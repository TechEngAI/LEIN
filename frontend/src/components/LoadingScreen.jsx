import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const STEPS = [
  'Initializing AI Classifier...',
  'Loading Route Engine...',
  'Connecting Emergency Database...',
  'Loading Forecast Engine...',
];

export default function LoadingScreen({ onComplete }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [doneSteps, setDoneSteps] = useState([]);
  const [showReady, setShowReady] = useState(false);
  const progressRef = useRef(null);
  const readyRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Ring spin entrance
    tl.from(ringRef.current, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' });

    // Step through loading items
    STEPS.forEach((_, i) => {
      tl.call(() => setActiveStep(i), [], `+=${i === 0 ? 0.3 : 0.6}`)
        .to(progressRef.current, { width: `${((i + 1) / STEPS.length) * 100}%`, duration: 0.5, ease: 'power2.out' }, '<')
        .call(() => {
          setDoneSteps(prev => [...prev, i]);
          setActiveStep(-1);
        }, [], '+=0.4');
    });

    // READY state
    tl.call(() => setShowReady(true), [], '+=0.3')
      .to(readyRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '<')
      .to(progressRef.current, { width: '100%', duration: 0.3 }, '<')
      .call(() => {
        gsap.to('.loading-screen', {
          opacity: 0, duration: 0.5, delay: 0.6, ease: 'power2.in',
          onComplete,
        });
      }, [], '+=0.4');
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-logo-ring" ref={ringRef}>
        <span className="loading-logo-emoji">🚨</span>
      </div>

      <div className="loading-title">LEIN</div>
      <div className="loading-tagline">Respond. Predict. Save Lives.</div>

      <div className="loading-steps">
        <div className="loading-step" style={{ borderBottom: 'none', marginBottom: 12, color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: 2 }}>
          INITIALIZING SYSTEM
        </div>
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`loading-step${activeStep === i ? ' active' : ''}${doneSteps.includes(i) ? ' done' : ''}`}
          >
            <div className="loading-step-dot" />
            {doneSteps.includes(i) ? `✓ ${step}` : step}
          </div>
        ))}
      </div>

      <div className="loading-progress-bar">
        <div className="loading-progress-fill" ref={progressRef} />
      </div>

      <div className="loading-ready" ref={readyRef} style={{ transform: 'translateY(10px)' }}>
        {showReady ? '● SYSTEM READY' : ''}
      </div>
    </div>
  );
}
