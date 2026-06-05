import React from 'react';
import { motion } from 'framer-motion';
import { Users, Wifi, Wind, Coffee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResort } from '../context/ResortContext';

const RoomCard = ({ room }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col justify-between"
  >
    <div>
      <div className="relative h-72 overflow-hidden">
        <img 
          src={room.image} 
          alt={room.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 text-sm font-bold">
          ₹{room.price.toLocaleString('en-IN')}/Night
        </div>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-heading font-bold text-primary mb-1">{room.name}</h3>
            <p className="text-secondary text-xs uppercase tracking-widest font-bold">{room.type}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {room.description}
        </p>
      </div>
    </div>
    <div className="px-8 pb-8 pt-0">
      <div className="flex items-center gap-6 mb-8 text-gray-500">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span className="text-xs">{room.capacity} Guests</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi size={16} />
          <span className="text-xs">Wifi</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={16} />
          <span className="text-xs">AC</span>
        </div>
      </div>
      <Link 
        to={`/booking?type=room&id=${room.id}`} 
        className="w-full btn-outline flex justify-center items-center gap-2 group-hover:bg-primary group-hover:text-white"
      >
        Book Room <ArrowRight size={18} />
      </Link>
    </div>
  </motion.div>
);

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
            Luxury Rooms & Suites
          </motion.h1>
          <p className="text-gray-300 text-lg">
            Choose from our curated selection of 10 luxury stays, each designed to provide an unforgettable experience of comfort and style.
          </p>
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
