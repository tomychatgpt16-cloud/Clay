export type StoneCollection = 'main' | 'chips';

export type StoneType = 'Granite' | 'Marble' | 'Limestone' | 'Basalt' | 'Stone Chips' | 'Chemical Flooring Material';

export interface StoneFinish {
  name: string;
  description: string;
  recommendedFor: string;
}

export interface CompositeCropCoordinates {
  sectionIndex: number;
  sectionLabel: string;
  bgPos3x2: string; // Background position for 3 columns x 2 rows
  bgPos2x3: string; // Background position for 2 columns x 3 rows
}

export interface StoneProduct {
  id: string;
  name: string;
  stoneType: StoneType;
  collection: StoneCollection;
  photoNumber: number;
  originRegion: string;
  pricePerM2?: number;
  priceFormatted: string;
  tagline: string;
  shortDescription: string;
  detailedDescription: string;
  finishOptions: string[];
  finishes: StoneFinish[];
  typicalApplications: string[];
  imageUrl: string;
  imageSlot: string;
  compositeCrop?: CompositeCropCoordinates;
  galleryUrls: string[];
  appearanceNotes: string;
  texturePattern: string;
  materialForm?: string;
}

export interface StoneService {
  id: string;
  title: string;
  summary: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
}

export type ProjectCategory = 
  | 'ALL'
  | 'RESIDENTIAL'
  | 'COMMERCIAL'
  | 'HOSPITALITY'
  | 'STAIRS'
  | 'FACADES'
  | 'INTERIORS';

export interface ArchitecturalProject {
  id: string;
  title: string;
  category: ProjectCategory;
  stoneUsed: string;
  application: string;
  location: string;
  imageUrl: string;
  scopeNote: string;
}

export interface ProcessStage {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  focus: string;
  imageUrl: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  stoneType?: 'Granite' | 'Marble' | 'Limestone' | 'Basalt' | 'Workshop' | 'Architectural';
  category: 'Granite Slabs' | 'Marble Slabs' | 'Limestone & Basalt' | 'Stairs & Sills' | 'Coping' | 'Workshop & Fabrication' | 'Architectural Installations' | 'Close-up Textures';
  imageUrl: string;
  description: string;
}

export type AllowedFinish = 'Polished' | 'Non-Polished' | 'Non Polished' | 'Mirror Polish' | 'Flamed';

export type StairTreadThickness = '2 cm (20 mm)' | '3 cm (30 mm)';

export interface StairItemConfig {
  treadLength: number;
  treadWidth: number;
  quantity: number;
  treadThickness: StairTreadThickness;
  riserRequired: boolean;
  riserHeight?: number;
  riserQuantity?: number;
  riserThickness?: string;
  landingRequired?: boolean;
  landingLength?: number;
  landingWidth?: number;
  edgeProfile?: string;
  finish: AllowedFinish;
}

export interface DimensionItemConfig {
  length: number;
  width: number;
  quantity: number;
  thickness: string;
  edgeProfile?: string;
  finish: AllowedFinish;
}

export interface CopingItemConfig {
  width: number;
  linearMeters: number;
  thickness: string;
  edgeProfile?: string;
  finish: AllowedFinish;
}

export interface FlooringItemConfig {
  mode: 'dimensions' | 'area';
  length?: number;
  width?: number;
  quantity?: number;
  directArea?: number;
  thickness: string;
  finish: AllowedFinish;
}

export interface CladdingItemConfig {
  length: number;
  height: number;
  quantity: number;
  thickness: string;
  finish: AllowedFinish;
}

export interface CustomItemConfig {
  description: string;
  estimatedArea?: number;
  estimatedLinearM?: number;
  thickness?: string;
  finish: AllowedFinish;
}

export interface ApplicationItemEntry {
  id: string;
  type: string; // 'Stair' | 'Window Sill' | 'Door Sill' | 'Coping' | 'Countertop' | 'Flooring' | 'Wall Cladding' | 'Custom / Other'
  label: string;
  finish: AllowedFinish;
  stairConfig?: StairItemConfig;
  dimensionConfig?: DimensionItemConfig;
  copingConfig?: CopingItemConfig;
  flooringConfig?: FlooringItemConfig;
  claddingConfig?: CladdingItemConfig;
  customConfig?: CustomItemConfig;
  calculatedAreaM2: number;
  calculatedLinearM: number;
  detailsSummary: string;
}

export interface DimensionQuoteState {
  productCategory: 'Granite' | 'Marble' | 'Limestone' | 'Basalt';
  selectedStoneId: string;
  application: string;
  length: number;
  width: number;
  quantity: number;
  unit: 'm' | 'cm' | 'mm';
  notes: string;
  fileName?: string;
  fileSize?: string;
  fileDataUrl?: string;
}

export interface QuotationSubmission {
  id: string;
  createdAt: string;
  fullName: string;
  company?: string;
  phoneNumber: string;
  email: string;
  projectLocation: string;
  productType: 'Granite' | 'Marble' | 'Limestone' | 'Basalt';
  specificStone: string;
  application?: string;
  applications: ApplicationItemEntry[];
  totalAreaM2: number;
  totalLinearM: number;
  length?: number;
  width?: number;
  unit?: string;
  quantity?: number;
  calculatedAreaM2?: number;
  calculatedLinearM?: number;
  preferredFinish?: string;
  projectDescription?: string;
  notes?: string;
  attachmentName?: string;
  status: 'Pending Review' | 'Contacted' | 'Quoted';
  formattedMessage?: string;
}
