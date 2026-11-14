import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Camera, X, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <img 
                src="/logo-symbol.png" 
                alt="DK STAR RESORTS Emblem" 
                className="h-14 sm:h-16 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-105"
              />
              <div className="border-l border-secondary/40 pl-3.5 py-1 text-left">
                <span className="block font-heading font-extrabold text-xl text-white tracking-wider leading-tight">
                  DK STAR RESORTS
                </span>
                <span className="block text-[9px] tracking-[0.25em] font-bold text-secondary uppercase mt-1">
                  ROYAL LUXURY COLLECTION
                </span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Experience the royal side of relaxation at DK STAR RESORTS. Discover our Prestige Room Collection, grand celebration halls, Wonders Swimming Pool, and The Grand Pavilion.
            </p>
            <p className="text-secondary text-xs uppercase tracking-[0.25em] font-bold">
              A Stay Beyond Expectations
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="hover:text-secondary transition-colors"><Camera size={20} /></a>
              <a href="#" className="hover:text-secondary transition-colors"><X size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-secondary uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/rooms" className="hover:text-white transition-colors">Prestige Rooms</Link></li>
              <li><Link to="/function-hall" className="hover:text-white transition-colors">Nakshatra Hall 1 & 2</Link></li>
              <li><Link to="/dining" className="hover:text-white transition-colors">The Grand Pavilion</Link></li>
              <li><Link to="/pool" className="hover:text-white transition-colors">Wonders Swimming Pool</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Resort Gallery</Link></li>
              <li><Link to="/booking" className="hover:text-white transition-colors">Book a Stay</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-secondary uppercase tracking-widest">Services</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>Wedding Events</li>
              <li>Corporate Meetings</li>
              <li>Poolside Parties</li>
              <li>Luxury Dining</li>
              <li>Airport Transfers</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-secondary uppercase tracking-widest">Contact Info</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <MapPin className="text-secondary shrink-0" size={18} />
                <a
                  href="https://maps.app.goo.gl/Lu84a8a5iCgT2rEd9?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  No 202/2, PONNIYAMMAN, Kovil Street, KOLLAIMEDU VP MAHAL Backside, Vanjur, Vellore - 632006
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-secondary shrink-0" size={18} />
                <a href="tel:+919489455977" className="hover:text-white transition-colors">+91 9489455977</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-secondary shrink-0" size={18} />
                <a href="mailto:dkstarresorts@gmail.com" className="hover:text-white transition-colors">dkstarresorts@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} DK STAR RESORTS. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
