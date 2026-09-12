import { useState, useEffect } from 'react';
import { Menu, X, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/stoneData';

interface NavbarProps {
  onOpenQuote: (stoneId?: string) => void;
  onOpenAdmin: () => void;
  quoteCount?: number;
}

export default function Navbar({ onOpenQuote, onOpenAdmin, quoteCount = 0 }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT', href: '#about' },
    { label: 'COLLECTION', href: '#our-stones' },
    { label: 'APPLICATIONS', href: '#applications' },
    { label: 'HERITAGE', href: '#material-to-masterpiece' },
    { label: 'CALCULATOR', href: '#quotation' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'ADVANTAGE', href: '#why-clays' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Utility Bar for Direct Phone and Showroom Location */}
      <div 
        id="top-utility-bar"
        className="bg-[#EBE9E4] border-b border-[#DDDAD3] text-[11px] tracking-widest text-[#5C5B57] py-1.5 px-4 sm:px-8 flex justify-between items-center z-50 relative"
      >
        <div className="flex items-center gap-4 text-[#5C5B57]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3F403E]"></span>
            {COMPANY_DETAILS.location}
          </span>
          <span className="hidden sm:inline-block text-[#C8C7C3]">|</span>
          <span className="hidden sm:inline-block text-[#706F6A]">
            {COMPANY_DETAILS.tagline}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <a 
            href={COMPANY_DETAILS.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1 text-[#252625] hover:text-[#3F403E] text-[10px] sm:text-[11px] font-medium transition-colors"
          >
            <span className="text-[#706F6A]">Telegram:</span>
            <span className="font-semibold">0960148501</span>
          </a>
          <a 
            href="https://wa.me/251902568301"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[#252625] hover:text-[#3F403E] text-[10px] sm:text-[11px] font-medium transition-colors"
          >
            <span className="text-[#706F6A]">WhatsApp:</span>
            <span className="font-semibold">0902568301</span>
          </a>
          <a 
            href="tel:+251960148501"
            className="flex items-center gap-1 text-[#252625] hover:text-[#3F403E] font-medium transition-colors"
          >
            <Phone className="w-3 h-3 text-[#3F403E]" />
            <span>0960148501</span>
          </a>
          <button
            onClick={onOpenAdmin}
            id="admin-portal-pill-btn"
            title="Admin Portal Architecture Preview"
            className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[#DDDAD3] text-[#252625] hover:bg-[#C8C7C3] border border-[#C8C7C3] transition-colors"
          >
            <ShieldCheck className="w-2.5 h-2.5 text-[#3F403E]" />
            <span>ADMIN PREVIEW</span>
            {quoteCount > 0 && (
              <span className="ml-1 px-1 rounded-full bg-[#252625] text-white font-bold text-[9px]">
                {quoteCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        id="main-navigation"
        className={`fixed top-[29px] left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F4F3F0]/95 backdrop-blur-md shadow-sm py-3 border-b border-[#DDDAD3]'
            : 'bg-[#F4F3F0]/90 backdrop-blur-sm py-4 border-b border-[#E6E5E2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo with CG Architectural Monogram */}
          <a
            href="#home"
            id="brand-logo-link"
            className="flex items-center gap-3 group focus:outline-none"
          >
            {/* Custom Architectural Stone Monogram */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-sm bg-[#252625] border border-[#3F403E] flex items-center justify-center shadow-md group-hover:border-[#171817] transition-colors">
              <span className="font-display text-[#F4F3F0] font-bold text-lg sm:text-xl tracking-tighter">
                CG
              </span>
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#8E8D89]"></div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display tracking-[0.2em] font-bold text-[#252625] text-sm sm:text-base leading-none group-hover:text-[#3F403E] transition-colors">
                  CLAY’S
                </span>
                <span className="text-[#8E8D89] text-xs font-serif font-light">♦</span>
              </div>
              <span className="text-[9px] tracking-[0.22em] text-[#706F6A] font-sans font-semibold uppercase mt-0.5">
                Granite & Marble
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.label}
                id={`nav-link-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleNavClick(link.href)}
                className="text-[12px] tracking-[0.18em] font-semibold text-[#252625] hover:text-[#8E8D89] transition-colors relative py-1 focus:outline-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Primary CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="nav-quote-cta-btn"
              onClick={() => onOpenQuote()}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-widest text-[#F4F3F0] bg-[#252625] hover:bg-[#3F403E] transition-all rounded-sm shadow-md cursor-pointer border border-[#171817]"
            >
              <span>REQUEST A QUOTATION</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#DDDAD3]" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              id="mobile-quote-cta-quick"
              onClick={() => onOpenQuote()}
              className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-white bg-[#252625] rounded-sm"
            >
              QUOTE
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#252625] hover:text-black rounded-sm bg-[#EBE9E4] border border-[#DDDAD3] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Luxury Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu-drawer"
          className="fixed inset-0 z-50 bg-[#F4F3F0]/98 backdrop-blur-xl flex flex-col p-6 pt-16 sm:hidden border-b border-[#DDDAD3]"
        >
          <div className="flex justify-between items-center pb-6 border-b border-[#DDDAD3]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#252625] border border-[#3F403E] flex items-center justify-center">
                <span className="font-display text-white font-bold text-sm">CG</span>
              </div>
              <span className="font-display tracking-widest text-[#252625] text-sm font-bold">
                CLAY’S MANUFACTURING
              </span>
            </div>
            <button
              id="close-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#5C5B57] hover:text-[#252625] rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-4 py-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left font-display text-lg tracking-wider text-[#252625] hover:text-[#8E8D89] py-2 border-b border-[#DDDAD3] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-[#DDDAD3] flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-3 text-center text-xs font-bold tracking-widest text-white bg-[#252625] hover:bg-[#3F403E] rounded-sm"
            >
              REQUEST A QUOTATION
            </button>
            
            <a
              href={`tel:${COMPANY_DETAILS.primaryPhoneClean}`}
              className="w-full py-2.5 text-center text-xs font-semibold tracking-wider text-[#252625] border border-[#C8C7C3] bg-[#EBE9E4] rounded-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#3F403E]" />
              {COMPANY_DETAILS.phones[0]}
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-[11px] text-[#5C5B57] hover:text-[#252625] py-1 text-center"
            >
              Admin Architecture Preview ({quoteCount} Inquiries)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
