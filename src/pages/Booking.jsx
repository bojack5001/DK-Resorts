import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Mail, Home, MapPin } from 'lucide-react';

const Booking = () => {
  return (
    <div className="pt-20">
      <section className="bg-primary py-20 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">Book Your Stay</h1>
        <p className="text-secondary font-bold uppercase tracking-[0.3em] text-sm">Experience Timeless Luxury</p>
      </section>

      <section className="section-container">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-heading font-bold mb-8 text-primary border-b-2 border-secondary inline-block pb-2">Reservation Details</h2>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Calendar size={14} className="text-secondary" /> Check-In Date
                  </label>
                  <input type="date" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Calendar size={14} className="text-secondary" /> Check-Out Date
                  </label>
                  <input type="date" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Home size={14} className="text-secondary" /> Room Type
                  </label>
                  <select className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors">
                    <option>Luxury Stag Suite</option>
                    <option>Forest View Deluxe</option>
                    <option>Family Heritage Villa</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <User size={14} className="text-secondary" /> Number of Guests
                  </label>
                  <select className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4+ Guests</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6 pt-6">
                <h3 className="text-xl font-heading font-bold text-primary">Guest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                    <input type="text" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                    <input type="tel" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors" placeholder="+91 00000 00000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                  <input type="email" className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors" placeholder="email@example.com" />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full btn-primary py-5 text-base shadow-lg shadow-primary/20">
                  Proceed to Payment
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em]">
                  Secure Booking powered by Razorpay
                </p>
              </div>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary text-white p-8">
              <h3 className="text-xl font-heading font-bold mb-6 text-secondary tracking-widest uppercase">Why Book with Us?</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">✓</span>
                  Best Price Guaranteed
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">✓</span>
                  No Hidden Charges
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">✓</span>
                  Complimentary Breakfast
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">✓</span>
                  Free Airport Transfer
                </li>
              </ul>
            </div>

            <div className="bg-cream p-8 border border-gray-200">
              <h3 className="text-xl font-heading font-bold mb-6 text-primary tracking-widest uppercase">Need Help?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-secondary" size={18} />
                  <span className="text-sm font-semibold">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-secondary" size={18} />
                  <span className="text-sm font-semibold">booking@dkstar.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
