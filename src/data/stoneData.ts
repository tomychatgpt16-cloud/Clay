import { 
  StoneProduct, 
  StoneService, 
  ArchitecturalProject, 
  ProcessStage, 
  GalleryImage,
  AllowedFinish 
} from '../types';

/**
 * =========================================================================
 * CENTRALIZED IMAGE REGISTRY
 * =========================================================================
 * Clean image system for official product photographs and architectural projects.
 * Replacing any file in /public/images/products/ or /public/images/chips/ will
 * automatically propagate everywhere across the application.
 */
export const STONE_IMAGES = {
  // Main Stone Collection (7 products matching exact uploaded filenames)
  'axum-granite-black': '/images/products/01_axum_granite_black.jpg',
  'welega-marble-white': '/images/products/02_welega_marble_white.jpg',
  'welega-marble-gray': '/images/products/03_welega_marble_gray.jpg',
  'axum-granite-white': '/images/products/04_axum_granite_white.jpg',
  'babile-granite': '/images/products/05_babile_granite.jpg',
  'limestone': '/images/products/06_limestone.jpg',
  'basalt': '/images/products/07_basalt.jpg',
  'bazalt': '/images/products/07_basalt.jpg', // alias support

  // Special Stone Chip Collection & Chemical Flooring (3 products)
  'black-chemical-chips': '/images/products/08_black_chemical_chips.jpg',
  'red-chemical-chips': '/images/products/09_red_chemical_chips.jpg',
  'powder-chips': '/images/products/10_powder_chips.jpg',

  // Project & Architectural Application Photography
  'chemical-flooring-hallway': '/images/projects/chemical-flooring-hallway.jpg',
} as const;

/**
 * Strict Allowed Finishes for Main Stone Products
 * ONLY: Polished, Non-Polished, Mirror Polish, Flamed
 * (NO Honed, NO Bush Hammered)
 */
export const ALLOWED_FINISH_PROFILES: { name: AllowedFinish; description: string; recommendedFor: string }[] = [
  {
    name: 'Polished',
    description: 'Smooth, lustrous finished natural stone highlighting natural crystalline depth.',
    recommendedFor: 'Interior stairs, window sills, door sills, vanity countertops, refined wall cladding'
  },
  {
    name: 'Non Polished',
    description: 'Natural matte surface without gloss, preserving tactile organic stone texture.',
    recommendedFor: 'Contemporary interior floors, understated window sills, door thresholds, architectural facades'
  },
  {
    name: 'Mirror Polish',
    description: 'High-gloss optical surface reflecting light with extraordinary clarity.',
    recommendedFor: 'Showcase architectural feature panels, luxury stair risers, signature lobby countertops'
  },
  {
    name: 'Flamed',
    description: 'Textured thermal heat-treated surface providing permanent slip resistance.',
    recommendedFor: 'Exterior stair treads, swimming pool coping, entrance ramps, outdoor pedestrian walkways'
  }
];

export const ALLOWED_FINISH_NAMES: AllowedFinish[] = [
  'Polished',
  'Non Polished',
  'Mirror Polish',
  'Flamed'
];

/**
 * Multiple Application Options (Selectable simultaneously with SELECT ALL capability)
 */
export const APPLICATION_OPTIONS = [
  { id: 'Stairs', label: 'Stairs', description: 'Treads (2cm / 3cm), risers, landings, custom edge finishing' },
  { id: 'Window Sill', label: 'Window Sill', description: 'Weather-shedding sills with drip grooves & polished returns' },
  { id: 'Door Sill', label: 'Door Sill', description: 'High-wear threshold slabs calibrated for heavy traffic passage' },
  { id: 'Coping', label: 'Coping', description: 'Parapet walls, terrace perimeters, and protective pool edges' },
  { id: 'Countertop', label: 'Countertop', description: 'Bespoke kitchen, bathroom vanity, and reception worktops' },
  { id: 'Flooring', label: 'Flooring', description: 'Calibrated stone paving, interior tiles, and chemical flooring' },
  { id: 'Wall Cladding', label: 'Wall Cladding', description: 'Interior feature walls & exterior ventilated architectural facades' },
  { id: 'Custom / Other', label: 'Custom / Other', description: 'Bespoke architectural stone elements and dimensional commissions' }
];

/**
 * =========================================================================
 * MAIN STONE COLLECTION — 7 PRODUCTS
 * =========================================================================
 * 1. Axum Granite Black (10,300 ETB / m²)
 * 2. Axum Granite White (9,800 ETB / m²)
 * 3. Welega Marble White (7,500 ETB / m²)
 * 4. Welega Marble Gray (8,000 ETB / m²)
 * 5. Babile Granite (8,500 ETB / m²)
 * 6. Limestone (Contact us for pricing)
 * 7. Basalt (Contact us for pricing)
 */
export const MAIN_STONE_PRODUCTS: StoneProduct[] = [
  {
    id: 'axum-granite-black',
    name: 'AXUM GRANITE BLACK',
    stoneType: 'Granite',
    collection: 'main',
    photoNumber: 1,
    originRegion: 'Northern Ethiopia (Axum Geological Formation)',
    pricePerM2: 10300,
    priceFormatted: '10,300 ETB / m²',
    tagline: 'Deep obsidian depth with unmatched compressive strength',
    shortDescription: 'Renowned for its deep obsidian black tone and ultra-dense crystalline composition, ideal for monumental stairs, heavy traffic flooring, and high-impact architectural facades.',
    detailedDescription: 'Sourced from the historic quarry reserves of northern Ethiopia, Axum Granite Black embodies natural permanence. Its micro-crystalline composition yields exceptional resistance to weathering, moisture absorption, and mechanical abrasion. Whether finished to a deep mirror polish or flamed for slip-resistant exterior stair treads, it provides unmatched architectural presence.',
    finishOptions: ['Polished', 'Non Polished', 'Mirror Polish', 'Flamed'],
    finishes: ALLOWED_FINISH_PROFILES,
    typicalApplications: [
      'Stairs',
      'Window Sill',
      'Door Sill',
      'Coping',
      'Countertop',
      'Flooring',
      'Wall Cladding',
      'Custom / Other'
    ],
    imageUrl: STONE_IMAGES['axum-granite-black'],
    imageSlot: STONE_IMAGES['axum-granite-black'],
    compositeCrop: {
      sectionIndex: 1,
      sectionLabel: 'Section 1 (Col 1, Row 1)',
      bgPos3x2: '0% 0%',
      bgPos2x3: '0% 0%'
    },
    galleryUrls: [
      STONE_IMAGES['axum-granite-black'],
      '/images/products/axum-granite-black.svg'
    ],
    appearanceNotes: 'Even dark charcoal to jet black field with microscopic reflective quartz crystals and ultra-dense igneous structure.',
    texturePattern: 'Dense intrusive igneous plutonic granite',
    materialForm: 'Solid Natural Stone Slabs'
  },
  {
    id: 'welega-marble-white',
    name: 'WELEGA MARBLE WHITE',
    stoneType: 'Marble',
    collection: 'main',
    photoNumber: 2,
    originRegion: 'Western Ethiopia (Welega Province)',
    pricePerM2: 7500,
    priceFormatted: '7,500 ETB / m²',
    tagline: 'Pristine luminous white marble with delicate soft smoke veining',
    shortDescription: 'A premier Ethiopian metamorphic marble featuring an ethereal alabaster background adorned with subtle, feather-soft charcoal and silver veining.',
    detailedDescription: 'Extracted from the ancient metamorphic belts of Welega, this marble rivals classic Mediterranean varieties in purity and luminosity. It is meticulously precision-cut and finished by Clay’s to produce breathtaking floating staircases, continuous-grain wall panels, elegant window sills, and bespoke architectural elements.',
    finishOptions: ['Polished', 'Non Polished', 'Mirror Polish', 'Flamed'],
    finishes: ALLOWED_FINISH_PROFILES,
    typicalApplications: [
      'Stairs',
      'Window Sill',
      'Door Sill',
      'Coping',
      'Countertop',
      'Flooring',
      'Wall Cladding',
      'Custom / Other'
    ],
    imageUrl: STONE_IMAGES['welega-marble-white'],
    imageSlot: STONE_IMAGES['welega-marble-white'],
    compositeCrop: {
      sectionIndex: 2,
      sectionLabel: 'Section 2 (Col 2, Row 1)',
      bgPos3x2: '50% 0%',
      bgPos2x3: '0% 50%'
    },
    galleryUrls: [
      STONE_IMAGES['welega-marble-white'],
      '/images/products/welega-marble-white.svg'
    ],
    appearanceNotes: 'Brilliant white to milky ivory base with organic feathered gray wisps and natural calcite translucency.',
    texturePattern: 'Recrystallized metamorphic calcium carbonate marble',
    materialForm: 'Solid Natural Stone Slabs'
  },
  {
    id: 'welega-marble-gray',
    name: 'WELEGA MARBLE GRAY',
    stoneType: 'Marble',
    collection: 'main',
    photoNumber: 3,
    originRegion: 'Western Ethiopia (Welega Province)',
    pricePerM2: 8000,
    priceFormatted: '8,000 ETB / m²',
    tagline: 'Sculptural pewter tones with dramatic tectonic wave patterns',
    shortDescription: 'Sophisticated storm-gray and pewter marble with fluid charcoal banding, creating an atmosphere of modern restraint and architectural gravity.',
    detailedDescription: 'Welega Marble Gray showcases dramatic metamorphic stratification. The subtle variations between steel-gray, graphite, and white calcite veining make every slab a natural art piece. Clay’s precision diamond saws and multi-stage polishing lines achieve seamless joints and bullnose edge profiles for luxury residential and commercial developments.',
    finishOptions: ['Polished', 'Non Polished', 'Mirror Polish', 'Flamed'],
    finishes: ALLOWED_FINISH_PROFILES,
    typicalApplications: [
      'Stairs',
      'Window Sill',
      'Door Sill',
      'Coping',
      'Countertop',
      'Flooring',
      'Wall Cladding',
      'Custom / Other'
    ],
    imageUrl: STONE_IMAGES['welega-marble-gray'],
    imageSlot: STONE_IMAGES['welega-marble-gray'],
    compositeCrop: {
      sectionIndex: 3,
      sectionLabel: 'Section 3 (Col 3, Row 1)',
      bgPos3x2: '100% 0%',
      bgPos2x3: '100% 50%'
    },
    galleryUrls: [
      STONE_IMAGES['welega-marble-gray'],
      '/images/products/welega-marble-gray.svg'
    ],
    appearanceNotes: 'Cool pewter and slate matrix interspersed with light silver streaks and darker charcoal metamorphic flow bands.',
    texturePattern: 'Layered metamorphic marble with directional movement',
    materialForm: 'Solid Natural Stone Slabs'
  },
  {
    id: 'axum-granite-white',
    name: 'AXUM GRANITE WHITE',
    stoneType: 'Granite',
    collection: 'main',
    photoNumber: 4,
    originRegion: 'Northern Ethiopia (Axum Geological Formation)',
    pricePerM2: 9800,
    priceFormatted: '9,800 ETB / m²',
    tagline: 'Luminous crystalline granite with dynamic silver-slate mineral accents',
    shortDescription: 'A distinguished white granite punctuated by silver-gray and charcoal mineral crystals, providing modern brightness without sacrificing natural granite durability.',
    detailedDescription: 'Axum Granite White provides an exceptional solution for architects seeking light-toned stone surfaces capable of enduring severe wear. Its natural quartz and feldspar matrix resists staining, scratching, and freeze-thaw cycles, making it a favored choice for window sills, door thresholds, wide commercial stairs, and perimeter coping.',
    finishOptions: ['Polished', 'Non Polished', 'Mirror Polish', 'Flamed'],
    finishes: ALLOWED_FINISH_PROFILES,
    typicalApplications: [
      'Stairs',
      'Window Sill',
      'Door Sill',
      'Coping',
      'Countertop',
      'Flooring',
      'Wall Cladding',
      'Custom / Other'
    ],
    imageUrl: STONE_IMAGES['axum-granite-white'],
    imageSlot: STONE_IMAGES['axum-granite-white'],
    compositeCrop: {
      sectionIndex: 4,
      sectionLabel: 'Section 4 (Col 1, Row 2)',
      bgPos3x2: '0% 100%',
      bgPos2x3: '100% 50%'
    },
    galleryUrls: [
      STONE_IMAGES['axum-granite-white'],
      '/images/products/axum-granite-white.svg'
    ],
    appearanceNotes: 'Off-white to light gray background with scattered quartz crystals and graphite-colored flecks in a balanced crystalline matrix.',
    texturePattern: 'Medium-grained crystalline igneous granite',
    materialForm: 'Solid Natural Stone Slabs'
  },
  {
    id: 'babile-granite',
    name: 'BABILE GRANITE',
    stoneType: 'Granite',
    collection: 'main',
    photoNumber: 5,
    originRegion: 'Eastern Ethiopia (Babile Geological Valley)',
    pricePerM2: 8500,
    priceFormatted: '8,500 ETB / m²',
    tagline: 'Warm earth tones, desert gold hues, and unmatched geological resilience',
    shortDescription: 'Celebrated for its warm terracotta, golden-tan, and rose-flecked crystalline palette, Babile Granite brings organic warmth and prestige to architectural stone installations.',
    detailedDescription: 'Originating from the dramatic rock sanctuaries of Eastern Ethiopia, Babile Granite is famous for its distinct coloration formed by potassium feldspars. Highly resilient to weathering and thermal variations, this stone bridges the gap between rugged natural stone character and precision architectural finishing.',
    finishOptions: ['Polished', 'Non Polished', 'Mirror Polish', 'Flamed'],
    finishes: ALLOWED_FINISH_PROFILES,
    typicalApplications: [
      'Stairs',
      'Window Sill',
      'Door Sill',
      'Coping',
      'Countertop',
      'Flooring',
      'Wall Cladding',
      'Custom / Other'
    ],
    imageUrl: STONE_IMAGES['babile-granite'],
    imageSlot: STONE_IMAGES['babile-granite'],
    compositeCrop: {
      sectionIndex: 5,
      sectionLabel: 'Section 5 (Col 2, Row 2)',
      bgPos3x2: '50% 100%',
      bgPos2x3: '0% 100%'
    },
    galleryUrls: [
      STONE_IMAGES['babile-granite'],
      '/images/products/babile-granite.svg'
    ],
    appearanceNotes: 'Warm beige to rose-gold and terracotta specks interwoven with smoky quartz nodules and dark mica crystals.',
    texturePattern: 'Coarse to medium crystalline feldspathic granite matrix',
    materialForm: 'Solid Natural Stone Slabs'
  },
  {
    id: 'limestone',
    name: 'LIMESTONE',
    stoneType: 'Limestone',
    collection: 'main',
    photoNumber: 6,
    originRegion: 'Eastern Ethiopia (Dire Dawa / Harar Geological Basin)',
    pricePerM2: undefined,
    priceFormatted: 'Contact for Quotation',
    tagline: 'Warm natural ivory and sand-buff sedimentary limestone for timeless facades',
    shortDescription: 'Naturally stratified Ethiopian sedimentary limestone featuring serene cream, ivory, and warm sand tones. Outstanding thermal insulation and refined architectural presence.',
    detailedDescription: 'Harvested from the venerable sedimentary limestone deposits of Eastern Ethiopia, this natural stone combines organic beauty with excellent thermal and acoustic performance. Its uniform fine-grained matrix and soft natural earthy hues make it an exceptional material for exterior building facades, ventilated cladding panels, window sills, door surrounds, and interior feature walls.',
    finishOptions: ['Polished', 'Non Polished', 'Mirror Polish', 'Flamed'],
    finishes: ALLOWED_FINISH_PROFILES,
    typicalApplications: [
      'Stairs',
      'Window Sill',
      'Door Sill',
      'Coping',
      'Countertop',
      'Flooring',
      'Wall Cladding',
      'Custom / Other'
    ],
    imageUrl: STONE_IMAGES['limestone'],
    imageSlot: STONE_IMAGES['limestone'],
    compositeCrop: {
      sectionIndex: 6,
      sectionLabel: 'Section 6 (Col 3, Row 2)',
      bgPos3x2: '100% 100%',
      bgPos2x3: '100% 100%'
    },
    galleryUrls: [
      STONE_IMAGES['limestone'],
      '/images/products/limestone.svg'
    ],
    appearanceNotes: 'Warm cream, pale buff, and ivory matrix with fine natural sedimentary grain lines and organic matte elegance.',
    texturePattern: 'Calibrated fine-grained sedimentary limestone',
    materialForm: 'Solid Natural Stone Slabs'
  },
  {
    id: 'basalt',
    name: 'BASALT',
    stoneType: 'Basalt',
    collection: 'main',
    photoNumber: 7,
    originRegion: 'Central Highlands & Rift Margins of Ethiopia',
    pricePerM2: undefined,
    priceFormatted: 'Contact for Quotation',
    tagline: 'Ultra-dense volcanic stone with supreme durability and deep charcoal-black aesthetic',
    shortDescription: 'High-density Ethiopian volcanic basalt with deep charcoal-black color and immense compressive strength. Engineered for heavy pedestrian traffic, stairs, thresholds, and durable exterior paving.',
    detailedDescription: 'Formed through rapid cooling of basaltic lava across Ethiopia’s Great Rift margins, Basalt represents the pinnacle of compressive strength and weather resistance. Practically impervious to freeze-thaw cycles and chemical erosion, our precision-cut basalt treads and pavers feature clean beveled edges and natural micro-texture that provides permanent slip resistance in high-traffic public, commercial, and residential architecture.',
    finishOptions: ['Polished', 'Non Polished', 'Mirror Polish', 'Flamed'],
    finishes: ALLOWED_FINISH_PROFILES,
    typicalApplications: [
      'Stairs',
      'Window Sill',
      'Door Sill',
      'Coping',
      'Countertop',
      'Flooring',
      'Wall Cladding',
      'Custom / Other'
    ],
    imageUrl: STONE_IMAGES['basalt'],
    imageSlot: STONE_IMAGES['basalt'],
    galleryUrls: [
      STONE_IMAGES['basalt'],
      '/images/products/basalt.svg',
      '/images/products/bazalt.svg'
    ],
    appearanceNotes: 'Uniform matte deep charcoal to pitch-black volcanic matrix with micro-vesicular mineral density.',
    texturePattern: 'Aphanitic dense igneous volcanic basalt',
    materialForm: 'Solid Natural Stone Slabs'
  }
];

/**
 * =========================================================================
 * SPECIAL STONE CHIP COLLECTION — 3 PRODUCTS
 * =========================================================================
 * Collection name: STONE CHIPS & CHEMICAL FLOORING MATERIALS
 * 8. Black Chemical Chips (Contact us for pricing)
 * 9. Red Chemical Chips (Contact us for pricing)
 * 10. Powder Chips (Contact us for pricing)
 *
 * NOTE: These are NOT natural solid slabs!
 * They are engineered stone chips and micro-aggregates used in
 * chemical-bound flooring applications (seamless terrazzo / resin flooring).
 */
export const STONE_CHIPS_PRODUCTS: StoneProduct[] = [
  {
    id: 'black-chemical-chips',
    name: 'BLACK CHEMICAL CHIPS',
    stoneType: 'Stone Chips',
    collection: 'chips',
    photoNumber: 8,
    originRegion: 'Processed Ethiopian Basalt & Dark Minerals',
    pricePerM2: undefined,
    priceFormatted: 'Contact for Quotation',
    tagline: 'High-contrast black stone chips for seamless chemical terrazzo flooring',
    shortDescription: 'Graded dark basalt and mineral chips specially calibrated for chemical-bound terrazzo and resin flooring installations. Delivers exceptional compressive strength and striking contrast.',
    detailedDescription: 'Black Chemical Chips are manufactured from selected high-density Ethiopian basalt and dark intrusive stones, mechanically crushed and screened to uniform aggregate sizes. Designed specifically for chemical-bound flooring systems, seamless terrazzo, and resin matrices, they offer superior abrasion resistance and a prestigious mosaic appearance in high-traffic commercial corridors and residential spaces.',
    finishOptions: ['Polished Terrazzo', 'Non-Polished / Satin', 'Mirror Finish Polish'],
    finishes: [
      { name: 'Polished Terrazzo', description: 'Ground flat and polished to a reflective luster within the chemical mortar matrix.', recommendedFor: 'Commercial hallways, lobbies, retail floors' },
      { name: 'Non-Polished / Satin', description: 'Smooth satin honed finish with anti-glare properties.', recommendedFor: 'Interior circulation zones, galleries' },
      { name: 'Mirror Finish Polish', description: 'Multi-stage diamond grinding for ultra-glossy continuous surfaces.', recommendedFor: 'Showcase lobbies and architectural foyers' }
    ],
    typicalApplications: [
      'Chemical-Bound Flooring',
      'Terrazzo Flooring',
      'Commercial Corridors',
      'Seamless Decorative Pavements',
      'Industrial Floors',
      'Custom Mosaic Inlays'
    ],
    imageUrl: STONE_IMAGES['black-chemical-chips'],
    imageSlot: STONE_IMAGES['black-chemical-chips'],
    galleryUrls: [
      STONE_IMAGES['black-chemical-chips'],
      STONE_IMAGES['chemical-flooring-hallway']
    ],
    appearanceNotes: 'Deep charcoal to black angular mineral chips set within white, gray, or contrasting chemical binder matrices.',
    texturePattern: 'Calibrated angular crushed stone aggregate (NOT solid slabs)',
    materialForm: 'Chemical Flooring Aggregate / Chips'
  },
  {
    id: 'red-chemical-chips',
    name: 'RED CHEMICAL CHIPS',
    stoneType: 'Stone Chips',
    collection: 'chips',
    photoNumber: 9,
    originRegion: 'Processed Ethiopian Terracotta & Marble Minerals',
    pricePerM2: undefined,
    priceFormatted: 'Contact for Quotation',
    tagline: 'Warm terracotta and marble chips for vibrant architectural chemical flooring',
    shortDescription: 'Distinctive reddish-terracotta and marble aggregate chips formulated for decorative chemical-bound terrazzo and resilient flooring systems with rich earthy warmth.',
    detailedDescription: 'Red Chemical Chips provide a warm, Mediterranean aesthetic to modern chemical-bound terrazzo flooring. Blended with select white marble fragments or bound within rich red chemical matrices, these chips create durable, joint-free surfaces that resist staining, impact, and daily pedestrian wear while celebrating authentic mineral tones.',
    finishOptions: ['Polished Terrazzo', 'Non-Polished / Satin', 'Mirror Finish Polish'],
    finishes: [
      { name: 'Polished Terrazzo', description: 'Diamond ground and sealed for vibrant color depth.', recommendedFor: 'Restaurants, hotels, luxury residences' },
      { name: 'Non-Polished / Satin', description: 'Satin sealed matte surface for natural warmth.', recommendedFor: 'Living areas, corridors, patios' },
      { name: 'Mirror Finish Polish', description: 'Ultra-smooth high-gloss architectural finish.', recommendedFor: 'Boutiques and flagship hospitality floors' }
    ],
    typicalApplications: [
      'Chemical-Bound Flooring',
      'Terrazzo Flooring',
      'Hospitality Spaces',
      'Commercial Corridors',
      'Decorative Mosaic Floors',
      'Seamless Surfacing'
    ],
    imageUrl: STONE_IMAGES['red-chemical-chips'],
    imageSlot: STONE_IMAGES['red-chemical-chips'],
    galleryUrls: [
      STONE_IMAGES['red-chemical-chips'],
      STONE_IMAGES['chemical-flooring-hallway']
    ],
    appearanceNotes: 'Warm terracotta, brick-red, and marble aggregate chips providing rich mosaic color and contrast.',
    texturePattern: 'Calibrated decorative stone aggregate chips (NOT solid slabs)',
    materialForm: 'Chemical Flooring Aggregate / Chips'
  },
  {
    id: 'powder-chips',
    name: 'POWDER CHIPS',
    stoneType: 'Chemical Flooring Material',
    collection: 'chips',
    photoNumber: 10,
    originRegion: 'Micro-Calibrated Ethiopian Stone Powder & Microchips',
    pricePerM2: undefined,
    priceFormatted: 'Contact for Quotation',
    tagline: 'Ultra-fine microchips and stone powder formulation for dense chemical mortar floors',
    shortDescription: 'Precision-graded micro-stone powder and fine chips designed for homogeneous chemical-bound floors, leveling matrices, and high-density continuous terrazzo binders.',
    detailedDescription: 'Powder Chips represent a high-performance chemical flooring component comprising micro-calibrated stone granules and mineral powder. Designed for dense, seamless flooring installations, this formulation integrates seamlessly with chemical binders to produce non-porous, ultra-resilient surfaces capable of supporting heavy rolling loads while maintaining a refined architectural aesthetic.',
    finishOptions: ['High-Density Polish', 'Smooth Matrix Finish', 'Chemical Seal & Protect'],
    finishes: [
      { name: 'High-Density Polish', description: 'Dense micro-surface polished to high reflective uniformity.', recommendedFor: 'High-traffic commercial, retail, hospitals' },
      { name: 'Smooth Matrix Finish', description: 'Even matte leveling finish for durable architectural floors.', recommendedFor: 'Offices, showrooms, public facilities' },
      { name: 'Chemical Seal & Protect', description: 'Specialized chemical impregnation for chemical and abrasion defense.', recommendedFor: 'Laboratories, workshops, corridors' }
    ],
    typicalApplications: [
      'Chemical-Bound Flooring',
      'Terrazzo Matrix Binder',
      'Smooth Chemical Floors',
      'High-Traffic Commercial Leveling',
      'Heavy-Wear Industrial Pavements',
      'Seamless Surfacing'
    ],
    imageUrl: STONE_IMAGES['powder-chips'],
    imageSlot: STONE_IMAGES['powder-chips'],
    galleryUrls: [
      STONE_IMAGES['powder-chips'],
      STONE_IMAGES['chemical-flooring-hallway']
    ],
    appearanceNotes: 'Densely packed micro-white and mineral granules evenly suspended within a durable chemical matrix.',
    texturePattern: 'Micro-granulate stone powder formulation (NOT solid slabs)',
    materialForm: 'Chemical Flooring Aggregate / Chips'
  }
];

/**
 * All 10 Products in the Official Catalog
 */
export const STONE_PRODUCTS: StoneProduct[] = [
  ...MAIN_STONE_PRODUCTS,
  ...STONE_CHIPS_PRODUCTS
];

/**
 * Helper to retrieve stone product by ID with alias fallback
 */
export function getStoneById(id: string): StoneProduct | undefined {
  if (id === 'bazalt') id = 'basalt';
  return STONE_PRODUCTS.find(p => p.id === id);
}

/**
 * Helper to retrieve centralized image URL by stone ID
 */
export function getStoneImageUrl(id: string): string {
  if (id === 'bazalt') id = 'basalt';
  if (id in STONE_IMAGES) {
    return STONE_IMAGES[id as keyof typeof STONE_IMAGES];
  }
  const product = getStoneById(id);
  return product ? product.imageUrl : '/images/products/axum-granite-black.jpg';
}

export const STONE_SERVICES: StoneService[] = [
  {
    id: 'stone-fabrication',
    title: 'STONE FABRICATION',
    summary: 'Precision cutting and fabrication of granite, marble, limestone, and basalt.',
    description: 'Equipped with industrial diamond bridge saws and edge profiling machinery, Clay’s transforms raw Ethiopian stone blocks and slabs into millimetre-accurate architectural components.',
    icon: 'Hammer',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    features: ['Computer-guided diamond saw cutting', 'Custom edge profiles (Bevel, Bullnose, Mitered)', 'Bookmatching & vein-matching layout', 'Dry-lay inspection before dispatch']
  },
  {
    id: 'stairs',
    title: 'STAIRS',
    summary: 'Custom granite and marble stair treads and risers (2cm & 3cm).',
    description: 'We fabricate custom solid treads, risers, and landing slabs in 2cm and 3cm calibrated thicknesses, designed to withstand decades of intensive pedestrian use.',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    features: ['Calibrated tread thickness: 2 cm (20 mm) & 3 cm (30 mm)', 'Slip-resistant flamed textures and anti-slip grooving', 'Precision-matched risers and skirtings', 'Floating cantilever & structural stair elements']
  },
  {
    id: 'window-door-sills',
    title: 'WINDOW & DOOR SILLS',
    summary: 'Custom-fabricated sills with accurate measurements and finishing.',
    description: 'Engineered to direct moisture away from structural walls while adding permanent architectural refinement, our stone sills are cut precisely to project schedules.',
    icon: 'Maximize2',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    features: ['Under-sill drip grooves on exterior pieces', 'Polished & non-polished exposed edge returns', 'Accurate length tolerances (±1mm)', 'Interior and exterior threshold integration']
  },
  {
    id: 'coping',
    title: 'COPING',
    summary: 'Granite, basalt, and marble coping for walls, pools, terraces, and parapets.',
    description: 'Protection and prestige for parapet walls, retaining structures, swimming pool borders, and garden terraces with water-shedding profiles and refined edge detailing.',
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    features: ['Dual-sided chamfered & rounded edges', 'Waterproof drip edge detailing', 'Custom curved radius coping fabrication', 'Extreme frost and UV resistance']
  },
  {
    id: 'chemical-flooring',
    title: 'CHEMICAL FLOORING & TERRAZZO',
    summary: 'High-performance chemical-bound stone chip and aggregate terrazzo flooring.',
    description: 'Specializing in chemical-bound terrazzo systems using our proprietary black, red, and powder stone chips, delivering seamless high-traffic floors with exceptional longevity.',
    icon: 'Sparkles',
    image: STONE_IMAGES['chemical-flooring-hallway'],
    features: ['Custom stone chip formulations', 'Seamless joint-free commercial surfaces', 'High compressive and impact strength', 'Professional diamond grinding & rotary polishing']
  },
  {
    id: 'custom-fabrication',
    title: 'CUSTOM FABRICATION',
    summary: 'Special dimensions and bespoke architectural stone requirements.',
    description: 'Collaborating directly with architects, general contractors, and structural engineers to deliver bespoke dimensional stone elements, complex geometry, and special commissions.',
    icon: 'Compass',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    features: ['Oversized slab handling and calibration', 'Solid stone carvings and custom plinths', 'Curved wall claddings & thresholds', 'Tailored fireplace surrounds and vanity tops']
  }
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    step: 1,
    title: 'STONE SELECTION',
    subtitle: 'Geological Inspection',
    description: 'We inspect raw stone blocks directly from premier Ethiopian quarries across Axum, Babile, and Welega, evaluating grain consistency, sound structure, and natural veining.',
    focus: 'Zero micro-fractures, optimal mineral density',
    imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80'
  },
  {
    step: 2,
    title: 'CUTTING',
    subtitle: 'Primary Slicing',
    description: 'Blocks are positioned onto heavy-duty gang saws and diamond wire saws to slice precise slabs at calibrated thicknesses: 2cm (20mm), 3cm (30mm), or custom gauges.',
    focus: 'Calibrated planar flatness across full slab length',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  {
    step: 3,
    title: 'FABRICATION',
    subtitle: 'Architectural Shaping',
    description: 'Using computerized bridge saws and digital templates, stone is shaped to exact project dimensions for stairs, window sills, door sills, coping, and cladding.',
    focus: 'Millimetre accuracy matching architectural CAD drawings',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
  },
  {
    step: 4,
    title: 'FINISHING',
    subtitle: 'Surface Treatment',
    description: 'Surfaces and edges are treated with diamond abrasive heads for high polish, non-polished matte, mirror polish, or thermal flaming for permanent slip resistance.',
    focus: 'Depth of color, optical gloss, and slip resistance',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    step: 5,
    title: 'QUALITY CONTROL',
    subtitle: 'Rigorous Inspection',
    description: 'Every finished unit undergoes multi-point inspection for dimensional accuracy, diagonal squareness, edge profile integrity, and surface finish uniformity.',
    focus: 'Documented inspection before packing',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
  },
  {
    step: 6,
    title: 'DELIVERY & LOGISTICS',
    subtitle: 'Protected Transport',
    description: 'Components are packed with non-staining protective dividers in heavy-duty timber A-frames and strapped securely for safe transport to sites across Ethiopia.',
    focus: 'Shock-cushioned transit to prevent edge chipping',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  }
];

export const ARCHITECTURAL_PROJECTS: ArchitecturalProject[] = [
  {
    id: 'proj-1',
    title: 'Grand Commercial Atrium & Monumental Stair',
    category: 'COMMERCIAL',
    stoneUsed: 'Axum Granite Black & Welega Marble White',
    application: 'Floating Stair Treads & Atrium Paving',
    location: 'Bole District, Addis Ababa',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    scopeNote: 'High-contrast monolithic stair installation with flame-textured safety inlays.'
  },
  {
    id: 'proj-2',
    title: 'Hillside Modern Residence',
    category: 'RESIDENTIAL',
    stoneUsed: 'Babile Granite & Welega Marble Gray',
    application: 'Terrace Coping, Window Sills & Pool Surrounds',
    location: 'Yeka Hills, Addis Ababa',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85',
    scopeNote: 'Over 450 linear meters of custom bullnose coping with weather drip grooves.'
  },
  {
    id: 'proj-3',
    title: 'Chemical Flooring Commercial Corridor',
    category: 'COMMERCIAL',
    stoneUsed: 'Black Chemical Chips & Terrazzo Binder',
    application: 'Seamless Chemical-Bound Terrazzo Corridor Flooring',
    location: 'Commercial Headquarters, Addis Ababa',
    imageUrl: STONE_IMAGES['chemical-flooring-hallway'],
    scopeNote: 'Real hallway chemical terrazzo flooring photograph demonstrating industrial rotary polishing and high-durability seamless finish.'
  },
  {
    id: 'proj-4',
    title: 'Luxury Boutique Hotel Foyer',
    category: 'HOSPITALITY',
    stoneUsed: 'Welega Marble White',
    application: 'Continuous Bookmatched Wall Cladding & Reception Slabs',
    location: 'Kazanchis, Addis Ababa',
    imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=85',
    scopeNote: 'Mirror-polished crystalline marble slabs with vein-matching continuity.'
  },
  {
    id: 'proj-5',
    title: 'Corporate Headquarters Tower',
    category: 'FACADES',
    stoneUsed: 'Axum Granite Black & Basalt Steps',
    application: 'Ventilated Rain-Screen Facade Panels & Entrance Plinths',
    location: 'Financial District, Addis Ababa',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85',
    scopeNote: 'Dimensional exterior cladding engineered for zero-maintenance performance.'
  },
  {
    id: 'proj-6',
    title: 'Cantilevered Minimalist Staircase',
    category: 'STAIRS',
    stoneUsed: 'Axum Granite Black (Polished & Flamed)',
    application: 'Custom 3cm Solid Treads with Hidden Steel Anchoring',
    location: 'Old Airport Area, Addis Ababa',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85',
    scopeNote: 'Custom cantilever design tested for heavy deflection tolerances.'
  }
];

export const GALLERY_ITEMS: GalleryImage[] = [
  {
    id: 'g-1',
    title: 'Axum Granite Black — Official Product Slab',
    stoneType: 'Granite',
    category: 'Granite Slabs',
    imageUrl: STONE_IMAGES['axum-granite-black'],
    description: 'Official product photograph: Deep obsidian black granite slab with fine quartz crystalline structure.'
  },
  {
    id: 'g-2',
    title: 'Axum Granite White — Official Product Sample',
    stoneType: 'Granite',
    category: 'Granite Slabs',
    imageUrl: STONE_IMAGES['axum-granite-white'],
    description: 'Official product photograph: Dense salt-and-pepper white and slate crystalline granite.'
  },
  {
    id: 'g-3',
    title: 'Welega Marble White — Official Product Tile',
    stoneType: 'Marble',
    category: 'Marble Slabs',
    imageUrl: STONE_IMAGES['welega-marble-white'],
    description: 'Official product photograph: Luminous Ethiopian alabaster marble tile with subtle soft veining.'
  },
  {
    id: 'g-4',
    title: 'Welega Marble Gray — Official Product Slab',
    stoneType: 'Marble',
    category: 'Marble Slabs',
    imageUrl: STONE_IMAGES['welega-marble-gray'],
    description: 'Official product photograph: Metamorphic pewter-gray marble showing dramatic flowing strata.'
  },
  {
    id: 'g-5',
    title: 'Babile Granite — Official Product Sample',
    stoneType: 'Granite',
    category: 'Granite Slabs',
    imageUrl: STONE_IMAGES['babile-granite'],
    description: 'Official product photograph: Rich salmon-pink and terracotta feldspar granite from Babile.'
  },
  {
    id: 'g-6',
    title: 'Limestone — Official Cut Blocks & Slabs',
    stoneType: 'Limestone',
    category: 'Limestone & Basalt',
    imageUrl: STONE_IMAGES['limestone'],
    description: 'Official product photograph: Natural cream and sand-buff sedimentary architectural limestone slabs.'
  },
  {
    id: 'g-7',
    title: 'Basalt — Official Heavy Duty Steps & Pavers',
    stoneType: 'Basalt',
    category: 'Limestone & Basalt',
    imageUrl: STONE_IMAGES['basalt'],
    description: 'Official product photograph: Ultra-dense dark volcanic basalt with clean chamfered architectural edges.'
  },
  {
    id: 'g-8',
    title: 'Black Chemical Chips — Chemical Flooring Material',
    stoneType: 'Granite',
    category: 'Close-up Textures',
    imageUrl: STONE_IMAGES['black-chemical-chips'],
    description: 'Official product photograph: Black basalt chips set in contrasting chemical terrazzo matrix.'
  },
  {
    id: 'g-9',
    title: 'Red Chemical Chips — Terrazzo Flooring Aggregate',
    stoneType: 'Marble',
    category: 'Close-up Textures',
    imageUrl: STONE_IMAGES['red-chemical-chips'],
    description: 'Official product photograph: Red and terracotta matrix with white marble aggregate chips.'
  },
  {
    id: 'g-10',
    title: 'Powder Chips — Micro-Calibrated Formulation',
    stoneType: 'Architectural',
    category: 'Close-up Textures',
    imageUrl: STONE_IMAGES['powder-chips'],
    description: 'Official product photograph: Dense microchips and stone powder in chemical flooring mortar.'
  },
  {
    id: 'g-11',
    title: 'Chemical Flooring Application — Corridor Installation',
    stoneType: 'Architectural',
    category: 'Architectural Installations',
    imageUrl: STONE_IMAGES['chemical-flooring-hallway'],
    description: 'Real hallway photograph showing chemical-bound terrazzo polished with rotary machinery.'
  }
];

export const COMPANY_DETAILS = {
  name: "CLAY’S GRANITE AND MARBLE MANUFACTURING",
  shortName: "Clay’s",
  tagline: "Build with Stone. Build for Generations.",
  heroSupportingText: "Official Ethiopian natural stone catalog. Premium granite, marble, limestone, basalt, and chemical flooring materials manufactured with precision for timeless architectural spaces.",
  aboutHeading: "Stone, Crafted with Purpose.",
  aboutStory: "Clay’s Granite and Marble Manufacturing is dedicated to transforming authentic Ethiopian natural stone into refined architectural surfaces. From carefully selected quarry blocks to precise bridge saw cutting, specialized surface finishing, and chemical flooring materials, we prioritize durability, engineering accuracy, and timeless beauty.",
  location: "Addis Ababa, Ethiopia",
  telegram: "0960148501",
  telegramUrl: "https://t.me/share/url?url=&text=Hello%20Clay%27s%20Granite%20and%20Marble%20Manufacturing%20%280960148501%29%2C%20I%20would%20like%20to%20inquire%20about%20your%20official%20product%20catalog.",
  whatsapp: "0902568301",
  whatsappUrl: "https://wa.me/251902568301",
  primaryPhone: "0960148501",
  primaryPhoneTel: "+251960148501",
  secondaryPhone: "0979790909",
  secondaryPhoneTel: "+251979790909",
  phones: ["0960148501", "0979790909"],
  primaryPhoneClean: "251960148501",
  secondaryPhoneClean: "251979790909",
  whatsappClean: "251902568301",
  telegramClean: "0960148501",
  email: "claysgranite@gmail.com",
  workingHours: "Monday – Saturday: 8:30 AM – 6:00 PM EAT",
  establishedYear: 2026,
  corePillars: [
    {
      title: "PRECISION",
      description: "Accurate measurements and fabrication using calibrated diamond bridge saws to meet exacting architectural CAD blueprints."
    },
    {
      title: "QUALITY",
      description: "Carefully selected natural stone from Ethiopia’s prime geological reserves in Axum, Babile, and Welega with controlled surface finishing."
    },
    {
      title: "CRAFTSMANSHIP",
      description: "Experienced stonemasonry in every edge profile, joint alignment, chamfered tread, and chemical flooring matrix."
    },
    {
      title: "DURABILITY",
      description: "Stone manufactured to perform for generations under severe weather, heavy foot traffic, and structural loads."
    },
    {
      title: "CUSTOMIZATION",
      description: "Dimensions, thicknesses (2cm & 3cm stairs), and surface finishes tailored specifically to each project’s unique requirements."
    },
    {
      title: "RELIABILITY",
      description: "Professional communication, scheduled delivery across Ethiopia, and dedicated technical project support from consultation to handover."
    }
  ]
};
