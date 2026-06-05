import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Function Hall', path: '/function-hall' },
    { name: 'Swimming Pool', path: '/pool' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'My Bookings', path: '/my-bookings' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 transition-all duration-500 bg-white/90 backdrop-blur-md shadow-sm py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img
              src="/logo-v2.png"
              alt="DK STAR RESORTS Logo"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
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

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 focus:outline-none text-primary"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 text-sm font-semibold uppercase tracking-widest ${
                    isActive(link.path) ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-2">
                <Link
                  to="/booking"
                  onClick={() => setIsOpen(false)}
                  className="w-full btn-primary flex justify-center items-center gap-2"
                >
                  <Calendar size={18} />
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
