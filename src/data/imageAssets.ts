/**
 * Central Image Management & Asset Replacement System
 * Clay's Granite and Marble Manufacturing
 * 
 * Replace image files in /public/images/ with your actual high-resolution company photographs.
 * The website will automatically display your photos once placed in the corresponding path.
 */

export interface ImageSlot {
  key: string;
  path: string;
  title: string;
  category: 'hero' | 'products' | 'services' | 'projects' | 'workshop' | 'process' | 'gallery';
  fallbackTexture: string;
  description: string;
}

export const SITE_IMAGE_SLOTS: Record<string, ImageSlot> = {
  // HERO IMAGE
  hero: {
    key: 'hero',
    path: '/images/hero/hero-architectural-marble.jpg',
    title: 'Hero Main Architectural View',
    category: 'hero',
    fallbackTexture: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
    description: 'Cinematic full-width view of monumental natural stone architectural staircase or lobby.'
  },

  // WORKSHOP & ABOUT
  aboutWorkshop: {
    key: 'aboutWorkshop',
    path: '/images/workshop/workshop-fabrication-facility.jpg',
    title: 'Manufacturing Workshop & Saw Machinery',
    category: 'workshop',
    fallbackTexture: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85',
    description: 'Industrial diamond bridge saw cutting Ethiopian granite and marble slabs.'
  },

  // 7 CORE PRODUCTS (Granite, Marble, Limestone, Basalt)
  axumGraniteBlack: {
    key: 'axumGraniteBlack',
    path: '/images/products/axum-granite-black.svg',
    title: 'AXUM GRANITE BLACK',
    category: 'products',
    fallbackTexture: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    description: 'High-density obsidian black Ethiopian granite with micro-crystalline depth.'
  },
  axumGraniteWhite: {
    key: 'axumGraniteWhite',
    path: '/images/products/axum-granite-white.svg',
    title: 'AXUM GRANITE WHITE',
    category: 'products',
    fallbackTexture: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=85',
    description: 'Luminous white-gray granite matrix with silver-slate mineral accents.'
  },
  welegaMarbleWhite: {
    key: 'welegaMarbleWhite',
    path: '/images/products/welega-marble-white.svg',
    title: 'WELEGA MARBLE WHITE',
    category: 'products',
    fallbackTexture: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
    description: 'Pristine luminous metamorphic white marble with delicate smoke veining.'
  },
  welegaMarbleGray: {
    key: 'welegaMarbleGray',
    path: '/images/products/welega-marble-gray.svg',
    title: 'WELEGA MARBLE GRAY',
    category: 'products',
    fallbackTexture: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85',
    description: 'Sculptural pewter and charcoal metamorphic wave marble.'
  },
  babileGranite: {
    key: 'babileGranite',
    path: '/images/products/babile-granite.svg',
    title: 'BABILE GRANITE',
    category: 'products',
    fallbackTexture: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=85',
    description: 'Warm desert gold and terracotta crystalline granite from Eastern Ethiopia.'
  },
  limestone: {
    key: 'limestone',
    path: '/images/products/limestone.svg',
    title: 'LIMESTONE',
    category: 'products',
    fallbackTexture: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=85',
    description: 'Natural Ethiopian sedimentary limestone featuring warm cream, sand, and ivory tones.'
  },
  bazalt: {
    key: 'bazalt',
    path: '/images/products/bazalt.svg',
    title: 'BAZALT (BASALT)',
    category: 'products',
    fallbackTexture: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=85',
    description: 'Ultra-dense volcanic Ethiopian basalt with deep charcoal-black tone and supreme durability.'
  },

  // SERVICES & ARCHITECTURAL ELEMENTS
  stairs: {
    key: 'stairs',
    path: '/images/services/stairs.jpg',
    title: 'Stair Treads & Risers',
    category: 'services',
    fallbackTexture: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    description: 'Precision cut 2cm and 3cm stair treads with bullnose or flamed finish.'
  },
  windowSills: {
    key: 'windowSills',
    path: '/images/services/window-sills.jpg',
    title: 'Window Sills',
    category: 'services',
    fallbackTexture: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
    description: 'Exterior and interior granite and marble window sills with drip grooves.'
  },
  doorSills: {
    key: 'doorSills',
    path: '/images/services/door-sills.jpg',
    title: 'Door Sills & Thresholds',
    category: 'services',
    fallbackTexture: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
    description: 'Heavy duty calibrated door threshold slabs for architectural passage.'
  },
  coping: {
    key: 'coping',
    path: '/images/services/coping.jpg',
    title: 'Wall & Terrace Coping',
    category: 'services',
    fallbackTexture: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
    description: 'Perimeter wall, balcony, and pool coping with dual chamfered edges.'
  },
  countertops: {
    key: 'countertops',
    path: '/images/services/countertops.jpg',
    title: 'Custom Countertops & Slabs',
    category: 'services',
    fallbackTexture: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
    description: 'Kitchen worktops, bathroom vanities, and reception counters.'
  },
  flooring: {
    key: 'flooring',
    path: '/images/services/flooring.jpg',
    title: 'Architectural Flooring & Paving',
    category: 'services',
    fallbackTexture: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
    description: 'Calibrated interior floor tiles and textured exterior granite paving.'
  },
  wallCladding: {
    key: 'wallCladding',
    path: '/images/services/wall-cladding.jpg',
    title: 'Wall Cladding & Facades',
    category: 'services',
    fallbackTexture: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    description: 'Bookmatched marble interior feature walls and ventilated granite exterior panels.'
  },

  // 6 PROCESS STAGES ("From Natural Stone to Architectural Masterpiece")
  processSelection: {
    key: 'processSelection',
    path: '/images/process/01-stone-selection.jpg',
    title: '01 Stone Selection',
    category: 'process',
    fallbackTexture: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=85',
    description: 'Quarry block inspection and selective geological harvesting.'
  },
  processCutting: {
    key: 'processCutting',
    path: '/images/process/02-precision-cutting.jpg',
    title: '02 Precision Cutting',
    category: 'process',
    fallbackTexture: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85',
    description: 'Multi-blade gang saws and laser-guided CNC bridge saws.'
  },
  processFabrication: {
    key: 'processFabrication',
    path: '/images/process/03-fabrication.jpg',
    title: '03 Fabrication',
    category: 'process',
    fallbackTexture: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=85',
    description: 'Custom edge profiling, mitered joints, drip grooves, and riser sizing.'
  },
  processFinishing: {
    key: 'processFinishing',
    path: '/images/process/04-finishing.jpg',
    title: '04 Finishing',
    category: 'process',
    fallbackTexture: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    description: 'Diamond rotary polishing lines and thermal flame torching.'
  },
  processQuality: {
    key: 'processQuality',
    path: '/images/process/05-quality-control.jpg',
    title: '05 Quality Control',
    category: 'process',
    fallbackTexture: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=85',
    description: 'Dry-lay layout check, micron tolerance verification, and structural inspection.'
  },
  processInstallation: {
    key: 'processInstallation',
    path: '/images/process/06-delivery-installation.jpg',
    title: '06 Delivery & Installation',
    category: 'process',
    fallbackTexture: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85',
    description: 'Timber A-frame transport and professional on-site stone anchoring.'
  },

  // PROJECTS
  projectCommercialAtrium: {
    key: 'projectCommercialAtrium',
    path: '/images/projects/project-commercial-atrium.jpg',
    title: 'Grand Commercial Atrium & Monumental Stair',
    category: 'projects',
    fallbackTexture: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    description: 'Axum Granite Black & Welega Marble White in Bole District.'
  },
  projectHillsideResidence: {
    key: 'projectHillsideResidence',
    path: '/images/projects/project-hillside-residence.jpg',
    title: 'Hillside Modern Residence',
    category: 'projects',
    fallbackTexture: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    description: 'Babile Granite & Welega Marble Gray coping and sills in Yeka Hills.'
  },
  projectLuxuryHotel: {
    key: 'projectLuxuryHotel',
    path: '/images/projects/project-luxury-hotel.jpg',
    title: 'Luxury Boutique Hotel Foyer',
    category: 'projects',
    fallbackTexture: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
    description: 'Continuous Welega Marble White bookmatched wall panels in Kazanchis.'
  },
  projectCorporateHQ: {
    key: 'projectCorporateHQ',
    path: '/images/projects/project-corporate-hq.jpg',
    title: 'Corporate Headquarters Tower',
    category: 'projects',
    fallbackTexture: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    description: 'Ventilated rain-screen exterior granite cladding in Financial District.'
  },
  projectCantileverStair: {
    key: 'projectCantileverStair',
    path: '/images/projects/project-cantilever-stair.jpg',
    title: 'Cantilevered Minimalist Staircase',
    category: 'projects',
    fallbackTexture: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    description: '30mm Axum Granite Black floating treads in Old Airport area.'
  },
  projectExecutiveSuite: {
    key: 'projectExecutiveSuite',
    path: '/images/projects/project-executive-suite.jpg',
    title: 'Executive Conference & Dining Suite',
    category: 'projects',
    fallbackTexture: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85',
    description: 'Welega Marble Gray monolithic tables and flooring in Bole Medhanealem.'
  }
};

/**
 * Convenient shorthand for direct image paths across the website
 */
export const IMAGES = {
  hero: SITE_IMAGE_SLOTS.hero.path,
  aboutWorkshop: SITE_IMAGE_SLOTS.aboutWorkshop.path,
  axumBlack: SITE_IMAGE_SLOTS.axumGraniteBlack.path,
  axumWhite: SITE_IMAGE_SLOTS.axumGraniteWhite.path,
  welegaWhite: SITE_IMAGE_SLOTS.welegaMarbleWhite.path,
  welegaGray: SITE_IMAGE_SLOTS.welegaMarbleGray.path,
  babile: SITE_IMAGE_SLOTS.babileGranite.path,
  limestone: SITE_IMAGE_SLOTS.limestone.path,
  bazalt: SITE_IMAGE_SLOTS.bazalt.path,
  basalt: SITE_IMAGE_SLOTS.bazalt.path,
  stairs: SITE_IMAGE_SLOTS.stairs.path,
  windowSills: SITE_IMAGE_SLOTS.windowSills.path,
  doorSills: SITE_IMAGE_SLOTS.doorSills.path,
  coping: SITE_IMAGE_SLOTS.coping.path,
  countertops: SITE_IMAGE_SLOTS.countertops.path,
  flooring: SITE_IMAGE_SLOTS.flooring.path,
  wallCladding: SITE_IMAGE_SLOTS.wallCladding.path,
  projects: {
    commercialAtrium: SITE_IMAGE_SLOTS.projectCommercialAtrium.path,
    hillsideResidence: SITE_IMAGE_SLOTS.projectHillsideResidence.path,
    luxuryHotel: SITE_IMAGE_SLOTS.projectLuxuryHotel.path,
    corporateHQ: SITE_IMAGE_SLOTS.projectCorporateHQ.path,
    cantileverStair: SITE_IMAGE_SLOTS.projectCantileverStair.path,
    executiveSuite: SITE_IMAGE_SLOTS.projectExecutiveSuite.path,
  },
  process: {
    selection: SITE_IMAGE_SLOTS.processSelection.path,
    cutting: SITE_IMAGE_SLOTS.processCutting.path,
    fabrication: SITE_IMAGE_SLOTS.processFabrication.path,
    finishing: SITE_IMAGE_SLOTS.processFinishing.path,
    quality: SITE_IMAGE_SLOTS.processQuality.path,
    installation: SITE_IMAGE_SLOTS.processInstallation.path,
  }
};
