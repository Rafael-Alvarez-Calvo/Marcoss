import { MapPin, Navigation } from "lucide-react";
import { Button } from "./ui/button";

export const LocationSection = () => {
  const address = "Calle de Viriato, 32, Chamberí, 28010 Madrid, España";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <section id="ubicacion" className="py-24 lg:py-32 bg-barber-bg" data-testid="location-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-barber-gold font-bebas tracking-widest text-lg">UBICACIÓN</span>
          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-barber-text mt-2 tracking-wide">
            ENCUÉNTRANOS
          </h2>
          <p className="text-barber-muted mt-4 max-w-2xl mx-auto">
            Estamos en el corazón del barrio de Chamberí, Madrid
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map */}
          <div className="relative rounded-sm overflow-hidden border border-barber-border h-[400px] lg:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.5!2d-3.7!3d40.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI1JzQ4LjAiTiAzwrA0MicwMC4wIlc!5e0!3m2!1ses!2ses!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(100%) contrast(1.1)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Marcoss Peluquería-Barbería"
            />
            <div className="absolute inset-0 pointer-events-none border border-barber-gold/20 rounded-sm" />
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="bg-barber-card p-8 rounded-sm border border-barber-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-barber-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-barber-gold" />
                </div>
                <div>
                  <h3 className="font-bebas text-2xl text-barber-text tracking-wide mb-2">DIRECCIÓN</h3>
                  <p className="text-barber-text text-lg">Calle de Viriato, 32</p>
                  <p className="text-barber-muted">Chamberí, 28010 Madrid</p>
                  <p className="text-barber-muted">España</p>
                </div>
              </div>
            </div>

            {/* Transport Info */}
            <div className="bg-barber-card p-8 rounded-sm border border-barber-border">
              <h3 className="font-bebas text-2xl text-barber-text tracking-wide mb-4">CÓMO LLEGAR</h3>
              <div className="space-y-3 text-barber-muted">
                <p className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">M</span>
                  Metro: Iglesia, Bilbao (Líneas 1, 4)
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">B</span>
                  Bus: Líneas 3, 37, 149
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary rounded-sm flex items-center justify-center gap-2 py-4"
                data-testid="directions-btn"
              >
                <Navigation className="w-5 h-5" />
                Cómo Llegar
              </a>
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline rounded-sm flex items-center justify-center gap-2 py-4"
                data-testid="open-maps-btn"
              >
                <MapPin className="w-5 h-5" />
                Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
