import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Clock, User, Phone, Mail, Scissors, Check, ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { format, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService: Service | null;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, preselectedService }) => {
  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: ""
  });

  // Fetch services
  useEffect(() => {
    const fetchServices = async (): Promise<void> => {
      try {
        const response = await axios.get(`${API}/services`);
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  // Set preselected service
  useEffect(() => {
    if (preselectedService && isOpen) {
      setSelectedService(preselectedService);
      setStep(2);
    } else {
      setStep(1);
      setSelectedService(null);
    }
  }, [preselectedService, isOpen]);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async (): Promise<void> => {
      if (!selectedDate) return;
      
      setIsLoadingSlots(true);
      try {
        const response = await axios.get(`${API}/available-slots/${selectedDate}`);
        
        if (response.data.is_closed) {
          setAvailableSlots([]);
          toast.error("Cerrado este día");
        } else {
          setAvailableSlots(response.data.available_slots);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
        setAvailableSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    
    fetchSlots();
    setSelectedTime(null);
  }, [selectedDate]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedService(null);
      setSelectedDate("");
      setSelectedTime(null);
      setAvailableSlots([]);
      setFormData({ name: "", phone: "", email: "" });
    }
  }, [isOpen]);

  const handleServiceSelect = (service: Service): void => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelectedDate(e.target.value);
  };

  const handleTimeSelect = (time: string): void => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error("Por favor, completa la selección");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        service: selectedService.name,
        service_price: selectedService.price,
        client_name: formData.name,
        client_phone: formData.phone,
        client_email: formData.email || null,
        appointment_date: selectedDate,
        appointment_time: selectedTime
      };

      await axios.post(`${API}/appointments`, appointmentData);
      
      const dateObj = new Date(selectedDate);
      toast.success("¡Cita reservada con éxito!", {
        description: `${selectedService.name} - ${format(dateObj, "d 'de' MMMM", { locale: es })} a las ${selectedTime}`
      });
      
      onClose();
    } catch (error: unknown) {
      console.error("Error creating appointment:", error);
      const axiosError = error as { response?: { data?: { detail?: string } } };
      toast.error(axiosError.response?.data?.detail || "Error al reservar la cita");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = format(new Date(), "yyyy-MM-dd");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="booking-modal">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-[500px] mx-4 bg-barber-bg border border-barber-border rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-barber-muted hover:text-barber-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Scissors className="w-7 h-7 text-barber-gold" />
          <h2 className="font-bebas text-3xl tracking-wide text-barber-text">RESERVAR CITA</h2>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s 
                    ? "bg-barber-gold text-barber-bg" 
                    : "bg-barber-card text-barber-muted"
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 ${step > s ? "bg-barber-gold" : "bg-barber-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="space-y-4" data-testid="step-1-services">
            <p className="text-barber-muted text-center">Selecciona un servicio</p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="w-full p-4 bg-barber-card border border-barber-border rounded-sm hover:border-barber-gold/50 transition-colors text-left group"
                  data-testid={`modal-service-${service.id}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bebas text-xl text-barber-text group-hover:text-barber-gold transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-barber-muted text-sm">{service.duration} min</p>
                    </div>
                    <span className="font-bebas text-2xl text-barber-gold">{service.price.toFixed(2)}€</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="space-y-4" data-testid="step-2-datetime">
            {/* Selected Service */}
            <div className="bg-barber-card p-3 rounded-sm border border-barber-gold/30 flex justify-between items-center">
              <div>
                <p className="text-barber-muted text-xs">Servicio seleccionado</p>
                <p className="font-bebas text-lg text-barber-text">{selectedService?.name}</p>
              </div>
              <span className="font-bebas text-xl text-barber-gold">{selectedService?.price.toFixed(2)}€</span>
              <button
                onClick={() => setStep(1)}
                className="text-barber-muted hover:text-barber-gold text-sm"
              >
                Cambiar
              </button>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-barber-muted text-sm mb-2">Selecciona una fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={today}
                className="w-full p-3 bg-barber-card border border-barber-border rounded-sm text-barber-text focus:border-barber-gold focus:outline-none"
                data-testid="booking-date-input"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="space-y-3">
                <p className="text-barber-muted text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horarios disponibles
                </p>
                
                {isLoadingSlots ? (
                  <div className="text-center py-4 text-barber-muted">Cargando horarios...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-4 text-barber-red">No hay horarios disponibles</div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-[150px] overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleTimeSelect(slot)}
                        className={`p-2 text-sm rounded-sm border transition-colors ${
                          selectedTime === slot
                            ? "bg-barber-gold text-barber-bg border-barber-gold"
                            : "bg-barber-card border-barber-border text-barber-text hover:border-barber-gold/50"
                        }`}
                        data-testid={`time-slot-${slot}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="step-3-details">
            {/* Summary */}
            <div className="bg-barber-card p-4 rounded-sm border border-barber-gold/30 space-y-2">
              <div className="flex justify-between">
                <span className="text-barber-muted">Servicio:</span>
                <span className="text-barber-text">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-barber-muted">Fecha:</span>
                <span className="text-barber-text">{selectedDate && format(new Date(selectedDate), "d 'de' MMMM", { locale: es })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-barber-muted">Hora:</span>
                <span className="text-barber-text">{selectedTime}</span>
              </div>
              <div className="flex justify-between border-t border-barber-border pt-2 mt-2">
                <span className="text-barber-muted">Precio:</span>
                <span className="font-bebas text-xl text-barber-gold">{selectedService?.price.toFixed(2)}€</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-barber-text text-sm flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-barber-gold" />
                  Nombre *
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  className="w-full p-3 bg-barber-card border border-barber-border rounded-sm text-barber-text focus:border-barber-gold focus:outline-none"
                  required
                  data-testid="input-name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-barber-text text-sm flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-barber-gold" />
                  Teléfono *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Tu teléfono"
                  className="w-full p-3 bg-barber-card border border-barber-border rounded-sm text-barber-text focus:border-barber-gold focus:outline-none"
                  required
                  data-testid="input-phone"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-barber-text text-sm flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-barber-gold" />
                  Email (opcional)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Tu email"
                  className="w-full p-3 bg-barber-card border border-barber-border rounded-sm text-barber-text focus:border-barber-gold focus:outline-none"
                  data-testid="input-email"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-barber-border text-barber-text rounded-sm hover:bg-barber-card transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Atrás
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 btn-primary rounded-sm"
                data-testid="confirm-booking-btn"
              >
                {isSubmitting ? "Reservando..." : "Confirmar Cita"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
