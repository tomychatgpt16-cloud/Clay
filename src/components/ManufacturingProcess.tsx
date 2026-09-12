import { useState } from 'react';
import { ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PROCESS_STAGES } from '../data/stoneData';

export default function ManufacturingProcess() {
  const [activeStep, setActiveStep] = useState(1);
  const currentStage = PROCESS_STAGES.find(s => s.step === activeStep) || PROCESS_STAGES[0];

  return (
    <section 
      id="manufacturing"
      className="py-24 sm:py-32 bg-marble-light relative border-t border-[#DDDAD3] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#3F403E]"></span>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#3F403E] uppercase">
              MANUFACTURING EXCELLENCE
            </span>
            <span className="w-6 h-[1.5px] bg-[#3F403E]"></span>
          </div>

          <h2 
            id="manufacturing-heading"
            className="text-3xl sm:text-5xl font-serif text-[#252625] tracking-tight leading-tight mb-4 font-medium"
          >
            From Quarry to Architecture
          </h2>

          <p className="text-[#5C5B57] text-sm sm:text-base font-light tracking-wide max-w-xl">
            A seven-stage journey of raw Ethiopian geological majesty translated into refined, millimetre-accurate architectural elements.
          </p>
        </div>

        {/* Horizontal Stepper Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {PROCESS_STAGES.map((stage) => (
            <button
              key={stage.step}
              id={`process-step-tab-${stage.step}`}
              onClick={() => setActiveStep(stage.step)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-sm border whitespace-nowrap transition-all cursor-pointer ${
                activeStep === stage.step
                  ? 'bg-[#252625] border-[#252625] text-white shadow-sm'
                  : 'bg-white border-[#DDDAD3] text-[#5C5B57] hover:text-[#252625] hover:bg-[#EBE9E4]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] font-mono font-bold flex items-center justify-center ${
                activeStep === stage.step ? 'bg-white text-[#252625]' : 'bg-[#DDDAD3] text-[#252625]'
              }`}>
                {stage.step}
              </span>
              <span className="text-xs font-serif tracking-wider font-medium">
                {stage.title}
              </span>
              {stage.step < 7 && <ChevronRight className="w-3.5 h-3.5 text-[#8E8D89] ml-1 shrink-0" />}
            </button>
          ))}
        </div>

        {/* Interactive Active Stage Display Box */}
        <div 
          id="manufacturing-stage-active"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#C8C7C3] rounded-sm overflow-hidden p-6 sm:p-10 shadow-lg"
        >
          {/* Left: Stage Visual */}
          <div className="lg:col-span-6 relative aspect-[16/11] rounded-sm overflow-hidden border border-[#DDDAD3] bg-[#EAE8E3]">
            <img
              src={currentStage.imageUrl}
              alt={`${currentStage.title} - Clay's Granite and Marble Manufacturing`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#252625]/90 backdrop-blur-md rounded-sm border border-[#3F403E] flex items-center justify-between text-white">
              <span className="text-xs font-mono text-[#F4F3F0]">
                STAGE 0{currentStage.step} OF 07
              </span>
              <span className="text-[11px] text-[#C8C7C3]">
                Clay's Workshop & Fabrication Yard
              </span>
            </div>
          </div>

          {/* Right: Stage Detail & Engineering Focus */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#3F403E]"></span>
                <span className="text-[11px] tracking-[0.25em] text-[#3F403E] uppercase font-bold">
                  {currentStage.subtitle}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-serif text-[#252625] tracking-wide mb-4 font-medium">
                0{currentStage.step}. {currentStage.title}
              </h3>

              <p className="text-sm sm:text-base text-[#5C5B57] font-light leading-relaxed mb-6">
                {currentStage.description}
              </p>

              {/* Engineering Focus Box */}
              <div className="p-4 rounded-sm bg-[#F4F3F0] border border-[#DDDAD3] mb-8">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#252625] mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#3F403E]" />
                  <span className="tracking-wider uppercase text-[10px]">CRITICAL TOLERANCE / FOCUS</span>
                </div>
                <p className="text-xs text-[#5C5B57] font-mono">
                  {currentStage.focus}
                </p>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#DDDAD3]">
              <button
                disabled={activeStep === 1}
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm border transition-colors cursor-pointer ${
                  activeStep === 1
                    ? 'opacity-30 cursor-not-allowed border-[#DDDAD3] text-[#8E8D89]'
                    : 'border-[#C8C7C3] text-[#5C5B57] hover:text-[#252625] bg-white hover:bg-[#F4F3F0]'
                }`}
              >
                Previous Stage
              </button>

              <button
                disabled={activeStep === 7}
                onClick={() => setActiveStep(prev => Math.min(7, prev + 1))}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeStep === 7
                    ? 'opacity-30 cursor-not-allowed bg-stone-300 text-stone-500'
                    : 'bg-[#252625] hover:bg-[#3F403E] text-white border border-[#171817] shadow-sm'
                }`}
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
