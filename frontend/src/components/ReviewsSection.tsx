import { Star, Quote } from "lucide-react";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const ReviewsSection: React.FC = () => {
  const reviews: Review[] = [
    {
      name: "Carlos M.",
      rating: 5,
      text: "Gran profesional, amable, excelente trato y conversación muy amena. Siempre salgo satisfecho.",
      date: "Hace 2 semanas"
    },
    {
      name: "David R.",
      rating: 5,
      text: "Muy buen trato y buen trabajo, siempre salgo contento con el corte. Lo recomiendo totalmente.",
      date: "Hace 1 mes"
    },
    {
      name: "Javier L.",
      rating: 5,
      text: "Buen trato, buen precio y profesionalidad. La mejor barbería del barrio sin duda.",
      date: "Hace 1 mes"
    },
    {
      name: "Pablo S.",
      rating: 5,
      text: "Como en casa, dedica el tiempo necesario para un corte perfecto. Se nota la experiencia.",
      date: "Hace 3 semanas"
    }
  ];

  const renderStars = (rating: number): React.JSX.Element[] => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-barber-gold fill-barber-gold' : 'text-barber-border'}`}
      />
    ));
  };

  return (
    <section id="resenas" className="py-24 lg:py-32 bg-barber-card" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-barber-gold font-bebas tracking-widest text-lg">RESEÑAS</span>
          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-barber-text mt-2 tracking-wide">
            LO QUE DICEN NUESTROS CLIENTES
          </h2>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1">
              {renderStars(5)}
            </div>
            <span className="font-bebas text-4xl text-barber-gold">4.9</span>
            <span className="text-barber-muted">/ 5</span>
          </div>
          <p className="text-barber-muted mt-2">Basado en 100 reseñas en Google</p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="review-card p-8 rounded-sm relative"
              data-testid={`review-card-${index}`}
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-barber-gold/20" />
              
              <div className="flex items-center gap-1 mb-4">
                {renderStars(review.rating)}
              </div>
              
              <p className="text-barber-text text-lg leading-relaxed mb-6 font-playfair italic">
                "{review.text}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-barber-text font-medium">{review.name}</p>
                  <p className="text-barber-muted text-sm">{review.date}</p>
                </div>
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-6 h-6 opacity-50"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews CTA */}
        <div className="text-center mt-12">
          <a 
            href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-barber-gold hover:text-barber-gold-hover transition-colors"
            data-testid="google-reviews-link"
          >
            Ver todas las reseñas en Google
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
