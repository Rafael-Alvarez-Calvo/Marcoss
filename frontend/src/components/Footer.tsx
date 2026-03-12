import { Scissors, Phone, MapPin, Clock } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string): void => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-barber-lighter border-t border-barber-border" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection("#inicio"); }} className="flex items-center gap-3 mb-6">
              <Scissors className="w-8 h-8 text-barber-gold" />
              <div className="flex flex-col">
                <span className="font-bebas text-2xl tracking-wider text-barber-text">MARCOSS</span>
                <span className="text-xs text-barber-muted -mt-1 tracking-widest">PELUQUERÍA-BARBERÍA</span>
              </div>
            </a>
            <p className="text-barber-muted leading-relaxed max-w-md">
              Tu barbería de confianza en el barrio de Chamberí, Madrid. 
              Ofrecemos un servicio profesional y cercano con años de experiencia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bebas text-xl text-barber-text tracking-wide mb-6">ENLACES</h4>
            <nav className="space-y-3">
              {[
                { href: "#inicio", label: "Inicio" },
                { href: "#servicios", label: "Servicios" },
                { href: "#galeria", label: "Galería" },
                { href: "#resenas", label: "Reseñas" },
                { href: "#ubicacion", label: "Ubicación" }
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className="block text-barber-muted hover:text-barber-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bebas text-xl text-barber-text tracking-wide mb-6">CONTACTO</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-barber-gold flex-shrink-0 mt-0.5" />
                <div className="text-barber-muted text-sm">
                  <p>Calle de Viriato, 32</p>
                  <p>Chamberí, 28010 Madrid</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-barber-gold flex-shrink-0" />
                <a href="tel:914456544" className="text-barber-muted hover:text-barber-gold transition-colors text-sm">
                  914 45 65 44
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-barber-gold flex-shrink-0 mt-0.5" />
                <div className="text-barber-muted text-sm">
                  <p>Lun - Vie: 09:30 - 20:30</p>
                  <p>Sábado: 09:00 - 14:00</p>
                  <p>Domingo: Cerrado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-barber-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-barber-muted text-sm">
            © {currentYear} Marcoss Peluquería-Barbería. Todos los derechos reservados.
          </p>
          <p className="text-barber-muted text-sm">
            Barbería en Chamberí, Madrid
          </p>
        </div>
      </div>
    </footer>
  );
};
