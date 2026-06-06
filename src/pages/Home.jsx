import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Coffee, Wifi, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img
          src="/hero-new.jpg"
          alt="DK STAR RESORTS"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 text-center text-white px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-secondary font-semibold uppercase tracking-[0.4em] mb-4 text-sm"
          >
            Welcome to DK STAR RESORTS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-heading font-bold mb-8 tracking-tight"
          >
            Luxury in the Heart <br className="hidden sm:block" /> of Nature
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link to="/rooms" className="btn-primary flex items-center gap-2 px-10">
              Explore Rooms <ArrowRight size={18} />
            </Link>
            <Link to="/booking" className="btn-outline border-white text-white hover:bg-white hover:text-primary px-10">
              Book Your Stay
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-white/80 to-transparent"></div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="text-secondary font-semibold uppercase tracking-widest text-sm">About Our Resort</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary leading-tight">
              A Serene Escape from the Ordinary
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              DK STAR RESORTS is more than just a destination; it's a sanctuary where luxury meets nature. Whether you're here for a family vacation, a grand wedding at our Function Hall, or a refreshing dip in our pristine pool, we ensure every moment is extraordinary.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-3 text-secondary">
                  <Star size={20} />
                </div>
                <span className="font-semibold text-sm">5-Star Luxury</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-3 text-secondary">
                  <Coffee size={20} />
                </div>
                <span className="font-semibold text-sm">Fine Dining</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-3 text-secondary">
                  <Wifi size={20} />
                </div>
                <span className="font-semibold text-sm">High Speed Wifi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-3 text-secondary">
                  <MapPin size={20} />
                </div>
                <span className="font-semibold text-sm">Prime Location</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Resort View"
              className="w-full h-[400px] md:h-[600px] object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-primary text-white p-6 md:p-10">
              <p className="text-3xl md:text-4xl font-heading font-bold mb-1 md:mb-2">15+</p>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-secondary font-bold">Years of Hospitality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-primary py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-secondary font-semibold uppercase tracking-widest text-sm">Our Facilities</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold">Exclusive Experiences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <Link to="/rooms" className="group relative overflow-hidden h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Luxury Rooms"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-heading font-bold mb-2">Luxury Rooms</h3>
                <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-6">
                  Experience ultimate comfort in our elegantly designed suites with panoramic nature views.
                </p>
                <div className="flex items-center text-secondary gap-2 text-sm font-bold uppercase tracking-widest">
                  View Rooms <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            {/* Service 2 */}
            <Link to="/function-hall" className="group relative overflow-hidden h-[500px]">
              <img
                src="/exquisite_venues_bg.jpg"
                alt="Function Hall"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-heading font-bold mb-2">Function Hall</h3>
                <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-6">
                  The perfect venue for weddings, corporate events, and grand celebrations with premium catering.
                </p>
                <div className="flex items-center text-secondary gap-2 text-sm font-bold uppercase tracking-widest">
                  Explore Hall <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            {/* Service 3 */}
            <Link to="/pool" className="group relative overflow-hidden h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Swimming Pool"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-heading font-bold mb-2">Swimming Pool</h3>
                <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-6">
                  Relax and rejuvenate in our temperature-controlled infinity pool overlooking the lush greenery.
                </p>
                <div className="flex items-center text-secondary gap-2 text-sm font-bold uppercase tracking-widest">
                  Pool Slots <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
