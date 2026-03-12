import { Phone } from "lucide-react";

export const MobileCallButton: React.FC = () => {
  return (
    <a
      href="tel:914456544"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-barber-gold rounded-full flex items-center justify-center shadow-lg md:hidden animate-bounce-slow hover:bg-barber-gold-hover transition-colors"
      aria-label="Llamar ahora"
      data-testid="mobile-call-button"
    >
      <Phone className="w-6 h-6 text-barber-bg" />
    </a>
  );
};
