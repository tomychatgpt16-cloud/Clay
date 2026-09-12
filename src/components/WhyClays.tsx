import { 
  BadgePercent, 
  Cpu, 
  Ruler, 
  DraftingCompass, 
  Building2 
} from 'lucide-react';

export default function WhyClays() {
  const competitiveStrengths = [
    {
      id: 'factory-pricing',
      num: '01',
      icon: <BadgePercent className="w-5 h-5 text-[#D8D6D1]" />,
      title: 'Direct Factory Pricing',
      subtitle: 'No Middleman Markup',
      description: 'We process directly from raw Ethiopian quarry blocks to finished slabs in our Addis Ababa manufacturing plant, offering the most competitive pricing in the country with complete transparency.'
    },
    {
      id: 'cutting-tech',
      num: '02',
      icon: <Cpu className="w-5 h-5 text-[#D8D6D1]" />,
      title: 'Advanced Stone Cutting Technology',
      subtitle: 'Diamond Gang Saws & Automated Bridge Cutters',
      description: 'Equipped with heavy-duty multi-blade diamond gang saws and automated bridge cutters that deliver clean, chip-free edge profiles, exact 90° miter angles, and micro-calibrated slab widths.'
    },
    {
      id: 'thickness-control',
      num: '03',
      icon: <Ruler className="w-5 h-5 text-[#D8D6D1]" />,
      title: 'Precision Thickness Control',
      subtitle: 'Uniform Calibration for Seamless Installation',
      description: 'Every slab passes continuous surface calibration to ensure uniform 20mm or 30mm thickness across its entire span, eliminating lippage and significantly reducing on-site installation time.'
    },
    {
      id: 'custom-fabrication',
      num: '04',
      icon: <DraftingCompass className="w-5 h-5 text-[#D8D6D1]" />,
      title: 'Custom Architectural Fabrication',
      subtitle: 'Made to Precise Project Drawings',
      description: 'We manufacture strictly against architectural schedules and CAD shop drawings, producing intricate beveled bullnoses, coping drip edges, and sink cutouts tailored to each project.'
    },
    {
      id: 'volume-supply',
      num: '05',
      icon: <Building2 className="w-5 h-5 text-[#D8D6D1]" />,
      title: 'Reliable Volume Supply',
      subtitle: 'Capable of Supplying Large Commercial Projects',
      description: 'Continuous stock reserves of raw quarry blocks and high production capacity ensure uninterrupted delivery schedules for major high-rise towers, public plazas, and embassy developments.'
    }
  ];

  return (
    <section 
      id="why-clays"
      className="py-28 sm:py-36 bg-[#111211] text-[#F4F3EF] relative border-t border-[#202120] overflow-hidden"
    >
      {/* Gray Marble Ambient Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[800px] h-[500px] bg-[#414240]/25 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-[1px] bg-[#858582]" />
            <span className="text-[11px] font-semibold tracking-[0.3em] text-[#B7B6B2] uppercase">
              MANUFACTURING ADVANTAGE
            </span>
            <span className="w-8 h-[1px] bg-[#858582]" />
          </div>

          <h2 
            id="why-clays-heading"
            className="text-4xl sm:text-6xl font-serif text-[#F4F3EF] tracking-tight leading-tight mb-4 font-normal"
          >
            Why Choose Clay’s
          </h2>

          <p className="text-[#B7B6B2] text-base sm:text-lg font-sans font-light tracking-wide max-w-xl">
            Real competitive strengths rooted in our direct manufacturing plant, precision machinery, and volume capabilities.
          </p>
        </div>

        {/* 5 Competitive Strengths Grid */}
        <div 
          id="why-clays-pillars-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {competitiveStrengths.map((item, idx) => {
            const isSpanTwo = idx === 4; // Make the 5th card span 2 on large screens or centered nicely

            return (
              <div
                key={item.id}
                id={`pillar-card-${item.id}`}
                className={`p-8 sm:p-10 rounded-sm bg-[#202120] border border-[#414240] hover:border-[#858582] transition-all duration-300 shadow-md hover:shadow-2xl flex flex-col justify-between group ${
                  isSpanTwo ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-sm bg-[#111211] border border-[#414240] group-hover:border-[#B7B6B2] flex items-center justify-center transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-mono text-3xl font-light text-[#414240] group-hover:text-[#D8D6D1] transition-colors">
                      {item.num}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono tracking-widest text-[#858582] uppercase block mb-1">
                    {item.subtitle}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-serif text-[#F4F3EF] tracking-wide mb-3 group-hover:text-white transition-colors font-medium">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#B7B6B2] font-sans font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="w-10 h-[1px] bg-[#414240] group-hover:bg-[#D8D6D1] group-hover:w-20 transition-all duration-300 mt-6" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
