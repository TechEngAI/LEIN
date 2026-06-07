import json
import os
from pathlib import Path
from typing import Dict, List

import numpy as np
import pandas as pd
from joblib import dump, load
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

try:
    from groq import Groq
except ImportError:
    Groq = None

MODEL_PATH = Path(__file__).resolve().parents[0] / 'models' / 'classifier_fallback.joblib'
TRAINING_CSV = Path(__file__).resolve().parents[0] / 'data' / 'emergency_train.csv'
CATEGORIES = ['Medical', 'Fire', 'Security', 'Accident']
KEYWORD_MAP = {
    'Medical': ['faint', 'unconscious', 'blood', 'bleed', 'sick', 'injury', 'pain', 'wake', 'vomit', 'heart'],
    'Fire': ['smoke', 'burn', 'burning', 'fire', 'flame', 'gas', 'sparks', 'hot'],
    'Security': ['boys', 'break', 'rob', 'steal', 'gun', 'attack', 'fight', 'intruder', 'cutlass'],
    'Accident': ['accident', 'crash', 'collision', 'pileup', 'vehicle', 'hit', 'skid', 'roadblock'],
}


def extract_keywords(text: str) -> List[str]:
    text_lower = text.lower()
    found: List[str] = []
    for tokens in KEYWORD_MAP.values():
        for token in tokens:
            if token in text_lower and token not in found:
                found.append(token)
    return found


def _choose_fallback_label(text: str) -> str:
    text_lower = text.lower()
    scores = {label: 0 for label in CATEGORIES}
    for label, tokens in KEYWORD_MAP.items():
        for token in tokens:
            if token in text_lower:
                scores[label] += 1
    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return 'Medical'
    return best


class ClassifierFallback:
    def __init__(self):
        self.model = None
        self._load_or_train()

    def _load_or_train(self):
        if MODEL_PATH.exists():
            self.model = load(MODEL_PATH)
            return
        self._train()

    def _train(self):
        if not TRAINING_CSV.exists():
            raise FileNotFoundError(f'Training CSV not found at {TRAINING_CSV}')
        df = pd.read_csv(TRAINING_CSV)
        X = df['description']
        y = df['incident_type']
        pipeline = Pipeline([
            ('vectorizer', TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ('clf', LogisticRegression(max_iter=1000, solver='lbfgs')),
        ])
        pipeline.fit(X, y)
        self.model = pipeline
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        dump(self.model, MODEL_PATH)

    def predict(self, text: str) -> Dict:
        probability = 0.0
        label = 'Medical'
        if self.model is not None:
            label = self.model.predict([text])[0]
            probs = self.model.predict_proba([text])[0]
            probability = float(probs.max())
        if label not in CATEGORIES:
            label = _choose_fallback_label(text)
        keywords = extract_keywords(text)
        return {
            'type': label,
            'confidence': probability if probability else 0.66,
            'keywords': keywords,
        }


def classify_incident(text: str) -> Dict:
    text = text.strip()
    if not text:
        return {
            'type': 'Medical',
            'confidence': 0.0,
            'keywords': [],
        }

    ai_mode = os.getenv('AI_MODE', 'offline').lower()
    if ai_mode == 'online' and Groq is not None:
        api_key = os.getenv('GROQ_API_KEY')
        if api_key:
            try:
                client = Groq(api_key=api_key)

                completion = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are a Lagos emergency classification assistant. "
                                "Classify incident text into exactly one of: "
                                "Medical, Fire, Security, Accident. "
                                "Return ONLY valid JSON with keys: "
                                "type (string), confidence (float 0.0-1.0), "
                                "keywords (array of strings). "
                                "No explanation. No markdown. JSON only."
                            ),
                        },
                        {
                            "role": "user",
                            "content": (
                                f"Classify this emergency report. "
                                f"It may be English, Pidgin, or mixed.\n"
                                f"Text: \"{text}\""
                            ),
                        },
                    ],
                    temperature=0.0,
                    max_tokens=200,
                )

                raw = completion.choices[0].message.content
                raw = raw.strip()
                if raw.startswith("```"):
                    raw = raw.split("```")[1]
                    if raw.startswith("json"):
                        raw = raw[4:]
                raw = raw.strip()

                data = json.loads(raw)
                if data.get('type') not in CATEGORIES:
                    raise ValueError('Invalid type returned')

                return {
                    'type': data['type'],
                    'confidence': float(
                        data.get('confidence', 0.85)
                    ),
                    'keywords': data.get('keywords', []),
                }

            except Exception as e:
                print(f"Groq classification failed: {e}")

    fallback = ClassifierFallback()
    return fallback.predict(text)
