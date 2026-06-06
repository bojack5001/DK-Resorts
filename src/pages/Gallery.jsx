import React from 'react';
import { useResort } from '../context/ResortContext';

const Gallery = () => {
  const { gallery } = useResort();

  return (
    <div className="pt-32 pb-20">
      <div className="section-container">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-primary">Visual Journey</h1>
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-sm">A Glimpse into DK STAR RESORTS</p>
        </div>
        
        {gallery.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium bg-cream/40 rounded-xl border border-secondary/10">
            No memories uploaded to the visual journey yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((item, index) => (
              <div key={item.id || index} className="group relative overflow-hidden h-80 shadow-md rounded-lg">
                <img 
                  src={item.url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/45 transition-colors duration-500 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold uppercase tracking-widest text-xs">View Large</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
