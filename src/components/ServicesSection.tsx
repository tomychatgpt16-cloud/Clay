import { 
  Hammer, 
  Layers, 
  Maximize2, 
  Shield, 
  Compass, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { STONE_SERVICES } from '../data/stoneData';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export default function ServicesSection({ onSelectServiceForQuote }: ServicesSectionProps) {
  const getIcon = (iconName: string, isDarkCard: boolean) => {
    const iconClass = isDarkCard ? "w-5 h-5 text-[#DDDAD3]" : "w-5 h-5 text-[#3F403E]";
    switch (iconName) {
      case 'Hammer':
        return <Hammer className={iconClass} />;
      case 'Layers':
        return <Layers className={iconClass} />;
      case 'Maximize2':
        return <Maximize2 className={iconClass} />;
      case 'Shield':
        return <Shield className={iconClass} />;
      case 'Compass':
        return <Compass className={iconClass} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={iconClass} />;
      default:
        return <Layers className={iconClass} />;
    }
  };

  return (
    <section 
      id="services"
      className="py-24 sm:py-32 bg-marble-light relative border-t border-[#DDDAD3] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#3F403E]"></span>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#3F403E] uppercase">
              CAPABILITIES & WORKMANSHIP
            </span>
            <span className="w-6 h-[1.5px] bg-[#3F403E]"></span>
          </div>

          <h2 
            id="services-heading"
            className="text-3xl sm:text-5xl font-serif text-[#252625] tracking-tight leading-tight mb-4 font-medium"
          >
            Bespoke Stone Services
          </h2>

          <p className="text-[#5C5B57] text-sm sm:text-base font-light tracking-wide max-w-xl">
            Precision cutting, custom fabrication, and architectural execution tailored to high-performance projects.
          </p>
        </div>

        {/* Services Grid (Alternating White, Light Gray Marble, and Dark Charcoal Cards) */}
        <div 
          id="services-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {STONE_SERVICES.map((service, index) => {
            const cardVariant = index % 3; // 0: White Card, 1: Light Gray Marble Card, 2: Dark Charcoal Card
            const isDarkCard = cardVariant === 2;
            const isGrayCard = cardVariant === 1;

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className={`stone-card-hover group flex flex-col justify-between rounded-sm overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl ${
                  isDarkCard
                    ? 'bg-[#252625] text-white border border-[#3F403E] hover:border-[#8E8D89]'
                    : isGrayCard
                    ? 'bg-[#EAE8E3] text-[#252625] border border-[#DDDAD3] hover:border-[#8E8D89]'
                    : 'bg-white text-[#252625] border border-[#C8C7C3] hover:border-[#8E8D89]'
                }`}
              >
                <div>
                  {/* Visual Image Header */}
                  <div className="relative h-48 overflow-hidden bg-[#171817]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div 
                      className={`absolute inset-0 bg-gradient-to-t ${
                        isDarkCard 
                          ? 'from-[#252625] via-[#252625]/40 to-transparent' 
                          : isGrayCard
                          ? 'from-[#EAE8E3] via-[#EAE8E3]/40 to-transparent'
                          : 'from-white via-white/30 to-transparent'
                      }`}
                    ></div>
                    
                    {/* Floating Architectural Icon */}
                    <div 
                      className={`absolute top-4 left-4 w-10 h-10 rounded-sm flex items-center justify-center backdrop-blur-sm shadow-sm border ${
                        isDarkCard
                          ? 'bg-[#171817]/90 border-[#3F403E]'
                          : 'bg-white/90 border-[#C8C7C3]'
                      }`}
                    >
                      {getIcon(service.icon, isDarkCard)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 
                      className={`text-lg sm:text-xl font-serif tracking-wide mb-1.5 transition-colors font-medium ${
                        isDarkCard ? 'text-[#F4F3F0] group-hover:text-white' : 'text-[#252625] group-hover:text-[#3F403E]'
                      }`}
                    >
                      {service.title}
                    </h3>

                    <p 
                      className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                        isDarkCard ? 'text-[#DDDAD3]' : 'text-[#706F6A]'
                      }`}
                    >
                      {service.summary}
                    </p>

                    <p 
                      className={`text-xs leading-relaxed font-light mb-4 ${
                        isDarkCard ? 'text-[#C8C7C3]' : 'text-[#5C5B57]'
                      }`}
                    >
                      {service.description}
                    </p>

                    {/* Bullet Highlights */}
                    <div className={`space-y-1.5 pt-3 border-t ${isDarkCard ? 'border-[#3F403E]' : 'border-[#DDDAD3]'}`}>
                      {service.features.map((feature, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-start gap-2 text-[11px] ${
                            isDarkCard ? 'text-[#DDDAD3]' : 'text-[#706F6A]'
                          }`}
                        >
                          <span className={isDarkCard ? 'text-[#C8C7C3] font-bold' : 'text-[#3F403E] font-bold'}>›</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Service Action Button */}
                <div className="p-6 pt-0">
                  <button
                    id={`btn-inquire-service-${service.id}`}
                    onClick={() => onSelectServiceForQuote(service.title)}
                    className={`w-full py-2.5 px-4 text-xs font-semibold tracking-wider rounded-sm flex items-center justify-between transition-all cursor-pointer group/btn border ${
                      isDarkCard
                        ? 'bg-[#171817] hover:bg-[#3F403E] text-white border-[#3F403E]'
                        : 'bg-white hover:bg-[#252625] text-[#252625] hover:text-white border-[#C8C7C3]'
                    }`}
                  >
                    <span>REQUEST QUOTE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
