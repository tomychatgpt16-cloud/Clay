import { Sparkles, ShieldCheck, Leaf, Compass, MapPin } from 'lucide-react';
import ArchitecturalImage from './ArchitecturalImage';

export default function MaterialToMasterpiece() {
  const heritageStones = [
    {
      name: 'Axum Granite',
      region: 'Axum, Tigray',
      type: 'Plutonic Natural Granite',
      description: 'Renowned throughout East Africa for immense compressive density, crystalline uniformity, and deep obsidian undertones that resist weathering for centuries.',
      properties: ['Exceptional mineral density', 'Zero water absorption decay', 'Mirror & flamed suitability'],
      slotPath: '/images/heritage/heritage-axum.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Welega Marble',
      region: 'Welega, Oromia',
      type: 'Metamorphic Calcite Marble',
      description: 'Celebrated by architectural masters for its luminous white translucency and subtle, rhythmic silver veining reminiscent of classical Mediterranean quarries.',
      properties: ['Pure white crystal translucency', 'Delicate silver-gray veining', 'Honed and high-polish elegance'],
      slotPath: '/images/heritage/heritage-welega.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Babile Granite',
      region: 'Babile, Harar',
      type: 'Warm Porphyritic Granite',
      description: 'Defined by warm earth tones, desert bronze minerals, and distinct crystalline character, echoing the historical stone masonry of ancient Harari architecture.',
      properties: ['Warm earthy quartz palette', 'High slip-resistance when flamed', 'Distinct geological matrix'],
      slotPath: '/images/products/babile-granite.svg',
      fallbackUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Ethiopian Limestone',
      region: 'Dire Dawa Basin',
      type: 'Sedimentary Architectural Limestone',
      description: 'Precipitated calcium carbonate stone with fine uniform stratification, presenting calm ivory, cream, and sand-buff hues suited for architectural cladding and sills.',
      properties: ['Exceptional thermal insulation', 'Fine-grained uniform texture', 'Smooth sawn and honed finishing'],
      slotPath: '/images/products/limestone.svg',
      fallbackUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Ethiopian Bazalt (Basalt)',
      region: 'Central Rift Highlands',
      type: 'Aphanitic Volcanic Igneous Stone',
      description: 'Formed from cooled continental flood basalts. Yields extreme density, deep charcoal-black coloration, and extraordinary durability for heavy pedestrian stairs and coping.',
      properties: ['Immense compressive strength', 'Natural non-slip micro-texture', 'Impervious to freeze-thaw and abrasion'],
      slotPath: '/images/products/bazalt.svg',
      fallbackUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const storyPillars = [
    {
      icon: <Compass className="w-5 h-5 text-[#D8D6D1]" />,
      step: '01',
      title: 'Ethiopian Geological Heritage',
      subtitle: 'Axum, Welega & Babile Reserves',
      body: 'Formed through tectonic pressures over hundreds of millions of years, Ethiopian natural stone possesses unique mineral matrices. From the volcanic granite deposits of Axum to the calcite marble strata of Welega and the warm quartz of Babile, our stone carries geological majesty.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#D8D6D1]" />,
      step: '02',
      title: 'Industrial Manufacturing Precision',
      subtitle: 'Multi-Blade Bridge Saws & Calibration Lines',
      body: 'At our Addis Ababa fabrication yard, massive rough blocks are sliced with multi-blade diamond gang saws, thickness-calibrated on automated lines to ±0.5mm tolerances, and surfaced using multi-head planetary polishers to achieve liquid-mirror reflections.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#D8D6D1]" />,
      step: '03',
      title: 'Architectural Value & Prestige',
      subtitle: 'Embassies, Commercial Plazas & Luxury Residences',
      body: 'Specified by leading architects for high-traffic public institutions, diplomatic missions, and signature luxury developments. Ethiopian stone combines timeless visual gravity with the durability demanded by heavy vehicular and pedestrian footfall.'
    },
    {
      icon: <Leaf className="w-5 h-5 text-[#D8D6D1]" />,
      step: '04',
      title: 'Sustainability & Generational Longevity',
      subtitle: '100% Natural, Chemical-Free, Built for Decades',
      body: 'Completely natural stone emits zero VOCs, requires no toxic synthetic adhesives, and will not degrade under intense equatorial UV exposure. It is a genuine investment in architectural permanence that outlasts artificial tile alternatives.'
    }
  ];

  return (
    <section 
      id="material-to-masterpiece"
      className="py-28 sm:py-36 bg-[#111211] text-[#F4F3EF] relative border-t border-[#202120] overflow-hidden"
    >
      {/* Deep Charcoal & Silver Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-[#414240]/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-[1px] bg-[#858582]" />
            <span className="text-[11px] font-semibold tracking-[0.3em] text-[#B7B6B2] uppercase">
              THE STORY OF ETHIOPIAN STONE
            </span>
            <span className="w-8 h-[1px] bg-[#858582]" />
          </div>

          <h2 
            id="masterpiece-heading"
            className="text-4xl sm:text-6xl font-serif text-[#F4F3EF] tracking-tight leading-tight mb-5 font-normal"
          >
            Material to Masterpiece
          </h2>

          <p className="text-[#B7B6B2] text-base sm:text-lg font-sans font-light tracking-wide max-w-2xl leading-relaxed">
            Connecting Ethiopia’s ancient stone quarrying heritage with state-of-the-art precision cutting technology to produce monumental architecture.
          </p>
        </div>

        {/* 4 Storytelling Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {storyPillars.map((pillar) => (
            <div
              key={pillar.step}
              className="p-8 sm:p-10 rounded-sm bg-[#202120]/80 border border-[#414240] hover:border-[#858582] transition-all duration-300 shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-sm bg-[#111211] border border-[#414240] group-hover:border-[#B7B6B2] flex items-center justify-center transition-colors">
                    {pillar.icon}
                  </div>
                  <span className="font-mono text-3xl font-light text-[#414240] group-hover:text-[#D8D6D1] transition-colors">
                    {pillar.step}
                  </span>
                </div>

                <span className="text-[10px] font-mono tracking-[0.25em] text-[#858582] uppercase block mb-1">
                  {pillar.subtitle}
                </span>

                <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F3EF] tracking-wide mb-3 font-medium">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#B7B6B2] font-sans font-light leading-relaxed">
                  {pillar.body}
                </p>
              </div>

              <div className="w-10 h-[1px] bg-[#414240] group-hover:w-20 group-hover:bg-[#D8D6D1] transition-all duration-300 mt-8" />
            </div>
          ))}
        </div>

        {/* Dedicated Section: Ethiopian Stone Geological Heritage Showcase */}
        <div className="pt-12 border-t border-[#202120]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#858582] uppercase block mb-2">
                REGIONAL GEOLOGY
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F3EF] font-medium">
                Ethiopian Stone Heritage
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#B7B6B2] font-light max-w-md">
              Each quarry across Ethiopia produces natural stone with distinctive chemical composition, density, and crystalline structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {heritageStones.map((stone) => (
              <div 
                key={stone.name}
                className="bg-[#202120] border border-[#414240] rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#858582] transition-colors"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#111211]">
                    <ArchitecturalImage
                      src={stone.slotPath}
                      fallbackUrl={stone.fallbackUrl}
                      alt={stone.name}
                      title={stone.name}
                      slotPath={stone.slotPath}
                      aspectRatio="aspect-[16/10]"
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 text-[10px] text-[#F4F3EF] bg-[#111211]/85 px-2.5 py-1 rounded-sm border border-[#414240]">
                      <MapPin className="w-3 h-3 text-[#D8D6D1]" />
                      <span>{stone.region}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-mono tracking-widest text-[#858582] uppercase block mb-1">
                      {stone.type}
                    </span>
                    <h4 className="text-2xl font-serif text-[#F4F3EF] mb-2 font-medium">
                      {stone.name}
                    </h4>
                    <p className="text-xs text-[#B7B6B2] font-light leading-relaxed mb-4">
                      {stone.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-[#414240]">
                      {stone.properties.map((prop, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-[#D8D6D1]">
                          <span className="text-[#858582]">•</span>
                          <span>{prop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <div className="p-2.5 bg-[#111211] rounded-sm border border-[#414240] text-[10px] font-mono text-[#858582] text-center uppercase tracking-widest">
                    Quarried &amp; Processed in Ethiopia
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
