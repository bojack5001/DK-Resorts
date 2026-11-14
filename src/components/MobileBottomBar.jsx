import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Calendar, MapPin } from 'lucide-react';

const MobileBottomBar = () => {
  const location = useLocation();

  // Don't show on admin or reception dashboard
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/reception')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#1A1A1A]/95 backdrop-blur-lg border-t border-[#C5A059]/30 px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Quick Call */}
        <a
          href="tel:+919489455977"
          className="flex-1 flex flex-col items-center justify-center py-1.5 text-gray-300 hover:text-[#C5A059] transition-colors active:scale-95"
          aria-label="Call DK Star Resorts"
        >
          <Phone size={18} className="text-[#C5A059]" />
          <span className="text-[9px] font-bold tracking-wider uppercase mt-1">Call</span>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919489455977?text=Hello%20DK%20Star%20Resorts,%20I%20would%20like%20to%20enquire%20about%20a%20stay"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1.5 text-gray-300 hover:text-green-400 transition-colors active:scale-95"
          aria-label="WhatsApp Enquiry"
        >
          <MessageCircle size={18} className="text-emerald-400" />
          <span className="text-[9px] font-bold tracking-wider uppercase mt-1">WhatsApp</span>
        </a>

        {/* Location Map */}
        <a
          href="https://maps.app.goo.gl/Lu84a8a5iCgT2rEd9?g_st=ac"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1.5 text-gray-300 hover:text-[#C5A059] transition-colors active:scale-95"
          aria-label="Google Maps Location"
        >
          <MapPin size={18} className="text-[#C5A059]" />
          <span className="text-[9px] font-bold tracking-wider uppercase mt-1">Location</span>
        </a>

        {/* Primary Action: Book Now */}
        <Link
          to="/booking"
          className="flex-2 flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#b08e4c] active:scale-95 text-[#4A3728] px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-transform"
        >
          <Calendar size={14} />
          <span>Book Now</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomBar;
