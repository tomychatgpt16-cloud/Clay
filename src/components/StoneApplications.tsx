import { ArrowRight, Layers, Check } from 'lucide-react';
import ArchitecturalImage from './ArchitecturalImage';

interface StoneApplicationsProps {
  onSelectApplicationForQuote: (appTitle: string) => void;
}

interface ArchitecturalApplication {
  id: string;
  name: string;
  category: string;
  description: string;
  keySpecs: string[];
  recommendedStone: string;
  availableFinishes: string[];
  imageSlot: string;
  fallbackUrl: string;
}

const FABRICATION_APPLICATIONS: ArchitecturalApplication[] = [
  {
    id: 'stairs',
    name: 'Stairs, Treads & Risers',
    category: 'Vertical Circulation',
    description: 'Calibrated steps engineered for structural longevity in high-traffic commercial and residential entries. Available in 20mm and 30mm single-slab profiles with custom anti-slip grooving.',
    keySpecs: [
      'Treads & Risers calibrated to exact millimeter dimensions',
      'Anti-slip flamed or honed safety strips',
      'Precision edge profiling: Half Bullnose, Full Bullnose, Chamfer'
    ],
    recommendedStone: 'Axum Granite Black, Bazalt (Volcanic), or Babile Granite',
    availableFinishes: ['Polished', 'Flamed (Anti-Slip)', 'Non-Polished', 'Mirror Polish'],
    imageSlot: '/images/applications/app-stairs.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'window-door-sills',
    name: 'Window Sills & Door Sills',
    category: 'Aperture Protection',
    description: 'Precision-sawn thresholds and sills that protect exterior masonry from rainwater infiltration while providing clean architectural framing.',
    keySpecs: [
      'Continuous underside weather groove / drip edge',
      'Cut-to-order spans up to 2.80 meters without joint lines',
      'Polished top with beveled water-shedding pitch'
    ],
    recommendedStone: 'Ethiopian Limestone, Axum Granite White, or Welega Marble White',
    availableFinishes: ['Polished', 'Non-Polished', 'Mirror Polish'],
    imageSlot: '/images/applications/app-sills.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'coping-caps',
    name: 'Coping & Parapet Caps',
    category: 'Perimeter Defense',
    description: 'Heavy-duty capping stone for exterior boundary walls, roof parapets, retaining walls, and swimming pool perimeters, manufactured to shed water cleanly.',
    keySpecs: [
      'Parapet, perimeter wall, and pool coping profiles',
      'Precision water-drip kerfs on one or both edges',
      'Superior freeze-thaw and thermal expansion stability'
    ],
    recommendedStone: 'Bazalt (High Density), Axum Granite Black, or Babile Granite',
    availableFinishes: ['Flamed', 'Non-Polished', 'Polished'],
    imageSlot: '/images/applications/app-coping.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'countertops',
    name: 'Kitchen & Vanity Countertops',
    category: 'Surface Finishes',
    description: 'Dense, crystalline granite slabs resistant to scratching, heat, and staining. Fabricated with CNC cutouts for under-mount sinks and cooktops.',
    keySpecs: [
      'Mirror-polished stain-resistant surface matrix',
      'Integrated under-mount sink and cooktop aperture cutouts',
      'Mitered aprons and waterfall island return edges'
    ],
    recommendedStone: 'Axum Granite Black or Axum Granite White',
    availableFinishes: ['Mirror Polish', 'Polished'],
    imageSlot: '/images/applications/app-countertops.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'flooring-paving',
    name: 'Flooring & Outdoor Paving',
    category: 'Floor Finishes',
    description: 'Large-format interior marble flooring paired with textured, high-traction flamed granite pavers for exterior plazas, courtyards, and driveways.',
    keySpecs: [
      'Interior mirror-calibrated floor tiles (60×60, 60×120, custom)',
      'Exterior high-traction flamed pedestrian and vehicular pavers',
      'Exceptional abrasion resistance for high-footfall public lobbies'
    ],
    recommendedStone: 'Welega Marble Gray / Welega Marble White / Axum Granite',
    availableFinishes: ['Polished', 'Flamed (Outdoor)', 'Non-Polished'],
    imageSlot: '/images/applications/app-flooring.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'wall-cladding',
    name: 'Interior & Exterior Wall Cladding',
    category: 'Architectural Envelopes',
    description: 'Dimensional cladding panels designed for mechanical anchoring or direct adhesion on executive feature walls, elevator lobbies, and building facades.',
    keySpecs: [
      'Engineered kerfs for stainless steel mechanical fixings',
      'Calibrated 20mm uniform thickness for tight dry-lay joints',
      'Book-matched veining patterns available on select Welega marble'
    ],
    recommendedStone: 'Ethiopian Limestone, Welega Marble White, or Axum Granite Black',
    availableFinishes: ['Polished', 'Non-Polished', 'Flamed'],
    imageSlot: '/images/applications/app-cladding.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'custom-fabrication',
    name: 'Custom Architectural Pieces',
    category: 'Bespoke Stonework',
    description: 'Bespoke masonry manufacturing for specialized architectural elements, including monolithic reception desks, solid stone columns, and fireplace surrounds.',
    keySpecs: [
      'Mitered joint monolithic reception counters and podiums',
      'Structural and decorative column casings',
      'Bespoke architectural detailing from CAD / DWG schedules'
    ],
    recommendedStone: 'All Ethiopian Granites & Marbles',
    availableFinishes: ['Polished', 'Mirror Polish', 'Non-Polished', 'Flamed'],
    imageSlot: '/images/applications/app-custom.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80'
  }
];

export default function StoneApplications({ onSelectApplicationForQuote }: StoneApplicationsProps) {
  return (
    <section 
      id="applications"
      className="py-28 sm:py-36 bg-[#F4F3EF] relative border-t border-[#D8D6D1] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-[1px] bg-[#858582]" />
            <span className="text-[11px] font-semibold tracking-[0.3em] text-[#414240] uppercase">
              FABRICATION CAPABILITIES
            </span>
            <span className="w-8 h-[1px] bg-[#858582]" />
          </div>

          <h2 
            id="applications-heading"
            className="text-4xl sm:text-6xl font-serif text-[#111211] tracking-tight leading-tight mb-4 font-normal"
          >
            Stone Applications
          </h2>

          <p className="text-[#414240] text-base sm:text-lg font-sans font-light tracking-wide max-w-2xl">
            From heavy-duty exterior granite coping to precision-veined marble feature walls, every element is custom-sawn to exact architectural blueprints.
          </p>
        </div>

        {/* Applications Grid: Editorial Cards */}
        <div 
          id="applications-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FABRICATION_APPLICATIONS.map((app, index) => (
            <article
              key={app.id}
              id={`application-card-${app.id}`}
              className="group flex flex-col justify-between bg-white border border-[#D8D6D1] hover:border-[#858582] rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl shadow-sm"
            >
              <div>
                {/* Visual Image Header with Central Registry Photo Slot */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#202120]">
                  <ArchitecturalImage
                    src={app.imageSlot}
                    fallbackUrl={app.fallbackUrl}
                    alt={`${app.name} fabrication by Clay's`}
                    title={app.name}
                    slotPath={app.imageSlot}
                    aspectRatio="aspect-[16/10]"
                    className="w-full h-full"
                  />

                  {/* Application Number & Category Badge */}
                  <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase bg-[#111211]/90 text-[#F4F3EF] border border-[#414240] rounded-sm backdrop-blur-md">
                      0{index + 1}
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase bg-[#111211]/75 text-[#D8D6D1] rounded-sm backdrop-blur-md hidden sm:inline-block">
                      {app.category}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-7">
                  <h3 className="text-xl sm:text-2xl font-serif text-[#111211] tracking-wide mb-2.5 font-medium group-hover:text-[#414240] transition-colors">
                    {app.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#414240] font-sans font-light leading-relaxed mb-5">
                    {app.description}
                  </p>

                  {/* Key Fabrication Specs */}
                  <div className="space-y-2 mb-5">
                    {app.keySpecs.map((spec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#202120]">
                        <Check className="w-3.5 h-3.5 text-[#414240] shrink-0 mt-0.5" />
                        <span className="font-light">{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Stone */}
                  <div className="pt-4 border-t border-[#D8D6D1] mb-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#858582] block mb-1">
                      Recommended Stone Type
                    </span>
                    <span className="text-xs font-serif font-bold text-[#111211]">
                      {app.recommendedStone}
                    </span>
                  </div>

                  {/* Available Finishes */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#858582] block mb-1.5">
                      Available Finishes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.availableFinishes.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 text-[10px] bg-[#F4F3EF] text-[#202120] rounded-sm border border-[#D8D6D1]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Button: Quote this application */}
              <div className="p-6 pt-0 mt-auto">
                <button
                  id={`btn-quote-application-${app.id}`}
                  onClick={() => onSelectApplicationForQuote(app.name)}
                  className="w-full py-3 px-4 text-xs font-bold tracking-[0.18em] uppercase rounded-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer bg-[#111211] hover:bg-[#414240] text-[#F4F3EF] border border-[#111211] shadow-md hover:shadow-lg"
                >
                  <span>SPECIFY THIS APPLICATION</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D8D6D1]" />
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
