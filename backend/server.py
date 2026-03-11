from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, date, time

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Appointment Models
class AppointmentCreate(BaseModel):
    service: str
    service_price: float
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    appointment_date: str  # ISO date string YYYY-MM-DD
    appointment_time: str  # Time string HH:MM

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service: str
    service_price: float
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    appointment_date: str
    appointment_time: str
    status: str = "confirmed"  # confirmed, cancelled, completed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentResponse(BaseModel):
    id: str
    service: str
    service_price: float
    client_name: str
    client_phone: str
    client_email: Optional[str]
    appointment_date: str
    appointment_time: str
    status: str
    created_at: str

# Business hours configuration
BUSINESS_HOURS = {
    0: [],  # Sunday - Closed
    1: [("09:30", "13:45"), ("16:30", "20:30")],  # Monday
    2: [("09:30", "13:45"), ("16:30", "20:30")],  # Tuesday
    3: [("09:30", "13:45"), ("16:30", "20:30")],  # Wednesday
    4: [("09:30", "13:45"), ("16:30", "20:30")],  # Thursday
    5: [("09:30", "13:45"), ("16:30", "20:30")],  # Friday
    6: [("09:00", "14:00")],  # Saturday
}

# Services with prices
SERVICES = [
    {"id": "corte", "name": "Corte de pelo", "price": 15.00, "duration": 30, "description": "Corte clásico o moderno según tu estilo"},
    {"id": "barba", "name": "Arreglo de barba", "price": 10.00, "duration": 20, "description": "Perfilado y arreglo profesional de barba"},
    {"id": "corte-barba", "name": "Corte + Barba", "price": 22.00, "duration": 45, "description": "Pack completo: corte de pelo y arreglo de barba"},
    {"id": "afeitado", "name": "Afeitado clásico", "price": 12.00, "duration": 25, "description": "Afeitado tradicional a navaja con toalla caliente"},
    {"id": "corte-nino", "name": "Corte niño", "price": 12.00, "duration": 25, "description": "Corte para niños menores de 12 años"},
    {"id": "degradado", "name": "Degradado / Fade", "price": 17.00, "duration": 35, "description": "Corte degradado moderno con máquina"},
]

def generate_time_slots(day_of_week: int):
    """Generate available time slots for a given day of the week"""
    hours = BUSINESS_HOURS.get(day_of_week, [])
    slots = []
    
    for start, end in hours:
        start_hour, start_min = map(int, start.split(':'))
        end_hour, end_min = map(int, end.split(':'))
        
        current_hour = start_hour
        current_min = start_min
        
        while (current_hour < end_hour) or (current_hour == end_hour and current_min < end_min):
            slots.append(f"{current_hour:02d}:{current_min:02d}")
            current_min += 30
            if current_min >= 60:
                current_hour += 1
                current_min = 0
    
    return slots

# Routes
@api_router.get("/")
async def root():
    return {"message": "Marcoss Peluquería-Barbería API"}

@api_router.get("/services")
async def get_services():
    return {"services": SERVICES}

@api_router.get("/available-slots/{date_str}")
async def get_available_slots(date_str: str):
    """Get available time slots for a specific date"""
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    day_of_week = target_date.weekday()
    # Convert to our indexing (0=Sunday, 1=Monday, etc.)
    day_index = (day_of_week + 1) % 7
    
    if day_index == 0:  # Sunday
        return {"date": date_str, "available_slots": [], "is_closed": True}
    
    all_slots = generate_time_slots(day_index)
    
    # Get booked slots for this date
    booked = await db.appointments.find(
        {"appointment_date": date_str, "status": {"$ne": "cancelled"}},
        {"_id": 0, "appointment_time": 1}
    ).to_list(100)
    
    booked_times = [b["appointment_time"] for b in booked]
    available_slots = [slot for slot in all_slots if slot not in booked_times]
    
    return {"date": date_str, "available_slots": available_slots, "is_closed": False}

@api_router.post("/appointments", response_model=AppointmentResponse)
async def create_appointment(input: AppointmentCreate):
    """Create a new appointment"""
    # Validate date
    try:
        target_date = datetime.strptime(input.appointment_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    # Check if slot is available
    existing = await db.appointments.find_one({
        "appointment_date": input.appointment_date,
        "appointment_time": input.appointment_time,
        "status": {"$ne": "cancelled"}
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Este horario ya está reservado")
    
    # Create appointment
    appointment = Appointment(
        service=input.service,
        service_price=input.service_price,
        client_name=input.client_name,
        client_phone=input.client_phone,
        client_email=input.client_email,
        appointment_date=input.appointment_date,
        appointment_time=input.appointment_time
    )
    
    doc = appointment.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.appointments.insert_one(doc)
    
    return AppointmentResponse(
        id=appointment.id,
        service=appointment.service,
        service_price=appointment.service_price,
        client_name=appointment.client_name,
        client_phone=appointment.client_phone,
        client_email=appointment.client_email,
        appointment_date=appointment.appointment_date,
        appointment_time=appointment.appointment_time,
        status=appointment.status,
        created_at=doc['created_at']
    )

@api_router.get("/appointments", response_model=List[AppointmentResponse])
async def get_appointments(date_str: Optional[str] = None):
    """Get all appointments, optionally filtered by date"""
    query = {"status": {"$ne": "cancelled"}}
    if date_str:
        query["appointment_date"] = date_str
    
    appointments = await db.appointments.find(query, {"_id": 0}).to_list(1000)
    return appointments

@api_router.delete("/appointments/{appointment_id}")
async def cancel_appointment(appointment_id: str):
    """Cancel an appointment"""
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": "cancelled"}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    return {"message": "Cita cancelada exitosamente"}

@api_router.get("/business-info")
async def get_business_info():
    """Get business information"""
    return {
        "name": "Marcoss Peluquería-Barbería",
        "address": "Calle de Viriato, 32",
        "neighborhood": "Chamberí",
        "city": "Madrid",
        "postal_code": "28010",
        "country": "España",
        "phone": "914 45 65 44",
        "rating": 4.9,
        "reviews_count": 100,
        "hours": {
            "monday": {"open": "09:30", "close": "13:45", "evening_open": "16:30", "evening_close": "20:30"},
            "tuesday": {"open": "09:30", "close": "13:45", "evening_open": "16:30", "evening_close": "20:30"},
            "wednesday": {"open": "09:30", "close": "13:45", "evening_open": "16:30", "evening_close": "20:30"},
            "thursday": {"open": "09:30", "close": "13:45", "evening_open": "16:30", "evening_close": "20:30"},
            "friday": {"open": "09:30", "close": "13:45", "evening_open": "16:30", "evening_close": "20:30"},
            "saturday": {"open": "09:00", "close": "14:00"},
            "sunday": "closed"
        }
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
