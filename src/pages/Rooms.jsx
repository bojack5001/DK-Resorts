import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Wifi, Wind, ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResort } from '../context/ResortContext';

// Room-specific image galleries (real resort photos)
const ROOM_GALLERIES = {
  1: ['/mercury1.png', '/mercury2.png', '/mercury3.png', '/mercury4.png'],                          // Mercury — 4 photos
  2: ['/venus1.png', '/venus2.png', '/venus3.png', '/venus4.png', '/venus5.png'],                   // Venus   — 5 photos
  3: ['/jupiter1.png', '/jupiter2.png', '/jupiter3.png', '/jupiter4.png', '/jupiter5.png'],         // Jupiter — 5 photos
  4: ['/earth1.png', '/earth2.png', '/earth3.png', '/earth4.png'],                                 // Earth   — 4 photos
  5: ['/mars1.png', '/mars2.png', '/mars3.png'],                                                    // Mars    — 3 photos
  6: ['/saturn1.png', '/saturn2.png', '/saturn3.png'],                                             // Saturn  — 3 photos
  7: ['/uranus1.png', '/uranus2.png'],                                                             // Uranus  — 2 photos
  8: ['/neptune1.png', '/neptune2.png', '/neptune3.png'],                                          // Neptune — 3 photos
  9: ['/pluto1.jpg', '/pluto2.jpg'],                                                               // Pluto   — 2 photos
};

const RoomCard = ({ room }) => {
  const gallery = ROOM_GALLERIES[room.id] || [room.image];
  const [imgIdx, setImgIdx] = useState(0);

  const prev = (e) => { e.preventDefault(); setImgIdx(i => (i - 1 + gallery.length) % gallery.length); };
  const next = (e) => { e.preventDefault(); setImgIdx(i => (i + 1) % gallery.length); };

  const isSunHallPackage = room.id === 9 || room.isSunHallPackage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col justify-between"
    >
      <div>
        {/* Photo with gallery nav */}
        <div className="relative h-72 overflow-hidden bg-gray-100">
          <img
            src={gallery[imgIdx]}
            alt={`${room.name} - view ${imgIdx + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          {/* Price badge */}
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-2 text-xs font-bold">
            {isSunHallPackage
              ? 'Incl. Sun Hall'
              : `₹${(room.price_weekday ?? room.price).toLocaleString('en-IN')}/Night`}
          </div>
          {/* Room number badge */}
          <div className="absolute top-4 left-4 bg-secondary/90 text-primary px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Room {String(room.id).padStart(2, '0')}
          </div>
          {/* Gallery nav arrows — only if multiple photos */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={16} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); setImgIdx(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === imgIdx ? 'bg-white scale-125' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-1">{room.name}</h3>
              <p className="text-secondary text-xs uppercase tracking-widest font-bold">{room.type}</p>
            </div>
            {!isSunHallPackage && (
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-0.5">Weekday</p>
                <p className="font-bold text-primary">₹{(room.price_weekday ?? room.price).toLocaleString('en-IN')}</p>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{room.description}</p>
          {/* Weekend price pill */}
          {!isSunHallPackage && room.price_weekend && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-secondary/10 text-secondary font-bold px-3 py-1 rounded-full">
                Weekend ₹{room.price_weekend.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-400">• Tax Inclusive</span>
            </div>
          )}
          {isSunHallPackage && (
            <div className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded font-medium">
              ☀️ Included free with Sun Hall booking
            </div>
          )}
        </div>
      </div>

      <div className="px-8 pb-8 pt-0">
        <div className="flex items-center gap-5 mb-6 text-gray-500">
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span className="text-xs">{room.capacity} Guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi size={14} />
            <span className="text-xs">WiFi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={14} />
            <span className="text-xs">AC</span>
          </div>
          {gallery.length > 1 && (
            <div className="flex items-center gap-1.5 text-secondary">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-semibold">{gallery.length} Photos</span>
            </div>
          )}
        </div>
        {isSunHallPackage ? (
          <Link
            to="/function-hall"
            className="w-full btn-outline flex justify-center items-center gap-2 group-hover:bg-primary group-hover:text-white text-sm"
          >
            View Sun Hall <ArrowRight size={16} />
          </Link>
        ) : (
          <Link
            to={`/booking?type=room&id=${room.id}`}
            className="w-full btn-outline flex justify-center items-center gap-2 group-hover:bg-primary group-hover:text-white text-sm"
          >
            Book Room <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

const Rooms = () => {
  const { rooms } = useResort();

  return (
    <div className="pt-20">
      <section className="bg-primary py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-secondary font-bold uppercase tracking-[0.3em] text-sm mb-4 block"
          >
            Accommodation
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-6"
          >
            Solar System Rooms
          </motion.h1>
          <p className="text-gray-300 text-lg">
            9 uniquely named rooms — Mercury to Pluto — each offering a stellar stay with weekday & weekend pricing.
          </p>
          <p className="text-secondary text-sm mt-3 font-semibold uppercase tracking-widest">A Stay Beyond the Stars</p>
        </div>
      </section>

      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rooms;
