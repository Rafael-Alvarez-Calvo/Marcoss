import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'test_database';

mongoose.connect(`${MONGO_URL}/${DB_NAME}`)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Interfaces
interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface IAppointment {
  id: string;
  service: string;
  service_price: number;
  client_name: string;
  client_phone: string;
  client_email?: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: Date;
}

// Mongoose Schema
const appointmentSchema = new mongoose.Schema<IAppointment>({
  id: { type: String, required: true, unique: true },
  service: { type: String, required: true },
  service_price: { type: Number, required: true },
  client_name: { type: String, required: true },
  client_phone: { type: String, required: true },
  client_email: { type: String },
  appointment_date: { type: String, required: true },
  appointment_time: { type: String, required: true },
  status: { type: String, default: 'confirmed' },
  created_at: { type: Date, default: Date.now }
});

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

// Services Data
const SERVICES: Service[] = [
  { id: "corte", name: "Corte de pelo", price: 15.00, duration: 30, description: "Corte clásico o moderno según tu estilo" },
  { id: "barba", name: "Arreglo de barba", price: 10.00, duration: 20, description: "Perfilado y arreglo profesional de barba" },
  { id: "corte-barba", name: "Corte + Barba", price: 22.00, duration: 45, description: "Pack completo: corte de pelo y arreglo de barba" },
  { id: "afeitado", name: "Afeitado clásico", price: 12.00, duration: 25, description: "Afeitado tradicional a navaja con toalla caliente" },
  { id: "corte-nino", name: "Corte niño", price: 12.00, duration: 25, description: "Corte para niños menores de 12 años" },
  { id: "degradado", name: "Degradado / Fade", price: 17.00, duration: 35, description: "Corte degradado moderno con máquina" },
];

// Business Hours Configuration
const BUSINESS_HOURS: Record<number, [string, string][]> = {
  0: [],  // Sunday - Closed
  1: [["09:30", "13:45"], ["16:30", "20:30"]],  // Monday
  2: [["09:30", "13:45"], ["16:30", "20:30"]],  // Tuesday
  3: [["09:30", "13:45"], ["16:30", "20:30"]],  // Wednesday
  4: [["09:30", "13:45"], ["16:30", "20:30"]],  // Thursday
  5: [["09:30", "13:45"], ["16:30", "20:30"]],  // Friday
  6: [["09:00", "14:00"]],  // Saturday
};

// Helper function to generate time slots
function generateTimeSlots(dayOfWeek: number): string[] {
  const hours = BUSINESS_HOURS[dayOfWeek] || [];
  const slots: string[] = [];

  for (const [start, end] of hours) {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      slots.push(`${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`);
      currentMin += 30;
      if (currentMin >= 60) {
        currentHour += 1;
        currentMin = 0;
      }
    }
  }

  return slots;
}

// API Routes
app.get('/api/', (_req: Request, res: Response) => {
  res.json({ message: "Marcoss Peluquería-Barbería API" });
});

app.get('/api/services', (_req: Request, res: Response) => {
  res.json({ services: SERVICES });
});

app.get('/api/available-slots/:dateStr', async (req: Request, res: Response) => {
  const dateStr = req.params.dateStr as string;

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    res.status(400).json({ detail: "Invalid date format. Use YYYY-MM-DD" });
    return;
  }

  const targetDate = new Date(dateStr);
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday

  if (dayOfWeek === 0) {
    res.json({ date: dateStr, available_slots: [], is_closed: true });
    return;
  }

  const allSlots = generateTimeSlots(dayOfWeek);

  // Get booked slots for this date
  const bookedAppointments = await Appointment.find({
    appointment_date: dateStr,
    status: { $ne: 'cancelled' }
  }).select('appointment_time');

  const bookedTimes = bookedAppointments.map(a => a.appointment_time);
  const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

  res.json({ date: dateStr, available_slots: availableSlots, is_closed: false });
});

app.post('/api/appointments', async (req: Request, res: Response) => {
  try {
    const { service, service_price, client_name, client_phone, client_email, appointment_date, appointment_time } = req.body;

    // Check if slot is available
    const existing = await Appointment.findOne({
      appointment_date,
      appointment_time,
      status: { $ne: 'cancelled' }
    });

    if (existing) {
      res.status(400).json({ detail: "Este horario ya está reservado" });
      return;
    }

    const appointment = new Appointment({
      id: uuidv4(),
      service,
      service_price,
      client_name,
      client_phone,
      client_email: client_email || null,
      appointment_date,
      appointment_time,
      status: 'confirmed',
      created_at: new Date()
    });

    await appointment.save();

    res.status(201).json({
      id: appointment.id,
      service: appointment.service,
      service_price: appointment.service_price,
      client_name: appointment.client_name,
      client_phone: appointment.client_phone,
      client_email: appointment.client_email,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      status: appointment.status,
      created_at: appointment.created_at.toISOString()
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ detail: "Error al crear la cita" });
  }
});

app.get('/api/appointments', async (req: Request, res: Response) => {
  const { date_str } = req.query;
  
  const query: Record<string, unknown> = { status: { $ne: 'cancelled' } };
  if (date_str) {
    query.appointment_date = date_str;
  }

  const appointments = await Appointment.find(query).select('-_id -__v');
  res.json(appointments);
});

app.delete('/api/appointments/:appointmentId', async (req: Request, res: Response) => {
  const { appointmentId } = req.params;

  const result = await Appointment.updateOne(
    { id: appointmentId },
    { $set: { status: 'cancelled' } }
  );

  if (result.modifiedCount === 0) {
    res.status(404).json({ detail: "Cita no encontrada" });
    return;
  }

  res.json({ message: "Cita cancelada exitosamente" });
});

app.get('/api/business-info', (_req: Request, res: Response) => {
  res.json({
    name: "Marcoss Peluquería-Barbería",
    address: "Calle de Viriato, 32",
    neighborhood: "Chamberí",
    city: "Madrid",
    postal_code: "28010",
    country: "España",
    phone: "914 45 65 44",
    rating: 4.9,
    reviews_count: 100,
    hours: {
      monday: { open: "09:30", close: "13:45", evening_open: "16:30", evening_close: "20:30" },
      tuesday: { open: "09:30", close: "13:45", evening_open: "16:30", evening_close: "20:30" },
      wednesday: { open: "09:30", close: "13:45", evening_open: "16:30", evening_close: "20:30" },
      thursday: { open: "09:30", close: "13:45", evening_open: "16:30", evening_close: "20:30" },
      friday: { open: "09:30", close: "13:45", evening_open: "16:30", evening_close: "20:30" },
      saturday: { open: "09:00", close: "14:00" },
      sunday: "closed"
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
