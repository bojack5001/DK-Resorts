import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Phone, Mail, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Halls', path: '/function-hall' },
    { name: 'The Grand Pavilion', path: '/dining' },
    { name: 'Wonders Pool', path: '/pool' },
    { name: 'Pay Online', path: '/payment' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'My Bookings', path: '/my-bookings' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed w-full z-50 transition-all duration-500 bg-white/95 backdrop-blur-md shadow-sm py-1.5 sm:py-2">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <img
                src="/logo-symbol.png"
                alt="DK STAR RESORTS Symbol"
                className="h-10 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="text-left border-l border-secondary/35 pl-2.5 sm:pl-3.5 py-0.5">
                <span className="block font-heading font-extrabold text-sm sm:text-base md:text-lg text-primary tracking-wider leading-tight group-hover:text-secondary transition-colors">
                  DK STAR RESORTS
                </span>
                <span className="block text-[7.5px] sm:text-[9px] tracking-[0.22em] sm:tracking-[0.25em] font-bold uppercase text-secondary leading-none mt-0.5 sm:mt-1">
                  ROYAL LUXURY COLLECTION
                </span>
              </div>
            </Link>

            {/* Desktop Nav (XL screens >= 1280px) */}
            <div className="hidden xl:flex items-center gap-2.5 2xl:gap-4.5 shrink-0">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative py-1.5 px-1 whitespace-nowrap text-[11px] 2xl:text-[12px] uppercase font-bold tracking-wider 2xl:tracking-widest transition-colors duration-200 shrink-0 inline-flex items-center ${
                      active
                        ? 'text-secondary font-extrabold'
                        : 'text-primary/90 hover:text-secondary'
                    }`}
                  >
                    <span>{link.name}</span>
                    {active && (
                      <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-secondary rounded-full" />
                    )}
                  </Link>
                );
              })}

              <Link
                to="/booking"
                className="ml-1 2xl:ml-2 shrink-0 whitespace-nowrap bg-primary hover:bg-secondary text-white py-2 px-3.5 2xl:px-4 rounded-lg text-[11px] 2xl:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Calendar size={13} className="text-secondary shrink-0" />
                <span>Book Now</span>
              </Link>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <div className="xl:hidden flex items-center gap-3">
              <Link
                to="/booking"
                className="hidden sm:flex md:flex xl:hidden btn-primary py-1.5 px-3.5 text-[11px] items-center gap-1.5"
              >
                <Calendar size={13} />
                <span>Book</span>
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-2.5 rounded-lg border border-gray-200 text-primary hover:border-secondary hover:text-secondary transition-colors focus:outline-none cursor-pointer"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Royal Luxury Mobile & Tablet Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm sm:max-w-md bg-[#FDFBF7] text-[#4A3728] shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#C5A059]/30"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#C5A059]/20 bg-white/90 backdrop-blur-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo-symbol.png" alt="DK Star Resorts" className="h-11 w-auto object-contain" />
                  <div className="border-l border-[#C5A059]/40 pl-3 py-0.5 text-left">
                    <span className="block font-heading font-extrabold text-sm text-[#4A3728] tracking-wider leading-tight">
                      DK STAR RESORTS
                    </span>
                    <span className="block text-[8px] tracking-[0.2em] font-bold text-[#C5A059] uppercase mt-1">
                      ROYAL LUXURY COLLECTION
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-cream hover:bg-[#C5A059]/20 text-[#4A3728] hover:text-[#C5A059] transition-colors cursor-pointer border border-[#C5A059]/20"
                  aria-label="Close Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="px-6 py-4 space-y-1 divide-y divide-[#C5A059]/15">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all group ${
                      isActive(link.path)
                        ? 'text-[#C5A059] pl-3 border-l-4 border-[#C5A059] bg-[#C5A059]/10'
                        : 'text-[#4A3728] hover:text-[#C5A059] hover:bg-[#C5A059]/5 hover:pl-2'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-[#C5A059] transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>

              {/* Drawer Footer & Quick Contact */}
              <div className="p-6 border-t border-[#C5A059]/20 bg-white space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-[#C5A059] text-[10px] uppercase font-bold tracking-widest">
                  <Sparkles size={12} />
                  <span>A Stay Beyond Expectations</span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <a href="tel:+919489455977" className="flex items-center gap-3 hover:text-[#4A3728] transition-colors">
                    <Phone size={14} className="text-[#C5A059]" />
                    <span className="font-semibold">+91 94894 55977</span>
                  </a>
                  <a href="mailto:dkstarresorts@gmail.com" className="flex items-center gap-3 hover:text-[#4A3728] transition-colors">
                    <Mail size={14} className="text-[#C5A059]" />
                    <span className="font-semibold">dkstarresorts@gmail.com</span>
                  </a>
                  <div className="flex items-start gap-3">
                    <MapPin size={14} className="text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight text-gray-500">No 202/2, PONNIYAMMAN Kovil St, Vanjur, Vellore - 632006</span>
                  </div>
                </div>

                <Link
                  to="/booking"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#4A3728] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg shadow-md transition-all active:scale-95"
                >
                  <Calendar size={15} />
                  <span>Reserve Your Stay Now</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
