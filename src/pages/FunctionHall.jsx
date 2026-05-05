import React from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Utensils, Camera, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FunctionHall = () => {
  return (
    <div className="pt-20">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Function Hall" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-heading font-bold mb-6"
          >
            Grand Celebrations
          </motion.h1>
          <p className="text-secondary font-bold uppercase tracking-[0.4em] text-sm">
            Elegant Venues for Timeless Memories
          </p>
        </div>
      </section>

      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-heading font-bold text-primary">The Imperial Ballroom</h2>
            <p className="text-gray-600 leading-relaxed">
              Our grand function hall is designed to host the most prestigious events. From fairytale weddings to high-profile corporate galas, we provide a sophisticated backdrop with state-of-the-art facilities.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-secondary/10 p-3 text-secondary"><Users size={24} /></div>
                <div>
                  <h4 className="font-bold text-primary">Large Capacity</h4>
                  <p className="text-sm text-gray-500">Host up to 1,000 guests comfortably.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-secondary/10 p-3 text-secondary"><Utensils size={24} /></div>
                <div>
                  <h4 className="font-bold text-primary">Premium Catering</h4>
                  <p className="text-sm text-gray-500">Customizable multi-cuisine menus.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-secondary/10 p-3 text-secondary"><Music size={24} /></div>
                <div>
                  <h4 className="font-bold text-primary">AV & Lighting</h4>
                  <p className="text-sm text-gray-500">Integrated professional sound and light systems.</p>
                </div>
              </div>
            </div>
            <button className="btn-primary mt-4">Download Brochure</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-80 object-cover" alt="Event" />
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-80 object-cover mt-12" alt="Event" />
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="bg-cream py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-12 shadow-xl border-t-4 border-secondary">
            <h2 className="text-3xl font-heading font-bold text-center mb-10 text-primary">Plan Your Event</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                <input type="text" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                <input type="email" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Event Type</label>
                <select className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 bg-transparent transition-colors">
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Estimated Guests</label>
                <input type="number" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors" placeholder="e.g. 200" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                <textarea className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors h-24" placeholder="Tell us more about your event..."></textarea>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full btn-primary py-4">Send Enquiry</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FunctionHall;
