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
            <Link to="/" className="inline-block">
              <img 
                src="/logo-v2.png" 
                alt="DK STAR RESORTS Logo" 
                className="h-28 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Experience luxury in the heart of nature. Our resort offers premium rooms, a grand function hall, and a pristine swimming pool for your perfect getaway.
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
              <li><Link to="/rooms" className="hover:text-white transition-colors">Our Rooms</Link></li>
              <li><Link to="/function-hall" className="hover:text-white transition-colors">Function Hall</Link></li>
              <li><Link to="/pool" className="hover:text-white transition-colors">Swimming Pool</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
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
                <span>123 Resort Valley Road, Scenic District, Nature State, 560001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-secondary shrink-0" size={18} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-secondary shrink-0" size={18} />
                <span>contact@dkstarresorts.com</span>
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
