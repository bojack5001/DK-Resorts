import React from 'react';

const Pool = () => {
  return (
    <div className="pt-32 pb-20 section-container text-center min-h-[60vh] flex flex-col justify-center">
      <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-primary">Crystal Infinity Pool</h1>
      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-gray-600 text-lg">
          Our temperature-controlled infinity pool offers a breathtaking view of the surrounding hills. Perfect for a morning lap or a relaxing evening dip.
        </p>
        <div className="bg-cream p-8 border border-secondary/20">
          <h3 className="text-xl font-heading font-bold mb-4 text-secondary uppercase tracking-widest">Timing Slots</h3>
          <ul className="space-y-2 text-sm">
            <li>Morning: 06:00 AM - 10:00 AM</li>
            <li>Afternoon: 03:00 PM - 06:00 PM</li>
            <li>Evening: 07:00 PM - 09:00 PM</li>
          </ul>
        </div>
        <p className="text-sm text-gray-500 italic pt-6">Online booking for pool slots is coming soon. Please contact the front desk for immediate reservations.</p>
      </div>
    </div>
  );
};

export default Pool;
