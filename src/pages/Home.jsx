import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Star, Coffee, Wifi, MapPin, Sparkles, Waves,
  UtensilsCrossed, ChefHat, CheckCircle2, Phone, Mail, Calendar, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResort } from '../context/ResortContext';

const Home = () => {
  const { rooms, halls } = useResort();
  const isWeekendToday = (new Date().getDay() === 0 || new Date().getDay() === 6);

  return (
    <div className="overflow-hidden bg-cream text-primary">
      {/* ── 1. Hero Section ────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[620px] flex items-center justify-center">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75 z-10"></div>
        <img
          src="/hero-new.jpg"
          alt="DK STAR RESORTS - Royal Luxury Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto pt-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 backdrop-blur-md mb-6"
          >
            <Sparkles size={14} className="text-secondary" />
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px] md:text-xs">
              DK STAR RESORTS • ROYAL LUXURY COLLECTION
            </span>
            <Sparkles size={14} className="text-secondary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 tracking-tight leading-[1.1]"
          >
            Experience the Royal Side <br className="hidden sm:block" /> of Relaxation.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-secondary font-heading italic text-lg sm:text-2xl md:text-3xl mb-10 tracking-wide font-normal"
          >
            A Stay Beyond Expectations
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link to="/rooms" className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 px-9 py-4 text-xs font-bold uppercase tracking-widest shadow-xl">
              Explore The Prestige Collection <ArrowRight size={16} />
            </Link>
            <Link to="/booking" className="w-full sm:w-auto btn-outline border-white text-white hover:bg-white hover:text-primary px-9 py-4 text-xs font-bold uppercase tracking-widest">
              Reserve Your Stay
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-70">
          <span className="text-[10px] tracking-[0.25em] text-white/80 uppercase">Scroll to Discover</span>
          <div className="w-px h-10 bg-gradient-to-b from-secondary to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* ── 2. Overview / Royal Heritage ──────────────────────────── */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-[0.25em] text-xs">
              <Sparkles size={14} /> Royal Hospitality Redefined
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary leading-tight">
              A Sanctuary of Distinction & Timeless Splendour
            </h2>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              Welcome to <strong>DK STAR RESORTS</strong>, where regal hospitality blends seamlessly with natural beauty. Each element of our estate has been meticulously crafted to offer guests a distinguished escape — from our curated <em>Prestige Room Collection</em> and majestic celebrations at <em>Nakshatra Hall 1 & 2</em>, to tranquil afternoons by the <em>Wonders Swimming Pool</em> and gourmet indulgences at <em>The Grand Pavilion</em>.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 shadow-sm rounded-lg">
                <div className="bg-secondary/10 p-2.5 rounded-md text-secondary">
                  <Star size={18} />
                </div>
                <div>
                  <span className="font-heading font-bold text-sm block">Five-Star Luxury</span>
                  <span className="text-[11px] text-gray-400">Royal Accommodations</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 shadow-sm rounded-lg">
                <div className="bg-secondary/10 p-2.5 rounded-md text-secondary">
                  <UtensilsCrossed size={18} />
                </div>
                <div>
                  <span className="font-heading font-bold text-sm block">The Grand Pavilion</span>
                  <span className="text-[11px] text-gray-400">Multi-Cuisine Delicacies</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 shadow-sm rounded-lg">
                <div className="bg-secondary/10 p-2.5 rounded-md text-secondary">
                  <Wifi size={18} />
                </div>
                <div>
                  <span className="font-heading font-bold text-sm block">High-Speed Wi-Fi</span>
                  <span className="text-[11px] text-gray-400">Seamless Connectivity</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 shadow-sm rounded-lg">
                <div className="bg-secondary/10 p-2.5 rounded-md text-secondary">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="font-heading font-bold text-sm block">Prime Location</span>
                  <span className="text-[11px] text-gray-400">Vanjur, Vellore</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
              <img
                src="/hero-new.jpg"
                alt="DK Star Resorts Estate"
                className="w-full h-[420px] md:h-[540px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-primary text-white p-6 md:p-8 rounded-xl shadow-xl border-l-4 border-secondary">
              <p className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-1">15+</p>
              <p className="text-[11px] uppercase tracking-widest text-gray-300 font-bold">Years of Exceptional Hospitality</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. The Prestige Collection – Nine Rooms ───────────────── */}
      <section className="bg-primary text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-xs">
              Royal Luxury Accommodations
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold">The Prestige Collection</h2>
            <p className="text-gray-300 text-sm md:text-base">
              Nine impeccably appointed private chambers and suites, crafted for guests who demand supreme comfort and quiet refinement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.slice(0, 9).map((room) => {
              const isNakshatra = room.id === 9 || room.isSunHallPackage || room.isNakshatraPackage;
              const weekdayRate = room.price_weekday || room.price;
              const weekendRate = room.price_weekend || room.price;

              // Real-time automatic dynamic day detector
              const todayDay = new Date().getDay(); // 0: Sun, 6: Sat
              const isWeekendToday = (todayDay === 0 || todayDay === 6);
              const currentTodayRate = isWeekendToday ? weekendRate : weekdayRate;

              return (
                <div
                  key={room.id}
                  className="bg-white text-primary rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300"
                >
                  <div>
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img
                        src={room.image.replace('.png', '.webp')}
                        alt={`${room.name} at DK Star Resorts`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-primary/90 text-secondary text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm">
                        Room 0{room.id}
                      </div>
                      <div className="absolute top-4 right-4 bg-secondary text-primary font-bold text-xs px-3 py-1.5 rounded-md shadow">
                        {isNakshatra ? 'Hall 2 Package' : (isWeekendToday ? `Weekend: ₹${weekendRate.toLocaleString('en-IN')}` : `Weekday: ₹${weekdayRate.toLocaleString('en-IN')}`)}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-2xl font-heading font-bold text-primary">{room.name}</h3>
                        <span className="text-secondary text-[11px] uppercase tracking-wider font-bold">{room.type}</span>
                      </div>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4 line-clamp-2">
                        {room.description}
                      </p>

                      {!isNakshatra && (
                        <div className="bg-cream p-3 rounded-lg border border-secondary/25 text-xs">
                          {!isWeekendToday ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-primary block">Weekday Tariff (Mon–Fri)</span>
                                <span className="text-[10px] text-gray-500">Tax Inclusive / Night</span>
                              </div>
                              <span className="font-bold text-primary text-base font-heading">
                                ₹{weekdayRate.toLocaleString('en-IN')}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-secondary block">Weekend Tariff (Sat–Sun)</span>
                                <span className="text-[10px] text-gray-500">Tax Inclusive / Night</span>
                              </div>
                              <span className="font-bold text-secondary text-base font-heading">
                                ₹{weekendRate.toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {isNakshatra && (
                        <div className="text-xs bg-amber-50 border border-amber-300 text-amber-900 px-3 py-2.5 rounded-lg font-medium">
                          ⭐ Included with Nakshatra Hall 2 package (No separate charge).
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex gap-3">
                    <Link
                      to="/rooms"
                      className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to={isNakshatra ? '/function-hall' : `/booking?type=room&id=${room.id}`}
                      className="flex-1 btn-primary py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5"
                    >
                      {isNakshatra ? 'View Hall' : 'Book Now'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest hover:bg-secondary/90 transition-colors shadow-lg"
            >
              Explore All 9 Prestige Suites <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Celebration Halls – Nakshatra Hall 1 & Nakshatra Hall 2 ── */}
      <section className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-xs">
            Grand Venues & Royal Celebrations
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
            Nakshatra Hall 1 & Nakshatra Hall 2
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            From climate-controlled luxury indoor banquets to expansive starlit open-air celebration lawns, our grand venues cater to celebrations up to 200 distinguished guests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Nakshatra Hall 1 (Indoor Hall) */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="relative h-72 overflow-hidden">
                <img
                  src="/indoor1.webp"
                  alt="Nakshatra Hall 1 - Indoor Banquet Hall"
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-secondary text-primary font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-md">
                  Hall 01 • Indoor Banquet Hall
                </div>
                <div className="absolute top-4 right-4 bg-primary/90 text-white font-bold text-xs px-3 py-1.5 rounded-md">
                  Capacity: Up to 100 Guests
                </div>
              </div>

              <div className="p-8 space-y-4">
                <h3 className="text-3xl font-heading font-bold text-primary">Nakshatra Hall 1</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A climate-controlled luxury indoor banquet hall featuring marble appointments, crystal chandeliers, acoustic audio, and projector screen for birthdays, engagements, and private banquets.
                </p>

                <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-primary text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  <span>Central Air-Conditioning, Royal Stage Setup & Banquet Seating.</span>
                </div>

                {/* Dynamic Tariff Box: Monday-Friday vs Saturday-Sunday */}
                <div className="bg-cream p-4 rounded-xl border-l-4 border-secondary">
                  {!isWeekendToday ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Weekday Tariff (Mon–Fri)</span>
                        <span className="text-[10px] text-gray-400 block">Tax Inclusive • Per Day</span>
                      </div>
                      <span className="text-2xl font-heading font-bold text-primary">₹20,000</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-secondary uppercase tracking-widest font-bold block">Weekend Tariff (Sat–Sun)</span>
                        <span className="text-[10px] text-gray-400 block">Tax Inclusive • Per Day</span>
                      </div>
                      <span className="text-2xl font-heading font-bold text-secondary">₹23,000</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-4">
              <Link to="/booking?type=hall&id=moon-hall" className="flex-1 btn-primary text-center py-3 text-xs font-bold uppercase tracking-wider rounded-lg">
                Book Nakshatra Hall 1
              </Link>
              <Link to="/function-hall" className="btn-outline text-center py-3 text-xs font-bold uppercase tracking-wider rounded-lg">
                View Gallery
              </Link>
            </div>
          </div>

          {/* Nakshatra Hall 2 (Outdoor Hall) */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="relative h-72 overflow-hidden">
                <img
                  src="/outdoor1.webp"
                  alt="Nakshatra Hall 2 - Outdoor Celebration Lawn"
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-secondary text-primary font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-md">
                  Hall 02 • Outdoor Celebration Lawn
                </div>
                <div className="absolute top-4 right-4 bg-primary/90 text-white font-bold text-xs px-3 py-1.5 rounded-md">
                  Capacity: Up to 200 Guests
                </div>
              </div>

              <div className="p-8 space-y-4">
                <h3 className="text-3xl font-heading font-bold text-primary">Nakshatra Hall 2</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  An expansive outdoor celebration lawn framed by lush palms and radiant evening illuminations. Perfect for grand weddings, receptions, and birthday celebrations.
                </p>

                <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs font-semibold flex items-center gap-2">
                  <Sparkles size={16} className="text-secondary shrink-0" />
                  <span>Includes Room 09 (Nakshatra Attached Dressing Suite) in the package.</span>
                </div>

                {/* Dynamic Tariff Box: Monday-Friday vs Saturday-Sunday */}
                <div className="bg-cream p-4 rounded-xl border-l-4 border-secondary">
                  {!isWeekendToday ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Weekday Tariff (Mon–Fri)</span>
                        <span className="text-[10px] text-gray-400 block">Tax Inclusive • Per Day</span>
                      </div>
                      <span className="text-2xl font-heading font-bold text-primary">₹25,000</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-secondary uppercase tracking-widest font-bold block">Weekend Tariff (Sat–Sun)</span>
                        <span className="text-[10px] text-gray-400 block">Tax Inclusive • Per Day</span>
                      </div>
                      <span className="text-2xl font-heading font-bold text-secondary">₹27,000</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-4">
              <Link to="/booking?type=hall&id=sun-hall" className="flex-1 btn-primary text-center py-3 text-xs font-bold uppercase tracking-wider rounded-lg">
                Book Nakshatra Hall 2
              </Link>
              <Link to="/function-hall" className="btn-outline text-center py-3 text-xs font-bold uppercase tracking-wider rounded-lg">
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Wonders Swimming Pool ──────────────────────────────── */}
      <section className="bg-cream py-20 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-[0.25em] text-xs">
                <Waves size={16} /> Leisure & Recreation
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
                Wonders Swimming Pool
              </h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Immerse yourself in serenity at the <strong>Wonders Swimming Pool</strong>. Featuring crystal-clear temperature-controlled waters, a refreshing mushroom water fountain, and ambient underwater LED illumination, it provides the ultimate refreshing leisure experience.
              </p>

              {/* Free Pool Access Policy Highlight */}
              <div className="p-4 bg-emerald-50 border border-emerald-300/80 rounded-xl flex items-start gap-3.5 text-emerald-950">
                <Sparkles size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold uppercase tracking-wider block text-emerald-900 text-xs">
                    FREE Pool Access for Room & Hall Bookings
                  </span>
                  <p className="text-emerald-800 leading-relaxed">
                    All guests staying in our <strong>Rooms</strong> or hosting celebrations at <strong>Nakshatra Halls</strong> receive <strong>100% complimentary unlimited swimming pool access</strong> throughout their stay!
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                    * Day visitors / non-resident guests can book session passes online or at reception.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span className="font-heading font-bold text-lg text-primary block">Mushroom Fountain</span>
                  <span className="text-xs text-gray-500">Interactive Splash Feature</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span className="font-heading font-bold text-lg text-primary block">Ambient Night Glow</span>
                  <span className="text-xs text-gray-500">Submerged LED Lighting</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span className="font-heading font-bold text-lg text-primary block">Covered Pavilion</span>
                  <span className="text-xs text-gray-500">Poolside Lounge Seating</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span className="font-heading font-bold text-lg text-emerald-800 block">FREE for Residents</span>
                  <span className="text-xs text-gray-500">Paid slots for day visitors</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/pool" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-xs font-bold uppercase tracking-wider rounded-lg">
                  Explore Pool Sessions & Passes <ArrowRight size={16} />
                </Link>
                <Link to="/booking" className="btn-outline inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg">
                  Book Stay (Free Pool)
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="/pool1.webp" alt="Wonders Swimming Pool Day View" loading="lazy" className="w-full h-56 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
                <img src="/pool3.webp" alt="Wonders Pool Fountain and Deck" loading="lazy" className="w-full h-44 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="space-y-4 pt-6">
                <img src="/pool2.webp" alt="Wonders Pool Deck Ambience" loading="lazy" className="w-full h-44 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
                <img src="/pool4.webp" alt="Wonders Pool Illuminated Night Glow" loading="lazy" className="w-full h-56 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. The Grand Pavilion & The Gourmet Kitchen ─────────────── */}
      <section className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-xs">
            Culinary Splendour
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
            The Grand Pavilion & The Gourmet Kitchen
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Honouring royal gastronomic traditions with fresh locally-sourced ingredients, exquisite culinary craft, and majestic poolside views.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img src="/dining1.webp" alt="The Grand Pavilion Restaurant" loading="lazy" className="w-full h-[400px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
              <div className="text-white">
                <span className="text-secondary text-xs uppercase tracking-widest font-bold block mb-1">Signature Restaurant</span>
                <h3 className="text-3xl font-heading font-bold">The Grand Pavilion</h3>
                <p className="text-gray-200 text-xs mt-1">Multi-cuisine poolside restaurant serving breakfast, lunch, and dinner.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-secondary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <UtensilsCrossed size={16} /> Restaurant Ambiance
            </span>
            <h3 className="text-3xl font-heading font-bold text-primary">Dine in Opulent Elegance</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              <strong>The Grand Pavilion</strong> offers a lavish open-air and covered dining pavilion overlooking the Wonders Swimming Pool. Featuring polished marble flooring, handcrafted rattan chandeliers, lush vertical gardens, and an expansive buffet setup, it transforms every meal into a royal banquet.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-secondary" /> 80+ Seating Capacity
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-secondary" /> Poolside Seating
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-secondary" /> Multi-Cuisine Menu
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-secondary" /> Buffet & À La Carte
              </div>
            </div>
            <Link to="/dining" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-xs font-bold uppercase tracking-wider rounded-lg">
              Explore The Grand Pavilion <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* The Gourmet Kitchen */}
        <div className="bg-primary text-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-secondary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <ChefHat size={18} /> Dedicated Catering Infrastructure
              </span>
              <h3 className="text-3xl md:text-4xl font-heading font-bold">The Gourmet Kitchen</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                A state-of-the-art culinary facility powering both daily dining and grand celebrations. Our master culinary team specializes in authentic South Indian feasts, North Indian tandoori specialties, and continental banquets for up to 200 event guests.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-300 pt-2">
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-secondary" /> Hygienic Stainless Steel Setup</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-secondary" /> Large Banquet Catering Ready</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-secondary" /> Customized Event Menus</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-secondary" /> Fresh Farm Ingredients</div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl shadow-lg border border-secondary/30">
              <img src="/dining2.webp" alt="The Gourmet Kitchen & Banquet Dining" loading="lazy" className="w-full h-72 object-cover" />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Resort Gallery Showcase ────────────────────────────── */}
      <section className="bg-cream py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-xs">
              Visual Elegance
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              Resort Gallery
            </h2>
            <p className="text-gray-500 text-sm">
              Glimpses of royal luxury across our rooms, venues, pool, and dining pavilions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { src: '/mercury1.webp', label: 'Elite Bedroom' },
              { src: '/venus1.webp', label: 'Signature Suite' },
              { src: '/outdoor1.webp', label: 'Nakshatra Lawn' },
              { src: '/indoor1.webp', label: 'Nakshatra Hall 1' },
              { src: '/pool4.webp', label: 'Wonders Pool Night' },
              { src: '/dining1.webp', label: 'The Grand Pavilion' },
            ].map((item, i) => (
              <Link
                key={i}
                to="/gallery"
                className="group relative h-48 overflow-hidden rounded-xl shadow-sm block"
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/gallery" className="btn-outline inline-flex items-center gap-2 text-xs uppercase tracking-widest px-8 py-3">
              View Full Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Booking & Enquiry CTA ──────────────────────────────── */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/outdoor1.png" alt="Resort Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-xs block">
            Plan Your Getaway
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
            Ready for a Stay Beyond Expectations?
          </h2>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
            Whether booking an intimate weekend in our Prestige Collection or planning a grand celebration at Nakshatra Hall, our royal concierge is here to assist you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/booking" className="btn-primary flex items-center justify-center gap-2 px-9 py-4 text-xs font-bold uppercase tracking-widest shadow-xl">
              <Calendar size={16} /> Book Your Reservation
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary flex items-center justify-center gap-2 px-9 py-4 text-xs font-bold uppercase tracking-widest">
              <Mail size={16} /> Contact Concierge
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. Location & Contact Information ─────────────────────── */}
      <section className="section-container bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 bg-cream rounded-2xl border border-secondary/20 space-y-3">
            <MapPin className="text-secondary" size={24} />
            <h4 className="font-heading font-bold text-lg text-primary">Estate Location</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              No 202/2, PONNIYAMMAN Kovil Street, KOLLAIMEDU VP MAHAL Backside, Vanjur, Vellore – 632006, Tamil Nadu
            </p>
            <a
              href="https://maps.app.goo.gl/Lu84a8a5iCgT2rEd9?g_st=ac"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-secondary text-xs font-bold uppercase tracking-wider hover:underline pt-2"
            >
              Open in Google Maps →
            </a>
          </div>

          <div className="p-8 bg-cream rounded-2xl border border-secondary/20 space-y-3">
            <Phone className="text-secondary" size={24} />
            <h4 className="font-heading font-bold text-lg text-primary">Telephone Reservations</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our front desk concierge is available daily for suite reservations, banquet inquiries, and pool bookings.
            </p>
            <a
              href="tel:+919489455977"
              className="inline-block font-heading font-bold text-primary text-lg hover:text-secondary transition-colors pt-2"
            >
              +91 9489455977
            </a>
          </div>

          <div className="p-8 bg-cream rounded-2xl border border-secondary/20 space-y-3">
            <Mail className="text-secondary" size={24} />
            <h4 className="font-heading font-bold text-lg text-primary">Electronic Inquiries</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              For event inquiries, custom wedding quotes, or corporate bookings, send your requirements directly.
            </p>
            <a
              href="mailto:dkstarresorts@gmail.com"
              className="inline-block font-heading font-bold text-primary text-base hover:text-secondary transition-colors pt-2"
            >
              dkstarresorts@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
