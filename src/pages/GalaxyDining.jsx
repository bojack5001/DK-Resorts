import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Coffee, Star, Clock, ChevronRight, Flame, Leaf, Users } from 'lucide-react';

const MENU_HIGHLIGHTS = [
  { icon: Flame, name: 'Tandoori Specials', desc: 'Authentic clay oven delicacies — succulent kebabs, naans and tikkas prepared fresh to order.' },
  { icon: Leaf, name: 'Garden Fresh Salads', desc: 'Farm-to-table greens, seasonal vegetables and house-made dressings for a light, refreshing start.' },
  { icon: Coffee, name: 'Breakfast Buffet', desc: 'An elaborate spread of South Indian, North Indian and continental breakfast favourites every morning.' },
  { icon: UtensilsCrossed, name: 'Multi-Cuisine Platters', desc: 'Curated platters from Indian, Chinese, and continental kitchens — something for every palate.' },
  { icon: Star, name: 'Chef\'s Special', desc: 'Daily rotating chef\'s special crafted from the freshest local produce and seasonal ingredients.' },
  { icon: Clock, name: 'Poolside Dining', desc: 'Enjoy your meals and beverages al fresco by the Milky Way Pool in a serene open-air ambiance.' },
];

const TIMINGS = [
  { meal: 'Breakfast', time: '7:00 AM – 10:30 AM' },
  { meal: 'Lunch', time: '12:30 PM – 3:00 PM' },
  { meal: 'Evening Snacks', time: '4:30 PM – 6:30 PM' },
  { meal: 'Dinner', time: '7:30 PM – 10:30 PM' },
];

const GalaxyDining = () => {
  const [activeImg, setActiveImg] = useState(0);
  const images = ['/dining1.png', '/dining2.png'];

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={images[activeImg]}
            alt="Galaxy Dining at DK Star Resorts"
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-secondary font-semibold uppercase tracking-[0.4em] mb-3 text-sm"
          >
            Resort Dining Experience
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-7xl font-heading font-bold mb-4"
          >
            Galaxy Dining
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-gray-200 mb-8"
          >
            A culinary journey through flavours — where every meal is a celebration
          </motion.p>
          {/* Image switcher dots */}
          <div className="flex justify-center gap-3 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${activeImg === i ? 'bg-secondary border-secondary scale-125' : 'bg-white/40 border-white/60'}`}
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
                alt={`Galaxy Dining view ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute bottom-4 left-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
            <span className="text-secondary font-semibold uppercase tracking-widest text-sm">Our Restaurant</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary leading-tight">
              Dine Among the Stars
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Galaxy Dining is DK Star Resort's signature restaurant — a stunning open-air and semi-covered space that brings together the finest multi-cuisine offerings in an atmosphere of elegance and warmth. With marble flooring, rattan pendant lighting, lush green walls and a view of the Milky Way Pool, every meal here is a visual and culinary delight.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our talented chefs curate daily menus featuring authentic tandoori specialties, fresh garden salads, hearty continental platters and regional favourites — all prepared with locally sourced, seasonal ingredients.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { label: 'Seating Capacity', value: '80+ Covers' },
                { label: 'Cuisine', value: 'Multi-Cuisine' },
                { label: 'Setting', value: 'Open-Air & Covered' },
                { label: 'Dining Style', value: 'À la carte & Buffet' },
              ].map(item => (
                <div key={item.label} className="bg-cream border border-secondary/20 p-4 rounded-sm">
                  <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-1">{item.label}</p>
                  <p className="font-heading font-semibold text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="/dining1.png"
              alt="Galaxy Dining interior"
              className="w-full h-[500px] object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-8 hidden md:block">
              <p className="text-3xl font-heading font-bold mb-1">4.9</p>
              <div className="flex text-secondary gap-1 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs uppercase tracking-widest text-secondary font-bold">Dining Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dining Timings ── */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-secondary font-semibold uppercase tracking-widest text-sm">Restaurant Hours</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-10">Dining Timings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TIMINGS.map(t => (
              <div key={t.meal} className="border border-secondary/30 p-6 hover:border-secondary transition-colors duration-300">
                <Clock size={24} className="text-secondary mx-auto mb-3" />
                <p className="font-heading font-bold text-lg mb-1">{t.meal}</p>
                <p className="text-gray-300 text-sm">{t.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Menu Highlights ── */}
      <section className="section-container bg-cream">
        <div className="text-center mb-14 space-y-3">
          <span className="text-secondary font-semibold uppercase tracking-widest text-sm">What We Serve</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">Menu Highlights</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Crafted with passion, served with pride — explore our signature offerings.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENU_HIGHLIGHTS.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white border border-secondary/10 p-8 hover:border-secondary/40 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-secondary/10 w-12 h-12 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                <item.icon size={22} className="text-secondary" />
              </div>
              <h3 className="font-heading font-bold text-primary text-lg mb-2">{item.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Full-width photo ── */}
      <section className="relative h-80 md:h-[450px] overflow-hidden">
        <img src="/dining2.png" alt="Galaxy Dining ambiance" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="px-10 md:px-20 max-w-lg text-white">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Private Dining<br/>Experiences</h2>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Planning a special occasion? We offer private dining arrangements, custom menus and candlelit setups for anniversaries, birthdays and intimate celebrations. Contact us to arrange a bespoke experience.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-secondary text-primary px-8 py-3 font-bold text-sm uppercase tracking-widest hover:bg-secondary/90 transition-colors"
            >
              Enquire Now <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-container text-center">
        <span className="text-secondary font-semibold uppercase tracking-widest text-sm">Ready to Dine?</span>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-2 mb-4">
          Book Your Table Today
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Galaxy Dining is open to all resort guests. Reservation recommended for dinner.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="btn-primary flex items-center gap-2 justify-center">
            Make a Reservation <ChevronRight size={16} />
          </Link>
          <Link to="/booking" className="btn-outline flex items-center gap-2 justify-center">
            Book a Stay <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GalaxyDining;

