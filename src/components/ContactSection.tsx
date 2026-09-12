import { useState, type FormEvent } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  Building2
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/stoneData';

interface ContactSectionProps {
  onRequestQuote: () => void;
}

export default function ContactSection({ onRequestQuote }: ContactSectionProps) {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickContact = (e: FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;
    setSubmitted(true);
  };

  const whatsappDirectUrl = `https://wa.me/${COMPANY_DETAILS.whatsappClean}?text=${encodeURIComponent(
    "Hello Clay's Granite and Marble, I am inquiring about natural stone for an architectural project in Ethiopia."
  )}`;

  return (
    <section 
      id="contact"
      className="py-24 sm:py-32 bg-[#1C1D1C] relative border-t border-[#2F302F] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Strong Final CTA Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#8E8D89]"></span>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#C8C7C3] uppercase">
              COMMENCE YOUR PROJECT
            </span>
            <span className="w-6 h-[1.5px] bg-[#8E8D89]"></span>
          </div>

          <h2 
            id="contact-heading"
            className="text-4xl sm:text-6xl font-serif text-[#F4F3F0] tracking-tight leading-tight mb-4 font-medium"
          >
            “Let’s Build Something Timeless.”
          </h2>

          <p 
            id="contact-subtext"
            className="text-[#C8C7C3] text-base sm:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed"
          >
            Have a project in mind? Tell us what you are building and let Clay’s help you find the right stone.
          </p>

          {/* Key Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
              id="contact-cta-request-quote"
              onClick={onRequestQuote}
              className="px-7 py-3.5 bg-[#F4F3F0] hover:bg-white text-[#252625] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-sm shadow-md hover:shadow-xl transition-all cursor-pointer border border-[#C8C7C3]"
            >
              REQUEST A QUOTATION
            </button>

            <a
              id="contact-cta-whatsapp"
              href="https://wa.me/251902568301"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm tracking-[0.16em] uppercase rounded-sm shadow-md flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WHATSAPP: 0902568301</span>
            </a>

            <a
              id="contact-cta-telegram"
              href={COMPANY_DETAILS.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#229ED9] hover:bg-[#1d8dc2] text-white font-bold text-xs sm:text-sm tracking-[0.16em] uppercase rounded-sm shadow-md flex items-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>TELEGRAM: 0960148501</span>
            </a>

            <a
              id="contact-cta-call"
              href="tel:+251960148501"
              className="px-6 py-3.5 bg-[#252625] hover:bg-[#3F403E] text-[#F4F3F0] font-semibold text-xs sm:text-sm tracking-[0.16em] uppercase border border-[#3F403E] rounded-sm flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-[#DDDAD3]" />
              <span>CALL: 0960148501</span>
            </a>
          </div>
        </div>

        {/* Contact Information & Interactive Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-12">
          
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 bg-[#252625] border border-[#3F403E] rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#C8C7C3] uppercase font-bold block mb-2">
                DIRECT CHANNELS
              </span>
              <h3 className="text-2xl font-serif text-[#F4F3F0] mb-6 font-medium">
                Clay’s Manufacturing Headquarters
              </h3>

              <div className="space-y-5">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-[#171817] border border-[#3F403E] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#DDDAD3]" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#8E8D89] block font-semibold">
                      Manufacturing Yard & Showroom
                    </span>
                    <span className="text-sm text-[#F4F3F0] mt-0.5 block font-serif">
                      {COMPANY_DETAILS.location}
                    </span>
                    <span className="text-xs text-[#8E8D89]">
                      Supplying architectural stone nationwide across Ethiopia
                    </span>
                  </div>
                </div>

                {/* Telegram - Dedicated Channel */}
                <div className="flex items-start gap-4 p-3 rounded-sm bg-[#171817]/70 border border-[#3F403E]">
                  <div className="w-9 h-9 rounded-sm bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4 text-[#229ED9]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#C8C7C3] font-semibold">
                        Telegram
                      </span>
                      <a
                        href={COMPANY_DETAILS.telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase font-bold tracking-wider text-[#229ED9] hover:underline"
                      >
                        OPEN CHAT ↗
                      </a>
                    </div>
                    <a
                      href={COMPANY_DETAILS.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-[#F4F3F0] hover:text-white font-medium block mt-0.5"
                    >
                      0960148501
                    </a>
                  </div>
                </div>

                {/* WhatsApp - Dedicated Channel */}
                <div className="flex items-start gap-4 p-3 rounded-sm bg-[#171817]/70 border border-[#3F403E]">
                  <div className="w-9 h-9 rounded-sm bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#C8C7C3] font-semibold">
                        WhatsApp
                      </span>
                      <a
                        href="https://wa.me/251902568301"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase font-bold tracking-wider text-[#25D366] hover:underline"
                      >
                        OPEN CHAT ↗
                      </a>
                    </div>
                    <a
                      href="https://wa.me/251902568301"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-[#F4F3F0] hover:text-white font-medium block mt-0.5"
                    >
                      0902568301
                    </a>
                  </div>
                </div>

                {/* Phone Numbers - Primary & Secondary */}
                <div className="flex items-start gap-4 p-3 rounded-sm bg-[#171817]/70 border border-[#3F403E]">
                  <div className="w-9 h-9 rounded-sm bg-[#171817] border border-[#3F403E] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#DDDAD3]" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#C8C7C3] block font-semibold mb-1">
                      Telephone / Direct Line
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8E8D89]">Primary Phone:</span>
                        <a
                          href="tel:+251960148501"
                          className="text-sm font-mono text-[#F4F3F0] hover:text-white font-medium transition-colors"
                        >
                          0960148501
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8E8D89]">Secondary Phone:</span>
                        <a
                          href="tel:+251979790909"
                          className="text-sm font-mono text-[#F4F3F0] hover:text-white font-medium transition-colors"
                        >
                          0979790909
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-[#171817] border border-[#3F403E] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#DDDAD3]" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#8E8D89] block font-semibold">
                      Official Inquiries
                    </span>
                    <a
                      href={`mailto:${COMPANY_DETAILS.email}`}
                      className="text-sm font-mono text-[#F4F3F0] hover:text-white transition-colors mt-0.5 block"
                    >
                      {COMPANY_DETAILS.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-[#171817] border border-[#3F403E] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#DDDAD3]" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#8E8D89] block font-semibold">
                      Factory Operating Hours
                    </span>
                    <span className="text-xs text-[#C8C7C3] mt-0.5 block">
                      {COMPANY_DETAILS.workingHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Instant Project Channels */}
            <div className="mt-8 p-4 rounded-sm bg-[#171817] border border-[#3F403E] grid grid-cols-2 gap-2">
              <a
                href="https://wa.me/251902568301"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-white text-center rounded-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span className="text-[11px] font-bold tracking-wider uppercase">WhatsApp</span>
              </a>
              <a
                href={COMPANY_DETAILS.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 text-white text-center rounded-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#229ED9]" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Telegram: 0960148501</span>
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Placeholder & Quick Inquiry */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Google Maps Section Placeholder (Section 15) */}
            <div 
              id="google-maps-placeholder"
              className="relative h-64 sm:h-72 rounded-sm overflow-hidden bg-[#171817] border border-[#3F403E] shadow-lg flex flex-col justify-between p-6"
            >
              {/* Decorative Geometric Road Grid */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#DDDAD3" strokeWidth="2" strokeDasharray="6 6" />
                  <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#8E8D89" strokeWidth="1" />
                  <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#8E8D89" strokeWidth="1" />
                  <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#DDDAD3" strokeWidth="1.5" />
                  <circle cx="70%" cy="40%" r="8" fill="#DDDAD3" />
                  <circle cx="70%" cy="40%" r="20" fill="none" stroke="#DDDAD3" strokeWidth="1" opacity="0.6" />
                </svg>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#252625]/90 border border-[#3F403E] rounded-sm">
                  <Building2 className="w-3.5 h-3.5 text-[#DDDAD3]" />
                  <span className="text-[11px] font-mono text-[#F4F3F0]">
                    Addis Ababa Industrial Zone & Showroom
                  </span>
                </div>
                <span className="text-[10px] text-[#C8C7C3] font-mono bg-[#252625] px-2 py-0.5 rounded border border-[#3F403E]">
                  GPS: 9.01° N, 38.76° E
                </span>
              </div>

              <div className="relative z-10 bg-[#252625]/95 backdrop-blur-md p-4 rounded-sm border border-[#3F403E] max-w-md">
                <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                  Clay’s Granite & Marble Manufacturing Yard
                </h4>
                <p className="text-[11px] text-[#C8C7C3] mt-1">
                  Addis Ababa, Ethiopia. Factory visits and slab selections available by appointment.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href="https://maps.google.com/?q=Addis+Ababa+Ethiopia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-[#DDDAD3] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>OPEN IN GOOGLE MAPS</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick General Inquiry Form */}
            <div className="bg-[#252625] border border-[#3F403E] rounded-sm p-6 sm:p-7 shadow-lg">
              <span className="text-[10px] tracking-[0.25em] text-[#C8C7C3] uppercase font-bold block mb-1">
                EXPRESS INQUIRY
              </span>
              <h4 className="text-lg font-serif text-[#F4F3F0] mb-4 font-medium">
                Send a Message to Our Stonework Specialists
              </h4>

              {submitted ? (
                <div className="p-4 rounded-sm bg-[#171817] border border-[#8E8D89] text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#DDDAD3] mx-auto mb-2" />
                  <p className="text-xs text-[#F4F3F0] font-medium">
                    Thank you! Your inquiry has been dispatched to our sales team in Addis Ababa.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuickContact} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full bg-[#171817] border border-[#3F403E] text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#C8C7C3] transition-colors"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (+251...)"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full bg-[#171817] border border-[#3F403E] text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#C8C7C3] transition-colors"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full bg-[#171817] border border-[#3F403E] text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#C8C7C3] transition-colors"
                  />

                  <textarea
                    rows={2}
                    placeholder="Tell us what you are building..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full bg-[#171817] border border-[#3F403E] text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#C8C7C3] transition-colors"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-white hover:bg-[#F4F3F0] text-[#252625] text-xs font-bold tracking-widest uppercase transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3 h-3 text-[#252625]" />
                    <span>SEND MESSAGE</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
