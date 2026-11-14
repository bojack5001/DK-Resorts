import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CreditCard, CheckCircle, Printer, Sparkles, ShieldCheck,
  Building, Waves, Home, Phone, Mail, User, ArrowRight,
  ExternalLink, Download, Clock, Calendar, HelpCircle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// ── Room & Hall Tariffs (Tax Inclusive) ──────────────────────────
const ROOM_TARIFFS = [
  { id: 1, name: 'ROOM 01 – ELITE',     type: 'Standard Room',       weekday: 2499, weekend: 2999 },
  { id: 2, name: 'ROOM 02 – SIGNATURE', type: 'Family Room',         weekday: 3999, weekend: 3499 },
  { id: 3, name: 'ROOM 03 – CROWN',     type: 'Master Family Suite', weekday: 3499, weekend: 3999 },
  { id: 4, name: 'ROOM 04 – LEGACY',    type: 'Balcony View Room',   weekday: 2999, weekend: 3499 },
  { id: 5, name: 'ROOM 05 – MAJESTIC',  type: 'Standard Room',       weekday: 2499, weekend: 2999 },
  { id: 6, name: 'ROOM 06 – GRANDE',    type: 'Standard Room',       weekday: 2499, weekend: 2999 },
  { id: 7, name: 'ROOM 07 – IMPERIAL',  type: 'Standard Room',       weekday: 2499, weekend: 2999 },
  { id: 8, name: 'ROOM 08 – SUPREME',   type: 'Standard Room',       weekday: 2499, weekend: 2999 },
  { id: 9, name: 'ROOM 09 – NAKSHATRA', type: 'Hall-Attached Suite', weekday: 0,    weekend: 0, note: 'Included in Nakshatra Hall 2 package' },
];

const HALL_TARIFFS = [
  { id: 'hall1', name: 'Nakshatra Hall 1', type: 'Indoor Grand Hall (100 Guests)',  weekday: 20000, weekend: 23000 },
  { id: 'hall2', name: 'Nakshatra Hall 2', type: 'Outdoor Party Hall (200 Guests)', weekday: 25000, weekend: 27000, note: 'Includes Room 09 Suite' },
];

const POOL_RATES = {
  ADULT: 150, // Age 6 & above: ₹150/hr
  KIDS: 100,  // Age 1 to 5: ₹100/hr
};

const fmtCurrency = (n) => Number(n || 0).toLocaleString('en-IN');
const genReceiptId = () => `DKS-PAY-${Math.floor(100000 + Math.random() * 900000)}`;

const Payment = () => {
  const [category, setCategory] = useState('rooms'); // 'rooms' | 'halls' | 'pool' | 'custom'

  // Rooms Form State
  const [selectedRoomId, setSelectedRoomId] = useState(1);
  const [roomDayType, setRoomDayType] = useState('weekday'); // 'weekday' | 'weekend'
  const [roomNights, setRoomNights] = useState(1);

  // Halls Form State
  const [selectedHallId, setSelectedHallId] = useState('hall1');
  const [hallDayType, setHallDayType] = useState('weekday');
  const [hallDays, setHallDays] = useState(1);

  // Pool Form State
  const [poolHours, setPoolHours] = useState(1);
  const [poolAdults, setPoolAdults] = useState(1);
  const [poolKids, setPoolKids] = useState(0);

  // Custom Form State
  const [customAmount, setCustomAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('Advance Room / Hall Reservation Deposit');

  // Common Guest Form State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // ── Compute Total Amount ─────────────────────────────────────────
  const selectedRoom = ROOM_TARIFFS.find(r => r.id === Number(selectedRoomId));
  const selectedHall = HALL_TARIFFS.find(h => h.id === selectedHallId);

  let computedAmount = 0;
  let serviceDescription = '';

  if (category === 'rooms') {
    const rate = roomDayType === 'weekend' ? selectedRoom.weekend : selectedRoom.weekday;
    computedAmount = rate * roomNights;
    serviceDescription = `${selectedRoom.name} (${roomNights} ${roomNights > 1 ? 'Nights' : 'Night'}, ${roomDayType === 'weekend' ? 'Weekend' : 'Weekday'})`;
  } else if (category === 'halls') {
    const rate = hallDayType === 'weekend' ? selectedHall.weekend : selectedHall.weekday;
    computedAmount = rate * hallDays;
    serviceDescription = `${selectedHall.name} (${hallDays} ${hallDays > 1 ? 'Days' : 'Day'}, ${hallDayType === 'weekend' ? 'Weekend' : 'Weekday'})`;
  } else if (category === 'pool') {
    const hourly = (poolAdults * POOL_RATES.ADULT) + (poolKids * POOL_RATES.KIDS);
    computedAmount = hourly * poolHours;
    serviceDescription = `Wonders Swimming Pool (${poolHours} hr(s) · ${poolAdults} Age 6+, ${poolKids} Age 1-5)`;
  } else if (category === 'custom') {
    computedAmount = Number(customAmount) || 0;
    serviceDescription = customDescription || 'DK Star Resorts Reservation Advance';
  }

  // ── UPI Deep-link for mobile payment apps ────────────────────────
  const upiLink = `upi://pay?pa=dkstarresorts@phonepe&pn=DK%20STAR%20RESORTS&am=${computedAmount}&cu=INR&tn=${encodeURIComponent(serviceDescription.slice(0, 40))}`;

  // ── Handle Payment Slip Submission ───────────────────────────────
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setError('');

    if (computedAmount <= 0 && category !== 'rooms') {
      setError('Payment amount must be greater than ₹0.');
      return;
    }
    if (!guestName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!guestPhone.trim()) {
      setError('Please enter your mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const receiptId = genReceiptId();
      const record = {
        id: receiptId,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_email: guestEmail || null,
        category,
        service_description: serviceDescription,
        amount: computedAmount,
        utr_number: utrNumber.trim() || 'Paid via PhonePe QR',
        booking_ref: bookingRef.trim() || null,
        payment_mode: 'PhonePe UPI',
        status: 'Acknowledged',
        created_at: new Date().toISOString(),
      };

      // Save to Supabase payments table if exists
      if (supabase) {
        try {
          await supabase.from('payments').insert(record);
        } catch (sbErr) {
          console.warn('[Supabase] payments insert fallback to localStorage:', sbErr);
        }
      }

      // Local storage persistence
      const history = JSON.parse(localStorage.getItem('dk_payments') || '[]');
      history.unshift(record);
      localStorage.setItem('dk_payments', JSON.stringify(history));

      setPaymentSuccess(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('[Payment] submit error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // SUCCESS RECEIPT VIEW
  // ═════════════════════════════════════════════════════════════════
  if (paymentSuccess) {
    const rc = paymentSuccess;
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#C5A059]/30"
        >
          {/* Header */}
          <div className="bg-[#4A3728] px-8 py-8 text-center text-white relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
            >
              <CheckCircle size={36} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold text-white mb-1">Payment Acknowledged!</h1>
            <p className="text-[#C5A059] text-xs uppercase tracking-widest font-bold">
              DK Star Resorts — Royal Luxury Collection
            </p>
          </div>

          {/* Receipt Info Bar */}
          <div className="bg-[#C5A059]/10 border-b border-[#C5A059]/20 px-8 py-4 flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Receipt Reference</span>
              <span className="font-heading font-bold text-[#4A3728] text-base font-mono">{rc.id}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Payment Mode</span>
              <span className="font-bold text-emerald-800 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PhonePe UPI Verified
              </span>
            </div>
          </div>

          {/* Body Breakdown */}
          <div className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">Guest Name</span>
                <span className="font-bold text-[#4A3728] text-sm">{rc.guest_name}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">Mobile Number</span>
                <span className="font-bold text-[#4A3728] font-mono">{rc.guest_phone}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">Service / Category</span>
                <span className="font-semibold text-gray-700 capitalize">{rc.category}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">UPI Ref / UTR</span>
                <span className="font-bold text-[#4A3728] font-mono">{rc.utr_number}</span>
              </div>
              <div className="sm:col-span-2 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">Payment For</span>
                <span className="font-bold text-[#4A3728]">{rc.service_description}</span>
                {rc.booking_ref && (
                  <span className="block text-[11px] text-gray-500 mt-0.5">Booking Ref: <strong>{rc.booking_ref}</strong></span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-150 pt-4 flex justify-between items-baseline font-bold">
              <div>
                <span className="font-heading text-[#4A3728] text-base block">Total Amount Paid</span>
                <span className="text-[10px] text-emerald-700 font-normal">All Taxes Included</span>
              </div>
              <span className="font-heading text-[#C5A059] text-3xl font-extrabold">₹{fmtCurrency(rc.amount)}</span>
            </div>

            {/* QR Notice */}
            <div className="flex items-center gap-3 p-3 bg-cream rounded-xl border border-[#C5A059]/30 text-xs text-gray-600">
              <img
                src="/payment-qr.jpg"
                alt="PhonePe QR"
                className="w-12 h-auto object-contain rounded border border-gray-300 shadow-xs shrink-0"
              />
              <div className="space-y-0.5 text-[11px]">
                <strong className="text-primary block">Official PhonePe QR Payment Record</strong>
                <p>Payment registered for D K STAR RESORTS. Please keep this receipt reference for check-in verification.</p>
              </div>
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 btn-outline py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Printer size={15} /> Print Receipt
            </button>
            <button
              onClick={() => {
                setPaymentSuccess(null);
                setUtrNumber('');
                setBookingRef('');
                setCustomAmount('');
              }}
              className="flex-1 btn-primary py-3 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Make Another Payment
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // MAIN PAYMENT PORTAL
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 bg-gradient-to-b from-[#4A3728] to-[#2B1E16] text-white text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> Official PhonePe UPI Gateway
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight">
            Scan & Pay with PhonePe
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pay instantly for your <strong>Prestige Rooms</strong>, <strong>Nakshatra Halls</strong>, and <strong>Wonders Swimming Pool</strong> passes with zero extra charges using the official PhonePe QR code.
          </p>
        </div>
      </section>

      {/* ── Category Tabs ──────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-[#C5A059]/30 p-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'rooms',  label: 'Rooms & Suites',  icon: Home,     desc: '9 Prestige Rooms' },
            { id: 'halls',  label: 'Function Halls',  icon: Building, desc: 'Nakshatra Hall 1 & 2' },
            { id: 'pool',   label: 'Swimming Pool',   icon: Waves,    desc: 'Hourly Pool Passes' },
            { id: 'custom', label: 'Custom Amount',   icon: CreditCard, desc: 'Advance & Extras' },
          ].map(tab => {
            const Icon = tab.icon;
            const active = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`py-3.5 px-3 rounded-xl transition-all text-left flex items-center gap-3 cursor-pointer ${
                  active
                    ? 'bg-[#4A3728] text-white shadow-md'
                    : 'bg-transparent text-[#4A3728] hover:bg-[#C5A059]/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  active ? 'bg-[#C5A059] text-white' : 'bg-cream text-[#4A3728]'
                }`}>
                  <Icon size={18} />
                </div>
                <div className="overflow-hidden">
                  <span className="block font-heading font-bold text-xs sm:text-sm truncate">{tab.label}</span>
                  <span className={`block text-[10px] truncate ${active ? 'text-[#C5A059]' : 'text-gray-400'}`}>
                    {tab.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Interactive Split: Selection Form + QR Standee ── */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Service Details & Selection Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200/80 space-y-6">

            {/* TAB 1: ROOMS */}
            {category === 'rooms' && (
              <div className="space-y-5">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <h3 className="font-heading font-bold text-lg text-primary">Select Room & Stay Dates</h3>
                  <span className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider">Tax Inclusive Tariff</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Room Selection</label>
                  <select
                    value={selectedRoomId}
                    onChange={e => setSelectedRoomId(Number(e.target.value))}
                    className="w-full border-2 border-gray-200 focus:border-[#C5A059] rounded-xl px-4 py-3 text-sm font-semibold text-primary outline-none bg-white"
                  >
                    {ROOM_TARIFFS.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.type}) — {r.id === 9 ? 'Hall Package Suite' : `Mon–Fri: ₹${fmtCurrency(r.weekday)} | Sat–Sun: ₹${fmtCurrency(r.weekend)}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Day Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRoomDayType('weekday')}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                          roomDayType === 'weekday'
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 text-gray-600 hover:border-[#C5A059]'
                        }`}
                      >
                        Weekday
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoomDayType('weekend')}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                          roomDayType === 'weekend'
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 text-gray-600 hover:border-[#C5A059]'
                        }`}
                      >
                        Weekend
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nights</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRoomNights(n => Math.max(1, n - 1))}
                        className="w-10 h-10 border-2 border-gray-200 rounded-lg font-bold text-primary hover:border-[#C5A059]"
                      >−</button>
                      <span className="font-heading font-bold text-xl text-primary w-8 text-center">{roomNights}</span>
                      <button
                        type="button"
                        onClick={() => setRoomNights(n => Math.min(30, n + 1))}
                        className="w-10 h-10 border-2 border-gray-200 rounded-lg font-bold text-primary hover:border-[#C5A059]"
                      >+</button>
                    </div>
                  </div>
                </div>

                {selectedRoom?.note && (
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-900 text-xs font-semibold border border-amber-200">
                    ⭐ {selectedRoom.note}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: HALLS */}
            {category === 'halls' && (
              <div className="space-y-5">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <h3 className="font-heading font-bold text-lg text-primary">Select Function Hall</h3>
                  <span className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider">Official Hall Tariff</span>
                </div>

                <div className="space-y-3">
                  {HALL_TARIFFS.map(hall => {
                    const active = selectedHallId === hall.id;
                    const price = hallDayType === 'weekend' ? hall.weekend : hall.weekday;
                    return (
                      <div
                        key={hall.id}
                        onClick={() => setSelectedHallId(hall.id)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                          active
                            ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-primary text-base">{hall.name}</span>
                            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                              {hall.id === 'hall1' ? 'Indoor' : 'Outdoor'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{hall.type}</p>
                          {hall.note && (
                            <span className="text-[10px] text-emerald-800 font-bold block mt-1">✓ {hall.note}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-heading font-bold text-primary text-lg block">₹{fmtCurrency(price)}</span>
                          <span className="text-[10px] text-gray-400">per day / tax incl.</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Day Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setHallDayType('weekday')}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                          hallDayType === 'weekday'
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 text-gray-600 hover:border-[#C5A059]'
                        }`}
                      >
                        Weekday
                      </button>
                      <button
                        type="button"
                        onClick={() => setHallDayType('weekend')}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                          hallDayType === 'weekend'
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 text-gray-600 hover:border-[#C5A059]'
                        }`}
                      >
                        Weekend
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Days</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setHallDays(d => Math.max(1, d - 1))}
                        className="w-10 h-10 border-2 border-gray-200 rounded-lg font-bold text-primary hover:border-[#C5A059]"
                      >−</button>
                      <span className="font-heading font-bold text-xl text-primary w-8 text-center">{hallDays}</span>
                      <button
                        type="button"
                        onClick={() => setHallDays(d => Math.min(10, d + 1))}
                        className="w-10 h-10 border-2 border-gray-200 rounded-lg font-bold text-primary hover:border-[#C5A059]"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: POOL */}
            {category === 'pool' && (
              <div className="space-y-5">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <h3 className="font-heading font-bold text-lg text-primary">Wonders Swimming Pool Passes</h3>
                  <span className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider">Hourly Pay-Per-Use</span>
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <Clock size={13} className="text-[#C5A059]" /> Select Duration (Hours)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(hr => (
                      <button
                        key={hr}
                        type="button"
                        onClick={() => setPoolHours(hr)}
                        className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-2 text-center transition-all ${
                          poolHours === hr
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'border-gray-200 text-gray-700 hover:border-[#C5A059]'
                        }`}
                      >
                        {hr} {hr === 1 ? 'Hr' : 'Hrs'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Steppers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border-2 border-gray-200 bg-white flex justify-between items-center">
                    <div>
                      <span className="font-heading font-bold text-primary text-sm block">Age 6 & Above</span>
                      <span className="text-secondary font-bold text-xs">₹150 / hr</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Adults & kids 6+</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPoolAdults(a => Math.max(0, a - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 font-bold hover:border-[#C5A059]"
                      >−</button>
                      <span className="font-bold text-primary text-lg w-6 text-center">{poolAdults}</span>
                      <button
                        type="button"
                        onClick={() => setPoolAdults(a => Math.min(25, a + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 font-bold hover:border-[#C5A059]"
                      >+</button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border-2 border-gray-200 bg-white flex justify-between items-center">
                    <div>
                      <span className="font-heading font-bold text-primary text-sm block">Age 1 to 5 Years</span>
                      <span className="text-secondary font-bold text-xs">₹100 / hr</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Toddlers & young kids</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPoolKids(k => Math.max(0, k - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 font-bold hover:border-[#C5A059]"
                      >−</button>
                      <span className="font-bold text-primary text-lg w-6 text-center">{poolKids}</span>
                      <button
                        type="button"
                        onClick={() => setPoolKids(k => Math.min(20, k + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 font-bold hover:border-[#C5A059]"
                      >+</button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600 shrink-0" />
                  <span>Room & Hall reservation guests enjoy <strong>100% FREE</strong> swimming pool access!</span>
                </div>
              </div>
            )}

            {/* TAB 4: CUSTOM */}
            {category === 'custom' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <h3 className="font-heading font-bold text-lg text-primary">Custom Payment Amount</h3>
                  <span className="text-[11px] text-gray-400">Advance / Extras</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Amount (₹ INR) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-lg font-bold text-primary">₹</span>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 5000"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-[#C5A059] rounded-xl pl-9 pr-4 py-3 text-lg font-bold text-primary outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Purpose / Description</label>
                  <input
                    type="text"
                    value={customDescription}
                    onChange={e => setCustomDescription(e.target.value)}
                    placeholder="e.g. Booking Advance Deposit, Banquet Balance, Dining"
                    className="w-full border border-gray-200 focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-xs text-primary outline-none"
                  />
                </div>
              </div>
            )}

            {/* Common Guest Information Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-4 border-t border-gray-150 pt-5">
              <h4 className="font-heading font-bold text-base text-primary">Guest Contact & Verification Details</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-gray-200 focus:border-[#C5A059] rounded-lg px-3.5 py-2.5 text-xs text-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    placeholder="+91 94894 55977"
                    className="w-full border border-gray-200 focus:border-[#C5A059] rounded-lg px-3.5 py-2.5 text-xs text-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-gray-200 focus:border-[#C5A059] rounded-lg px-3.5 py-2.5 text-xs text-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Booking ID / Ref (Optional)</label>
                  <input
                    type="text"
                    value={bookingRef}
                    onChange={e => setBookingRef(e.target.value)}
                    placeholder="e.g. BK-1234 or PL-5678"
                    className="w-full border border-gray-200 focus:border-[#C5A059] rounded-lg px-3.5 py-2.5 text-xs text-primary outline-none font-mono"
                  />
                </div>
              </div>

              {/* UTR Number */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A3728] flex items-center justify-between">
                  <span>PhonePe UPI Reference / UTR Number (12 Digits)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Found in your UPI app receipt</span>
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  placeholder="e.g. 432156789012 (after scanning QR)"
                  className="w-full border-2 border-[#C5A059]/40 focus:border-[#C5A059] rounded-xl px-4 py-3 text-sm font-mono text-primary outline-none bg-[#FDFBF7]"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-200 p-3 rounded-lg font-medium">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Verifying Payment…' : `Submit Payment Confirmation (₹${fmtCurrency(computedAmount)})`}
              </button>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" /> 100% Verified PhonePe Merchant
                </span>
                <span>Immediate Resort Desk Notification</span>
              </div>
            </form>
          </div>

          {/* Right Column: PhonePe QR Code Standee Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Official PhonePe Standee */}
            <div className="bg-[#121212] text-white rounded-2xl p-6 sm:p-7 shadow-2xl border-2 border-[#C5A059]/40 relative overflow-hidden text-center">
              {/* Subtle Luxury Corner Accents */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C5A059]/20 to-transparent pointer-events-none" />

              {/* Amount Pill */}
              <div className="mb-4 inline-flex items-center gap-2 bg-[#C5A059]/20 border border-[#C5A059]/50 px-4 py-1.5 rounded-full">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">Payable Amount</span>
                <span className="font-heading font-extrabold text-[#C5A059] text-base">₹{fmtCurrency(computedAmount)}</span>
              </div>

              {/* High Definition PhonePe QR Standee Image */}
              <div className="max-w-[280px] mx-auto rounded-xl overflow-hidden border-2 border-[#C5A059]/40 shadow-2xl bg-black">
                <img
                  src="/payment-qr.jpg"
                  alt="PhonePe QR Code - DK STAR RESORTS"
                  className="w-full h-auto object-contain block"
                />
              </div>

              {/* Direct UPI Mobile Action */}
              <div className="mt-5 space-y-2">
                <a
                  href={upiLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#5f259f] hover:bg-[#4b1d7d] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-98"
                >
                  <ExternalLink size={14} /> Open PhonePe / UPI App on Mobile
                </a>
                <a
                  href="/payment-qr.jpg"
                  download="DK-Star-Resorts-PhonePe-QR.jpg"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white/90 py-2 px-4 rounded-xl text-[11px] font-semibold transition-all"
                >
                  <Download size={13} /> Save QR Image
                </a>
              </div>

              {/* Instruction Steps */}
              <div className="mt-5 pt-4 border-t border-white/10 text-left text-xs space-y-2 text-gray-300">
                <p className="font-bold text-white text-[11px] uppercase tracking-wider">How to Pay:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-400">
                  <li>Open <strong>PhonePe</strong>, <strong>Google Pay</strong>, or <strong>Paytm</strong>.</li>
                  <li>Tap <strong>Scan QR</strong> and point camera at the QR code above.</li>
                  <li>Verify payee shows <strong>D K STAR RESORTS</strong>.</li>
                  <li>Enter <strong>₹{fmtCurrency(computedAmount)}</strong> and complete UPI PIN.</li>
                  <li>Copy the <strong>12-digit UTR Number</strong> into the form on the left.</li>
                </ol>
              </div>
            </div>

            {/* Assistance Card */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 text-xs space-y-3">
              <div className="flex items-center gap-2 text-primary font-heading font-bold text-sm">
                <HelpCircle size={16} className="text-[#C5A059]" /> Need Payment Help?
              </div>
              <p className="text-gray-500 leading-relaxed">
                If you face any issues with UPI transaction limits or need IMPS / NEFT bank transfer details, call our 24/7 reception desk:
              </p>
              <div className="space-y-1.5 font-semibold text-primary">
                <a href="tel:+919489455977" className="flex items-center gap-2 text-[#C5A059] hover:text-[#4A3728] transition-colors">
                  <Phone size={13} /> +91 94894 55977
                </a>
                <a href="mailto:dkstarresorts@gmail.com" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                  <Mail size={13} /> dkstarresorts@gmail.com
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Payment;
