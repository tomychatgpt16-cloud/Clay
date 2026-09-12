import { useState } from 'react';
import { Eye, FileText, MapPin, Layers, Info, Image as ImageIcon, Sliders, Sparkles, Upload, Check } from 'lucide-react';
import { STONE_PRODUCTS, STONE_IMAGES } from '../data/stoneData';
import { StoneProduct } from '../types';
import ArchitecturalImage from './ArchitecturalImage';
import PhotoUploaderModal from './PhotoUploaderModal';
import MasterCompositeViewer from './MasterCompositeViewer';
import { getStoredPhotos } from '../utils/photoManager';

interface OurStonesProps {
  onSelectProduct: (product: StoneProduct) => void;
  onRequestQuote: (stoneId: string) => void;
}

type FilterTab = 'ALL' | 'SLABS' | 'CHIPS' | 'Granite' | 'Marble' | 'Limestone' | 'Basalt';
type ImageMode = 'composite' | 'individual';

export default function OurStones({ onSelectProduct, onRequestQuote }: OurStonesProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [imageMode, setImageMode] = useState<ImageMode>('individual');
  const [alwaysShowSlotPaths, setAlwaysShowSlotPaths] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [showMasterSheet, setShowMasterSheet] = useState<boolean>(false);
  const [storedPhotos, setStoredPhotos] = useState<Record<string, string>>(() => getStoredPhotos());

  const handlePhotosUpdated = () => {
    setStoredPhotos(getStoredPhotos());
  };

  const handleSelectProductById = (stoneId: string) => {
    const product = STONE_PRODUCTS.find(p => p.id === stoneId);
    if (product) {
      onSelectProduct(product);
    }
  };

  // Filter products according to active showroom tab
  const filteredProducts = STONE_PRODUCTS.filter(p => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'SLABS') return p.collection === 'main';
    if (activeTab === 'CHIPS') return p.collection === 'chips';
    return p.stoneType === activeTab;
  });

  return (
    <section 
      id="our-stones"
      className="py-24 sm:py-32 bg-[#F4F3EF] relative border-t border-[#D8D6D1] overflow-hidden"
    >
      <div id="our-collection" className="absolute -top-12 left-0 pointer-events-none" />

      {/* Background ambient architectural tint */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[700px] bg-[#D8D6D1]/30 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title & Editorial Showroom Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="w-8 h-[1px] bg-[#858582]" />
            <span className="text-[11px] font-semibold tracking-[0.3em] text-[#414240] uppercase font-mono">
              OFFICIAL MANUFACTURING COLLECTION
            </span>
            <span className="w-8 h-[1px] bg-[#858582]" />
          </div>

          <h2 
            id="our-collection-heading"
            className="text-4xl sm:text-6xl font-serif text-[#111211] tracking-tight leading-tight mb-4 font-normal"
          >
            OUR COLLECTION
          </h2>

          <p 
            id="our-collection-subheading"
            className="text-[#414240] text-base sm:text-lg font-sans font-light tracking-wide max-w-2xl leading-relaxed"
          >
            Ten distinguished Ethiopian natural stones and specialized chemical flooring materials, calibrated for monumental architecture, stairs, thresholds, and continuous surfaces.
          </p>
        </div>

        {/* Showroom Controls Bar: Navigation Filters & Stone Image Mode Switcher */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#D8D6D1]">
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-sm bg-[#EBE9E4] border border-[#D8D6D1] shadow-inner">
            <button
              id="filter-all-10"
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 rounded-sm cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-[#111211] text-[#F4F3EF] shadow-md -translate-y-0.5'
                  : 'text-[#414240] hover:text-[#111211] hover:bg-white/60'
              }`}
            >
              ALL 10 PRODUCTS
            </button>

            <button
              id="filter-slabs-7"
              onClick={() => setActiveTab('SLABS')}
              className={`px-3.5 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 rounded-sm cursor-pointer ${
                activeTab === 'SLABS'
                  ? 'bg-[#111211] text-[#F4F3EF] shadow-md -translate-y-0.5'
                  : 'text-[#414240] hover:text-[#111211] hover:bg-white/60'
              }`}
            >
              NATURAL STONES (7)
            </button>

            <button
              id="filter-chips-3"
              onClick={() => setActiveTab('CHIPS')}
              className={`px-3.5 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 rounded-sm cursor-pointer ${
                activeTab === 'CHIPS'
                  ? 'bg-[#111211] text-[#F4F3EF] shadow-md -translate-y-0.5'
                  : 'text-[#414240] hover:text-[#111211] hover:bg-white/60'
              }`}
            >
              CHIPS &amp; FLOORING (3)
            </button>

            <div className="hidden sm:flex items-center gap-1 border-l border-[#B7B6B2] pl-2 ml-1">
              {(['Granite', 'Marble', 'Limestone', 'Basalt'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-150 rounded-sm cursor-pointer ${
                    activeTab === type
                      ? 'bg-[#111211] text-[#F4F3EF] shadow-sm'
                      : 'text-[#5C5B57] hover:text-[#111211] hover:bg-white/40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Architectural Image Placeholder Controls & Photo Manager Button */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Direct Upload Button for Official Factory Photos */}
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm bg-[#111211] text-[#F4F3EF] hover:bg-[#242524] transition-all cursor-pointer flex items-center gap-1.5 shadow-md border border-[#414240] hover:-translate-y-0.5"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">Upload Company Photos</span>
              {Object.keys(storedPhotos).length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  {Object.keys(storedPhotos).length} Loaded
                </span>
              )}
            </button>

            {/* Toggle Master 6-Stone Sheet View */}
            <button
              onClick={() => setShowMasterSheet(!showMasterSheet)}
              className={`px-3 py-2 text-[11px] font-mono rounded-sm border transition-all cursor-pointer flex items-center gap-1.5 ${
                showMasterSheet
                  ? 'bg-[#181918] text-[#F4F3EF] border-[#181918] shadow-sm'
                  : 'bg-white/80 text-[#414240] border-[#D8D6D1] hover:bg-white'
              }`}
              title="Toggle interactive 6-stone composite sheet (IMG_7588)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showMasterSheet ? 'Hide Master Sheet' : 'Show 6-Stone Sheet'}</span>
            </button>

            <div className="flex items-center gap-1.5 p-1 rounded-sm bg-[#EBE9E4] border border-[#D8D6D1]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5C5B57] px-2 py-1 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-[#414240]" />
                Photo Source:
              </span>
              <button
                onClick={() => setImageMode('composite')}
                title="Use appropriate section crop from the 6-stone photograph + 4 individual photos"
                className={`px-2.5 py-1 text-[11px] font-medium rounded-sm transition-all cursor-pointer ${
                  imageMode === 'composite'
                    ? 'bg-[#111211] text-[#F4F3EF] shadow-sm font-semibold'
                    : 'text-[#414240] hover:text-[#111211] hover:bg-white/60'
                }`}
              >
                6-Stone Sheet Sections (1–6)
              </button>
              <button
                onClick={() => setImageMode('individual')}
                title="Use individual photograph slots for all 10 products"
                className={`px-2.5 py-1 text-[11px] font-medium rounded-sm transition-all cursor-pointer ${
                  imageMode === 'individual'
                    ? 'bg-[#111211] text-[#F4F3EF] shadow-sm font-semibold'
                    : 'text-[#414240] hover:text-[#111211] hover:bg-white/60'
                }`}
              >
                10 Individual Photo Slots
              </button>
            </div>

            <button
              onClick={() => setAlwaysShowSlotPaths(!alwaysShowSlotPaths)}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-sm border transition-all cursor-pointer flex items-center gap-1.5 ${
                alwaysShowSlotPaths
                  ? 'bg-[#111211] text-[#F4F3EF] border-[#111211] shadow-sm'
                  : 'bg-white/80 text-[#414240] border-[#D8D6D1] hover:bg-white'
              }`}
              title="Toggle persistent file path & slot overlay on product cards"
            >
              <Sliders className="w-3 h-3" />
              <span>{alwaysShowSlotPaths ? 'Hide Slot Paths' : 'Show File References'}</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE MASTER 6-STONE COMPOSITE VIEWER (Toggleable) */}
        {showMasterSheet && (
          <MasterCompositeViewer
            compositeSrc={storedPhotos['six-stones-composite'] || '/images/products/six-stones-composite.jpg'}
            onSelectProductById={handleSelectProductById}
            onOpenPhotoManager={() => setIsPhotoModalOpen(true)}
          />
        )}

        {/* 10 INDIVIDUAL PRODUCT CARDS GRID */}
        <div 
          id="collection-product-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-20"
        >
          {filteredProducts.map((product) => {
            // Determine whether this stone card uses composite crop (stones 1-6) or individual photo
            const isFirstSixStone = product.photoNumber <= 6 && Boolean(product.compositeCrop);
            const useCompositeForThisCard = imageMode === 'composite' && isFirstSixStone;

            const compositeCropProp = product.compositeCrop ? {
              compositeUrl: storedPhotos['six-stones-composite'] || '/images/products/six-stones-composite.jpg',
              bgPos: product.compositeCrop.bgPos3x2,
              sectionLabel: product.compositeCrop.sectionLabel,
            } : undefined;

            const officialPhotoFilename = `${String(product.photoNumber).padStart(2, '0')}_${product.id.replace(/-/g, '_')}.jpg`;
            const individualSlotPath = `/images/products/${officialPhotoFilename}`;
            const fallbackSlotPath = `/images/products/${product.id}.jpg`;
            const customPhotoForThisProduct = storedPhotos[product.id];
            const customCompositePhoto = storedPhotos['six-stones-composite'];

            return (
              <article
                key={product.id}
                id={`product-card-${product.id}`}
                className="group flex flex-col justify-between bg-white border border-[#D8D6D1] hover:border-[#858582] rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl shadow-sm"
              >
                <div>
                  {/* INDIVIDUAL IMAGE CONTAINER */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#202120]">
                    <ArchitecturalImage
                      src={product.imageUrl || individualSlotPath}
                      fallbackUrl={fallbackSlotPath}
                      alt={`${product.name} Official Product Photograph`}
                      title={product.name}
                      slotPath={officialPhotoFilename}
                      aspectRatio="aspect-[16/11]"
                      className="w-full h-full"
                      useComposite={useCompositeForThisCard}
                      compositeCrop={compositeCropProp}
                      customSrc={customPhotoForThisProduct}
                      customCompositeUrl={customCompositePhoto}
                      onUploadClick={() => setIsPhotoModalOpen(true)}
                      showSlotIndicator={!alwaysShowSlotPaths}
                    />

                    {/* Sequential Product Index (01 through 10) & Category Pill */}
                    <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 pointer-events-none">
                      <span className="w-7 h-7 flex items-center justify-center text-xs font-mono font-bold bg-[#111211] text-[#F4F3EF] border border-[#414240] rounded-sm shadow-md">
                        {String(product.photoNumber).padStart(2, '0')}
                      </span>
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] uppercase bg-[#111211]/90 text-[#F4F3EF] border border-[#414240] rounded-sm backdrop-blur-md shadow-md">
                        {product.stoneType}
                      </span>
                    </div>

                    {/* Origin / Material Type Indicator */}
                    <div className="absolute bottom-3 left-3.5 z-20 flex items-center gap-1.5 text-[11px] text-[#F4F3EF] bg-[#111211]/85 px-2.5 py-1 rounded-sm border border-[#414240]/60 backdrop-blur-md pointer-events-none">
                      {product.collection === 'main' ? (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-[#D8D6D1]" />
                          <span className="font-mono text-[10px]">{product.originRegion.split('(')[0].trim()}</span>
                        </>
                      ) : (
                        <>
                          <Layers className="w-3.5 h-3.5 text-[#D8D6D1]" />
                          <span className="font-mono text-[10px]">Aggregate Material</span>
                        </>
                      )}
                    </div>

                    {/* Persistent File Reference Tag (when toggled on) */}
                    {alwaysShowSlotPaths && (
                      <div className="absolute top-3.5 right-3.5 z-20 bg-[#111211]/95 text-[#F4F3EF] text-[10px] font-mono px-2.5 py-1 rounded-sm border border-[#858582] shadow-lg max-w-[210px] truncate">
                        {useCompositeForThisCard
                          ? `6-Stone Crop: Sec ${product.compositeCrop?.sectionIndex}`
                          : `File: ${officialPhotoFilename}`}
                      </div>
                    )}
                  </div>

                  {/* CARD ARCHITECTURAL CONTENT */}
                  <div className="p-6 sm:p-7">
                    
                    {/* Number & Product Name */}
                    <div className="mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#858582] block mb-1">
                        {product.collection === 'main' ? `Ethiopian ${product.stoneType} Slab` : 'Chemical Flooring Aggregate'}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-[#111211] tracking-wide leading-tight group-hover:text-[#414240] transition-colors font-medium">
                        {product.name}
                      </h3>
                    </div>

                    {/* PROMINENT PRICE DISPLAY */}
                    <div className="my-3.5 py-2.5 px-3.5 bg-[#F4F3EF] border border-[#D8D6D1] rounded-sm flex items-baseline justify-between">
                      <span className="text-[10px] tracking-[0.2em] font-semibold text-[#858582] uppercase">
                        {product.pricePerM2 ? 'Official Price' : 'Price Schedule'}
                      </span>
                      {product.pricePerM2 ? (
                        <div className="flex items-baseline gap-1 text-right">
                          <span className="text-lg sm:text-xl font-mono font-bold text-[#111211] tracking-tight">
                            {product.pricePerM2.toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-[#414240] tracking-wider">
                            ETB / m²
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-sm font-serif italic font-medium text-[#111211]">
                            Contact for Quotation
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-[#414240] font-sans font-light leading-relaxed mb-4 line-clamp-3">
                      {product.shortDescription}
                    </p>

                    {/* Finish Options (Strictly Polished, Non Polished, Mirror Polish, Flamed for Stones) */}
                    <div className="pt-3.5 border-t border-[#D8D6D1]/80 mb-3.5">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#858582] font-semibold block mb-1.5">
                        Available Finishes
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.finishOptions.map((finish) => (
                          <span
                            key={finish}
                            className="px-2 py-0.5 text-[10px] sm:text-[11px] bg-[#F4F3EF] text-[#202120] rounded-sm border border-[#D8D6D1] font-medium"
                          >
                            {finish}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Common Applications */}
                    <div className="pt-3 border-t border-[#D8D6D1]/80">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#858582] font-semibold block mb-1.5">
                        {product.collection === 'main' ? 'Architectural Applications' : 'Recommended Applications'}
                      </span>
                      <div className="flex flex-wrap gap-1 text-[11px] text-[#414240]">
                        {product.typicalApplications.slice(0, 5).map((app, i) => (
                          <span key={app} className="inline-flex items-center">
                            <span>{app}</span>
                            {i < Math.min(product.typicalApplications.length, 5) - 1 && (
                              <span className="mx-1 text-[#B7B6B2]">•</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Image Placeholder Info Line */}
                    <div className="mt-4 pt-3 border-t border-dashed border-[#D8D6D1] text-[10px] font-mono text-[#858582] flex items-center justify-between">
                      <span className="truncate max-w-[210px]">
                        Slot: {individualSlotPath}
                      </span>
                      {isFirstSixStone && (
                        <span className="text-[#414240] font-semibold">
                          Sec {product.compositeCrop?.sectionIndex}/6
                        </span>
                      )}
                    </div>

                  </div>
                </div>

                {/* Two Required CTA Action Buttons */}
                <div className="p-6 pt-0 grid grid-cols-2 gap-3 mt-auto">
                  <button
                    id={`btn-view-details-${product.id}`}
                    onClick={() => onSelectProduct(product)}
                    className="w-full py-3 text-center text-xs font-semibold tracking-[0.15em] text-[#111211] hover:text-black bg-[#F4F3EF] hover:bg-[#D8D6D1] border border-[#B7B6B2] rounded-sm flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#414240]" />
                    <span>VIEW DETAILS</span>
                  </button>

                  <button
                    id={`btn-request-quote-${product.id}`}
                    onClick={() => onRequestQuote(product.id)}
                    className="w-full py-3 text-center text-xs font-bold tracking-[0.15em] text-[#F4F3EF] bg-[#111211] hover:bg-[#414240] border border-[#111211] rounded-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer hover:-translate-y-0.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D8D6D1]" />
                    <span>REQUEST QUOTE</span>
                  </button>
                </div>

              </article>
            );
          })}
        </div>

        {/* Real Chemical Flooring Project Showcase Banner (Preserves Existing Showroom Context) */}
        <div className="bg-white border border-[#B7B6B2] rounded-sm overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 mb-16">
          <div className="lg:col-span-7 relative min-h-[320px] bg-[#202120]">
            <img
              src={STONE_IMAGES['chemical-flooring-hallway']}
              alt="Real Chemical Flooring Corridor Application in Commercial Hallway"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-[#111211]/90 text-[#F4F3EF] font-mono text-[10px] tracking-widest uppercase rounded-sm border border-[#414240]">
              REAL APPLICATION PHOTOGRAPH • ADDIS ABABA
            </div>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-[#FAF9F6]">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#858582] uppercase block mb-2">
                SEAMLESS TERRAZZO APPLICATION
              </span>
              <h4 className="text-2xl sm:text-3xl font-serif text-[#111211] font-medium tracking-wide mb-3">
                Commercial Corridor Chemical Flooring
              </h4>
              <p className="text-xs sm:text-sm text-[#414240] font-light leading-relaxed mb-4">
                Demonstration of our black mineral chips and white aggregate formulated within a heavy-duty chemical matrix, diamond-ground and mechanically rotary-polished into a continuous joint-free hallway surface.
              </p>

              <ul className="space-y-2 text-xs text-[#202120] mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111211]" />
                  <span>High resistance to intensive pedestrian and rolling trolley traffic</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111211]" />
                  <span>Non-porous, chemical-resistant surface that does not trap grime</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111211]" />
                  <span>Monolithic seamless application without grout lines or joint failure</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-[#F4F3EF] border border-[#D8D6D1] rounded-sm text-xs text-[#414240]">
              <div className="flex items-center gap-2 font-semibold text-[#111211] mb-1 font-mono uppercase text-[11px]">
                <Info className="w-4 h-4 text-[#111211]" />
                <span>Architectural Specification Note</span>
              </div>
              <p className="leading-relaxed">
                Products 8, 9, and 10 are <strong className="text-[#111211]">calibrated mineral aggregates and stone powders</strong> applied in chemical-bound matrix systems. Products 1 through 7 are solid natural stone slabs.
              </p>
            </div>
          </div>
        </div>

        {/* Quality Assurance Architectural Footnote */}
        <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#D8D6D1] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#111211] border border-[#414240] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#D8D6D1]" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-serif text-[#111211] tracking-wide font-medium">
                Quarry-Direct Inspection &amp; Calibrated Slicing
              </h4>
              <p className="text-xs sm:text-sm text-[#414240] font-light mt-0.5 max-w-2xl">
                Every stone unit undergoes thickness verification, vein matching, and calibrated edge profiling to meet exacting architectural schedules across Ethiopia.
              </p>
            </div>
          </div>

          <button
            onClick={() => onRequestQuote('axum-granite-black')}
            className="w-full md:w-auto px-6 py-3 text-xs font-bold tracking-[0.2em] text-[#F4F3EF] bg-[#111211] hover:bg-[#414240] rounded-sm uppercase whitespace-nowrap cursor-pointer border border-[#111211] shadow-md transition-all hover:-translate-y-0.5"
          >
            REQUEST CUSTOM SPECIFICATION
          </button>
        </div>

        {/* Official Factory Photo Management Modal */}
        <PhotoUploaderModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onPhotosUpdated={handlePhotosUpdated}
        />

      </div>
    </section>
  );
}
