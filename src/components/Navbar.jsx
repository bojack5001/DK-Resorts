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
    { name: 'The Amber Dining', path: '/dining' },
    { name: 'Wonders Pool', path: '/pool' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'My Bookings', path: '/my-bookings' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed w-full z-50 transition-all duration-500 bg-white/95 backdrop-blur-md shadow-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo-v2.png"
                alt="DK STAR RESORTS Logo"
                className="h-11 sm:h-12 md:h-14 w-auto object-contain"
              />
              <div className="hidden sm:block text-left border-l border-secondary/30 pl-3 py-0.5">
                <span className="block text-[9px] tracking-[0.25em] font-extrabold uppercase text-secondary">ROYAL LUXURY</span>
                <span className="block text-[8px] tracking-[0.2em] uppercase text-primary/70 font-semibold">COLLECTION</span>
              </div>
            </Link>

            {/* Desktop Nav (XL screens >= 1280px) */}
            <div className="hidden xl:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[11px] uppercase tracking-widest font-bold transition-colors duration-300 ${
                    isActive(link.path)
                      ? 'text-secondary border-b-2 border-secondary'
                      : 'text-primary hover:text-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <Link to="/booking" className="btn-primary py-2 px-5 text-[11px] flex items-center gap-2">
                <Calendar size={15} />
                Book Now
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
                  <img src="/logo-v2.png" alt="DK Star Resorts" className="h-11 w-auto object-contain" />
                  <div className="border-l border-[#C5A059]/40 pl-3 py-0.5">
                    <span className="block text-[10px] tracking-[0.2em] font-extrabold text-[#C5A059] uppercase">ROYAL LUXURY</span>
                    <span className="block text-[8px] tracking-[0.15em] text-[#4A3728]/80 font-bold uppercase">COLLECTION</span>
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
                  <a href="mailto:destarresorts@gmail.com" className="flex items-center gap-3 hover:text-[#4A3728] transition-colors">
                    <Mail size={14} className="text-[#C5A059]" />
                    <span className="font-semibold">destarresorts@gmail.com</span>
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
