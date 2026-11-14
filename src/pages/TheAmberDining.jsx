import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Coffee, Star, Clock, ChevronRight, Flame, Leaf, ChefHat, Sparkles, CheckCircle2 } from 'lucide-react';

const MENU_HIGHLIGHTS = [
  { icon: Flame, name: 'Royal Tandoori Specials', desc: 'Authentic clay oven delicacies — succulent kebabs, rotis and tikkas prepared fresh with royal spices.' },
  { icon: Leaf, name: 'Harvest Fresh Salads', desc: 'Farm-fresh organic greens, crisp garden vegetables, and delicate house dressings.' },
  { icon: Coffee, name: 'Artisan Breakfast Spread', desc: 'An elaborate morning feast featuring traditional South Indian tiffins, North Indian favorites, and continental classics.' },
  { icon: UtensilsCrossed, name: 'Multi-Cuisine Feasts', desc: 'Handcrafted delicacies from Indian, regional, and continental culinary traditions.' },
  { icon: Star, name: "Master Chef's Creations", desc: 'Daily rotating signature courses crafted from fresh local produce and authentic recipes.' },
  { icon: Clock, name: 'Poolside Dining Pavilion', desc: 'Dine al fresco beside the Wonders Swimming Pool in a serene open-air, covered setting.' },
];

const TIMINGS = [
  { meal: 'Breakfast Buffet', time: '7:00 AM – 10:30 AM' },
  { meal: 'Royal Lunch', time: '12:30 PM – 3:00 PM' },
  { meal: 'High Tea & Snacks', time: '4:30 PM – 6:30 PM' },
  { meal: 'Gourmet Dinner', time: '7:30 PM – 10:30 PM' },
];

const TheAmberDining = () => {
  const [activeImg, setActiveImg] = useState(0);
  const images = ['/dining1.png', '/dining2.png'];

  return (
    <div className="overflow-hidden bg-cream pt-20">
      {/* ── Hero ── */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={images[activeImg]}
            alt="The Amber Dining at DK Star Resorts"
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-3 backdrop-blur-sm"
          >
            <Sparkles size={14} /> Royal Luxury Dining Experience
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-7xl font-heading font-bold mb-4"
          >
            The Amber Dining
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-200 mb-8 font-heading italic"
          >
            A Royal Feast for the Senses • Overlooking the Wonders Swimming Pool
          </motion.p>
          {/* Image switcher dots */}
          <div className="flex justify-center gap-3 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`View photo ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${activeImg === i ? 'w-8 bg-secondary' : 'w-2.5 bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery Strip ── */}
      <section className="py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 h-72 md:h-96">
          {images.map((src, i) => (
            <div key={i} className="relative overflow-hidden group cursor-pointer" onClick={() => setActiveImg(i)}>
              <img
                src={src}
                alt={`The Amber Dining view ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View {i + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-secondary font-semibold uppercase tracking-widest text-xs flex items-center gap-2">
              <UtensilsCrossed size={14} /> Signature Restaurant
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary leading-tight">
              Culinary Elegance in a Regal Setting
            </h2>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              <strong>The Amber Dining</strong> is DK Star Resorts' signature multi-cuisine dining destination — an exquisite open-air and covered pavilion designed with imported marble flooring, handcrafted rattan lighting, and lush botanical backdrops.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Guests can enjoy gourmet breakfasts, grand banquet luncheons, and intimate starlit dinners right alongside the Wonders Swimming Pool. Every plate is crafted with utmost care, using locally sourced vegetables and authentic spices.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { label: 'Seating Capacity', value: '80+ Covers' },
                { label: 'Cuisine Style', value: 'Multi-Cuisine' },
                { label: 'Setting', value: 'Open-Air & Covered' },
                { label: 'Service Style', value: 'Buffet & À la Carte' },
              ].map(item => (
                <div key={item.label} className="bg-white border border-secondary/20 p-4 rounded-xl shadow-sm">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">{item.label}</p>
                  <p className="font-heading font-semibold text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="/dining1.png"
              alt="The Amber Dining Interior"
              className="w-full h-[480px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-7 rounded-xl shadow-xl hidden md:block border-l-4 border-secondary">
              <p className="text-3xl font-heading font-bold mb-1 text-secondary">4.9</p>
              <div className="flex text-secondary gap-1 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">Guest Dining Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Gourmet Kitchen ── */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-secondary font-semibold uppercase tracking-widest text-xs flex items-center gap-2">
                <ChefHat size={18} /> Dedicated Catering Infrastructure
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold">
                The Gourmet Kitchen
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Operating alongside The Amber Dining, <strong>The Gourmet Kitchen</strong> is our fully-equipped, modern food preparation facility. Designed to cater both daily resident guests and grand wedding receptions at Nakshatra Hall and Moon Hall, our master culinary brigade ensures exceptional quality, uncompromising hygiene, and rich authentic flavours.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 pt-2">
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  <span>State-of-the-Art Commercial Kitchen</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  <span>Grand Banquet & Wedding Catering</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  <span>Custom Event Menu Formulation</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  <span>Strict Food Safety & Fresh Sourcing</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-secondary/30">
              <img
                src="/dining2.png"
                alt="The Gourmet Kitchen & Banquet Arrangement"
                className="w-full h-[360px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Dining Timings ── */}
      <section className="bg-cream py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-secondary font-semibold uppercase tracking-widest text-xs">Restaurant Hours</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-10 text-primary">Dining Timings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TIMINGS.map(t => (
              <div key={t.meal} className="bg-white border border-secondary/20 p-6 rounded-xl shadow-sm hover:border-secondary transition-colors duration-300">
                <Clock size={22} className="text-secondary mx-auto mb-3" />
                <p className="font-heading font-bold text-base text-primary mb-1">{t.meal}</p>
                <p className="text-gray-500 text-xs">{t.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Menu Highlights ── */}
      <section className="section-container bg-white border-t border-gray-100">
        <div className="text-center mb-14 space-y-3">
          <span className="text-secondary font-semibold uppercase tracking-widest text-xs">Culinary Highlights</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">Signature Offerings</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">Prepared with passion by our master chefs for an unforgettable dining experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENU_HIGHLIGHTS.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-cream border border-secondary/10 p-8 rounded-xl hover:border-secondary/40 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                <item.icon size={22} className="text-secondary" />
              </div>
              <h3 className="font-heading font-bold text-primary text-lg mb-2">{item.name}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-container text-center bg-cream">
        <span className="text-secondary font-semibold uppercase tracking-widest text-xs">Plan Your Dining</span>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-2 mb-4">
          Reserve Your Table or Event Catering
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm">
          The Amber Dining welcomes all resort residents and celebration guests. For private events or table reservations, contact us directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="btn-primary flex items-center gap-2 justify-center px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-lg">
            Make an Enquiry <ChevronRight size={16} />
          </Link>
          <Link to="/booking" className="btn-outline flex items-center gap-2 justify-center px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-lg">
            Book a Stay <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TheAmberDining;

