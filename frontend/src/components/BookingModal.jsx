import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Clock, User, Phone, Mail, Scissors, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";
import axios from "axios";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const BookingModal = ({ isOpen, onClose, preselectedService }) => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
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
    const fetchSlots = async () => {
      if (!selectedDate) return;
      
      setIsLoadingSlots(true);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const response = await axios.get(`${API}/available-slots/${dateStr}`);
        
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
      setSelectedDate(null);
      setSelectedTime(null);
      setAvailableSlots([]);
      setFormData({ name: "", phone: "", email: "" });
    }
  }, [isOpen]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error("Por favor, completa todos los campos obligatorios");
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
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedTime
      };

      await axios.post(`${API}/appointments`, appointmentData);
      
      toast.success("¡Cita reservada con éxito!", {
        description: `${selectedService.name} - ${format(selectedDate, "d 'de' MMMM", { locale: es })} a las ${selectedTime}`
      });
      
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error(error.response?.data?.detail || "Error al reservar la cita");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  const disabledDays = (date) => {
    // Disable past dates and Sundays (day 0)
    return isBefore(date, today) || date.getDay() === 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-barber-bg border-barber-border text-barber-text max-h-[90vh] overflow-y-auto" data-testid="booking-modal">
        <DialogHeader>
          <DialogTitle className="font-bebas text-3xl tracking-wide text-barber-text flex items-center gap-3">
            <Scissors className="w-7 h-7 text-barber-gold" />
            RESERVAR CITA
          </DialogTitle>
        </DialogHeader>

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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                className="text-barber-muted hover:text-barber-gold"
              >
                Cambiar
              </Button>
            </div>

            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledDays}
                locale={es}
                className="rounded-sm border border-barber-border bg-barber-card"
                data-testid="booking-calendar"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="space-y-3">
                <p className="text-barber-muted text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horarios disponibles para {format(selectedDate, "d 'de' MMMM", { locale: es })}
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
                <span className="text-barber-text">{selectedDate && format(selectedDate, "d 'de' MMMM", { locale: es })}</span>
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
                <Label htmlFor="name" className="text-barber-text flex items-center gap-2">
                  <User className="w-4 h-4 text-barber-gold" />
                  Nombre *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  className="mt-1 bg-barber-card border-barber-border text-barber-text focus:border-barber-gold"
                  required
                  data-testid="input-name"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-barber-text flex items-center gap-2">
                  <Phone className="w-4 h-4 text-barber-gold" />
                  Teléfono *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Tu teléfono"
                  className="mt-1 bg-barber-card border-barber-border text-barber-text focus:border-barber-gold"
                  required
                  data-testid="input-phone"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-barber-text flex items-center gap-2">
                  <Mail className="w-4 h-4 text-barber-gold" />
                  Email (opcional)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Tu email"
                  className="mt-1 bg-barber-card border-barber-border text-barber-text focus:border-barber-gold"
                  data-testid="input-email"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 border-barber-border text-barber-text hover:bg-barber-card"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Atrás
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary"
                data-testid="confirm-booking-btn"
              >
                {isSubmitting ? "Reservando..." : "Confirmar Cita"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
