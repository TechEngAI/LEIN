from collections import Counter
from datetime import datetime
import math
from typing import Any, List, cast

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from database import supabase
from dependencies import get_current_user
from schemas import HeatmapOut, HospitalOut, IncidentCreate, IncidentOut, ResponderOut


incidents_router = APIRouter(prefix="/incidents", tags=["incidents"])
lookup_router = APIRouter(tags=["incidents"])

Row = dict[str, Any]


class AssignmentCreate(BaseModel):
    incident_id: int
    responder_id: int


class ResolveCreate(BaseModel):
    incident_id: int


def get_rows(response: Any) -> list[Row]:
    return cast(list[Row], response.data or [])


def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    radius_km = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlng / 2) ** 2
    )
    return radius_km * 2 * math.asin(math.sqrt(a))


def get_traffic_multiplier(hour: int) -> float:
    if 6 <= hour <= 9:
        return 1.8
    if 16 <= hour <= 20:
        return 2.1
    return 0.9


def calculate_severity(incident_type: str, description: str, hour: int) -> int:
    base_scores = {
        "Medical": 9,
        "Fire": 8,
        "Accident": 7,
        "Security": 6,
    }
    keyword_terms = [
        "unconscious",
        "fire",
        "gun",
        "dead",
        "bleeding",
        "crash",
        "explosion",
        "stabbed",
        "burning",
        "attack",
    ]

    severity = base_scores.get(incident_type, 5)
    if 6 <= hour <= 9 or 16 <= hour <= 20:
        severity += 1

    description_text = (description or "").lower()
    keyword_flags = sum(1 for word in keyword_terms if word in description_text)
    if keyword_flags >= 2:
        severity += 1

    return max(1, min(5, severity))


def calculate_eta(distance_km: float, traffic_multiplier: float) -> int:
    return max(2, round(distance_km * traffic_multiplier * 3))


def get_capacity_label(capacity: int) -> str:
    if capacity < 50:
        return "Available"
    if capacity < 80:
        return "Moderate"
    return "Critical"


def map_incident_timestamp(incident: Row) -> Row:
    mapped_incident = dict(incident)
    mapped_incident["timestamp"] = mapped_incident.pop("created_at", None)
    return mapped_incident


@incidents_router.get("/", response_model=List[IncidentOut])
def get_incidents():
    response = (
        supabase.table("incidents")
        .select("*")
        .neq("status", "resolved")
        .order("priority_score", desc=True)
        .execute()
    )
    incidents = get_rows(response)
    return [map_incident_timestamp(incident) for incident in incidents]


@lookup_router.get("/responders", response_model=List[ResponderOut])
def get_responders():
    response = supabase.table("responders").select("*").execute()
    return get_rows(response)


@lookup_router.get("/hospitals", response_model=List[HospitalOut])
def get_hospitals():
    response = supabase.table("hospitals").select("*").execute()
    return get_rows(response)


@lookup_router.get("/stats/heatmap", response_model=List[HeatmapOut])
def get_heatmap():
    response = (
        supabase.table("incidents")
        .select("lga")
        .neq("status", "resolved")
        .execute()
    )
    incidents = get_rows(response)
    counts = Counter(str(incident["lga"]) for incident in incidents if incident.get("lga"))
    return [{"lga": lga, "count": count} for lga, count in counts.items()]


@lookup_router.get("/forecast")
def get_forecast():
    return [
        {
            "lga": "Ikeja",
            "type": "Medical",
            "predicted_incidents": 8,
            "hour": "1:00 PM",
        },
        {
            "lga": "Lagos Island",
            "type": "Fire",
            "predicted_incidents": 3,
            "hour": "2:00 PM",
        },
        {
            "lga": "Surulere",
            "type": "Medical",
            "predicted_incidents": 5,
            "hour": "3:00 PM",
        },
        {
            "lga": "Lekki",
            "type": "Security",
            "predicted_incidents": 4,
            "hour": "4:00 PM",
        },
        {
            "lga": "Oshodi",
            "type": "Accident",
            "predicted_incidents": 6,
            "hour": "5:00 PM",
        },
        {
            "lga": "Yaba",
            "type": "Medical",
            "predicted_incidents": 7,
            "hour": "6:00 PM",
        },
    ]


@lookup_router.post("/incidents")
async def create_incident(
    body: IncidentCreate,
    current_user=Depends(get_current_user),
):
    try:
        current_hour = datetime.utcnow().hour
        traffic_multiplier = get_traffic_multiplier(current_hour)
        severity = calculate_severity(body.type, body.description, current_hour)
        priority_score = severity * 2.0

        incident_payload = {
            "type": body.type,
            "description": body.description,
            "lat": body.lat,
            "lng": body.lng,
            "severity": severity,
            "priority_score": priority_score,
            "lga": body.location,
            "status": "active",
            "reporter_name": body.reporter_name,
            "reporter_phone": body.reporter_phone,
        }
        incident_response = (
            supabase.table("incidents").insert(incident_payload).execute()
        )
        incident_data = get_rows(incident_response)
        if not incident_data:
            return JSONResponse(
                status_code=500,
                content={"error": "Incident could not be created"},
            )

        new_incident = incident_data[0]
        new_incident_id = new_incident["id"]

        responders_response = (
            supabase.table("responders")
            .select("*")
            .eq("status", "available")
            .execute()
        )
        responders = get_rows(responders_response)

        hospitals_response = supabase.table("hospitals").select("*").execute()
        hospitals = get_rows(hospitals_response)
        nearest_hospital: Row | None = None
        if hospitals:
            nearest_hospital = min(
                hospitals,
                key=lambda hospital: haversine(
                    body.lat,
                    body.lng,
                    float(hospital["lat"]),
                    float(hospital["lng"]),
                ),
            )

        nearest_hospital_name = nearest_hospital["name"] if nearest_hospital else "None"
        hospital_capacity = (
            get_capacity_label(int(nearest_hospital["capacity"]))
            if nearest_hospital
            else "Unknown"
        )

        if not responders:
            return {
                "id": new_incident_id,
                "severity": severity,
                "priority_score": priority_score,
                "recommended_unit": "No units available",
                "eta_minutes": 0,
                "nearest_hospital": nearest_hospital_name,
                "hospital_capacity": hospital_capacity,
                "status": "active",
            }

        nearest_responder: Row | None = None
        nearest_distance = 0.0
        nearest_score: float | None = None
        for responder in responders:
            distance_km = haversine(
                body.lat,
                body.lng,
                float(responder["lat"]),
                float(responder["lng"]),
            )
            score = distance_km * traffic_multiplier
            if nearest_score is None or score < nearest_score:
                nearest_score = score
                nearest_distance = distance_km
                nearest_responder = responder

        eta_minutes = calculate_eta(nearest_distance, traffic_multiplier)
        if nearest_responder is None:
            return JSONResponse(
                status_code=500,
                content={"error": "Nearest responder could not be selected"},
            )

        supabase.table("assignments").insert(
            {
                "incident_id": new_incident_id,
                "responder_id": nearest_responder["id"],
                "eta_minutes": eta_minutes,
            }
        ).execute()

        supabase.table("responders").update({"status": "assigned"}).eq(
            "id",
            nearest_responder["id"],
        ).execute()

        return {
            "id": new_incident_id,
            "severity": severity,
            "priority_score": priority_score,
            "recommended_unit": nearest_responder["name"],
            "eta_minutes": eta_minutes,
            "nearest_hospital": nearest_hospital_name,
            "hospital_capacity": hospital_capacity,
            "status": "dispatched",
        }
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc)})


@lookup_router.post("/assign")
async def assign_responder(
    body: AssignmentCreate,
    current_user=Depends(get_current_user),
):
    try:
        responder_response = (
            supabase.table("responders")
            .select("*")
            .eq("id", body.responder_id)
            .limit(1)
            .execute()
        )
        responders = get_rows(responder_response)
        if not responders:
            return JSONResponse(
                status_code=404,
                content={"error": "Responder not found", "eta": 0},
            )

        responder = responders[0]
        if responder.get("status") != "available":
            return {"error": "Responder not available", "eta": 0}

        incident_response = (
            supabase.table("incidents")
            .select("*")
            .eq("id", body.incident_id)
            .limit(1)
            .execute()
        )
        incidents = get_rows(incident_response)
        if not incidents:
            return JSONResponse(
                status_code=404,
                content={"error": "Incident not found", "eta": 0},
            )

        incident = incidents[0]
        current_hour = datetime.utcnow().hour
        traffic_multiplier = get_traffic_multiplier(current_hour)
        distance_km = haversine(
            float(responder["lat"]),
            float(responder["lng"]),
            float(incident["lat"]),
            float(incident["lng"]),
        )
        eta_minutes = calculate_eta(distance_km, traffic_multiplier)

        supabase.table("assignments").insert(
            {
                "incident_id": body.incident_id,
                "responder_id": body.responder_id,
                "eta_minutes": eta_minutes,
            }
        ).execute()

        supabase.table("responders").update({"status": "assigned"}).eq(
            "id",
            body.responder_id,
        ).execute()

        return {"eta": eta_minutes}
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc)})


@lookup_router.post("/resolve")
async def resolve_incident(
    body: ResolveCreate,
    current_user=Depends(get_current_user),
):
    try:
        incident_response = (
            supabase.table("incidents")
            .select("*")
            .eq("id", body.incident_id)
            .limit(1)
            .execute()
        )
        incidents = get_rows(incident_response)
        if not incidents:
            raise HTTPException(status_code=404, detail="Incident not found")

        supabase.table("incidents").update({"status": "resolved"}).eq(
            "id",
            body.incident_id,
        ).execute()

        assignment_response = (
            supabase.table("assignments")
            .select("*")
            .eq("incident_id", body.incident_id)
            .limit(1)
            .execute()
        )
        assignments = get_rows(assignment_response)
        if assignments:
            supabase.table("responders").update({"status": "available"}).eq(
                "id",
                assignments[0]["responder_id"],
            ).execute()

        return {
            "message": "Incident resolved",
            "incident_id": body.incident_id,
        }
    except HTTPException:
        raise
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc)})
