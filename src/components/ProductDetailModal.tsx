import { useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, MapPin, Tag } from 'lucide-react';
import { StoneProduct } from '../types';
import ArchitecturalImage from './ArchitecturalImage';

interface ProductDetailModalProps {
  product: StoneProduct | null;
  onClose: () => void;
  onRequestQuote: (stoneId: string) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onRequestQuote
}: ProductDetailModalProps) {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [selectedFinish, setSelectedFinish] = useState(product.finishOptions[0]);

  return (
    <div 
      id="product-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#111211]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-white border border-[#B7B6B2] rounded-sm shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8D6D1] bg-[#F4F3EF]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] text-[#111211] uppercase font-bold font-mono">
              {product.stoneType} SPECIFICATION
            </span>
            <span className="text-[#B7B6B2]">•</span>
            <span className="text-xs text-[#414240] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#414240]" />
              <span>{product.originRegion}</span>
            </span>
          </div>

          <button
            id="close-product-detail-modal"
            onClick={onClose}
            className="p-1.5 text-[#414240] hover:text-[#111211] rounded-full hover:bg-[#D8D6D1] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Architectural Photo Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#D8D6D1] bg-[#202120]">
              <ArchitecturalImage
                src={product.imageSlot || `/images/products/${product.id}.jpg`}
                fallbackUrl={selectedImage}
                alt={product.name}
                title={product.name}
                slotPath={product.imageSlot || `/images/products/${product.id}.jpg`}
                aspectRatio="aspect-[4/3]"
                className="w-full h-full"
              />
              <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-[#111211]/90 backdrop-blur-md rounded-sm border border-[#414240]">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#F4F3EF]">
                  {product.stoneType}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery Strip */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.galleryUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(url)}
                  className={`relative w-20 h-14 rounded-sm overflow-hidden border transition-all shrink-0 cursor-pointer ${
                    selectedImage === url 
                      ? 'border-[#111211] ring-2 ring-[#111211]/40' 
                      : 'border-[#D8D6D1] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Geological Appearance Notes */}
            <div className="p-4 rounded-sm bg-[#F4F3EF] border border-[#D8D6D1]">
              <span className="text-[10px] tracking-widest text-[#858582] uppercase font-semibold block mb-1">
                Visual Matrix &amp; Petrographic Notes
              </span>
              <p className="text-xs text-[#414240] font-sans leading-relaxed">
                {product.appearanceNotes}
              </p>
            </div>
          </div>

          {/* Right Column: Stone Details & Action */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#858582] block">
                  ORIGIN: {product.originRegion.split('(')[0].trim().toUpperCase()}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#111211] tracking-wide mt-1 font-medium">
                  {product.name}
                </h2>
                <p className="text-xs text-[#858582] font-sans tracking-wide mt-0.5">
                  {product.tagline}
                </p>
              </div>

              {/* OFFICIAL PRICE DISPLAY */}
              <div className="my-4 p-4 bg-[#F4F3EF] border border-[#D8D6D1] rounded-sm flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#414240]" />
                  <span className="text-xs font-semibold tracking-wider text-[#414240] uppercase">
                    {product.pricePerM2 ? 'Official Selling Price' : 'Pricing Schedule'}
                  </span>
                </div>
                {product.pricePerM2 ? (
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-[#111211] tracking-tight">
                      {product.pricePerM2.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-[#414240] ml-1.5">
                      ETB / m²
                    </span>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-serif italic font-medium text-[#111211] tracking-wide">
                      Contact us for pricing
                    </span>
                  </div>
                )}
              </div>

              {/* Architectural Description */}
              <div className="border-t border-b border-[#D8D6D1] py-4 my-4">
                <p className="text-xs sm:text-sm text-[#414240] leading-relaxed font-light">
                  {product.detailedDescription}
                </p>
              </div>

              {/* Finishes Section */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#858582] font-semibold">
                    Finish Options
                  </span>
                  <span className="text-[11px] text-[#111211] font-bold font-mono">
                    {selectedFinish}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.finishOptions.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-3 py-1.5 text-xs rounded-sm transition-all border cursor-pointer ${
                        selectedFinish === finish
                          ? 'bg-[#111211] text-[#F4F3EF] font-bold border-[#111211] shadow-sm'
                          : 'bg-[#F4F3EF] text-[#202120] hover:bg-[#D8D6D1] border-[#D8D6D1]'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>

                {/* Selected Finish Note */}
                {product.finishes.find(f => f.name === selectedFinish) && (
                  <div className="mt-2.5 p-2.5 rounded-sm bg-[#F4F3EF] border border-[#D8D6D1] text-[11px] text-[#414240]">
                    <span className="text-[#111211] font-semibold">Finish Texture: </span>
                    {product.finishes.find(f => f.name === selectedFinish)?.description}
                  </div>
                )}
              </div>

              {/* Typical Architectural Applications */}
              <div className="mb-6">
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#858582] font-semibold block mb-2">
                  Typical Applications
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#202120]">
                  {[
                    'Stairs',
                    'Window Sills',
                    'Door Sills',
                    'Coping',
                    'Countertops',
                    'Flooring',
                    'Wall Cladding',
                    'Custom Fabrication'
                  ].map((app) => (
                    <div key={app} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#414240]" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct CTA Action Button */}
            <div className="pt-4 border-t border-[#D8D6D1] flex flex-col gap-2.5">
              <button
                id="modal-request-quote-btn"
                onClick={() => {
                  onClose();
                  onRequestQuote(product.id);
                }}
                className="w-full py-3.5 px-6 bg-[#111211] hover:bg-[#414240] text-[#F4F3EF] font-bold text-xs tracking-[0.2em] uppercase transition-all rounded-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer border border-[#111211] hover:-translate-y-0.5"
              >
                <span>REQUEST QUOTATION</span>
                <ArrowRight className="w-4 h-4 text-[#D8D6D1]" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#858582]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#414240]" />
                <span>Immediate direct pricing calculations with custom thickness &amp; finishes</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
