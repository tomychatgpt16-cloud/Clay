import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  Layers, 
  AlertCircle, 
  Trash2,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { 
  OFFICIAL_PHOTO_SLOTS, 
  getStoredPhotos, 
  savePhotoLocallyAndOnServer, 
  clearStoredPhotos, 
  autoMatchUploadedFile 
} from '../utils/photoManager';

interface PhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosUpdated: () => void;
}

export default function PhotoUploaderModal({
  isOpen,
  onClose,
  onPhotosUpdated,
}: PhotoUploaderModalProps) {
  const [storedPhotos, setStoredPhotos] = useState<Record<string, string>>(() => getStoredPhotos());
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [activeSlotUpload, setActiveSlotUpload] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[]) => {
    let matchedCount = 0;
    setStatusMessage({ text: 'Processing photographs...', type: 'info' });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if uploaded for a specific target slot, or auto-match
      const slotId = activeSlotUpload || autoMatchUploadedFile(file);
      
      if (slotId) {
        const slotDef = OFFICIAL_PHOTO_SLOTS.find(s => s.id === slotId);
        if (slotDef) {
          try {
            const base64 = await readFileAsBase64(file);
            await savePhotoLocallyAndOnServer(slotId, base64, slotDef.filename);
            matchedCount++;
          } catch (err) {
            console.error('Error reading file:', file.name, err);
          }
        }
      }
    }

    // Refresh state
    const updated = getStoredPhotos();
    setStoredPhotos(updated);
    setActiveSlotUpload(null);
    onPhotosUpdated();

    if (matchedCount > 0) {
      setStatusMessage({
        text: `Successfully integrated ${matchedCount} official product photograph${matchedCount > 1 ? 's' : ''}!`,
        type: 'success',
      });
    } else {
      setStatusMessage({
        text: 'File could not be automatically matched. Please select a specific photo slot below.',
        type: 'error',
      });
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerSlotUpload = (slotId: string) => {
    setActiveSlotUpload(slotId);
    fileInputRef.current?.click();
  };

  const handleSlotFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (confirm('Reset custom photos to default factory slots?')) {
      clearStoredPhotos();
      setStoredPhotos({});
      onPhotosUpdated();
      setStatusMessage({ text: 'Reset to default photograph slots.', type: 'info' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#111211]/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#F4F3EF] border border-[#D8D6D1] rounded-sm shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Inputs */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleSlotFileInputChange} 
          accept="image/jpeg,image/png,image/jpg" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={batchFileInputRef} 
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }} 
          multiple 
          accept="image/jpeg,image/png,image/jpg" 
          className="hidden" 
        />

        {/* Header */}
        <div className="px-6 py-5 bg-[#181918] text-[#F4F3EF] flex items-center justify-between border-b border-[#303130]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#242524] border border-[#414240] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#D8D6D1]" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#F4F3EF] tracking-tight">
                Official Company Photographs Manager
              </h3>
              <p className="text-xs text-[#B7B6B2] font-mono">
                Integrate real factory photos directly into all 10 product cards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#B7B6B2] hover:text-[#F4F3EF] hover:bg-[#252625] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3.5 rounded-sm text-xs font-sans flex items-center gap-2.5 border ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-950/20 text-emerald-900 border-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/20 text-rose-900 border-rose-300'
                : 'bg-[#E2E0D8] text-[#242524] border-[#B7B6B2]'
            }`}>
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Master Drag and Drop Batch Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => batchFileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-sm p-8 text-center transition-all duration-200 cursor-pointer ${
              isDraggingOver 
                ? 'border-[#111211] bg-[#E2E0D8]/80 scale-[0.99]' 
                : 'border-[#B7B6B2] hover:border-[#111211] bg-[#EBE9E4]/60 hover:bg-[#EBE9E4]'
            }`}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-[#D8D6D1] flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-[#181918]" />
            </div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#181918] mb-1">
              Drag &amp; Drop Your 5 Company Photographs Here
            </h4>
            <p className="text-xs text-[#5C5B57] max-w-lg mx-auto mb-3 leading-relaxed">
              Accepts <strong className="text-[#181918]">IMG_7588.jpeg</strong> (6-stone composite sheet), <strong className="text-[#181918]">IMG_7586.jpeg</strong> (Basalt), <strong className="text-[#181918]">IMG_7585.png</strong> (Chemical Corridor), <strong className="text-[#181918]">IMG_7688.jpeg</strong> and <strong className="text-[#181918]">IMG_7687.jpeg</strong> (Red Chemical Chips).
            </p>
            <span className="inline-block px-4 py-2 bg-[#181918] text-[#F4F3EF] text-xs font-mono uppercase tracking-wider rounded-sm shadow-sm hover:bg-[#242524] transition-colors">
              Browse Files On Device
            </span>
          </div>

          {/* Individual Slot Cards (5 Official Uploads) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#414240] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#181918]" />
                Official Factory Photo Slots ({OFFICIAL_PHOTO_SLOTS.length})
              </h4>

              {Object.keys(storedPhotos).length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-mono text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Custom Photos
                </button>
              )}
            </div>

            <div className="space-y-3.5">
              {OFFICIAL_PHOTO_SLOTS.map((slot) => {
                const isLoaded = Boolean(storedPhotos[slot.id]);
                const loadedData = storedPhotos[slot.id];

                return (
                  <div
                    key={slot.id}
                    className="p-4 rounded-sm bg-white border border-[#D8D6D1] hover:border-[#858582] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Left details */}
                    <div className="flex items-start gap-3.5 max-w-xl">
                      {/* Thumbnail or Placeholder */}
                      <div className="w-16 h-16 rounded-sm bg-[#202120] border border-[#D8D6D1] shrink-0 overflow-hidden relative flex items-center justify-center">
                        {isLoaded ? (
                          <img 
                            src={loadedData} 
                            alt={slot.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-[#5C5B57]" />
                        )}
                        {isLoaded && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-serif text-sm font-semibold text-[#181918]">
                            {slot.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-sm bg-[#EBE9E4] text-[#414240] text-[10px] font-mono">
                            {slot.originalUploadedName}
                          </span>
                        </div>
                        <p className="text-xs text-[#5C5B57] leading-relaxed mb-1.5">
                          {slot.description}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-[#414240]">
                          <span className="text-[#858582]">Supplies:</span>
                          {slot.appliesTo.map((target, idx) => (
                            <span 
                              key={idx} 
                              className="px-1.5 py-0.5 bg-[#F4F3EF] border border-[#D8D6D1] rounded-sm text-[#181918]"
                            >
                              {target}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="shrink-0 w-full md:w-auto flex md:flex-col items-center gap-2">
                      <button
                        onClick={() => triggerSlotUpload(slot.id)}
                        className={`w-full md:w-auto px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isLoaded
                            ? 'bg-[#EBE9E4] text-[#181918] hover:bg-[#D8D6D1] border border-[#B7B6B2]'
                            : 'bg-[#181918] text-[#F4F3EF] hover:bg-[#242524] shadow-sm'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isLoaded ? 'Replace Photo' : 'Select Photo'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#EBE9E4] border-t border-[#D8D6D1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#5C5B57]">
          <span>
            Photos are saved locally and served directly to the showroom collection.
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#181918] text-[#F4F3EF] font-semibold text-xs tracking-wider uppercase rounded-sm hover:bg-[#242524] transition-colors cursor-pointer shadow-sm"
          >
            Done &amp; View Showroom
          </button>
        </div>
      </div>
    </div>
  );
}
