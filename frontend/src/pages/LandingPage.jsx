import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ServicesSection } from "../components/ServicesSection";
import { GallerySection } from "../components/GallerySection";
import { ReviewsSection } from "../components/ReviewsSection";
import { LocationSection } from "../components/LocationSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { BookingModal } from "../components/BookingModal";
import { MobileCallButton } from "../components/MobileCallButton";

export default function LandingPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleBookService = (service) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleOpenBooking = () => {
    setSelectedService(null);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-barber-bg" data-testid="landing-page">
      <Header onBookClick={handleOpenBooking} />
      <main>
        <HeroSection onBookClick={handleOpenBooking} />
        <AboutSection />
        <ServicesSection onBookService={handleBookService} />
        <GallerySection />
        <ReviewsSection />
        <LocationSection />
        <ContactSection onBookClick={handleOpenBooking} />
      </main>
      <Footer />
      <MobileCallButton />
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        preselectedService={selectedService}
      />
    </div>
  );
}
