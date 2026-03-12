import { Phone, Clock, MapPin, Calendar } from "lucide-react";

interface ContactSectionProps {
  onBookClick: () => void;
}

interface BusinessHour {
  day: string;
  hours: string;
  closed?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onBookClick }) => {
  const businessHours: BusinessHour[] = [
    { day: "Lunes", hours: "09:30 - 13:45 / 16:30 - 20:30" },
    { day: "Martes", hours: "09:30 - 13:45 / 16:30 - 20:30" },
    { day: "Miércoles", hours: "09:30 - 13:45 / 16:30 - 20:30" },
    { day: "Jueves", hours: "09:30 - 13:45 / 16:30 - 20:30" },
    { day: "Viernes", hours: "09:30 - 13:45 / 16:30 - 20:30" },
    { day: "Sábado", hours: "09:00 - 14:00" },
    { day: "Domingo", hours: "Cerrado", closed: true }
  ];

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-barber-card" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-barber-gold font-bebas tracking-widest text-lg">CONTACTO</span>
          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-barber-text mt-2 tracking-wide">
            TE ESPERAMOS
          </h2>
          <p className="text-barber-muted mt-4 max-w-2xl mx-auto">
            Reserva tu cita o llámanos directamente. Estaremos encantados de atenderte.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="bg-barber-bg p-8 rounded-sm border border-barber-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-barber-gold/10 rounded-full flex items-center justify-center">
                <Phone className="w-7 h-7 text-barber-gold" />
              </div>
              <div>
                <h3 className="font-bebas text-xl text-barber-text tracking-wide">TELÉFONO</h3>
                <a 
                  href="tel:914456544" 
                  className="text-barber-gold text-xl hover:text-barber-gold-hover transition-colors"
                  data-testid="phone-link"
                >
                  914 45 65 44
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-barber-gold/10 rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-barber-gold" />
              </div>
              <div>
                <h3 className="font-bebas text-xl text-barber-text tracking-wide">DIRECCIÓN</h3>
                <p className="text-barber-muted">Calle de Viriato, 32</p>
                <p className="text-barber-muted">Chamberí, Madrid</p>
              </div>
            </div>

            <a 
              href="tel:914456544" 
              className="btn-primary rounded-sm w-full flex items-center justify-center gap-2 py-4"
              data-testid="call-now-btn"
            >
              <Phone className="w-5 h-5" />
              Llamar Ahora
            </a>
          </div>

          {/* Business Hours */}
          <div className="bg-barber-bg p-8 rounded-sm border border-barber-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-barber-gold/10 rounded-full flex items-center justify-center">
                <Clock className="w-7 h-7 text-barber-gold" />
              </div>
              <h3 className="font-bebas text-2xl text-barber-text tracking-wide">HORARIO</h3>
            </div>

            <div className="space-y-3">
              {businessHours.map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-barber-border last:border-0"
                >
                  <span className={`font-medium ${item.closed ? 'text-barber-muted' : 'text-barber-text'}`}>
                    {item.day}
                  </span>
                  <span className={item.closed ? 'text-barber-red' : 'text-barber-muted'}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Book Appointment */}
          <div className="bg-barber-gold/10 p-8 rounded-sm border border-barber-gold/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-barber-gold rounded-full flex items-center justify-center">
                <Calendar className="w-7 h-7 text-barber-bg" />
              </div>
              <h3 className="font-bebas text-2xl text-barber-text tracking-wide">RESERVA TU CITA</h3>
            </div>

            <p className="text-barber-text mb-6 leading-relaxed">
              Reserva tu cita online y asegúrate tu horario preferido. 
              Sin esperas, sin complicaciones.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-barber-muted">
                <span className="w-2 h-2 bg-barber-gold rounded-full" />
                Selecciona tu servicio
              </li>
              <li className="flex items-center gap-2 text-barber-muted">
                <span className="w-2 h-2 bg-barber-gold rounded-full" />
                Elige fecha y hora
              </li>
              <li className="flex items-center gap-2 text-barber-muted">
                <span className="w-2 h-2 bg-barber-gold rounded-full" />
                Confirmación inmediata
              </li>
            </ul>

            <button 
              onClick={onBookClick}
              className="btn-primary rounded-sm w-full flex items-center justify-center gap-2 py-4"
              data-testid="contact-book-btn"
            >
              <Calendar className="w-5 h-5" />
              Reservar Cita Online
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
