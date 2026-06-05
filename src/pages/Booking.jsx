import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Mail, Home, MapPin, Printer, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useResort } from '../context/ResortContext';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const { rooms, halls, bookings, addBooking } = useResort();

  // Search parameters for pre-filling
  const prefillType = searchParams.get('type') || 'room'; // 'room' or 'hall'
  const prefillId = searchParams.get('id') || '';

  // Form states
  const [itemType, setItemType] = useState(prefillType);
  const [itemId, setItemId] = useState(prefillId);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Booking result screen
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Synchronize initial selections from search parameters when rooms/halls are loaded
  useEffect(() => {
    if (prefillType) setItemType(prefillType);
    if (prefillId) {
      setItemId(prefillType === 'room' ? Number(prefillId) : prefillId);
    } else if (prefillType === 'room' && rooms.length > 0) {
      setItemId(rooms[0].id);
    } else if (prefillType === 'hall' && halls.length > 0) {
      setItemId(halls[0].id);
    }
  }, [prefillType, prefillId, rooms, halls]);

  // Adjust item selector when type changes
  const handleTypeChange = (type) => {
    setItemType(type);
    if (type === 'room' && rooms.length > 0) {
      setItemId(rooms[0].id);
    } else if (type === 'hall' && halls.length > 0) {
      setItemId(halls[0].id);
    }
  };

  // Find currently selected item
  const selectedItem = itemType === 'room'
    ? rooms.find(r => r.id === Number(itemId))
    : halls.find(h => h.id === itemId);

  // Calculate pricing breakdown
  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = date2 - date1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  const basePrice = selectedItem ? selectedItem.price : 0;
  const subtotal = basePrice * days;
  const gst = Math.round(subtotal * 0.18); // 18% GST for luxury stays
  const total = subtotal + gst;

  // Check date availability
  const checkAvailability = (id, type, start, end) => {
    if (!start || !end) return true;
    const reqStart = new Date(start);
    const reqEnd = new Date(end);

    // Filter bookings for the same room/hall that are not cancelled
    const conflicts = bookings.filter(b => {
      if (b.status === 'Cancelled') return false;
      const bId = type === 'room' ? Number(b.itemId) : b.itemId;
      const matchId = type === 'room' ? Number(id) : id;
      if (bId !== matchId || b.itemType !== type) return false;

      const resStart = new Date(b.checkIn);
      const resEnd = new Date(b.checkOut);

      // Overlap condition: reqStart < resEnd && reqEnd > resStart
      return reqStart < resEnd && reqEnd > resStart;
    });

    return conflicts.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!itemId) {
      setErrorMessage('Please select a room or function hall.');
      return;
    }
    if (!checkIn || !checkOut) {
      setErrorMessage('Please select check-in and check-out dates.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (checkIn < today) {
      setErrorMessage('Check-in date cannot be in the past.');
      return;
    }
    if (checkOut <= checkIn) {
      setErrorMessage('Check-out date must be after check-in date.');
      return;
    }

    // Availability validation
    const available = checkAvailability(itemId, itemType, checkIn, checkOut);
    if (!available) {
      setErrorMessage(`This ${itemType === 'room' ? 'room' : 'venue'} is already reserved for the selected dates. Please choose different dates.`);
      return;
    }

    // Book it!
    const bookingDetails = {
      itemId,
      itemName: selectedItem.name,
      itemType,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      guests: Number(guestsCount),
      status: 'Confirmed' // User bookings are auto-confirmed in this demo
    };

    const newBooking = addBooking(bookingDetails);
    setConfirmedBooking(newBooking);
  };

  const handlePrint = () => {
    window.print();
  };

  if (confirmedBooking) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex items-center justify-center px-4 print:p-0 print:bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white shadow-2xl border border-gray-200 overflow-hidden print:shadow-none print:border-none"
        >
          {/* Header */}
          <div className="bg-primary text-white p-8 text-center relative print:bg-white print:text-primary print:border-b">
            <CheckCircle className="mx-auto mb-4 text-secondary print:hidden" size={48} />
            <h2 className="text-3xl font-heading font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-secondary uppercase tracking-widest text-xs font-semibold">Your stay has been reserved successfully</p>
          </div>

          {/* Ticket Body */}
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Booking ID</p>
                <p className="text-xl font-bold text-primary">{confirmedBooking.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Status</p>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                  {confirmedBooking.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Guest Details</p>
                <p className="font-bold text-primary text-sm">{confirmedBooking.guestName}</p>
                <p className="text-xs text-gray-500">{confirmedBooking.guestEmail}</p>
                <p className="text-xs text-gray-500">{confirmedBooking.guestPhone}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Accommodation</p>
                <p className="font-bold text-primary text-sm">{confirmedBooking.itemName}</p>
                <p className="text-xs text-secondary font-bold uppercase tracking-widest">{confirmedBooking.itemType}</p>
                <p className="text-xs text-gray-500">{confirmedBooking.guests} Guests</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 bg-gray-50 px-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Check-In</p>
                <p className="font-bold text-primary text-sm">{confirmedBooking.checkIn}</p>
                <p className="text-xs text-gray-500">From 12:00 PM</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Check-Out</p>
                <p className="font-bold text-primary text-sm">{confirmedBooking.checkOut}</p>
                <p className="text-xs text-gray-500">Before 11:00 AM</p>
              </div>
            </div>

            {/* Price Detail */}
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Invoice Summary</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{confirmedBooking.itemName} x {Math.ceil((new Date(confirmedBooking.checkOut) - new Date(confirmedBooking.checkIn))/(1000*3600*24))} days</span>
                  <span className="font-semibold text-primary">₹{(confirmedBooking.amount / 1.18).toFixed(0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="font-semibold text-primary">₹{(confirmedBooking.amount - (confirmedBooking.amount / 1.18)).toFixed(0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold">
                  <span className="text-primary font-heading">Total Amount Paid</span>
                  <span className="text-secondary font-heading">₹{confirmedBooking.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Print Note */}
            <div className="text-[10px] text-center text-gray-400 border-t border-dashed border-gray-200 pt-4">
              Please present this voucher or Booking ID at the reception during check-in.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 p-6 flex flex-col md:flex-row gap-4 justify-between border-t border-gray-100 print:hidden">
            <button 
              onClick={() => setConfirmedBooking(null)}
              className="btn-outline flex items-center justify-center gap-2 text-xs py-3 w-full md:w-auto"
            >
              <ArrowLeft size={16} /> New Booking
            </button>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <button 
                onClick={handlePrint}
                className="btn-outline flex items-center justify-center gap-2 text-xs py-3 bg-secondary/15 border-secondary text-secondary hover:bg-secondary hover:text-white"
              >
                <Printer size={16} /> Print Ticket
              </button>
              <Link 
                to="/my-bookings"
                className="btn-primary flex items-center justify-center gap-2 text-xs py-3"
              >
                Go to My Bookings
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="bg-primary py-20 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">Book Your Stay</h1>
        <p className="text-secondary font-bold uppercase tracking-[0.3em] text-sm">Experience Timeless Luxury</p>
      </section>

      <section className="section-container">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-heading font-bold mb-8 text-primary border-b-2 border-secondary inline-block pb-2">Reservation Details</h2>
            
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex gap-3 items-center">
                <AlertTriangle size={20} className="shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Type Selection */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-6">
                <button
                  type="button"
                  onClick={() => handleTypeChange('room')}
                  className={`py-3 text-center border font-bold uppercase tracking-wider text-xs transition-colors ${itemType === 'room' ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                  Book a Room
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('hall')}
                  className={`py-3 text-center border font-bold uppercase tracking-wider text-xs transition-colors ${itemType === 'hall' ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                  Book a Function Hall
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Specific Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Home size={14} className="text-secondary" /> {itemType === 'room' ? 'Select Room' : 'Select Hall'}
                  </label>
                  <select 
                    value={itemId} 
                    onChange={(e) => setItemId(itemType === 'room' ? Number(e.target.value) : e.target.value)}
                    className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors text-primary font-semibold"
                  >
                    {itemType === 'room' ? (
                      rooms.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} - ₹{r.price.toLocaleString('en-IN')}/night
                        </option>
                      ))
                    ) : (
                      halls.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} - ₹{h.price.toLocaleString('en-IN')}/day
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <User size={14} className="text-secondary" /> Number of Guests
                  </label>
                  <select 
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors text-primary font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 20, 50, 100, 200, 500, 1000].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Calendar size={14} className="text-secondary" /> Check-In Date
                  </label>
                  <input 
                    required
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors text-primary font-semibold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Calendar size={14} className="text-secondary" /> Check-Out Date
                  </label>
                  <input 
                    required
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors text-primary font-semibold" 
                  />
                </div>
              </div>

              {/* Guest Info */}
              <div className="space-y-6 pt-6">
                <h3 className="text-xl font-heading font-bold text-primary border-b border-gray-100 pb-2">Guest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors text-primary" 
                      placeholder="Enter your name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors text-primary" 
                      placeholder="+91 00000 00000" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full border-b border-gray-300 focus:border-secondary outline-none py-3 bg-transparent transition-colors text-primary" 
                    placeholder="email@example.com" 
                  />
                </div>
              </div>

              {/* Real-time Pricing Summary */}
              {days > 0 && selectedItem && (
                <div className="bg-cream p-6 border-l-4 border-secondary space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Cost Summary</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span>{selectedItem.name} ({days} {itemType === 'room' ? 'Nights' : 'Days'})</span>
                      <span className="font-semibold text-primary">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>GST Tax (18%)</span>
                      <span>₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
                      <span className="text-primary font-heading">Estimated Total</span>
                      <span className="text-secondary font-heading">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6">
                <button type="submit" className="w-full btn-primary py-5 text-base shadow-lg shadow-primary/20">
                  Book Reservation Now
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em]">
                  Secure booking verified by resort desk
                </p>
              </div>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-8">
            {selectedItem && (
              <div className="bg-white border border-gray-100 shadow-md p-6 space-y-4">
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-48 object-cover" />
                <div>
                  <span className="text-secondary text-[10px] uppercase font-bold tracking-widest">{selectedItem.type}</span>
                  <h4 className="text-xl font-heading font-bold text-primary">{selectedItem.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2">{selectedItem.description}</p>
                </div>
              </div>
            )}

            <div className="bg-primary text-white p-8">
              <h3 className="text-xl font-heading font-bold mb-6 text-secondary tracking-widest uppercase">Why Book with Us?</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">✓</span>
                  Best Price Guaranteed
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">✓</span>
                  No Hidden Charges
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">✓</span>
                  Complimentary Breakfast
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">✓</span>
                  Free Infinity Pool Access
                </li>
              </ul>
            </div>

            <div className="bg-cream p-8 border border-gray-200">
              <h3 className="text-xl font-heading font-bold mb-6 text-primary tracking-widest uppercase">Need Help?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-secondary" size={18} />
                  <span className="text-sm font-semibold">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-secondary" size={18} />
                  <span className="text-sm font-semibold">booking@dkstar.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
