import { ArrowDown, ChevronRight } from 'lucide-react';
import { SITE_IMAGE_SLOTS } from '../data/imageAssets';

interface HeroProps {
  onExploreStones: () => void;
  onRequestQuote: () => void;
}

export default function Hero({ onExploreStones, onRequestQuote }: HeroProps) {
  const heroAsset = SITE_IMAGE_SLOTS.hero;

  return (
    <section 
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#111211] pt-24 pb-20"
    >
      {/* Cinematic Full-screen Background of Natural Stone & Gray Marble Architecture */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroAsset.path}
          onError={(e) => {
            // Fallback to high-res architectural natural stone texture if local file isn't uploaded yet
            (e.target as HTMLImageElement).src = heroAsset.fallbackTexture;
          }}
          alt="Clay’s Granite & Marble Architectural Stone"
          className="w-full h-full object-cover object-center brightness-75 contrast-110 scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Sophisticated Architectural Lighting & Depth Gradients (No heavy solid black block) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111211]/90 via-[#202120]/75 to-[#111211]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111211] via-transparent to-[#111211]/60" />
        <div className="absolute inset-0 bg-[#202120]/25 backdrop-blur-[1px]" />
        
        {/* Fine Architectural Marble Veining Texture */}
        <div className="absolute inset-0 opacity-10 bg-marble-charcoal pointer-events-none" />
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Small Elegant Architectural Label */}
        <div 
          id="hero-label"
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#858582]/40 bg-[#202120]/70 backdrop-blur-md mb-8 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D8D6D1] animate-pulse" />
          <span className="text-[10px] sm:text-xs tracking-[0.35em] font-medium text-[#D8D6D1] uppercase">
            CLAY’S GRANITE &amp; MARBLE
          </span>
        </div>

        {/* Monumental Headline in Cormorant Garamond */}
        <h1 
          id="hero-main-headline"
          className="font-serif text-[#F4F3EF] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[-0.02em] leading-[0.92] select-none mb-6 drop-shadow-lg"
        >
          <span className="block">STONE</span>
          <span className="block italic font-normal text-[#D8D6D1]">CRAFTED FOR</span>
          <span className="block font-medium">GENERATIONS.</span>
        </h1>

        {/* Supporting Text */}
        <p 
          id="hero-supporting-text"
          className="max-w-2xl mx-auto mt-2 text-base sm:text-lg md:text-xl text-[#B7B6B2] font-sans font-light leading-relaxed tracking-wide"
        >
          “Premium granite and marble, precisely manufactured for timeless architectural spaces.”
        </p>

        {/* Editorial Action Buttons */}
        <div 
          id="hero-actions"
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <button
            id="hero-explore-btn"
            onClick={onExploreStones}
            className="w-full sm:w-auto px-8 py-4 bg-[#F4F3EF] hover:bg-white text-[#111211] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 group cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            <span>EXPLORE OUR COLLECTION</span>
            <ChevronRight className="w-4 h-4 text-[#111211] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-request-quote-btn"
            onClick={onRequestQuote}
            className="w-full sm:w-auto px-8 py-4 bg-[#202120]/80 hover:bg-[#202120] text-[#F4F3EF] text-xs sm:text-sm font-medium tracking-[0.2em] uppercase border border-[#858582]/70 hover:border-[#D8D6D1] transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg backdrop-blur-md cursor-pointer hover:-translate-y-0.5"
          >
            <span>REQUEST A QUOTATION</span>
          </button>
        </div>

        {/* Subtle Architectural Spec Strip */}
        <div className="mt-16 pt-8 border-t border-[#414240]/60 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.25em] text-[#858582] uppercase font-semibold">GEOLOGICAL ORIGIN</span>
            <span className="text-sm font-serif text-[#F4F3EF] mt-1 tracking-wide">Axum • Babile • Welega</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.25em] text-[#858582] uppercase font-semibold">PRECISION CUT</span>
            <span className="text-sm font-serif text-[#F4F3EF] mt-1 tracking-wide">Diamond Bridge Saws</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.25em] text-[#858582] uppercase font-semibold">CUSTOM SURFACES</span>
            <span className="text-sm font-serif text-[#F4F3EF] mt-1 tracking-wide">Polished • Flamed • Mirror</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.25em] text-[#858582] uppercase font-semibold">SHOWROOM &amp; WORKS</span>
            <span className="text-sm font-serif text-[#F4F3EF] mt-1 tracking-wide">Addis Ababa, Ethiopia</span>
          </div>
        </div>

      </div>

      {/* Subtle Animated Scroll Indicator */}
      <div 
        id="hero-scroll-indicator"
        onClick={onExploreStones}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        role="button"
        tabIndex={0}
        aria-label="Scroll to stone collection"
      >
        <span className="text-[9px] tracking-[0.3em] text-[#B7B6B2] uppercase font-mono">
          SCROLL TO EXPLORE
        </span>
        <div className="w-5 h-8 rounded-full border border-[#858582] flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#D8D6D1] rounded-full animate-bounce" />
        </div>
        <ArrowDown className="w-3 h-3 text-[#D8D6D1] -mt-0.5 animate-pulse" />
      </div>
    </section>
  );
}
