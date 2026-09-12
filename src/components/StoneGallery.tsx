import { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/stoneData';
import { GalleryImage } from '../types';

export default function StoneGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Granite Slabs',
    'Marble Slabs',
    'Limestone & Basalt',
    'Stairs & Sills',
    'Coping',
    'Workshop & Fabrication',
    'Architectural Installations',
    'Close-up Textures'
  ];

  const filteredItems = GALLERY_ITEMS.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const currentItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section 
      id="gallery"
      className="py-24 sm:py-32 bg-marble-light relative border-t border-[#DDDAD3] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#3F403E]"></span>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#3F403E] uppercase">
              VISUAL REPERTOIRE
            </span>
            <span className="w-6 h-[1.5px] bg-[#3F403E]"></span>
          </div>

          <h2 
            id="gallery-heading"
            className="text-3xl sm:text-5xl font-serif text-[#252625] tracking-tight leading-tight mb-4 font-medium"
          >
            Stone & Workshop Gallery
          </h2>

          <p className="text-[#5C5B57] text-sm sm:text-base font-light tracking-wide max-w-xl">
            A photographic inspection of raw Ethiopian natural stone slabs, precision machinery, finished stairs, sills, coping, and completed spaces.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`gallery-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider rounded-sm transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#252625] text-white border-[#252625] font-bold shadow-sm'
                    : 'bg-white text-[#5C5B57] hover:text-[#252625] border-[#DDDAD3] hover:bg-[#EBE9E4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div 
          id="gallery-items-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              id={`gallery-thumb-${item.id}`}
              onClick={() => openLightbox(index)}
              className="stone-card-hover group relative aspect-square rounded-sm overflow-hidden bg-[#EAE8E3] border border-[#C8C7C3] hover:border-[#8E8D89] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <span className="p-1.5 rounded-full bg-[#252625]/80 text-white border border-white/20 shadow-sm">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8C7C3] block">
                    {item.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-serif text-white tracking-wide mt-0.5 line-clamp-2 font-medium">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div 
          id="gallery-lightbox-overlay"
          className="fixed inset-0 z-50 bg-[#171817]/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-8"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#DDDAD3] uppercase tracking-widest font-bold font-mono">
                {activeLightboxIndex! + 1} / {filteredItems.length}
              </span>
              <span className="text-[#3F403E]">|</span>
              <span className="text-[#C8C7C3] font-sans tracking-wider uppercase text-[11px]">
                {currentItem.category}
              </span>
            </div>

            <button
              id="lightbox-close-btn"
              onClick={closeLightbox}
              className="p-2 text-[#C8C7C3] hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Image Stage */}
          <div 
            className="relative flex items-center justify-center max-h-[75vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              className="max-h-[75vh] max-w-full object-contain rounded-sm shadow-2xl border border-[#3F403E]"
            />

            {/* Left & Right Navigation Arrows */}
            <button
              id="lightbox-prev-btn"
              onClick={prevImage}
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#DDDAD3] border border-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              id="lightbox-next-btn"
              onClick={nextImage}
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#DDDAD3] border border-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div 
            className="max-w-2xl mx-auto text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-xl font-serif text-white mb-1 font-medium">
              {currentItem.title}
            </h3>
            <p className="text-xs text-[#C8C7C3] font-light">
              {currentItem.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
