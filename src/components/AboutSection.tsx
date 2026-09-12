import { ArrowRight, CheckCircle } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/stoneData';

interface AboutSectionProps {
  onDiscoverMore: () => void;
}

export default function AboutSection({ onDiscoverMore }: AboutSectionProps) {
  const pillars = [
    {
      title: 'QUALITY',
      desc: 'Selected geological reserves with pristine crystal clarity and uniform mineral density.',
    },
    {
      title: 'DURABILITY',
      desc: 'Formed through millions of years of natural heat and pressure to endure generations.',
    },
    {
      title: 'ELEGANCE',
      desc: 'Refined surface finishes that elevate contemporary architectural and interior spaces.',
    },
  ];

  return (
    <section 
      id="about" 
      className="py-24 sm:py-32 bg-marble-light relative border-t border-[#DDDAD3] overflow-hidden"
    >
      {/* Subtle Gray Marble Ambient Highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8E8D89]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C8C7C3]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1.5px] bg-[#3F403E]"></div>
          <span className="text-xs font-semibold tracking-[0.25em] text-[#3F403E] uppercase">
            ABOUT CLAY’S
          </span>
        </div>

        {/* Visual Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Premium Stone / Factory Imagery Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-sm overflow-hidden border border-[#C8C7C3] shadow-xl group bg-white">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85"
                alt="Clay's Stone Manufacturing Facility and Precision Diamond Cutting"
                className="w-full h-[420px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252625]/80 via-transparent to-transparent opacity-85"></div>
              
              {/* Badge overlay on image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-sm bg-[#171817]/90 backdrop-blur-md border border-[#3F403E]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#DDDAD3] font-semibold block">
                      Manufacturing Standard
                    </span>
                    <span className="text-sm font-serif text-[#F4F3F0] mt-0.5 block">
                      Bridge Saw Tolerances & Hand-Finished Profiles
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#C8C7C3]">Addis Ababa</span>
                </div>
              </div>
            </div>

            {/* Decorative Architectural Offset Frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#C8C7C3] -z-0 rounded-sm hidden sm:block"></div>
          </div>

          {/* Right Side: Company Story & Pillars */}
          <div className="lg:col-span-6 flex flex-col">
            
            <h2 
              id="about-main-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#252625] tracking-tight leading-tight mb-6 font-medium"
            >
              “Stone, Crafted with Purpose.”
            </h2>

            <p 
              id="about-body-story"
              className="text-[#5C5B57] text-base sm:text-lg leading-relaxed font-light mb-8"
            >
              {COMPANY_DETAILS.aboutStory}
            </p>

            {/* Three Emphasized Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 pt-4 border-t border-[#DDDAD3]">
              {pillars.map((pillar) => (
                <div 
                  key={pillar.title} 
                  className="flex flex-col p-4 rounded-sm bg-white/80 backdrop-blur-sm border border-[#DDDAD3] shadow-sm hover:border-[#8E8D89] transition-colors"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle className="w-4 h-4 text-[#3F403E] shrink-0" />
                    <h3 className="font-display text-xs tracking-[0.2em] font-bold text-[#252625]">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#706F6A] leading-normal font-sans">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Button: Discover Clay's */}
            <div>
              <button
                id="about-discover-clays-btn"
                onClick={onDiscoverMore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-transparent hover:bg-[#252625] text-[#252625] hover:text-white text-xs font-bold tracking-[0.2em] uppercase border border-[#252625] transition-all group cursor-pointer shadow-sm"
              >
                <span>DISCOVER CLAY’S</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#252625] group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
