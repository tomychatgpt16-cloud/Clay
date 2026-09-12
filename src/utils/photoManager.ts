/**
 * photoManager.ts
 * Manages official factory photographs uploaded by the company.
 * Automatically handles browser persistence (localStorage) and backend sync (/api/save-stone-image).
 */

export interface PhotoSlotDefinition {
  id: string;
  filename: string;
  title: string;
  subtitle: string;
  originalUploadedName: string;
  appliesTo: string[];
  description: string;
}

export const OFFICIAL_PHOTO_SLOTS: PhotoSlotDefinition[] = [
  {
    id: 'axum-granite-black',
    filename: '01_axum_granite_black.jpg',
    title: 'Axum Granite Black (Product 1)',
    subtitle: '01_axum_granite_black.jpg',
    originalUploadedName: '01_axum_granite_black.jpg',
    appliesTo: ['Axum Granite Black (10,300 ETB/m²)'],
    description: 'Deep obsidian black natural granite with dense crystalline structure.'
  },
  {
    id: 'welega-marble-white',
    filename: '02_welega_marble_white.jpg',
    title: 'Welega Marble White (Product 2)',
    subtitle: '02_welega_marble_white.jpg',
    originalUploadedName: '02_welega_marble_white.jpg',
    appliesTo: ['Welega Marble White (7,500 ETB/m²)'],
    description: 'Luminous Ethiopian white marble with delicate feathered gray veining.'
  },
  {
    id: 'welega-marble-gray',
    filename: '03_welega_marble_gray.jpg',
    title: 'Welega Marble Gray (Product 3)',
    subtitle: '03_welega_marble_gray.jpg',
    originalUploadedName: '03_welega_marble_gray.jpg',
    appliesTo: ['Welega Marble Gray (8,000 ETB/m²)'],
    description: 'Sculptural pewter and charcoal metamorphic marble with fluid tectonic banding.'
  },
  {
    id: 'axum-granite-white',
    filename: '04_axum_granite_white.jpg',
    title: 'Axum Granite White (Product 4)',
    subtitle: '04_axum_granite_white.jpg',
    originalUploadedName: '04_axum_granite_white.jpg',
    appliesTo: ['Axum Granite White (9,800 ETB/m²)'],
    description: 'Distinguished off-white granite with silver-slate and dark quartz crystals.'
  },
  {
    id: 'babile-granite',
    filename: '05_babile_granite.jpg',
    title: 'Babile Granite (Product 5)',
    subtitle: '05_babile_granite.jpg',
    originalUploadedName: '05_babile_granite.jpg',
    appliesTo: ['Babile Granite (8,500 ETB/m²)'],
    description: 'Warm earth tone granite with golden-tan and terracotta potassium feldspar minerals.'
  },
  {
    id: 'limestone',
    filename: '06_limestone.jpg',
    title: 'Limestone (Product 6)',
    subtitle: '06_limestone.jpg',
    originalUploadedName: '06_limestone.jpg',
    appliesTo: ['Limestone (Contact for Quotation)'],
    description: 'Sedimentary natural limestone featuring serene ivory, sand-buff tones and fine grain.'
  },
  {
    id: 'basalt',
    filename: '07_basalt.jpg',
    title: 'Basalt (Product 7)',
    subtitle: '07_basalt.jpg',
    originalUploadedName: '07_basalt.jpg',
    appliesTo: ['Basalt (Contact for Quotation)'],
    description: 'Dense volcanic basalt with pitch-black matte finish for heavy-traffic paving.'
  },
  {
    id: 'black-chemical-chips',
    filename: '08_black_chemical_chips.jpg',
    title: 'Black Chemical Chips (Product 8)',
    subtitle: '08_black_chemical_chips.jpg',
    originalUploadedName: '08_black_chemical_chips.jpg',
    appliesTo: ['Black Chemical Chips (Contact for Quotation)'],
    description: 'High-contrast dark basalt chips formulated for seamless chemical terrazzo floors.'
  },
  {
    id: 'red-chemical-chips',
    filename: '09_red_chemical_chips.jpg',
    title: 'Red Chemical Chips (Product 9)',
    subtitle: '09_red_chemical_chips.jpg',
    originalUploadedName: '09_red_chemical_chips.jpg',
    appliesTo: ['Red Chemical Chips (Contact for Quotation)'],
    description: 'Terracotta and marble aggregate chips for decorative chemical-bound terrazzo systems.'
  },
  {
    id: 'powder-chips',
    filename: '10_powder_chips.jpg',
    title: 'Powder Chips (Product 10)',
    subtitle: '10_powder_chips.jpg',
    originalUploadedName: '10_powder_chips.jpg',
    appliesTo: ['Powder Chips (Contact for Quotation)'],
    description: 'Precision-graded micro-stone powder formulation for dense chemical mortar floors.'
  }
];

const STORAGE_KEY = 'clays_stone_photos_v1';

export function getStoredPhotos(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to load custom photos from localStorage', err);
    return {};
  }
}

export function autoMatchUploadedFile(file: File): string | null {
  const name = file.name.toUpperCase();
  if (name.includes('01') || (name.includes('AXUM') && name.includes('BLACK'))) return 'axum-granite-black';
  if (name.includes('02') || (name.includes('WELEGA') && name.includes('WHITE'))) return 'welega-marble-white';
  if (name.includes('03') || (name.includes('WELEGA') && name.includes('GRAY'))) return 'welega-marble-gray';
  if (name.includes('04') || (name.includes('AXUM') && name.includes('WHITE'))) return 'axum-granite-white';
  if (name.includes('05') || name.includes('BABILE')) return 'babile-granite';
  if (name.includes('06') || name.includes('LIMESTONE')) return 'limestone';
  if (name.includes('07') || name.includes('BASALT') || name.includes('BAZALT')) return 'basalt';
  if (name.includes('08') || (name.includes('BLACK') && name.includes('CHIP'))) return 'black-chemical-chips';
  if (name.includes('09') || (name.includes('RED') && name.includes('CHIP'))) return 'red-chemical-chips';
  if (name.includes('10') || name.includes('POWDER')) return 'powder-chips';

  // Fallbacks for generic filenames
  if (name.includes('7588') || name.includes('COMPOSITE')) return 'six-stones-composite';
  if (name.includes('7586')) return 'basalt';
  if (name.includes('7585')) return 'black-chemical-chips';
  if (name.includes('7688')) return 'red-chemical-chips';
  return null;
}

export async function savePhotoLocallyAndOnServer(
  slotId: string,
  base64Data: string,
  filename: string
): Promise<boolean> {
  // 1. Save to localStorage immediately for persistent client-side rendering
  try {
    const current = getStoredPhotos();
    current[slotId] = base64Data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('LocalStorage save failed (quota exceeded or private mode):', err);
  }

  // 2. POST to server endpoint to save to disk in public/images/products/
  try {
    const response = await fetch('/api/save-stone-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, base64Data })
    });
    return response.ok;
  } catch (err) {
    console.log('Server endpoint write skipped (client-mode or offline)', err);
    return true; // Still true since saved to localStorage
  }
}

export function clearStoredPhotos(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error(err);
  }
}
