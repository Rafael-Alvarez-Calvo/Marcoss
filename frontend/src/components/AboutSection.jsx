import { Scissors, Users, Heart } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: Scissors,
      title: "Atención Personalizada",
      description: "Cada corte es único, adaptado a tu estilo y preferencias personales."
    },
    {
      icon: Users,
      title: "Profesionalidad",
      description: "Años de experiencia garantizan un servicio de alta calidad."
    },
    {
      icon: Heart,
      title: "Trato Cercano",
      description: "Un ambiente acogedor donde te sentirás como en casa."
    }
  ];

  return (
    <section id="nosotros" className="py-24 lg:py-32 bg-barber-bg" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-sm">
              <img 
                src="https://customer-assets.emergentagent.com/job_marcoss-chamberil/artifacts/8gmchtqc_image.png"
                alt="Fachada de Marcoss Peluquería-Barbería"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-barber-bg/50 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-barber-gold/30 rounded-sm -z-10" />
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <div>
              <span className="text-barber-gold font-bebas tracking-widest text-lg">SOBRE NOSOTROS</span>
              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-barber-text mt-2 tracking-wide">
                TU BARBERÍA DE CONFIANZA EN CHAMBERÍ
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-barber-text/90 text-lg leading-relaxed font-playfair italic">
                "Marcoss Peluquería-Barbería es una barbería de confianza en el barrio de Chamberí."
              </p>
              <p className="text-barber-muted leading-relaxed">
                Con un trato cercano y profesional, Marcos dedica el tiempo necesario a cada cliente 
                para conseguir un resultado perfecto. Nuestra pasión por el oficio y la atención al 
                detalle nos han convertido en la barbería de referencia del barrio.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 pt-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group bg-barber-card p-6 border border-barber-border hover:border-barber-gold/50 transition-colors duration-300 rounded-sm"
                >
                  <feature.icon className="w-10 h-10 text-barber-gold mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="font-bebas text-xl text-barber-text tracking-wide mb-2">{feature.title}</h3>
                  <p className="text-barber-muted text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
