import { Phone, MapPin, Star, Scissors } from "lucide-react";
import { Button } from "./ui/button";

export const HeroSection = ({ onBookClick }) => {
  const interiorImage = "https://customer-assets.emergentagent.com/job_marcoss-chamberil/artifacts/i3pjg0d4_image.png";

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${interiorImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-barber-bg/60 via-barber-bg/70 to-barber-bg" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-barber-card/80 backdrop-blur-sm border border-barber-gold/30 rounded-full px-4 py-2 animate-fade-in-up">
            <Star className="w-4 h-4 text-barber-gold fill-barber-gold" />
            <span className="text-barber-gold text-sm font-medium">4.9 / 5 en Google</span>
            <span className="text-barber-muted text-sm">• 100 reseñas</span>
          </div>

          {/* Main Title */}
          <h1 className="font-bebas text-5xl sm:text-6xl lg:text-8xl tracking-wider text-barber-text animate-fade-in-up stagger-1">
            MARCOSS
            <span className="block text-barber-gold">PELUQUERÍA-BARBERÍA</span>
          </h1>

          {/* Subtitle */}
          <p className="font-playfair text-xl sm:text-2xl text-barber-muted italic animate-fade-in-up stagger-2">
            Barbería profesional en Chamberí, Madrid
          </p>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-barber-text/90 text-lg leading-relaxed animate-fade-in-up stagger-3">
            Cortes de pelo y arreglo de barba con atención al detalle, trato cercano y años de experiencia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up stagger-4">
            <Button 
              onClick={onBookClick}
              className="btn-primary rounded-sm text-lg px-10 py-4"
              data-testid="hero-book-btn"
            >
              <Scissors className="w-5 h-5 mr-2" />
              Reservar Cita
            </Button>
            <a 
              href="tel:914456544" 
              className="btn-outline rounded-sm text-lg px-10 py-4 flex items-center"
              data-testid="hero-call-btn"
            >
              <Phone className="w-5 h-5 mr-2" />
              Llamar Ahora
            </a>
          </div>

          {/* Info Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8 animate-fade-in-up stagger-5">
            <div className="flex items-center gap-2 bg-barber-card/60 backdrop-blur-sm px-4 py-2 rounded-full border border-barber-border">
              <MapPin className="w-4 h-4 text-barber-gold" />
              <span className="text-barber-text text-sm">Chamberí, Madrid</span>
            </div>
            <div className="flex items-center gap-2 bg-barber-card/60 backdrop-blur-sm px-4 py-2 rounded-full border border-barber-border">
              <Scissors className="w-4 h-4 text-barber-gold" />
              <span className="text-barber-text text-sm">Más de 100 clientes satisfechos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-barber-gold/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-2.5 bg-barber-gold rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
