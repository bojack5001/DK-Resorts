import React from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Utensils, Calendar, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResort } from '../context/ResortContext';

const FunctionHall = () => {
  const { halls } = useResort();

  return (
    <div className="pt-20">
      {/* Hero Header */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <img 
          src="/exquisite_venues_bg.jpg" 
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
            Exquisite Venues
          </motion.h1>
          <p className="text-secondary font-bold uppercase tracking-[0.4em] text-sm">
            Elegant Venues for Timeless Memories
          </p>
        </div>
      </section>

      {/* Halls Listing */}
      <section className="section-container space-y-24">
        {halls.map((hall, idx) => (
          <div 
            key={hall.id}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            {/* Left/Right Text Column */}
            <div className={`space-y-8 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <span className="text-secondary font-semibold uppercase tracking-widest text-xs flex items-center gap-2">
                <Sparkles size={14} /> {hall.type}
              </span>
              <h2 className="text-4xl font-heading font-bold text-primary">{hall.name}</h2>
              <p className="text-gray-600 leading-relaxed">
                {hall.description}
              </p>
              
              <div className="bg-cream p-6 border-l-4 border-secondary space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">Base Rate:</span>
                  <span className="text-xl font-bold text-primary">₹{hall.price.toLocaleString('en-IN')}/Day</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">Capacity:</span>
                  <span className="text-base font-bold text-primary">Up to {hall.capacity} Guests</span>
                </div>
              </div>

              {/* Amenities tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {hall.amenities.map(amenity => (
                  <span 
                    key={amenity}
                    className="bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex gap-4">
                <Link 
                  to={`/booking?type=hall&id=${hall.id}`} 
                  className="btn-primary flex items-center gap-2 group"
                >
                  Book Venue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#enquiry-form" className="btn-outline">Download Details</a>
              </div>
            </div>

            {/* Image Column */}
            <div className={`relative ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="overflow-hidden shadow-2xl relative h-[450px]">
                <img 
                  src={hall.image} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                  alt={hall.name} 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-secondary text-primary font-bold p-6 shadow-lg flex flex-col justify-center items-center">
                <Users size={24} className="mb-2 text-primary" />
                <span className="text-xs uppercase tracking-widest font-bold">Capacity</span>
                <span className="text-lg">{hall.capacity} max</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form" className="bg-cream py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-12 shadow-xl border-t-4 border-secondary">
            <h2 className="text-3xl font-heading font-bold text-center mb-10 text-primary">Plan Your Event</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for your interest! Our event coordinator will call you back within 2 hours.");
            }}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                <input required type="text" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                <input required type="email" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Event Venue</label>
                <select className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 bg-transparent transition-colors">
                  <option value="open-hall">Grand Lawn & Pavilion (Open Hall)</option>
                  <option value="mini-hall">The Oak Room (Mini Hall)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Estimated Guests</label>
                <input required type="number" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors" placeholder="e.g. 200" />
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
