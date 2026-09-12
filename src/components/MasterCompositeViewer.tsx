import { useState } from 'react';
import { StoneProduct } from '../types';
import { Layers, ZoomIn, Eye, Sparkles } from 'lucide-react';

interface MasterCompositeViewerProps {
  compositeSrc: string;
  onSelectProductById: (stoneId: string) => void;
  onOpenPhotoManager: () => void;
}

interface StoneHotspot {
  id: string;
  num: number;
  name: string;
  type: string;
  price: string;
  x: string; // Left percentage relative to stone grid
  y: string; // Top percentage
  w: string;
  h: string;
}

// Coordinate hotspots matching IMG_7588.jpeg layout
const HOTSPOTS: StoneHotspot[] = [
  {
    id: 'axum-granite-black',
    num: 1,
    name: 'AXUM GRANITE BLACK',
    type: 'Granite',
    price: '10,300 ETB / m²',
    x: '0%',
    y: '0%',
    w: '33.33%',
    h: '50%'
  },
  {
    id: 'welega-marble-white',
    num: 2,
    name: 'WELEGA MARBLE WHITE',
    type: 'Marble',
    price: '7,500 ETB / m²',
    x: '33.33%',
    y: '0%',
    w: '33.33%',
    h: '50%'
  },
  {
    id: 'welega-marble-gray',
    num: 3,
    name: 'WELEGA MARBLE GRAY',
    type: 'Marble',
    price: '8,000 ETB / m²',
    x: '66.66%',
    y: '0%',
    w: '33.33%',
    h: '50%'
  },
  {
    id: 'axum-granite-white',
    num: 4,
    name: 'AXUM GRANITE WHITE',
    type: 'Granite',
    price: '9,800 ETB / m²',
    x: '0%',
    y: '50%',
    w: '33.33%',
    h: '50%'
  },
  {
    id: 'babile-granite',
    num: 5,
    name: 'BABILE GRANITE',
    type: 'Granite',
    price: '8,500 ETB / m²',
    x: '33.33%',
    y: '50%',
    w: '33.33%',
    h: '50%'
  },
  {
    id: 'limestone',
    num: 6,
    name: 'LIMESTONE',
    type: 'Limestone',
    price: 'Contact for Quotation',
    x: '66.66%',
    y: '50%',
    w: '33.33%',
    h: '50%'
  }
];

export default function MasterCompositeViewer({
  compositeSrc,
  onSelectProductById,
  onOpenPhotoManager,
}: MasterCompositeViewerProps) {
  const [activeHotspot, setActiveHotspot] = useState<StoneHotspot | null>(null);

  return (
    <div className="bg-[#181918] border border-[#303130] rounded-sm p-6 sm:p-8 text-[#F4F3EF] mb-16 shadow-xl relative overflow-hidden">
      {/* Background marble accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#303130]">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5 text-xs font-mono uppercase tracking-widest text-[#B7B6B2]">
            <Sparkles className="w-3.5 h-3.5 text-[#D8D6D1]" />
            Official Master Showroom Composite (IMG_7588)
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#F4F3EF] tracking-tight">
            Six Natural Stone Collection Sheet
          </h3>
          <p className="text-xs sm:text-sm text-[#B7B6B2] font-sans font-light mt-0.5">
            Hover over any stone slab below to preview details or click to launch its full technical specifications &amp; quotation calculator.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPhotoManager}
            className="px-3.5 py-2 rounded-sm bg-[#242524] hover:bg-[#303130] text-[#F4F3EF] border border-[#414240] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Photos</span>
          </button>
        </div>
      </div>

      {/* Interactive Composite Image Display */}
      <div className="relative rounded-sm overflow-hidden bg-[#111211] border border-[#303130] aspect-[16/9] max-w-5xl mx-auto group">
        <img
          src={compositeSrc}
          alt="Clay's Granite and Marble 6-Stone Official Collection (IMG_7588.jpeg)"
          className="w-full h-full object-contain"
        />

        {/* Hotspots Grid Overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
          {HOTSPOTS.map((spot) => (
            <div
              key={spot.id}
              onMouseEnter={() => setActiveHotspot(spot)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => onSelectProductById(spot.id)}
              className="relative border border-transparent hover:border-[#D8D6D1]/60 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer flex flex-col justify-end p-3 sm:p-4 group/spot"
            >
              {/* Badge on top right of cell */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-[#111211]/85 border border-[#414240] text-[10px] font-mono text-[#D8D6D1] flex items-center gap-1 opacity-0 group-hover/spot:opacity-100 transition-opacity">
                <span>#{spot.num}</span>
                <span className="font-semibold text-white">{spot.name}</span>
              </div>

              {/* Bottom tag inside hover */}
              <div className="mt-auto transform translate-y-2 group-hover/spot:translate-y-0 opacity-0 group-hover/spot:opacity-100 transition-all duration-200 bg-[#181918]/95 border border-[#858582] p-2 sm:p-2.5 rounded-sm shadow-xl">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-serif font-bold text-white tracking-wide truncate">
                    {spot.name}
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold text-[11px] shrink-0">
                    {spot.price}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#B7B6B2] mt-1 font-mono">
                  <span>Category: {spot.type}</span>
                  <span className="text-white flex items-center gap-1">
                    <Eye className="w-3 h-3" /> View Specs
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Legend Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 text-center">
        {HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            onClick={() => onSelectProductById(spot.id)}
            className="p-2 rounded-sm bg-[#202120] hover:bg-[#252625] border border-[#303130] hover:border-[#858582] transition-colors cursor-pointer text-left group/btn"
          >
            <div className="text-[10px] font-mono text-[#858582] group-hover/btn:text-[#D8D6D1]">
              Photo #{spot.num} • {spot.type}
            </div>
            <div className="text-xs font-serif font-semibold text-white truncate">
              {spot.name}
            </div>
            <div className="text-[11px] font-mono text-emerald-400">
              {spot.price}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
