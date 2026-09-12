import { Phone, MessageSquare, Send, Calculator } from 'lucide-react';

interface MobileQuickBarProps {
  onRequestQuote: () => void;
}

export default function MobileQuickBar({ onRequestQuote }: MobileQuickBarProps) {
  // Pre-filled WhatsApp inquiry for quick contact
  const quickWhatsAppUrl = `https://wa.me/251902568301?text=${encodeURIComponent(
    "Hello Clay’s Granite and Marble Manufacturing, I am interested in inquiring about your natural stone slabs and custom fabrication services."
  )}`;

  // Pre-filled Telegram Share dialog
  const quickTelegramShareUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(
    "CLAY’S GRANITE AND MARBLE MANUFACTURING\n\nI would like to inquire about Ethiopian natural stone quotation and slab availability."
  )}`;

  return (
    <aside 
      id="mobile-quick-contact-bar"
      aria-label="Mobile quick contact actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111211]/95 backdrop-blur-lg border-t border-[#414240] px-2 py-2 shadow-2xl safe-area-inset-bottom"
    >
      <div className="grid grid-cols-4 gap-1.5 max-w-lg mx-auto">
        {/* CALL */}
        <a
          id="mobile-call-btn"
          href="tel:+251960148501"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-sm bg-[#202120] hover:bg-[#414240] text-[#F4F3EF] border border-[#414240] transition-colors"
        >
          <Phone className="w-4 h-4 text-[#D8D6D1] mb-1" />
          <span className="text-[9px] font-mono tracking-wider font-bold uppercase">CALL</span>
        </a>

        {/* WHATSAPP */}
        <a
          id="mobile-whatsapp-btn"
          href={quickWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-sm bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors shadow-sm"
        >
          <MessageSquare className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-mono tracking-wider font-bold uppercase">WHATSAPP</span>
        </a>

        {/* TELEGRAM */}
        <a
          id="mobile-telegram-btn"
          href={quickTelegramShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-sm bg-[#229ED9] text-white hover:bg-[#1d8dc2] transition-colors shadow-sm"
        >
          <Send className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-mono tracking-wider font-bold uppercase">TELEGRAM</span>
        </a>

        {/* REQUEST QUOTE */}
        <button
          id="mobile-quote-btn"
          onClick={onRequestQuote}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-sm bg-[#F4F3EF] text-[#111211] hover:bg-white transition-colors cursor-pointer border border-[#D8D6D1]"
        >
          <Calculator className="w-4 h-4 text-[#111211] mb-1" />
          <span className="text-[9px] font-mono tracking-wider font-bold uppercase whitespace-nowrap">QUOTE</span>
        </button>
      </div>
    </aside>
  );
}
