import { useState, useEffect } from "react";
import { Scissors, Clock } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface ServicesSectionProps {
  onBookService: (service: Service) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookService }) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async (): Promise<void> => {
      try {
        const response = await axios.get(`${API}/services`);
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
        // Fallback services
        setServices([
          { id: "corte", name: "Corte de pelo", price: 15.00, duration: 30, description: "Corte clásico o moderno según tu estilo" },
          { id: "barba", name: "Arreglo de barba", price: 10.00, duration: 20, description: "Perfilado y arreglo profesional de barba" },
          { id: "corte-barba", name: "Corte + Barba", price: 22.00, duration: 45, description: "Pack completo: corte de pelo y arreglo de barba" },
          { id: "afeitado", name: "Afeitado clásico", price: 12.00, duration: 25, description: "Afeitado tradicional a navaja con toalla caliente" },
          { id: "corte-nino", name: "Corte niño", price: 12.00, duration: 25, description: "Corte para niños menores de 12 años" },
          { id: "degradado", name: "Degradado / Fade", price: 17.00, duration: 35, description: "Corte degradado moderno con máquina" },
        ]);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="servicios" className="py-24 lg:py-32 bg-barber-card" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-barber-gold font-bebas tracking-widest text-lg">NUESTROS SERVICIOS</span>
          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-barber-text mt-2 tracking-wide">
            CARTA DE SERVICIOS
          </h2>
          <p className="text-barber-muted mt-4 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios de barbería tradicional con técnicas modernas
          </p>
        </div>

        {/* Services List - Menu Style */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {services.map((service) => (
              <div 
                key={service.id}
                className="service-item group flex flex-col sm:flex-row sm:items-end justify-between pb-6 cursor-pointer"
                onClick={() => onBookService(service)}
                data-testid={`service-item-${service.id}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bebas text-2xl text-barber-text tracking-wide group-hover:text-barber-gold transition-colors">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-1 text-barber-muted text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                  <p className="text-barber-muted text-sm pr-8">{service.description}</p>
                </div>
                
                {/* Price and CTA */}
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex-grow sm:flex-grow-0 border-b border-dotted border-barber-border w-16 sm:w-24 hidden sm:block" />
                  <span className="font-bebas text-3xl text-barber-gold">{service.price.toFixed(2)}€</span>
                  <button 
                    className="bg-transparent border border-barber-gold text-barber-gold hover:bg-barber-gold hover:text-barber-bg text-sm px-4 py-2 font-bebas tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookService(service);
                    }}
                    data-testid={`book-service-${service.id}`}
                  >
                    Reservar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="text-center mt-12">
          <p className="text-barber-muted text-sm">
            <Scissors className="w-4 h-4 inline mr-2" />
            Todos los precios incluyen consulta personalizada
          </p>
        </div>
      </div>
    </section>
  );
};
