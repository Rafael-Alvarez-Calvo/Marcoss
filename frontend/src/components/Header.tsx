import { useState, useEffect } from "react";
import { Menu, X, Scissors, Phone } from "lucide-react";

interface HeaderProps {
  onBookClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#servicios", label: "Servicios" },
    { href: "#galeria", label: "Galería" },
    { href: "#resenas", label: "Reseñas" },
    { href: "#ubicacion", label: "Ubicación" },
  ];

  const scrollToSection = (href: string): void => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-barber-bg/95 backdrop-blur-md border-b border-barber-border shadow-lg" 
          : "bg-transparent"
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a 
            href="#inicio" 
            onClick={(e) => { e.preventDefault(); scrollToSection("#inicio"); }}
            className="flex items-center gap-3 group"
            data-testid="logo-link"
          >
            <Scissors className="w-8 h-8 text-barber-gold transition-transform duration-300 group-hover:rotate-45" />
            <div className="flex flex-col">
              <span className="font-bebas text-2xl tracking-wider text-barber-text">MARCOSS</span>
              <span className="text-xs text-barber-muted -mt-1 tracking-widest">PELUQUERÍA-BARBERÍA</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className="text-barber-text hover:text-barber-gold transition-colors duration-300 text-sm font-medium tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
            <button 
              onClick={onBookClick}
              className="btn-primary rounded-sm"
              data-testid="header-book-btn"
            >
              Reservar Cita
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-barber-text p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden bg-barber-bg/98 backdrop-blur-lg border-t border-barber-border"
          data-testid="mobile-menu"
        >
          <nav className="flex flex-col px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className="text-barber-text hover:text-barber-gold transition-colors duration-300 text-lg font-medium py-2 border-b border-barber-border"
              >
                {link.label}
              </a>
            ))}
            <button 
              onClick={() => { onBookClick(); setIsMobileMenuOpen(false); }}
              className="btn-primary rounded-sm w-full mt-4"
              data-testid="mobile-book-btn"
            >
              Reservar Cita
            </button>
            <a 
              href="tel:914456544" 
              className="flex items-center justify-center gap-2 btn-outline rounded-sm py-3"
              data-testid="mobile-call-link"
            >
              <Phone className="w-5 h-5" />
              Llamar Ahora
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
