import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wifi, Wind, ArrowRight, ChevronLeft, ChevronRight, Star, Sparkles, CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResort } from '../context/ResortContext';

// Room-specific image galleries (genuine resort photography)
const ROOM_GALLERIES = {
  1: ['/mercury1.png', '/mercury2.png', '/mercury3.png', '/mercury4.png'],                          // Room 01: ELITE
  2: ['/venus1.png', '/venus2.png', '/venus3.png', '/venus4.png', '/venus5.png'],                   // Room 02: SIGNATURE
  3: ['/jupiter1.png', '/jupiter2.png', '/jupiter3.png', '/jupiter4.png', '/jupiter5.png'],         // Room 03: CROWN
  4: ['/earth1.png', '/earth2.png', '/earth3.png', '/earth4.png'],                                 // Room 04: LEGACY
  5: ['/mars1.png', '/mars2.png', '/mars3.png'],                                                    // Room 05: MAJESTIC
  6: ['/saturn1.png', '/saturn2.png', '/saturn3.png'],                                             // Room 06: GRANDE
  7: ['/uranus1.png', '/uranus2.png'],                                                             // Room 07: IMPERIAL
  8: ['/neptune1.png', '/neptune2.png', '/neptune3.png'],                                          // Room 08: SUPREME
  9: ['/nakshatra1.jpg', '/nakshatra2.jpg'],                                                               // Room 09: NAKSHATRA
};

const RoomCard = ({ room, onSelectDetails }) => {
  const gallery = ROOM_GALLERIES[room.id] || [room.image];
  const [imgIdx, setImgIdx] = useState(0);

  const prev = (e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i => (i - 1 + gallery.length) % gallery.length); };
  const next = (e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i => (i + 1) % gallery.length); };

  const isNakshatraPackage = room.id === 9 || room.isSunHallPackage || room.isNakshatraPackage;
  const weekdayRate = room.price_weekday || room.price;
  const weekendRate = room.price_weekend || room.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 rounded-xl flex flex-col justify-between"
    >
      <div>
        {/* Photo with gallery nav */}
        <div className="relative h-72 overflow-hidden bg-gray-100">
          <img
            src={gallery[imgIdx]}
            alt={`Room 0${room.id} - ${room.name} at DK Star Resorts`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Top badges */}
          <div className="absolute top-4 left-4 bg-primary/95 text-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest rounded shadow backdrop-blur-sm">
            Room 0{room.id}
          </div>

          <div className="absolute top-4 right-4 bg-secondary text-primary px-3 py-1.5 text-xs font-extrabold rounded shadow">
            {isNakshatraPackage
              ? 'Nakshatra Hall Package'
              : `₹${weekdayRate.toLocaleString('en-IN')}/Night`}
          </div>

          {/* Gallery navigation arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition-all opacity-80 group-hover:opacity-100"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition-all opacity-80 group-hover:opacity-100"
              >
                <ChevronRight size={16} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIdx ? 'w-5 bg-secondary' : 'w-1.5 bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-7">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-2xl font-heading font-bold text-primary tracking-tight">{room.name}</h3>
              <p className="text-secondary text-xs uppercase tracking-widest font-bold mt-0.5">{room.type}</p>
            </div>
            {!isNakshatraPackage && (
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Weekday</span>
                <span className="font-bold text-primary font-heading text-lg">₹{weekdayRate.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
            {room.description}
          </p>

          {/* Weekend rate pill */}
          {!isNakshatraPackage && (
            <div className="flex items-center justify-between bg-cream p-3 rounded-lg border border-secondary/20 mb-3 text-xs">
              <span className="font-bold text-secondary">
                Weekend: ₹{weekendRate.toLocaleString('en-IN')}/Night
              </span>
              <span className="text-gray-400 text-[11px] font-medium">• Tax Inclusive</span>
            </div>
          )}

          {isNakshatraPackage && (
            <div className="text-xs bg-amber-50 border border-amber-300 text-amber-900 p-3 rounded-lg font-medium flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-secondary shrink-0" />
              <span>Included with Nakshatra Hall booking package at no additional charge.</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-7 pb-7 pt-0">
        <div className="flex items-center gap-5 mb-5 text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-secondary" />
            <span className="text-xs font-semibold">{room.capacity} Guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi size={14} className="text-secondary" />
            <span className="text-xs font-semibold">Wi-Fi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={14} className="text-secondary" />
            <span className="text-xs font-semibold">AC</span>
          </div>
          {gallery.length > 1 && (
            <div className="flex items-center gap-1.5 text-secondary ml-auto">
              <Star size={13} fill="currentColor" />
              <span className="text-xs font-bold">{gallery.length} Photos</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSelectDetails(room, gallery)}
            className="flex-1 py-2.5 px-3 border border-gray-300 text-primary text-xs font-bold uppercase tracking-wider rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>

          {isNakshatraPackage ? (
            <Link
              to="/function-hall"
              className="flex-1 btn-primary py-2.5 px-3 text-center text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1"
            >
              View Hall <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              to={`/booking?type=room&id=${room.id}`}
              className="flex-1 btn-primary py-2.5 px-3 text-center text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1"
            >
              Book Now <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Rooms = () => {
  const { rooms } = useResort();
  const [detailModal, setDetailModal] = useState(null);

  const openDetails = (room, gallery) => {
    setDetailModal({ room, gallery });
  };

  return (
    <div className="pt-20 bg-cream min-h-screen">
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="bg-primary py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/hero-new.jpg" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-4"
          >
            <Sparkles size={14} /> Royal Luxury Collection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-4"
          >
            The Prestige Collection
          </motion.h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Nine exquisitely designed private chambers and suites — from the understated elegance of Elite to the stately splendor of Nakshatra.
          </p>
          <p className="text-secondary text-sm mt-4 font-semibold uppercase tracking-[0.3em] italic">
            A Stay Beyond Expectations
          </p>
        </div>
      </section>

      {/* ── Room Cards Grid ────────────────────────────────── */}
      <section className="section-container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} onSelectDetails={openDetails} />
          ))}
        </div>
      </section>

      {/* ── View Details Modal ─────────────────────────────── */}
      <AnimatePresence>
        {detailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200"
            >
              <div className="relative h-72">
                <img
                  src={detailModal.gallery[0] || detailModal.room.image}
                  alt={detailModal.room.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setDetailModal(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-4 bg-primary/90 text-secondary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                  Room 0{detailModal.room.id} • {detailModal.room.name}
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-3xl font-heading font-bold text-primary">{detailModal.room.name}</h3>
                    <span className="text-secondary text-xs uppercase tracking-widest font-bold">{detailModal.room.type}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mt-2">{detailModal.room.description}</p>
                </div>

                <div className="bg-cream p-4 rounded-xl border border-secondary/20 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Weekday Rate</span>
                    <span className="text-2xl font-heading font-bold text-primary">
                      {detailModal.room.id === 9 ? 'Hall Package' : `₹${(detailModal.room.price_weekday || detailModal.room.price).toLocaleString('en-IN')}`}
                    </span>
                    <span className="text-[10px] text-gray-400 block">Per Night • Tax Inclusive</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-secondary uppercase tracking-widest font-bold block">Weekend Rate</span>
                    <span className="text-2xl font-heading font-bold text-secondary">
                      {detailModal.room.id === 9 ? 'Hall Package' : `₹${(detailModal.room.price_weekend || detailModal.room.price).toLocaleString('en-IN')}`}
                    </span>
                    <span className="text-[10px] text-gray-400 block">Per Night • Tax Inclusive</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Amenities & Inclusions</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailModal.room.amenities.map(a => (
                      <span key={a} className="bg-primary/5 text-primary text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-secondary" /> {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-4">
                  <button
                    onClick={() => setDetailModal(null)}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-wider border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <Link
                    to={detailModal.room.id === 9 ? '/function-hall' : `/booking?type=room&id=${detailModal.room.id}`}
                    onClick={() => setDetailModal(null)}
                    className="flex-1 btn-primary py-3 text-center text-xs font-bold uppercase tracking-wider rounded-lg"
                  >
                    {detailModal.room.id === 9 ? 'View Nakshatra Hall' : 'Book Room'}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rooms;
