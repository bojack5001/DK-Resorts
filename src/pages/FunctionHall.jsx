import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Utensils, Calendar, ArrowRight, Sparkles, MapPin, ChevronLeft, ChevronRight, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResort } from '../context/ResortContext';

const HALL_GALLERIES = {
  'moon-hall': ['/indoor1.webp', '/indoor2.webp', '/indoor3.webp', '/indoor4.webp', '/indoor5.webp'],
  'sun-hall': ['/outdoor1.webp', '/outdoor2.webp', '/outdoor3.webp', '/outdoor4.webp'],
};

const HallCard = ({ hall, idx }) => {
  const gallery = HALL_GALLERIES[hall.id] || [hall.image];
  const [activeIdx, setActiveIdx] = useState(0);

  // Preload all venue photos into memory so transitions are instant
  React.useEffect(() => {
    gallery.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [gallery]);

  const prev = (e) => {
    e.preventDefault();
    setActiveIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const next = (e) => {
    e.preventDefault();
    setActiveIdx((prev) => (prev + 1) % gallery.length);
  };

  const weekdayPrice = hall.price_weekday || hall.price;
  const weekendPrice = hall.price_weekend || hall.price;

  // Real-time automatic dynamic day detector
  const todayDay = new Date().getDay(); // 0 is Sun, 6 is Sat
  const isWeekendToday = (todayDay === 0 || todayDay === 6);
  const currentTodayPrice = isWeekendToday ? weekendPrice : weekdayPrice;

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
        idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Left/Right Text Column */}
      <div className={`space-y-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-secondary font-semibold uppercase tracking-widest text-xs flex items-center gap-1.5 bg-secondary/10 px-3 py-1 rounded-full">
            <Sparkles size={14} /> {hall.type}
          </span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {gallery.length} Photos
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
            Today: ₹{currentTodayPrice.toLocaleString('en-IN')} ({isWeekendToday ? 'Weekend' : 'Weekday'})
          </span>
        </div>

        <div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">{hall.name}</h2>
          <p className="text-secondary text-xs uppercase tracking-[0.3em] font-bold mt-1">
            {hall.id === 'sun-hall' ? 'Grand Outdoor Celebrations (Up to 200 Guests)' : 'Climate-Controlled Luxury Banquets (Up to 100 Guests)'}
          </p>
        </div>

        {hall.hasSeparateRoom && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3">
            <Sparkles size={18} className="text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Nakshatra Attached Suite Included
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Includes private dressing/bridal suite (Room 09 – Nakshatra) at no additional charge when booking Nakshatra Hall 2.
              </p>
            </div>
          </div>
        )}

        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {hall.description}
        </p>

        {/* Pricing & Capacity Box with Dual Dynamic Tariff */}
        <div className="bg-cream p-6 border-l-4 border-secondary rounded-r-xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${!isWeekendToday ? 'bg-white shadow-xs border border-secondary/30' : ''}`}>
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[11px] block">
                Weekday Tariff (Mon–Fri)
              </span>
              <span className="text-2xl font-bold text-primary font-heading">
                ₹{weekdayPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-gray-500 block">Per Day • Tax Inclusive</span>
            </div>
            <div className={`p-3 rounded-lg ${isWeekendToday ? 'bg-white shadow-xs border border-secondary/30' : ''}`}>
              <span className="text-secondary font-bold uppercase tracking-widest text-[11px] block">
                Weekend Tariff (Sat–Sun)
              </span>
              <span className="text-2xl font-bold text-secondary font-heading">
                ₹{weekendPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-gray-500 block">Per Day • Tax Inclusive</span>
            </div>
          </div>

          <div className="border-t border-gray-200/60 pt-3 flex justify-between items-center text-sm">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Seating Capacity:
            </span>
            <span className="text-base font-bold text-primary">
              Up to {hall.capacity} Guests
            </span>
          </div>
        </div>

        {/* Amenities tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {hall.amenities.map((amenity) => (
            <span
              key={amenity}
              className="bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
            >
              <CheckCircle size={12} className="text-secondary" /> {amenity}
            </span>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            to={`/booking?type=hall&id=${hall.id}`}
            className="btn-primary flex items-center gap-2 group"
          >
            Book Venue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#enquiry-form" className="btn-outline">
            Request Event Quote
          </a>
        </div>
      </div>

      {/* Image Carousel Column */}
      <div className={`relative ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
        <div className="overflow-hidden shadow-2xl relative h-[440px] md:h-[480px] rounded-2xl group">
          <img
            src={gallery[activeIdx]}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={`${hall.name} - view ${activeIdx + 1}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Navigation Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition-all opacity-80 hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition-all opacity-80 hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {gallery.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveIdx(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIdx === dotIdx ? 'w-6 bg-secondary' : 'w-2 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Hall Name Overlay */}
          <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest">
            {hall.name}
          </div>
        </div>

        {/* Floating Capacity Pill */}
        <div className="absolute -bottom-5 -right-3 md:-bottom-6 md:-right-4 bg-secondary text-primary font-bold p-5 shadow-xl rounded-xl flex flex-col justify-center items-center">
          <Users size={22} className="mb-1 text-primary" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Capacity</span>
          <span className="text-base font-extrabold">{hall.capacity} Guests</span>
        </div>
      </div>
    </div>
  );
};

const FunctionHall = () => {
  const { halls } = useResort();

  return (
    <div className="pt-20">
      {/* Hero Header */}
      <section className="relative h-[65vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <img
          src="/outdoor1.webp"
          alt="Nakshatra Hall 1 & Nakshatra Hall 2 Venues"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold uppercase tracking-[0.4em] text-xs md:text-sm block mb-3"
          >
            DK Star Resorts • Celebrations & Events
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4"
          >
            Nakshatra Hall 1 & Nakshatra Hall 2
          </motion.h1>
          <p className="text-gray-200 text-sm md:text-lg max-w-2xl mx-auto">
            From open-air celebrations under the night sky to climate-controlled grand indoor banquets — create timeless memories at DK Star Resorts.
          </p>
        </div>
      </section>

      {/* Halls Listing */}
      <section className="section-container space-y-28 py-20">
        {halls.map((hall, idx) => (
          <HallCard key={hall.id} hall={hall} idx={idx} />
        ))}
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form" className="bg-cream py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 md:p-12 shadow-xl border-t-4 border-secondary rounded-2xl">
            <h2 className="text-3xl font-heading font-bold text-center mb-2 text-primary">Plan Your Event</h2>
            <p className="text-gray-500 text-center text-sm mb-10">Our event coordinator will tailor a custom quote for your celebration.</p>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for your event enquiry! Our event manager will contact you within 2 hours.');
              }}
            >
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors text-sm"
                  placeholder="e.g. Anand Kumar"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors text-sm"
                  placeholder="anand@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Event Venue</label>
                <select className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 bg-transparent transition-colors text-sm">
                  {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.name} ({hall.type}) • Up to {hall.capacity} Guests • Weekday ₹{(hall.price_weekday || hall.price).toLocaleString('en-IN')} / Weekend ₹{(hall.price_weekend || hall.price).toLocaleString('en-IN')}
                      {hall.hasSeparateRoom ? ' [Includes Room 09 Nakshatra Suite]' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Estimated Guests</label>
                <input
                  required
                  type="number"
                  className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors text-sm"
                  placeholder="e.g. 150"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Event Details & Requirements</label>
                <textarea
                  className="w-full border-b border-gray-300 focus:border-secondary outline-none py-2 transition-colors h-24 text-sm resize-none"
                  placeholder="Tell us about your event date, catering needs, stage decoration..."
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full btn-primary py-4 text-sm font-bold tracking-widest uppercase">
                  Send Event Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FunctionHall;
