import React, { useState } from 'react';
import { useResort } from '../context/ResortContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, Calendar, Home, AlertCircle, Trash2, Printer, CheckCircle, MessageSquare, Star, X } from 'lucide-react';

const MyBookings = () => {
  const { bookings, updateBookingStatus, addFeedback } = useResort();
  const [emailInput, setEmailInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundBookings, setFoundBookings] = useState([]);
  
  // Feedback Modal State
  const [feedbackBooking, setFeedbackBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('idle');

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackStatus('loading');
    try {
      await addFeedback({
        booking_id: feedbackBooking.id,
        guest_name: feedbackBooking.guestName,
        guest_email: feedbackBooking.guestEmail,
        rating: rating,
        comments: comments,
      });
      setFeedbackStatus('success');
      setTimeout(() => {
        setFeedbackBooking(null);
        setFeedbackStatus('idle');
        setRating(5);
        setComments('');
      }, 2000);
    } catch (error) {
      console.error(error);
      setFeedbackStatus('error');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    // Find bookings matches email case insensitively
    const matches = bookings.filter(
      b => b.guestEmail.trim().toLowerCase() === emailInput.trim().toLowerCase()
    );
    setFoundBookings(matches);
    setSearched(true);
  };

  const handleCancel = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      updateBookingStatus(bookingId, 'Cancelled');
      // Update list
      setFoundBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b)
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Checked-in': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Checked-out': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-[80vh] bg-cream">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-2 block">Guest Self Service</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">Manage Bookings</h1>
          <p className="text-gray-500 mt-2 text-sm">View details, print confirmation vouchers, or cancel active reservations.</p>
        </div>

        {/* Email Search Box */}
        <div className="bg-white p-8 shadow-xl border border-gray-100 mb-10 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block">
              Enter Registered Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="email"
                placeholder="e.g. rahul@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/15 outline-none rounded-none text-primary font-medium"
              />
            </div>
            <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
              <Search size={18} /> Lookup Reservations
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searched && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-heading font-bold text-primary border-b border-gray-200 pb-3">
              Found {foundBookings.length} booking{foundBookings.length !== 1 ? 's' : ''} for {emailInput}
            </h3>

            {foundBookings.length === 0 ? (
              <div className="bg-white p-12 text-center border border-gray-100 shadow-sm">
                <AlertCircle className="mx-auto text-gray-300 mb-4 animate-pulse" size={48} />
                <p className="text-gray-600 font-bold mb-2">No Bookings Found</p>
                <p className="text-xs text-gray-400">Please make sure the spelling is correct or check with the front desk if you reserved via walk-in.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                  {foundBookings.map((booking) => (
                    <motion.div 
                      key={booking.id}
                      layout
                      className="bg-white border border-gray-100 shadow-md hover:shadow-lg transition-shadow p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
                    >
                      {/* Left: ID & Accommodation */}
                      <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Booking ID</span>
                          <span className="text-sm font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">{booking.id}</span>
                        </div>
                        <h4 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                          <Home size={18} className="text-secondary shrink-0" />
                          {booking.itemName}
                        </h4>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-secondary bg-secondary/5 px-2 py-0.5 border border-secondary/10 inline-block">
                          {booking.itemType}
                        </span>
                      </div>

                      {/* Middle: Checkin/out Dates */}
                      <div className="space-y-3 border-t md:border-t-0 md:border-l md:border-r border-gray-100 pt-4 md:pt-0 md:px-6">
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <Calendar size={15} className="text-gray-400 shrink-0" />
                          <div>
                            <p className="font-semibold">Check-In: <span className="text-primary font-bold">{booking.checkIn}</span></p>
                            <p className="font-semibold">Check-Out: <span className="text-primary font-bold">{booking.checkOut}</span></p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Guests: <span className="font-bold text-primary">{booking.guests}</span> | Amount: <span className="font-bold text-primary">₹{booking.amount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Right: Status badge & Actions */}
                      <div className="flex flex-col gap-3 justify-end items-stretch md:items-end">
                        <div className="text-center md:text-right">
                          <span className={`inline-block border px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 justify-stretch md:justify-end">
                          <button 
                            onClick={() => {
                              window.open(`/booking?bookingId=${booking.id}`, "_blank");
                            }}
                            className="btn-outline flex-1 md:flex-initial py-2 px-3 text-xs flex justify-center items-center gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer"
                          >
                            <Printer size={13} /> View Ticket
                          </button>
                          
                          {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                            <button 
                              onClick={() => handleCancel(booking.id)}
                              className="btn-outline flex-1 md:flex-initial py-2 px-3 text-xs flex justify-center items-center gap-1.5 border-red-300 text-red-500 hover:bg-red-50 hover:border-red-500"
                            >
                              <Trash2 size={13} /> Cancel
                            </button>
                          )}
                          
                          {booking.status === 'Checked-out' && (
                            <button 
                              onClick={() => { setFeedbackBooking(booking); setRating(5); setComments(''); }}
                              className="btn-primary flex-1 md:flex-initial py-2 px-3 text-xs flex justify-center items-center gap-1.5"
                            >
                              <MessageSquare size={13} /> Leave Feedback
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* FEEDBACK MODAL */}
      <AnimatePresence>
        {feedbackBooking && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-md w-full rounded-2xl p-8 relative shadow-2xl"
            >
              <button onClick={() => setFeedbackBooking(null)} className="absolute top-4 right-4 text-gray-400 hover:text-primary">
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-heading font-bold text-primary">How was your stay?</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{feedbackBooking.itemName}</p>
              </div>

              {feedbackStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                  <p className="font-bold text-primary">Thank you for your feedback!</p>
                  <p className="text-sm text-gray-500 mt-1">We hope to see you again soon.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  {/* Star Rating */}
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          size={32} 
                          className={star <= rating ? 'text-secondary fill-secondary' : 'text-gray-300'} 
                        />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Additional Comments</label>
                    <textarea 
                      required
                      value={comments}
                      onChange={e => setComments(e.target.value)}
                      placeholder="Tell us what you loved, or how we can improve..."
                      className="w-full border border-gray-200 focus:border-secondary outline-none p-3 text-sm h-32 rounded-lg resize-none"
                    />
                  </div>

                  {feedbackStatus === 'error' && (
                    <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded border border-red-100">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button 
                    type="submit" 
                    disabled={feedbackStatus === 'loading'}
                    className="w-full btn-primary py-3 flex items-center justify-center disabled:opacity-50"
                  >
                    {feedbackStatus === 'loading' ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
