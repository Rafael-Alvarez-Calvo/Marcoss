import { useState } from "react";

export const GallerySection = () => {
  const images = [
    {
      src: "https://customer-assets.emergentagent.com/job_marcoss-chamberil/artifacts/i3pjg0d4_image.png",
      alt: "Interior de la barbería con sillones clásicos",
      size: "large"
    },
    {
      src: "https://images.unsplash.com/photo-1635301304768-5f2db6a5499b?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
      alt: "Barbero profesional trabajando",
      size: "small"
    },
    {
      src: "https://images.unsplash.com/photo-1549663369-22ac6b052faf?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
      alt: "Corte de pelo profesional",
      size: "small"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_marcoss-chamberil/artifacts/8gmchtqc_image.png",
      alt: "Fachada exterior de Marcoss",
      size: "medium"
    },
    {
      src: "https://images.unsplash.com/photo-1625038032200-648fbcd800d0?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
      alt: "Herramientas de barbería",
      size: "small"
    },
    {
      src: "https://images.unsplash.com/photo-1654097800183-574ba7368f74?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
      alt: "Cliente en la barbería",
      size: "medium"
    }
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="galeria" className="py-24 lg:py-32 bg-barber-bg" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-barber-gold font-bebas tracking-widest text-lg">GALERÍA</span>
          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-barber-text mt-2 tracking-wide">
            NUESTRO TRABAJO
          </h2>
          <p className="text-barber-muted mt-4 max-w-2xl mx-auto">
            Un vistazo a nuestra barbería y el trabajo que realizamos cada día
          </p>
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`gallery-image relative rounded-sm overflow-hidden cursor-pointer border border-barber-border hover:border-barber-gold/50 transition-all duration-300 ${
                image.size === "large" ? "col-span-2 row-span-2" : 
                image.size === "medium" ? "col-span-2" : ""
              }`}
              onClick={() => setSelectedImage(image)}
              data-testid={`gallery-image-${index}`}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-barber-bg/0 hover:bg-barber-bg/30 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-barber-bg/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          data-testid="gallery-lightbox"
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-sm"
            />
            <p className="text-barber-text text-center mt-4">{selectedImage.alt}</p>
            <button 
              className="absolute top-4 right-4 text-barber-text hover:text-barber-gold text-4xl"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
