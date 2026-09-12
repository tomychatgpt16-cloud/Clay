import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import OurStones from './components/OurStones';
import StoneApplications from './components/StoneApplications';
import MaterialToMasterpiece from './components/MaterialToMasterpiece';
import ProductDetailModal from './components/ProductDetailModal';
import QuotationCalculator from './components/QuotationCalculator';
import ProjectsSection from './components/ProjectsSection';
import WhyClays from './components/WhyClays';
import ManufacturingProcess from './components/ManufacturingProcess';
import StoneGallery from './components/StoneGallery';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminPreviewModal from './components/AdminPreviewModal';
import MobileQuickBar from './components/MobileQuickBar';
import { StoneProduct, QuotationSubmission } from './types';

// Initial realistic quotation inquiries to demonstrate future-ready admin architecture
const INITIAL_QUOTATIONS: QuotationSubmission[] = [
  {
    id: 'QUO-892104',
    createdAt: '06 Sep 2026, 14:20',
    fullName: 'Henok Tadesse',
    company: 'Abyssinia Design & Build',
    phoneNumber: '+251 91 145 8820',
    email: 'h.tadesse@abyssiniadesign.com',
    projectLocation: 'Bole Medhanealem, Addis Ababa',
    productType: 'Granite',
    specificStone: 'AXUM GRANITE BLACK',
    application: 'Stair, Coping',
    totalAreaM2: 24.58,
    totalLinearM: 68.6,
    calculatedAreaM2: 24.58,
    calculatedLinearM: 68.6,
    preferredFinish: 'Flamed',
    applications: [
      {
        id: 'Stair',
        type: 'Stair',
        label: 'Stair',
        finish: 'Flamed',
        calculatedAreaM2: 18.58,
        calculatedLinearM: 48.6,
        detailsSummary: '36 Steps (1.35m × 0.30m, 3 cm (30 mm)) + 36 Risers'
      },
      {
        id: 'Coping',
        type: 'Coping',
        label: 'Coping',
        finish: 'Flamed',
        calculatedAreaM2: 6.00,
        calculatedLinearM: 20.0,
        detailsSummary: '20 lm Coping (Width: 0.30m, 3 cm (30 mm))'
      }
    ],
    projectDescription: 'Commercial entrance stair treads with 30mm thickness and anti-slip flamed finish plus exterior boundary coping.',
    attachmentName: 'Bole_Office_Stair_Schedule_Rev2.pdf',
    status: 'Pending Review'
  },
  {
    id: 'QUO-891942',
    createdAt: '04 Sep 2026, 09:45',
    fullName: 'Sara Wolde',
    company: 'Studio Vista Architects',
    phoneNumber: '+251 92 310 9940',
    email: 'sara@studiovista.et',
    projectLocation: 'Old Airport Area, Addis Ababa',
    productType: 'Marble',
    specificStone: 'WELEGA MARBLE WHITE',
    application: 'Window sill',
    totalAreaM2: 8.1,
    totalLinearM: 32.4,
    calculatedAreaM2: 8.1,
    calculatedLinearM: 32.4,
    preferredFinish: 'Polished',
    applications: [
      {
        id: 'Window Sill',
        type: 'Window Sill',
        label: 'Window Sill',
        finish: 'Polished',
        calculatedAreaM2: 8.1,
        calculatedLinearM: 32.4,
        detailsSummary: '18 Sills (1.80m × 0.25m, 2 cm (20 mm), Drip Groove)'
      }
    ],
    projectDescription: 'Residential villa interior window sills with pencil round exposed edge profiles.',
    attachmentName: 'Villa_Window_Sill_Details.dwg',
    status: 'Contacted'
  }
];

export default function App() {
  // Modal & Interactive Navigation State
  const [selectedProductForModal, setSelectedProductForModal] = useState<StoneProduct | null>(null);
  const [targetStoneIdForQuote, setTargetStoneIdForQuote] = useState<string>('axum-granite-black');
  const [targetApplicationForQuote, setTargetApplicationForQuote] = useState<string>('Stair');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [quotations, setQuotations] = useState<QuotationSubmission[]>(INITIAL_QUOTATIONS);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestQuote = (stoneId?: string, appType?: string) => {
    if (stoneId) setTargetStoneIdForQuote(stoneId);
    if (appType) setTargetApplicationForQuote(appType);
    scrollToSection('quotation');
  };

  const handleServiceSelectForQuote = (serviceTitle: string) => {
    let mappedApp = 'Other';
    const lower = serviceTitle.toLowerCase();
    if (lower.includes('stair')) mappedApp = 'Stair';
    else if (lower.includes('sill')) mappedApp = 'Window sill';
    else if (lower.includes('coping')) mappedApp = 'Coping';
    else if (lower.includes('fabrication')) mappedApp = 'Countertop';
    
    setTargetApplicationForQuote(mappedApp);
    scrollToSection('quotation');
  };

  const handleNewQuoteSubmitted = (newQuote: QuotationSubmission) => {
    setQuotations(prev => [newQuote, ...prev]);
  };

  const handleUpdateQuoteStatus = (id: string, newStatus: QuotationSubmission['status']) => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
  };

  return (
    <div className="min-h-screen bg-[#F4F3F0] text-[#252625] flex flex-col font-sans selection:bg-[#252625] selection:text-[#F4F3F0]">
      
      {/* Fixed Luxury Navigation */}
      <Navbar
        onOpenQuote={() => handleRequestQuote()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        quoteCount={quotations.length}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        
        {/* 1. Dramatic Hero Section */}
        <Hero
          onExploreStones={() => scrollToSection('our-stones')}
          onRequestQuote={() => handleRequestQuote()}
        />

        {/* 2. About Clay's (Split Layout) */}
        <AboutSection
          onDiscoverMore={() => scrollToSection('why-clays')}
        />

        {/* 3. Our Stones / Product Catalog (5 Key Ethiopian Stones with Official Prices) */}
        <OurStones
          onSelectProduct={(product) => setSelectedProductForModal(product)}
          onRequestQuote={(stoneId) => handleRequestQuote(stoneId)}
        />

        {/* 4. Stone Applications / Fabrication Capabilities (7 Key Architectural Pieces) */}
        <StoneApplications
          onSelectApplicationForQuote={(appName) => handleServiceSelectForQuote(appName)}
        />

        {/* 5. Material to Masterpiece — Story of Ethiopian Stone & Heritage */}
        <MaterialToMasterpiece />

        {/* 6. Stair & Sill Interactive Quotation System with Real-Time ETB Calculation */}
        <QuotationCalculator
          initialStoneId={targetStoneIdForQuote}
          initialApplication={targetApplicationForQuote}
          onQuoteSubmitted={handleNewQuoteSubmitted}
        />

        {/* 7. Architectural Projects Showcase (Editorial Magazine Gallery) */}
        <ProjectsSection
          onSelectProjectForQuote={(stoneName, app) => handleRequestQuote(undefined, app)}
        />

        {/* 8. Why Clay's — Real Manufacturing Advantages */}
        <WhyClays />

        {/* 9. From Quarry to Architecture (7-Stage Process) */}
        <ManufacturingProcess />

        {/* 10. Visual Stone Gallery & Lightbox */}
        <StoneGallery />

        {/* 11. Contact & Final CTA */}
        <ContactSection
          onRequestQuote={() => handleRequestQuote()}
        />
      </main>

      {/* Luxury Dark Navy Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenQuote={() => handleRequestQuote()}
      />

      {/* Dedicated Sticky Mobile Quick-Contact Bar */}
      <MobileQuickBar
        onRequestQuote={() => handleRequestQuote()}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onRequestQuote={(stoneId) => handleRequestQuote(stoneId)}
      />

      {/* Admin Architecture Preview Modal */}
      <AdminPreviewModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        quotations={quotations}
        onUpdateQuoteStatus={handleUpdateQuoteStatus}
      />

    </div>
  );
}
