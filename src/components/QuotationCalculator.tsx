import { useState, useId, useRef, useEffect, type FormEvent } from 'react';
import { 
  Calculator, 
  Upload, 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  Phone, 
  Info, 
  X,
  Sparkles,
  Send,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  Check,
  Building
} from 'lucide-react';
import { STONE_PRODUCTS, ALLOWED_FINISH_NAMES, APPLICATION_OPTIONS } from '../data/stoneData';
import { 
  QuotationSubmission, 
  ApplicationItemEntry, 
  AllowedFinish, 
  StairItemConfig, 
  DimensionItemConfig,
  StairTreadThickness,
  StoneType
} from '../types';

interface QuotationCalculatorProps {
  initialStoneId?: string;
  initialApplication?: string;
  onQuoteSubmitted: (quote: QuotationSubmission) => void;
}

// Available finishes strictly matching user instructions
const FINISH_OPTIONS: AllowedFinish[] = ['Polished', 'Non-Polished', 'Mirror Polish', 'Flamed'];

const THICKNESS_OPTIONS = [
  '2 cm (20 mm)',
  '3 cm (30 mm)',
  'Custom Thickness'
];

const EDGE_PROFILES = [
  'Straight Chamfer (Beveled Edge)',
  'Half Bullnose',
  'Full Bullnose',
  'Standard Arris (Softened Edge)',
  'Drip Groove / Drip Edge',
  'Mitered Apron (Custom)'
];

const PROJECT_STAGES = [
  'Planning & Design Phase',
  'Construction Underway',
  'Finishing Stage (Ready for Stone)',
  'Immediate Installation Required',
  'Renovation / Replacement'
];

export default function QuotationCalculator({
  initialStoneId,
  initialApplication,
  onQuoteSubmitted
}: QuotationCalculatorProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stone Selection
  const [productType, setProductType] = useState<StoneType>(() => {
    if (initialStoneId) {
      const match = STONE_PRODUCTS.find(p => p.id === initialStoneId);
      if (match) return match.stoneType;
    }
    return 'Granite';
  });
  const [specificStone, setSpecificStone] = useState<string>(
    initialStoneId || 'axum-granite-black'
  );

  useEffect(() => {
    if (initialStoneId) {
      setSpecificStone(initialStoneId);
      const match = STONE_PRODUCTS.find(p => p.id === initialStoneId);
      if (match) {
        setProductType(match.stoneType);
      }
    }
  }, [initialStoneId]);

  // Application Selection Checklist
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>(['Stair']);
  const [activeTabAppId, setActiveTabAppId] = useState<string>('Stair');

  // Per-application dynamic configurations
  // STAIR
  const [stairTreadLength, setStairTreadLength] = useState<string>('1.20');
  const [stairTreadWidth, setStairTreadWidth] = useState<string>('0.30');
  const [stairStepsCount, setStairStepsCount] = useState<string>('16');
  const [stairTreadThickness, setStairTreadThickness] = useState<StairTreadThickness>('3 cm (30 mm)');
  const [stairRiserRequired, setStairRiserRequired] = useState<boolean>(true);
  const [stairRiserHeight, setStairRiserHeight] = useState<string>('0.16');
  const [stairRiserQuantity, setStairRiserQuantity] = useState<string>('16');
  const [stairRiserThickness, setStairRiserThickness] = useState<string>('2 cm (20 mm)');
  const [stairLandingRequired, setStairLandingRequired] = useState<boolean>(false);
  const [stairLandingLength, setStairLandingLength] = useState<string>('1.20');
  const [stairLandingWidth, setStairLandingWidth] = useState<string>('1.20');
  const [stairEdgeProfile, setStairEdgeProfile] = useState<string>('Straight Chamfer (Beveled Edge)');
  const [stairFinish, setStairFinish] = useState<AllowedFinish>('Polished');

  // WINDOW SILL
  const [sillLength, setSillLength] = useState<string>('1.50');
  const [sillWidth, setSillWidth] = useState<string>('0.25');
  const [sillQuantity, setSillQuantity] = useState<string>('8');
  const [sillThickness, setSillThickness] = useState<string>('2 cm (20 mm)');
  const [sillEdgeProfile, setSillEdgeProfile] = useState<string>('Drip Groove / Drip Edge');
  const [sillFinish, setSillFinish] = useState<AllowedFinish>('Polished');

  // DOOR SILL
  const [doorLength, setDoorLength] = useState<string>('1.00');
  const [doorWidth, setDoorWidth] = useState<string>('0.25');
  const [doorQuantity, setDoorQuantity] = useState<string>('4');
  const [doorThickness, setDoorThickness] = useState<string>('3 cm (30 mm)');
  const [doorEdgeProfile, setDoorEdgeProfile] = useState<string>('Straight Chamfer (Beveled Edge)');
  const [doorFinish, setDoorFinish] = useState<AllowedFinish>('Polished');

  // COPING
  const [copingLength, setCopingLength] = useState<string>('20.0');
  const [copingWidth, setCopingWidth] = useState<string>('0.30');
  const [copingThickness, setCopingThickness] = useState<string>('3 cm (30 mm)');
  const [copingEdgeProfile, setCopingEdgeProfile] = useState<string>('Drip Groove / Drip Edge');
  const [copingFinish, setCopingFinish] = useState<AllowedFinish>('Flamed');

  // COUNTERTOP
  const [counterLength, setCounterLength] = useState<string>('2.80');
  const [counterWidth, setCounterWidth] = useState<string>('0.65');
  const [counterQuantity, setCounterQuantity] = useState<string>('1');
  const [counterThickness, setCounterThickness] = useState<string>('3 cm (30 mm)');
  const [counterEdgeProfile, setCounterEdgeProfile] = useState<string>('Half Bullnose');
  const [counterFinish, setCounterFinish] = useState<AllowedFinish>('Mirror Polish');

  // FLOORING
  const [flooringMode, setFlooringMode] = useState<'area' | 'dimensions'>('area');
  const [flooringDirectArea, setFlooringDirectArea] = useState<string>('45.0');
  const [flooringTileLength, setFlooringTileLength] = useState<string>('0.60');
  const [flooringTileWidth, setFlooringTileWidth] = useState<string>('0.60');
  const [flooringTileQty, setFlooringTileQty] = useState<string>('120');
  const [flooringThickness, setFlooringThickness] = useState<string>('2 cm (20 mm)');
  const [flooringFinish, setFlooringFinish] = useState<AllowedFinish>('Polished');

  // WALL CLADDING
  const [claddingLength, setCladdingLength] = useState<string>('0.60');
  const [claddingHeight, setCladdingHeight] = useState<string>('0.30');
  const [claddingQuantity, setCladdingQuantity] = useState<string>('80');
  const [claddingThickness, setCladdingThickness] = useState<string>('2 cm (20 mm)');
  const [claddingFinish, setCladdingFinish] = useState<AllowedFinish>('Polished');

  // CUSTOM / OTHER
  const [customDescription, setCustomDescription] = useState<string>('');
  const [customEstimatedArea, setCustomEstimatedArea] = useState<string>('5.0');
  const [customEstimatedLinearM, setCustomEstimatedLinearM] = useState<string>('10.0');
  const [customThickness, setCustomThickness] = useState<string>('2 cm (20 mm)');
  const [customFinish, setCustomFinish] = useState<AllowedFinish>('Polished');

  // Customer Contact Details
  const [fullName, setFullName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [projectLocation, setProjectLocation] = useState<string>('Addis Ababa');
  const [projectStage, setProjectStage] = useState<string>('Construction Underway');
  const [projectDescription, setProjectDescription] = useState<string>('');

  // Upload
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

  // Submission Status
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastSubmittedQuote, setLastSubmittedQuote] = useState<QuotationSubmission | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Synchronize initial props
  useEffect(() => {
    if (initialStoneId) {
      const found = STONE_PRODUCTS.find(p => p.id === initialStoneId);
      if (found) {
        setProductType(found.stoneType);
        setSpecificStone(found.id);
      }
    }
  }, [initialStoneId]);

  useEffect(() => {
    if (initialApplication) {
      let matchedApp = initialApplication;
      // map casing variations
      const foundOption = APPLICATION_OPTIONS.find(
        o => o.id.toLowerCase() === initialApplication.toLowerCase() ||
             o.label.toLowerCase() === initialApplication.toLowerCase()
      );
      if (foundOption) {
        matchedApp = foundOption.id;
      }
      setSelectedAppIds(prev => prev.includes(matchedApp) ? prev : [...prev, matchedApp]);
      setActiveTabAppId(matchedApp);
    }
  }, [initialApplication]);

  // Handle Application Checklist Toggles
  const handleToggleApplication = (appId: string) => {
    if (selectedAppIds.includes(appId)) {
      if (selectedAppIds.length === 1) {
        // keep at least one selected
        return;
      }
      const updated = selectedAppIds.filter(id => id !== appId);
      setSelectedAppIds(updated);
      if (activeTabAppId === appId) {
        setActiveTabAppId(updated[0]);
      }
    } else {
      const updated = [...selectedAppIds, appId];
      setSelectedAppIds(updated);
      setActiveTabAppId(appId);
    }
  };

  const handleSelectAllApplications = () => {
    const all = APPLICATION_OPTIONS.map(a => a.id);
    setSelectedAppIds(all);
    if (!all.includes(activeTabAppId)) {
      setActiveTabAppId(all[0]);
    }
  };

  const handleClearToSingle = (appId: string = 'Stair') => {
    setSelectedAppIds([appId]);
    setActiveTabAppId(appId);
  };

  // Build the list of active ApplicationItemEntry objects with calculated metrics
  const buildApplicationEntries = (): ApplicationItemEntry[] => {
    const entries: ApplicationItemEntry[] = [];

    selectedAppIds.forEach(appId => {
      if (appId === 'Stair') {
        const tLen = parseFloat(stairTreadLength) || 0;
        const tWid = parseFloat(stairTreadWidth) || 0;
        const steps = parseInt(stairStepsCount, 10) || 0;
        let treadArea = tLen * tWid * steps;
        let linearM = tLen * steps;

        let riserArea = 0;
        const riserQty = parseInt(stairRiserQuantity, 10) || steps;
        if (stairRiserRequired) {
          const rH = parseFloat(stairRiserHeight) || 0;
          riserArea = tLen * rH * riserQty;
        }

        let landingArea = 0;
        if (stairLandingRequired) {
          const lLen = parseFloat(stairLandingLength) || 0;
          const lWid = parseFloat(stairLandingWidth) || 0;
          landingArea = lLen * lWid;
          linearM += lLen;
        }

        const totalArea = +(treadArea + riserArea + landingArea).toFixed(2);
        const totalLm = +linearM.toFixed(2);

        const config: StairItemConfig = {
          treadLength: tLen,
          treadWidth: tWid,
          quantity: steps,
          treadThickness: stairTreadThickness,
          riserRequired: stairRiserRequired,
          riserHeight: stairRiserRequired ? parseFloat(stairRiserHeight) || 0 : undefined,
          riserQuantity: stairRiserRequired ? riserQty : undefined,
          riserThickness: stairRiserRequired ? stairRiserThickness : undefined,
          landingRequired: stairLandingRequired,
          landingLength: stairLandingRequired ? parseFloat(stairLandingLength) || 0 : undefined,
          landingWidth: stairLandingRequired ? parseFloat(stairLandingWidth) || 0 : undefined,
          edgeProfile: stairEdgeProfile,
          finish: stairFinish
        };

        entries.push({
          id: 'Stair',
          type: 'Stair',
          label: 'Stair',
          finish: stairFinish,
          stairConfig: config,
          calculatedAreaM2: totalArea,
          calculatedLinearM: totalLm,
          detailsSummary: `${steps} Steps (${tLen}m × ${tWid}m, ${stairTreadThickness})${stairRiserRequired ? ` + ${steps} Risers` : ''}${stairLandingRequired ? ' + Landing' : ''}`
        });
      } else if (appId === 'Window Sill') {
        const len = parseFloat(sillLength) || 0;
        const wid = parseFloat(sillWidth) || 0;
        const qty = parseInt(sillQuantity, 10) || 0;
        const area = +(len * wid * qty).toFixed(2);
        const lm = +(len * qty).toFixed(2);

        const config: DimensionItemConfig = {
          length: len,
          width: wid,
          quantity: qty,
          thickness: sillThickness,
          edgeProfile: sillEdgeProfile,
          finish: sillFinish
        };

        entries.push({
          id: 'Window Sill',
          type: 'Window Sill',
          label: 'Window Sill',
          finish: sillFinish,
          dimensionConfig: config,
          calculatedAreaM2: area,
          calculatedLinearM: lm,
          detailsSummary: `${qty} Sills (${len}m × ${wid}m, ${sillThickness}, ${sillEdgeProfile})`
        });
      } else if (appId === 'Door Sill') {
        const len = parseFloat(doorLength) || 0;
        const wid = parseFloat(doorWidth) || 0;
        const qty = parseInt(doorQuantity, 10) || 0;
        const area = +(len * wid * qty).toFixed(2);
        const lm = +(len * qty).toFixed(2);

        const config: DimensionItemConfig = {
          length: len,
          width: wid,
          quantity: qty,
          thickness: doorThickness,
          edgeProfile: doorEdgeProfile,
          finish: doorFinish
        };

        entries.push({
          id: 'Door Sill',
          type: 'Door Sill',
          label: 'Door Sill',
          finish: doorFinish,
          dimensionConfig: config,
          calculatedAreaM2: area,
          calculatedLinearM: lm,
          detailsSummary: `${qty} Sills (${len}m × ${wid}m, ${doorThickness}, ${doorEdgeProfile})`
        });
      } else if (appId === 'Coping') {
        const len = parseFloat(copingLength) || 0;
        const wid = parseFloat(copingWidth) || 0;
        const area = +(len * wid).toFixed(2);
        const lm = +len.toFixed(2);

        entries.push({
          id: 'Coping',
          type: 'Coping',
          label: 'Coping',
          finish: copingFinish,
          copingConfig: {
            width: wid,
            linearMeters: len,
            thickness: copingThickness,
            edgeProfile: copingEdgeProfile,
            finish: copingFinish
          },
          calculatedAreaM2: area,
          calculatedLinearM: lm,
          detailsSummary: `${len} lm Coping (Width: ${wid}m, ${copingThickness}, ${copingEdgeProfile})`
        });
      } else if (appId === 'Countertop') {
        const len = parseFloat(counterLength) || 0;
        const wid = parseFloat(counterWidth) || 0;
        const qty = parseInt(counterQuantity, 10) || 0;
        const area = +(len * wid * qty).toFixed(2);
        const lm = +(len * qty).toFixed(2);

        entries.push({
          id: 'Countertop',
          type: 'Countertop',
          label: 'Countertop',
          finish: counterFinish,
          dimensionConfig: {
            length: len,
            width: wid,
            quantity: qty,
            thickness: counterThickness,
            edgeProfile: counterEdgeProfile,
            finish: counterFinish
          },
          calculatedAreaM2: area,
          calculatedLinearM: lm,
          detailsSummary: `${qty} Countertop Slab(s) (${len}m × ${wid}m, ${counterThickness}, ${counterEdgeProfile})`
        });
      } else if (appId === 'Flooring') {
        let area = 0;
        let summary = '';
        if (flooringMode === 'area') {
          area = +(parseFloat(flooringDirectArea) || 0).toFixed(2);
          summary = `${area} m² Calibrated Paving (${flooringThickness})`;
        } else {
          const tL = parseFloat(flooringTileLength) || 0;
          const tW = parseFloat(flooringTileWidth) || 0;
          const qty = parseInt(flooringTileQty, 10) || 0;
          area = +(tL * tW * qty).toFixed(2);
          summary = `${qty} Tiles (${tL}m × ${tW}m, ${flooringThickness})`;
        }

        entries.push({
          id: 'Flooring',
          type: 'Flooring',
          label: 'Flooring',
          finish: flooringFinish,
          flooringConfig: {
            mode: flooringMode,
            directArea: flooringMode === 'area' ? area : undefined,
            length: flooringMode === 'dimensions' ? parseFloat(flooringTileLength) || 0 : undefined,
            width: flooringMode === 'dimensions' ? parseFloat(flooringTileWidth) || 0 : undefined,
            quantity: flooringMode === 'dimensions' ? parseInt(flooringTileQty, 10) || 0 : undefined,
            thickness: flooringThickness,
            finish: flooringFinish
          },
          calculatedAreaM2: area,
          calculatedLinearM: 0,
          detailsSummary: summary
        });
      } else if (appId === 'Wall Cladding') {
        const len = parseFloat(claddingLength) || 0;
        const ht = parseFloat(claddingHeight) || 0;
        const qty = parseInt(claddingQuantity, 10) || 0;
        const area = +(len * ht * qty).toFixed(2);

        entries.push({
          id: 'Wall Cladding',
          type: 'Wall Cladding',
          label: 'Wall Cladding',
          finish: claddingFinish,
          claddingConfig: {
            length: len,
            height: ht,
            quantity: qty,
            thickness: claddingThickness,
            finish: claddingFinish
          },
          calculatedAreaM2: area,
          calculatedLinearM: +(len * qty).toFixed(2),
          detailsSummary: `${qty} Cladding Panels (${len}m × ${ht}m, ${claddingThickness})`
        });
      } else {
        // Custom / Other
        const estArea = +(parseFloat(customEstimatedArea) || 0).toFixed(2);
        const estLm = +(parseFloat(customEstimatedLinearM) || 0).toFixed(2);

        entries.push({
          id: 'Custom / Other',
          type: 'Custom / Other',
          label: 'Custom / Other',
          finish: customFinish,
          customConfig: {
            description: customDescription || 'Custom architectural stone specification',
            estimatedArea: estArea,
            estimatedLinearM: estLm,
            thickness: customThickness,
            finish: customFinish
          },
          calculatedAreaM2: estArea,
          calculatedLinearM: estLm,
          detailsSummary: customDescription ? `${customDescription} (~${estArea} m²)` : `Custom Item (~${estArea} m²)`
        });
      }
    });

    return entries;
  };

  const applicationEntries = buildApplicationEntries();
  const totalEstimatedAreaM2 = +(applicationEntries.reduce((acc, curr) => acc + curr.calculatedAreaM2, 0)).toFixed(2);
  const totalEstimatedLinearM = +(applicationEntries.reduce((acc, curr) => acc + curr.calculatedLinearM, 0)).toFixed(2);

  // Available stones filtered by selected material type
  const availableStones = STONE_PRODUCTS.filter(p => p.stoneType === productType);
  const selectedStoneObj = STONE_PRODUCTS.find(p => p.id === specificStone);
  const stoneDisplayName = selectedStoneObj ? selectedStoneObj.name : specificStone;
  const stonePricePerM2 = selectedStoneObj?.pricePerM2 || 0;
  const estimatedMaterialCost = Math.round(totalEstimatedAreaM2 * stonePricePerM2);

  const handleFileUpload = (file: File) => {
    const sizeKB = (file.size / 1024).toFixed(1);
    setUploadedFile({
      name: file.name,
      size: `${sizeKB} KB`
    });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = 'Please provide your full name.';
    if (!phoneNumber.trim()) errors.phoneNumber = 'Please provide a valid contact phone number.';
    if (selectedAppIds.length === 0) errors.applications = 'Please select at least one application.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatQuotationMessage = (clientName: string = fullName) => {
    const appLabels = applicationEntries.map(e => e.label).join(', ') || 'Architectural Stone';
    
    // Formatted Dimensions per application
    const dimensionsList = applicationEntries.length > 0
      ? applicationEntries.map(e => `• ${e.label}: ${e.detailsSummary}`).join('\n')
      : 'Standard specifications';

    // Quantity summary
    const quantitySummary = applicationEntries.length > 0
      ? applicationEntries.map(e => {
          if (e.stairConfig) return `Stair: ${e.stairConfig.quantity} steps${e.stairConfig.riserRequired ? ` + ${e.stairConfig.quantity} risers` : ''}${e.stairConfig.landingRequired ? ' + landing' : ''}`;
          if (e.dimensionConfig) return `${e.label}: ${e.dimensionConfig.quantity} pcs`;
          if (e.copingConfig) return `Coping: ${e.copingConfig.linearMeters} lm`;
          if (e.flooringConfig) return `Flooring: ${e.flooringConfig.directArea ? `${e.flooringConfig.directArea} m²` : `${e.flooringConfig.quantity} tiles`}`;
          if (e.claddingConfig) return `Cladding: ${e.claddingConfig.quantity} panels`;
          return `${e.label}: 1 set`;
        }).join(', ')
      : 'Per architectural drawings';

    // Finishes summary
    const finishesSummary = applicationEntries.length > 0
      ? Array.from(new Set(applicationEntries.map(e => `${e.label}: ${e.finish}`))).join(', ')
      : 'Polished';

    // Tread thickness (from stair entry or state)
    const stairEntry = applicationEntries.find(e => e.stairConfig);
    const treadThickness = stairEntry?.stairConfig?.treadThickness 
      || (selectedAppIds.includes('Stair') ? stairTreadThickness : 'N/A (Non-stair elements)');

    return [
      `CLAY’S GRANITE AND MARBLE MANUFACTURING`,
      ``,
      `QUOTATION REQUEST`,
      ``,
      `Customer Name: ${clientName.trim() || 'Prospective Client'}`,
      `Company: ${company.trim() || 'N/A'}`,
      `Phone: ${phoneNumber.trim() || 'Not provided'}`,
      `Project Location: ${projectLocation.trim() || 'Addis Ababa'}`,
      ``,
      `Stone: ${stoneDisplayName} (${productType})`,
      `Application(s): ${appLabels}`,
      `Dimensions:`,
      dimensionsList,
      `Quantity: ${quantitySummary}`,
      `Finish: ${finishesSummary}`,
      `Tread Thickness: ${treadThickness}`,
      `Total Area: ${totalEstimatedAreaM2} m²`,
      `Total Linear Meters: ${totalEstimatedLinearM} lm`,
      `Additional Notes: ${projectDescription.trim() || (projectStage ? `Project Stage: ${projectStage}` : 'Please provide quotation.')}`,
      ``,
      `Please provide us with a quotation.`
    ].join('\n');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedMessage = formatQuotationMessage();

    const newQuote: QuotationSubmission = {
      id: `QUO-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      fullName,
      company: company || undefined,
      phoneNumber,
      email: email || '',
      projectLocation,
      productType,
      specificStone: stoneDisplayName,
      application: applicationEntries.map(e => e.label).join(', '),
      applications: applicationEntries,
      totalAreaM2: totalEstimatedAreaM2,
      totalLinearM: totalEstimatedLinearM,
      calculatedAreaM2: totalEstimatedAreaM2,
      calculatedLinearM: totalEstimatedLinearM,
      preferredFinish: applicationEntries[0]?.finish || 'Polished',
      projectDescription: projectDescription || `Stage: ${projectStage}`,
      attachmentName: uploadedFile?.name,
      status: 'Pending Review',
      formattedMessage
    };

    onQuoteSubmitted(newQuote);
    setLastSubmittedQuote(newQuote);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setLastSubmittedQuote(null);
  };

  // WhatsApp Pre-formatted Message (to 0902568301 with international link format)
  const getWhatsAppUrl = () => {
    const msg = formatQuotationMessage();
    return `https://wa.me/251902568301?text=${encodeURIComponent(msg)}`;
  };

  // Telegram Share URL with complete pre-filled quotation message
  const getTelegramShareUrl = () => {
    const msg = formatQuotationMessage();
    return `https://t.me/share/url?url=&text=${encodeURIComponent(msg)}`;
  };

  return (
    <section 
      id="quotation"
      className="py-20 sm:py-28 bg-[#F4F3F0] relative border-t border-[#DDDAD3] overflow-hidden"
    >
      {/* Ambient background accent */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#DDDAD3]/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Calculator className="w-4 h-4 text-[#3F403E]" />
            <span className="text-xs font-semibold tracking-[0.25em] text-[#3F403E] uppercase">
              ARCHITECTURAL SPECIFICATION
            </span>
          </div>

          <h2 
            id="quotation-heading"
            className="text-3xl sm:text-5xl font-serif text-[#252625] tracking-tight leading-tight mb-4 font-medium"
          >
            Stair, Sill & Stone Quotation Request
          </h2>

          <p className="text-[#5C5B57] text-sm sm:text-base font-light tracking-wide max-w-2xl leading-relaxed">
            Configure single or multiple architectural stone applications simultaneously. Enter your step dimensions, window sills, thresholds, coping, or custom elements to receive an engineering-verified schedule.
          </p>
        </div>

        {/* Submission Confirmation Modal / Overlay */}
        {isSubmitted && lastSubmittedQuote && (
          <div 
            id="quotation-success-overlay"
            className="mb-12 p-8 sm:p-10 rounded-sm bg-white border-2 border-[#252625] shadow-2xl text-center max-w-3xl mx-auto relative animate-fade-in"
          >
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-[#706F6A] hover:text-[#252625] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#F4F3F0] border border-[#3F403E] flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#252625]" />
            </div>

            <span className="text-xs tracking-[0.25em] uppercase text-[#3F403E] font-bold block mb-1">
              QUOTATION REQUEST REGISTERED • {lastSubmittedQuote.id}
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif text-[#252625] mb-3 font-medium">
              Thank You, {lastSubmittedQuote.fullName}.
            </h3>

            <p className="text-sm text-[#5C5B57] font-light max-w-xl mx-auto mb-6 leading-relaxed">
              Your inquiry has been submitted to Clay’s engineering department. You can also send the formatted specification directly via WhatsApp or Telegram for immediate review.
            </p>

            {/* Itemized Summary Box */}
            <div className="bg-[#F4F3F0] border border-[#DDDAD3] rounded-sm p-5 text-left mb-6">
              <div className="flex items-center justify-between border-b border-[#DDDAD3] pb-3 mb-3">
                <div>
                  <span className="text-[10px] tracking-wider text-[#706F6A] uppercase font-bold block">Selected Material</span>
                  <span className="text-sm font-serif font-medium text-[#252625]">{lastSubmittedQuote.specificStone} ({lastSubmittedQuote.productType})</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] tracking-wider text-[#706F6A] uppercase font-bold block">Total Est. Area</span>
                  <span className="text-sm font-mono font-bold text-[#252625]">{lastSubmittedQuote.totalAreaM2} m²</span>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-[#3F403E] block mb-2 uppercase tracking-wider">
                Configured Applications:
              </span>
              <div className="space-y-2 text-xs">
                {lastSubmittedQuote.applications?.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between bg-white p-2.5 rounded-sm border border-[#DDDAD3]">
                    <div>
                      <span className="font-semibold text-[#252625]">{item.label}</span>
                      <span className="text-[#706F6A] block text-[11px] mt-0.5">{item.detailsSummary}</span>
                      <span className="text-[10px] font-mono text-[#3F403E] uppercase mt-0.5 inline-block">Finish: {item.finish}</span>
                    </div>
                    <div className="text-right font-mono text-[#252625] shrink-0 ml-3">
                      <span className="font-bold">{item.calculatedAreaM2} m²</span>
                      {item.calculatedLinearM > 0 && (
                        <span className="text-[10px] text-[#706F6A] block">{item.calculatedLinearM} lm</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {lastSubmittedQuote.projectDescription && (
                <div className="mt-3 pt-3 border-t border-[#DDDAD3] text-xs text-[#5C5B57]">
                  <span className="font-semibold text-[#252625]">Notes: </span>
                  {lastSubmittedQuote.projectDescription}
                </div>
              )}
            </div>

            {/* Direct WhatsApp & Telegram Forwarding */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                id="quote-success-whatsapp-link"
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold tracking-wider uppercase rounded-sm flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>SEND VIA WHATSAPP (0902568301)</span>
              </a>

              <a
                id="quote-success-telegram-link"
                href={getTelegramShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#229ED9] hover:bg-[#1d8dc2] text-white text-xs font-bold tracking-wider uppercase rounded-sm flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>SEND VIA TELEGRAM</span>
              </a>

              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-3 text-xs text-[#706F6A] hover:text-[#252625] underline cursor-pointer"
              >
                Configure Another Quote
              </button>
            </div>

            {/* Telegram & Direct Contact Notice */}
            <div className="mt-4 pt-3 border-t border-[#DDDAD3] text-center space-y-1.5 max-w-xl mx-auto">
              <p className="text-[11px] text-[#5C5B57] leading-relaxed">
                <strong>Telegram Notice:</strong> Clicking opens Telegram's share dialog with your complete quotation pre-filled. Select <strong>Clay’s (Telegram: 0960148501)</strong> and press <em>Send</em> inside Telegram to transmit.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-[#706F6A] font-medium pt-1">
                <span>WhatsApp: <strong className="text-[#252625] font-mono font-bold">0902568301</strong></span>
                <span>•</span>
                <span>Telegram: <strong className="text-[#252625] font-mono font-bold">0960148501</strong></span>
                <span>•</span>
                <span>Phone: <strong className="text-[#252625] font-mono font-bold">0960148501</strong> / <strong className="text-[#252625] font-mono font-bold">0979790909</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Main Quotation Split Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Applications, Measurements & Finishes */}
          <div className="lg:col-span-7 bg-white border border-[#C8C7C3] rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              
              {/* Step 1: Material & Stone Selection */}
              <div className="pb-4 mb-6 border-b border-[#DDDAD3]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#252625]"></span>
                    <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-[#252625]">
                      1. Natural Stone Selection
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#706F6A] font-mono font-medium">STEP 1 OF 3</span>
                </div>
              </div>

              {/* Stone Category & Specific Stone */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-8">
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#3F403E] uppercase mb-2">
                    Stone Family
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Granite', 'Marble', 'Limestone', 'Basalt', 'Stone Chips'] as const).map((type) => (
                      <button
                        type="button"
                        key={type}
                        id={`calc-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => {
                          const targetType = type as StoneType;
                          setProductType(targetType);
                          const firstMatch = STONE_PRODUCTS.find(p => p.stoneType === targetType || (targetType === 'Stone Chips' && (p.stoneType === 'Stone Chips' || p.stoneType === 'Chemical Flooring Material')));
                          if (firstMatch) setSpecificStone(firstMatch.id);
                        }}
                        className={`py-2 px-2.5 rounded-sm text-xs font-bold tracking-wider uppercase transition-all border cursor-pointer text-center ${
                          productType === type || (type === 'Stone Chips' && (productType === 'Stone Chips' || productType === 'Chemical Flooring Material'))
                            ? 'bg-[#252625] text-white border-[#252625] shadow-sm'
                            : 'bg-[#F4F3F0] text-[#5C5B57] hover:text-[#252625] border-[#DDDAD3]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-7">
                  <label className="block text-[11px] font-semibold tracking-wider text-[#3F403E] uppercase mb-2">
                    Selected Stone / Material
                  </label>
                  <select
                    id="calc-stone-select"
                    value={specificStone}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSpecificStone(id);
                      const match = STONE_PRODUCTS.find(p => p.id === id);
                      if (match) setProductType(match.stoneType);
                    }}
                    className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#252625] font-medium"
                  >
                    {STONE_PRODUCTS.map((stone) => (
                      <option key={stone.id} value={stone.id}>
                        {stone.name} — {stone.priceFormatted}
                      </option>
                    ))}
                  </select>

                  {/* Immediate Selected Stone & Current Price Display */}
                  {selectedStoneObj && (
                    <div className="mt-3 p-3 bg-[#F4F3EF] border border-[#D8D6D1] rounded-sm flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-sm overflow-hidden border border-[#B7B6B2] shrink-0 bg-[#202120]">
                          <img 
                            src={selectedStoneObj.imageUrl} 
                            alt={selectedStoneObj.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-mono tracking-widest text-[#858582] block">
                            Selected
                          </span>
                          <span className="text-xs sm:text-sm font-serif font-bold text-[#111211]">
                            {selectedStoneObj.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {selectedStoneObj.pricePerM2 ? (
                          <>
                            <span className="text-base sm:text-lg font-mono font-bold text-[#111211]">
                              {selectedStoneObj.pricePerM2.toLocaleString()}
                            </span>
                            <span className="text-[11px] font-semibold text-[#414240] ml-1">
                              ETB / m²
                            </span>
                          </>
                        ) : (
                          <span className="text-xs sm:text-sm font-serif italic font-medium text-[#111211]">
                            Contact us for pricing
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Multi-Application Selection Checklist */}
              <div className="pb-4 mb-5 border-b border-[#DDDAD3]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#252625]"></span>
                    <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-[#252625]">
                      2. Choose Applications to Quote
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllApplications}
                      className="text-[11px] font-semibold text-[#252625] hover:underline px-2 py-0.5 rounded bg-[#F4F3F0] border border-[#DDDAD3] cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClearToSingle('Stair')}
                      className="text-[11px] font-semibold text-[#706F6A] hover:text-[#252625] px-2 py-0.5 rounded bg-[#F4F3F0] border border-[#DDDAD3] cursor-pointer"
                    >
                      Reset to Stair Only
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-[#706F6A] mt-1">
                  Select one or multiple applications below. Configure dimensions for each selected element:
                </p>
              </div>

              {/* Application Checkbox / Pill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {APPLICATION_OPTIONS.map((app) => {
                  const isChecked = selectedAppIds.includes(app.id);
                  const isActiveTab = activeTabAppId === app.id;
                  return (
                    <button
                      type="button"
                      key={app.id}
                      onClick={() => handleToggleApplication(app.id)}
                      className={`p-2.5 rounded-sm border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-[#252625] text-white border-[#252625] shadow-sm'
                          : 'bg-[#F4F3F0] text-[#5C5B57] hover:text-[#252625] border-[#DDDAD3]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{app.label}</span>
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                          isChecked ? 'bg-white border-white text-[#252625]' : 'border-[#C8C7C3] bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <span className={`text-[10px] leading-tight ${isChecked ? 'text-[#DDDAD3]' : 'text-[#8E8D89]'}`}>
                        {app.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Parameter Forms - Application Tabs */}
              <div className="bg-[#FAF9F7] border border-[#DDDAD3] rounded-sm p-4 sm:p-5 mb-6">
                <div className="flex items-center justify-between border-b border-[#DDDAD3] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#3F403E]" />
                    <span className="text-xs uppercase tracking-wider font-bold text-[#252625]">
                      Configure: {activeTabAppId}
                    </span>
                  </div>
                  {selectedAppIds.length > 1 && (
                    <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-none">
                      <span className="text-[10px] text-[#706F6A] uppercase font-semibold mr-1">Switch:</span>
                      {selectedAppIds.map(id => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setActiveTabAppId(id)}
                          className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-sm border transition-colors cursor-pointer whitespace-nowrap ${
                            activeTabAppId === id
                              ? 'bg-[#252625] text-white border-[#252625]'
                              : 'bg-white text-[#5C5B57] border-[#DDDAD3] hover:text-[#252625]'
                          }`}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* FORM FOR: STAIR */}
                {activeTabAppId === 'Stair' && selectedAppIds.includes('Stair') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Tread Length (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.1"
                          value={stairTreadLength}
                          onChange={(e) => setStairTreadLength(e.target.value)}
                          placeholder="e.g. 1.20"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Tread Width (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.1"
                          value={stairTreadWidth}
                          onChange={(e) => setStairTreadWidth(e.target.value)}
                          placeholder="e.g. 0.30"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Number of Steps (Qty)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={stairStepsCount}
                          onChange={(e) => setStairStepsCount(e.target.value)}
                          placeholder="e.g. 16"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Tread Thickness
                        </label>
                        <select
                          value={stairTreadThickness}
                          onChange={(e) => setStairTreadThickness(e.target.value as StairTreadThickness)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs focus:outline-none focus:border-[#252625]"
                        >
                          <option value="2 cm (20 mm)">2 cm (20 mm)</option>
                          <option value="3 cm (30 mm)">3 cm (30 mm)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Finish for Stair
                        </label>
                        <select
                          value={stairFinish}
                          onChange={(e) => setStairFinish(e.target.value as AllowedFinish)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs focus:outline-none focus:border-[#252625]"
                        >
                          {FINISH_OPTIONS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Edge Profile
                        </label>
                        <select
                          value={stairEdgeProfile}
                          onChange={(e) => setStairEdgeProfile(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs focus:outline-none focus:border-[#252625]"
                        >
                          {EDGE_PROFILES.map(ep => (
                            <option key={ep} value={ep}>{ep}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Riser Specification Toggle */}
                    <div className="p-3 bg-white border border-[#DDDAD3] rounded-sm">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#252625] flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stairRiserRequired}
                            onChange={(e) => setStairRiserRequired(e.target.checked)}
                            className="rounded text-[#252625] focus:ring-0 w-4 h-4 cursor-pointer"
                          />
                          <span>Include Vertical Risers? (Matching {stairStepsCount} steps)</span>
                        </label>
                        <span className="text-[11px] text-[#706F6A]">
                          {stairRiserRequired ? 'Riser included' : 'Open riser style'}
                        </span>
                      </div>

                      {stairRiserRequired && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#F4F3F0]">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-[#706F6A] mb-1">
                              Riser Height (Meters)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={stairRiserHeight}
                              onChange={(e) => setStairRiserHeight(e.target.value)}
                              placeholder="e.g. 0.16"
                              className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-[#706F6A] mb-1">
                              Riser Quantity (Pieces)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={stairRiserQuantity}
                              onChange={(e) => setStairRiserQuantity(e.target.value)}
                              placeholder="e.g. 16"
                              className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-[#706F6A] mb-1">
                              Riser Thickness
                            </label>
                            <select
                              value={stairRiserThickness}
                              onChange={(e) => setStairRiserThickness(e.target.value)}
                              className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-1.5 text-xs"
                            >
                              <option value="2 cm (20 mm)">2 cm (20 mm) — Standard</option>
                              <option value="3 cm (30 mm)">3 cm (30 mm)</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Landing Platform Toggle */}
                    <div className="p-3 bg-white border border-[#DDDAD3] rounded-sm">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#252625] flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stairLandingRequired}
                            onChange={(e) => setStairLandingRequired(e.target.checked)}
                            className="rounded text-[#252625] focus:ring-0 w-4 h-4 cursor-pointer"
                          />
                          <span>Include Intermediate / Top Landing Slab?</span>
                        </label>
                        <span className="text-[11px] text-[#706F6A]">
                          {stairLandingRequired ? 'Landing specified' : 'None'}
                        </span>
                      </div>

                      {stairLandingRequired && (
                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#F4F3F0]">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-[#706F6A] mb-1">
                              Landing Length (Meters)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={stairLandingLength}
                              onChange={(e) => setStairLandingLength(e.target.value)}
                              placeholder="e.g. 1.20"
                              className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-[#706F6A] mb-1">
                              Landing Width (Meters)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={stairLandingWidth}
                              onChange={(e) => setStairLandingWidth(e.target.value)}
                              placeholder="e.g. 1.20"
                              className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-1.5 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* FORM FOR: WINDOW SILL */}
                {activeTabAppId === 'Window Sill' && selectedAppIds.includes('Window Sill') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Sill Length (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={sillLength}
                          onChange={(e) => setSillLength(e.target.value)}
                          placeholder="e.g. 1.50"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Sill Width (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={sillWidth}
                          onChange={(e) => setSillWidth(e.target.value)}
                          placeholder="e.g. 0.25"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Number of Sills (Qty)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={sillQuantity}
                          onChange={(e) => setSillQuantity(e.target.value)}
                          placeholder="e.g. 8"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Thickness
                        </label>
                        <select
                          value={sillThickness}
                          onChange={(e) => setSillThickness(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {THICKNESS_OPTIONS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Finish for Window Sill
                        </label>
                        <select
                          value={sillFinish}
                          onChange={(e) => setSillFinish(e.target.value as AllowedFinish)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {FINISH_OPTIONS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Edge & Drip Detail
                        </label>
                        <select
                          value={sillEdgeProfile}
                          onChange={(e) => setSillEdgeProfile(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {EDGE_PROFILES.map(ep => (
                            <option key={ep} value={ep}>{ep}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM FOR: DOOR SILL */}
                {activeTabAppId === 'Door Sill' && selectedAppIds.includes('Door Sill') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Threshold Length (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={doorLength}
                          onChange={(e) => setDoorLength(e.target.value)}
                          placeholder="e.g. 1.00"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Width (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={doorWidth}
                          onChange={(e) => setDoorWidth(e.target.value)}
                          placeholder="e.g. 0.25"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Quantity of Thresholds
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={doorQuantity}
                          onChange={(e) => setDoorQuantity(e.target.value)}
                          placeholder="e.g. 4"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Thickness
                        </label>
                        <select
                          value={doorThickness}
                          onChange={(e) => setDoorThickness(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {THICKNESS_OPTIONS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Finish for Door Sill
                        </label>
                        <select
                          value={doorFinish}
                          onChange={(e) => setDoorFinish(e.target.value as AllowedFinish)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {FINISH_OPTIONS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Edge Profile
                        </label>
                        <select
                          value={doorEdgeProfile}
                          onChange={(e) => setDoorEdgeProfile(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {EDGE_PROFILES.map(ep => (
                            <option key={ep} value={ep}>{ep}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM FOR: COPING */}
                {activeTabAppId === 'Coping' && selectedAppIds.includes('Coping') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Total Linear Meters (lm)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={copingLength}
                          onChange={(e) => setCopingLength(e.target.value)}
                          placeholder="e.g. 20.0"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Wall / Coping Width (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={copingWidth}
                          onChange={(e) => setCopingWidth(e.target.value)}
                          placeholder="e.g. 0.30"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Thickness
                        </label>
                        <select
                          value={copingThickness}
                          onChange={(e) => setCopingThickness(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {THICKNESS_OPTIONS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Finish for Coping
                        </label>
                        <select
                          value={copingFinish}
                          onChange={(e) => setCopingFinish(e.target.value as AllowedFinish)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {FINISH_OPTIONS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Edge Detail
                        </label>
                        <select
                          value={copingEdgeProfile}
                          onChange={(e) => setCopingEdgeProfile(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {EDGE_PROFILES.map(ep => (
                            <option key={ep} value={ep}>{ep}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM FOR: COUNTERTOP */}
                {activeTabAppId === 'Countertop' && selectedAppIds.includes('Countertop') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Slab Length (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={counterLength}
                          onChange={(e) => setCounterLength(e.target.value)}
                          placeholder="e.g. 2.80"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Width / Depth (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={counterWidth}
                          onChange={(e) => setCounterWidth(e.target.value)}
                          placeholder="e.g. 0.65"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Quantity of Countertops
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={counterQuantity}
                          onChange={(e) => setCounterQuantity(e.target.value)}
                          placeholder="e.g. 1"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Thickness
                        </label>
                        <select
                          value={counterThickness}
                          onChange={(e) => setCounterThickness(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {THICKNESS_OPTIONS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Finish for Countertop
                        </label>
                        <select
                          value={counterFinish}
                          onChange={(e) => setCounterFinish(e.target.value as AllowedFinish)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {FINISH_OPTIONS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Edge Profile
                        </label>
                        <select
                          value={counterEdgeProfile}
                          onChange={(e) => setCounterEdgeProfile(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {EDGE_PROFILES.map(ep => (
                            <option key={ep} value={ep}>{ep}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM FOR: FLOORING */}
                {activeTabAppId === 'Flooring' && selectedAppIds.includes('Flooring') && (
                  <div className="space-y-4">
                    <div className="flex gap-3 mb-2">
                      <button
                        type="button"
                        onClick={() => setFlooringMode('area')}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer ${
                          flooringMode === 'area'
                            ? 'bg-[#252625] text-white border-[#252625]'
                            : 'bg-white text-[#5C5B57] border-[#DDDAD3]'
                        }`}
                      >
                        Total Floor Area (m²)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlooringMode('dimensions')}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer ${
                          flooringMode === 'dimensions'
                            ? 'bg-[#252625] text-white border-[#252625]'
                            : 'bg-white text-[#5C5B57] border-[#DDDAD3]'
                        }`}
                      >
                        Tile Dimension & Count
                      </button>
                    </div>

                    {flooringMode === 'area' ? (
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Total Floor Area (m²)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={flooringDirectArea}
                          onChange={(e) => setFlooringDirectArea(e.target.value)}
                          placeholder="e.g. 45.0"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-[#706F6A] mb-1">
                            Tile Length (m)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={flooringTileLength}
                            onChange={(e) => setFlooringTileLength(e.target.value)}
                            className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-[#706F6A] mb-1">
                            Tile Width (m)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={flooringTileWidth}
                            onChange={(e) => setFlooringTileWidth(e.target.value)}
                            className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-[#706F6A] mb-1">
                            Number of Tiles
                          </label>
                          <input
                            type="number"
                            value={flooringTileQty}
                            onChange={(e) => setFlooringTileQty(e.target.value)}
                            className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-1.5 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Thickness
                        </label>
                        <select
                          value={flooringThickness}
                          onChange={(e) => setFlooringThickness(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {THICKNESS_OPTIONS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Finish for Flooring
                        </label>
                        <select
                          value={flooringFinish}
                          onChange={(e) => setFlooringFinish(e.target.value as AllowedFinish)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {FINISH_OPTIONS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM FOR: WALL CLADDING */}
                {activeTabAppId === 'Wall Cladding' && selectedAppIds.includes('Wall Cladding') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Panel Length (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={claddingLength}
                          onChange={(e) => setCladdingLength(e.target.value)}
                          placeholder="e.g. 0.60"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Panel Height (Meters)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={claddingHeight}
                          onChange={(e) => setCladdingHeight(e.target.value)}
                          placeholder="e.g. 0.30"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Panel Quantity (Qty)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={claddingQuantity}
                          onChange={(e) => setCladdingQuantity(e.target.value)}
                          placeholder="e.g. 80"
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Thickness
                        </label>
                        <select
                          value={claddingThickness}
                          onChange={(e) => setCladdingThickness(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          <option value="2 cm (20 mm)">2 cm (20 mm) — Cladding standard</option>
                          <option value="3 cm (30 mm)">3 cm (30 mm)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Finish for Wall Cladding
                        </label>
                        <select
                          value={claddingFinish}
                          onChange={(e) => setCladdingFinish(e.target.value as AllowedFinish)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {FINISH_OPTIONS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM FOR: CUSTOM / OTHER */}
                {activeTabAppId === 'Custom / Other' && selectedAppIds.includes('Custom / Other') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                        Description of Architectural Stone Item
                      </label>
                      <input
                        type="text"
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="e.g. Pool surround coping, fireplace mantel, architectural architraves..."
                        className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Estimated Area (m²)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={customEstimatedArea}
                          onChange={(e) => setCustomEstimatedArea(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Estimated Linear M (lm)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={customEstimatedLinearM}
                          onChange={(e) => setCustomEstimatedLinearM(e.target.value)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3F403E] uppercase mb-1">
                          Finish for Custom Item
                        </label>
                        <select
                          value={customFinish}
                          onChange={(e) => setCustomFinish(e.target.value as AllowedFinish)}
                          className="w-full bg-white border border-[#C8C7C3] text-[#252625] rounded-sm px-2.5 py-2 text-xs"
                        >
                          {FINISH_OPTIONS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Drawing / Architectural Plan Upload */}
              <div className="mb-2">
                <label className="block text-xs font-semibold tracking-wider text-[#3F403E] uppercase mb-2">
                  Upload Site Drawing, Blueprint or Photo (Optional)
                </label>
                
                <input
                  type="file"
                  id={fileInputId}
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.dwg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-[#C8C7C3] hover:border-[#252625] rounded-sm p-4 text-center cursor-pointer transition-colors bg-[#FAF9F7]"
                >
                  <Upload className="w-5 h-5 text-[#706F6A] mx-auto mb-1.5" />
                  <span className="text-xs text-[#252625] font-medium block">
                    {uploadedFile ? uploadedFile.name : 'Click to select project drawings, PDF schedules, or photos'}
                  </span>
                  <span className="text-[10px] text-[#8E8D89] block mt-0.5">
                    {uploadedFile ? `${uploadedFile.size} uploaded` : 'Supported: PDF, DWG, PNG, JPG up to 25MB'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Customer Details, Aggregated Metrics & Action Buttons */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Aggregated Real-Time Calculation & Specification Box */}
            <div className="bg-[#252625] border border-[#3F403E] rounded-sm p-6 text-[#F4F3F0] shadow-lg">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#3F403E]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#C8C7C3]">
                    ESTIMATED QUANTITIES
                  </span>
                </div>
                <span className="text-[10px] text-[#8E8D89] font-mono">
                  {applicationEntries.length} APPLICATION{applicationEntries.length > 1 ? 'S' : ''}
                </span>
              </div>

              {/* Total Estimated Area & Linear Meters */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-sm bg-[#171817] border border-[#3F403E]">
                  <span className="text-[10px] tracking-wider text-[#8E8D89] uppercase font-semibold block mb-0.5">
                    Total Estimated Area
                  </span>
                  <span className="text-2xl font-mono font-bold text-white tracking-tight">
                    {totalEstimatedAreaM2}
                  </span>
                  <span className="text-xs font-mono text-[#DDDAD3] ml-1">m²</span>
                </div>

                <div className="p-3 rounded-sm bg-[#171817] border border-[#3F403E]">
                  <span className="text-[10px] tracking-wider text-[#8E8D89] uppercase font-semibold block mb-0.5">
                    Total Linear Length
                  </span>
                  <span className="text-2xl font-mono font-bold text-white tracking-tight">
                    {totalEstimatedLinearM}
                  </span>
                  <span className="text-xs font-mono text-[#DDDAD3] ml-1">lm</span>
                </div>
              </div>

              {/* ESTIMATED MATERIAL COST (Area × Product Price ETB) */}
              <div className="p-3.5 mb-3 rounded-sm bg-[#171817] border border-[#414240] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#B7B6B2] block">
                    {stonePricePerM2 > 0 ? 'Estimated Material Cost' : 'Pricing Schedule'}
                  </span>
                  <span className="text-[11px] text-[#858582]">
                    {stonePricePerM2 > 0 
                      ? `${totalEstimatedAreaM2} m² × ${stonePricePerM2.toLocaleString()} ETB/m²`
                      : 'Specialized Architectural Quotation'}
                  </span>
                </div>
                {stonePricePerM2 > 0 ? (
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-[#F4F3EF] tracking-tight">
                      {estimatedMaterialCost.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-[#D8D6D1] ml-1.5">
                      ETB
                    </span>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-sm font-serif italic text-[#F4F3EF] tracking-wide font-medium">
                      Contact us for pricing
                    </span>
                  </div>
                )}
              </div>

              {/* Mandatory Official Quotation Disclaimer */}
              <p className="text-[11px] text-[#858582] italic leading-relaxed mb-4 px-1">
                Final quotation may vary depending on dimensions, thickness, finish, fabrication, installation, delivery, and project requirements.
              </p>

              {/* Itemized Specification Breakdown */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] uppercase tracking-wider text-[#C8C7C3] font-bold block">
                  Configured Items:
                </span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {applicationEntries.map((entry, idx) => (
                    <div key={idx} className="p-2.5 rounded-sm bg-[#1C1D1C] border border-[#3F403E] text-xs flex items-center justify-between">
                      <div className="pr-2">
                        <span className="font-semibold text-white block">{entry.label}</span>
                        <span className="text-[11px] text-[#8E8D89] line-clamp-1">{entry.detailsSummary}</span>
                        <span className="text-[10px] text-[#DDDAD3] font-mono">Finish: {entry.finish}</span>
                      </div>
                      <div className="text-right shrink-0 font-mono">
                        <span className="font-bold text-[#DDDAD3] block">{entry.calculatedAreaM2} m²</span>
                        {entry.calculatedLinearM > 0 && (
                          <span className="text-[10px] text-[#8E8D89]">{entry.calculatedLinearM} lm</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Policy Disclaimer (Strictly adhering to instructions) */}
              <div className="p-3.5 rounded-sm bg-[#171817] border border-[#3F403E] text-[11px] text-[#C8C7C3] flex items-start gap-2.5 leading-relaxed">
                <Info className="w-4 h-4 text-[#DDDAD3] shrink-0 mt-0.5" />
                <p>
                  Estimated price — final quotation may vary depending on specifications, finish, thickness, fabrication, delivery, and installation.
                </p>
              </div>
            </div>

            {/* Customer Contact & Project Details */}
            <div className="bg-white border border-[#C8C7C3] rounded-sm p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#DDDAD3]">
                <span className="w-2 h-2 rounded-full bg-[#252625]"></span>
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-[#252625]">
                  3. Contact & Delivery Location
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#706F6A] font-semibold mb-1">
                    Full Name / Contact Person *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abebe Kebede"
                    className={`w-full bg-[#FAF9F7] border ${
                      formErrors.fullName ? 'border-red-500' : 'border-[#C8C7C3]'
                    } text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]`}
                  />
                  {formErrors.fullName && (
                    <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.fullName}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#706F6A] font-semibold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 0911 234 567"
                      className={`w-full bg-[#FAF9F7] border ${
                        formErrors.phoneNumber ? 'border-red-500' : 'border-[#C8C7C3]'
                      } text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]`}
                    />
                    <span className="text-[9px] text-[#8E8D89] mt-0.5 block">WhatsApp / Telegram preferred</span>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#706F6A] font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#706F6A] font-semibold mb-1">
                      Company / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Construction"
                      className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#706F6A] font-semibold mb-1">
                      Project Location (City / Sub-city)
                    </label>
                    <input
                      type="text"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      placeholder="e.g. Bole, Addis Ababa"
                      className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#706F6A] font-semibold mb-1">
                    Project Stage
                  </label>
                  <select
                    value={projectStage}
                    onChange={(e) => setProjectStage(e.target.value)}
                    className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]"
                  >
                    {PROJECT_STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#706F6A] font-semibold mb-1">
                    Special Instructions / Edge Notes
                  </label>
                  <textarea
                    rows={2}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Specific chamfer notes, stair riser bullnose details, or installation timeline..."
                    className="w-full bg-[#FAF9F7] border border-[#C8C7C3] text-[#252625] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#252625]"
                  />
                </div>

                {/* Primary Action: Submit Formal Quote */}
                <button
                  type="submit"
                  id="calc-submit-btn"
                  className="w-full py-4 bg-[#252625] hover:bg-[#3F403E] text-white font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-sm transition-all shadow-md cursor-pointer border border-[#252625]"
                >
                  SUBMIT QUOTATION REQUEST
                </button>

                {/* Instant Messaging Channels */}
                <div className="pt-2 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      id="calc-whatsapp-direct"
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold tracking-wider uppercase rounded-sm flex items-center justify-center gap-2 transition-colors text-center shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>SEND VIA WHATSAPP (0902568301)</span>
                    </a>

                    <a
                      id="calc-telegram-direct"
                      href={getTelegramShareUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 bg-[#229ED9] hover:bg-[#1d8dc2] text-white text-[11px] font-bold tracking-wider uppercase rounded-sm flex items-center justify-center gap-2 transition-colors text-center shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SEND VIA TELEGRAM</span>
                    </a>
                  </div>

                  <p className="text-[10px] text-[#706F6A] text-center leading-tight">
                    Telegram share opens with your quotation pre-filled. Select <strong>Clay’s (Telegram: 0960148501)</strong> and press Send.
                  </p>

                  <div className="pt-2 border-t border-[#DDDAD3] flex flex-wrap items-center justify-between text-[11px] text-[#706F6A]">
                    <span>WhatsApp: <strong className="text-[#252625] font-mono">0902568301</strong></span>
                    <span>Telegram: <strong className="text-[#252625] font-mono">0960148501</strong></span>
                    <span>Phone: <strong className="text-[#252625] font-mono">0960148501</strong> / <strong className="text-[#252625] font-mono">0979790909</strong></span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </form>

      </div>
    </section>
  );
}
