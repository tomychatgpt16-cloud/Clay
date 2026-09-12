import { ArrowUp, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS, STONE_SERVICES } from '../data/stoneData';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenQuote: () => void;
}

export default function Footer({ onOpenAdmin, onOpenQuote }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT', href: '#about' },
    { label: 'OUR STONES', href: '#our-stones' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'SERVICES', href: '#services' },
    { label: 'WHY CLAY’S', href: '#why-clays' },
    { label: 'MANUFACTURING', href: '#manufacturing' },
    { label: 'GALLERY', href: '#gallery' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <footer 
      id="main-footer"
      className="bg-[#171817] text-[#C8C7C3] border-t border-[#2F302F] pt-16 pb-12 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-[#2F302F]">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm bg-[#252625] border border-[#3F403E] flex items-center justify-center">
                <span className="font-display text-[#DDDAD3] font-bold text-lg">CG</span>
              </div>
              <div>
                <span className="font-display tracking-[0.2em] font-bold text-white text-base block">
                  CLAY’S
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#8E8D89] uppercase font-sans">
                  Granite and Marble Manufacturing
                </span>
              </div>
            </div>

            <p className="font-serif italic text-base text-[#DDDAD3] mb-4 font-normal">
              “Build with Stone. Build for Generations.”
            </p>

            <p className="text-xs text-[#8E8D89] font-light leading-relaxed mb-6 max-w-sm">
              Ethiopian natural stone manufacturing specializing in precision granite and marble products for residential, commercial, hospitality, and architectural spaces.
            </p>

              {/* Social Media & Instant Channels */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={COMPANY_DETAILS.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-[11px] font-mono text-[#DDDAD3] bg-[#229ED9]/15 border border-[#229ED9]/40 rounded-sm hover:border-[#229ED9] hover:text-white transition-colors"
              >
                Telegram (0960148501)
              </a>
              <a
                href="https://wa.me/251902568301"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-[11px] font-mono text-[#DDDAD3] bg-[#25D366]/15 border border-[#25D366]/40 rounded-sm hover:border-[#25D366] hover:text-white transition-colors"
              >
                WhatsApp
              </a>
              {['LinkedIn', 'Instagram'].map((platform) => (
                <span
                  key={platform}
                  className="px-2.5 py-1 text-[11px] font-mono text-[#C8C7C3] bg-[#252625] border border-[#3F403E] rounded-sm hover:border-[#8E8D89] hover:text-white cursor-pointer transition-colors"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3">
            <span className="text-[11px] tracking-[0.25em] text-[#C8C7C3] uppercase font-bold block mb-4">
              NAVIGATION
            </span>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#8E8D89] hover:text-[#F4F3F0] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3">
            <span className="text-[11px] tracking-[0.25em] text-[#C8C7C3] uppercase font-bold block mb-4">
              OUR SERVICES
            </span>
            <ul className="space-y-2 text-xs text-[#8E8D89]">
              {STONE_SERVICES.map((s) => (
                <li key={s.id} className="hover:text-[#F4F3F0] transition-colors cursor-pointer" onClick={onOpenQuote}>
                  {s.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-[11px] tracking-[0.25em] text-[#C8C7C3] uppercase font-bold block mb-4">
                CONTACT
              </span>
              <div className="space-y-2.5 text-xs text-[#8E8D89]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#DDDAD3] shrink-0 mt-0.5" />
                  <span>{COMPANY_DETAILS.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#DDDAD3] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <a href="tel:+251960148501" className="hover:text-white transition-colors">
                      0960148501 (Primary)
                    </a>
                    <a href="tel:+251979790909" className="hover:text-white transition-colors">
                      0979790909 (Secondary)
                    </a>
                  </div>
                </div>
                <div className="pt-1 flex flex-col gap-1 text-[11px]">
                  <a href="https://wa.me/251902568301" target="_blank" rel="noopener noreferrer" className="text-[#DDDAD3] hover:text-[#25D366] transition-colors">
                    WhatsApp: 0902568301
                  </a>
                  <a href={COMPANY_DETAILS.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-[#DDDAD3] hover:text-[#229ED9] transition-colors">
                    Telegram: 0960148501
                  </a>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <Mail className="w-3.5 h-3.5 text-[#DDDAD3] shrink-0 mt-0.5" />
                  <a href={`mailto:${COMPANY_DETAILS.email}`} className="break-all hover:text-white transition-colors">
                    {COMPANY_DETAILS.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2F302F]">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-[#706F6A] hover:text-[#DDDAD3] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-[#8E8D89]" />
                <span>Admin Architecture</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#706F6A] gap-4">
          <p>
            © 2026 Clay’s Granite and Marble Manufacturing. All Rights Reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[#8E8D89] hover:text-[#F4F3F0] transition-colors p-2 cursor-pointer"
          >
            <span className="text-[11px] uppercase tracking-wider font-semibold">Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
