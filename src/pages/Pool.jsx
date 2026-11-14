import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Waves, Sun, Sunset, Moon, Users, Calendar, Phone, Mail,
  User, CheckCircle, Clock, Droplets, Wind, Thermometer,
  ArrowLeft, Printer, Star, Sparkles, ShieldCheck
} from 'lucide-react';

// ─── Hourly Pool Rates ─────────────────────────────────────────
const POOL_RATES = {
  KIDS: 100,  // Age 1 to 5: ₹100 per hour
  ADULT: 150, // Age 6 & above: ₹150 per hour
};

// ─── Slot Config ─────────────────────────────────────────────
const SLOTS = [
  {
    id: 'morning',
    label: 'Morning Session',
    time: '06:00 AM – 10:00 AM',
    icon: Sun,
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    desc: 'Start your day with a refreshing swim as the sun rises over the hills.',
    perks: ['Lifeguard on duty', 'Fresh towels provided', 'Morning sunshine deck'],
  },
  {
    id: 'afternoon',
    label: 'Afternoon Splash',
    time: '03:00 PM – 06:00 PM',
    icon: Sunset,
    color: 'from-blue-400 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    desc: 'Cool off from the afternoon heat in our crystal leisure pool with mushroom fountain.',
    perks: ['Mushroom fountain active', 'Inflatable floats available', 'Shaded loungers'],
  },
  {
    id: 'evening',
    label: 'Evening Glow',
    time: '07:00 PM – 09:00 PM',
    icon: Moon,
    color: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-300',
    desc: 'A magical twilight swim under ambient underwater LED lighting.',
    perks: ['Submerged ambient lighting', 'Poolside beverages', 'Exclusive & serene'],
  },
];

// ─── Features strip ──────────────────────────────────────────
const FEATURES = [
  { icon: Thermometer, label: 'Temp. Controlled', value: '28°C' },
  { icon: Droplets,   label: 'Pool Size',         value: '25m × 12m' },
  { icon: Users,      label: 'Max Capacity',       value: '40 guests' },
  { icon: Wind,       label: 'Infinity Edge',      value: 'Hill View' },
];

// ─── Helpers ─────────────────────────────────────────────────
const genId = () => `PL-${Math.floor(1000 + Math.random() * 9000)}`;
const today = () => new Date().toISOString().split('T')[0];
const fmtDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};
const fmtCurrency = (v) =>
  Number(v).toLocaleString('en-IN', { minimumFractionDigits: 0 });

// ─── Main Component ───────────────────────────────────────────
const Pool = () => {
  const [step, setStep] = useState(1); // 1=slot & guests, 2=form, 3=confirmed
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [hours, setHours] = useState(1); // Duration in hours (1-5 hrs)
  const [adults, setAdults] = useState(1); // Age 6 & above: ₹150/hr
  const [kids, setKids] = useState(0); // Age 1 to 5: ₹100/hr
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentUtr, setPaymentUtr] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const slot = SLOTS.find(s => s.id === selectedSlot);
  const totalGuests = adults + kids;
  const hourlyRate = (adults * POOL_RATES.ADULT) + (kids * POOL_RATES.KIDS);
  const total = hourlyRate * hours; // All prices inclusive of taxes

  // ── Step 1 → Step 2 ──────────────────────────────────────
  const proceedToForm = () => {
    if (!selectedSlot) { setError('Please select a session window.'); return; }
    if (!bookingDate)  { setError('Please select a date.'); return; }
    if (bookingDate < today()) { setError('Date cannot be in the past.'); return; }
    if (totalGuests < 1) { setError('Please select at least 1 guest (Age 6+ or Age 1-5).'); return; }
    if (hours < 1) { setError('Please select a valid duration (minimum 1 hour).'); return; }
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Form Submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!guestName.trim()) { setError('Please enter your name.'); return; }
    if (!guestEmail.trim()) { setError('Please enter your email.'); return; }

    setIsSubmitting(true);
    try {
      const id = genId();
      const booking = {
        id,
        booking_date: bookingDate,
        slot:         selectedSlot,
        duration_hrs: hours,
        adults_count: adults,
        kids_count:   kids,
        guests:       totalGuests,
        guest_name:   guestName,
        guest_email:  guestEmail,
        guest_phone:  guestPhone,
        amount:       total,
        payment_utr:  paymentUtr || null,
        payment_mode: 'PhonePe UPI',
        rate_summary: `${adults} Age 6+ (@₹150/hr), ${kids} Age 1-5 (@₹100/hr) for ${hours} hr(s)`,
        status:       'Confirmed',
        created_at:   new Date().toISOString(),
      };

      if (supabase) {
        const { error: sbError } = await supabase.from('pool_bookings').insert(booking);
        if (sbError) {
          console.warn('[Supabase] pool_bookings insert failed, falling back to localStorage:', sbError.message);
        }
      }

      // Local storage fallback so the UI works even without Supabase
      const cached = JSON.parse(localStorage.getItem('dk_pool_bookings') || '[]');
      cached.push(booking);
      localStorage.setItem('dk_pool_bookings', JSON.stringify(cached));

      setConfirmed({
        ...booking,
        slotLabel: slot.label,
        slotTime: slot.time,
        hours,
        adults,
        kids,
        total,
      });
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('[Pool] submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => { setError(''); setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // ════════════════════════════════════════════════════════════
  // STEP 3 — Confirmation Receipt
  // ════════════════════════════════════════════════════════════
  if (step === 3 && confirmed) {
    const conf = confirmed;
    return (
      <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary px-8 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle size={36} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold text-white mb-1">Pool Ticket Confirmed!</h1>
            <p className="text-secondary font-semibold tracking-widest uppercase text-xs">DK Star Resorts — Wonders Swimming Pool</p>
          </div>

          {/* Booking ID banner */}
          <div className="bg-secondary/10 border-b border-secondary/20 px-8 py-4 flex justify-between items-center">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Ticket ID</span>
            <span className="font-heading font-bold text-primary text-lg">{conf.id}</span>
          </div>

          {/* Details */}
          <div className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Guest Name</p>
                <p className="font-semibold text-primary">{conf.guest_name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Phone</p>
                <p className="font-semibold text-primary">{conf.guest_phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Date</p>
                <p className="font-semibold text-primary">{fmtDate(conf.booking_date)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Session</p>
                <p className="font-semibold text-primary">{conf.slotLabel}</p>
                <p className="text-xs text-gray-400">{conf.slotTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Duration</p>
                <p className="font-semibold text-primary">{conf.duration_hrs || conf.hours} Hour{(conf.duration_hrs || conf.hours) > 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Total Guests</p>
                <p className="font-semibold text-primary">{conf.guests} Person{conf.guests > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-400">
                  {conf.adults_count || conf.adults} Age 6+ · {conf.kids_count || conf.kids} Age 1-5
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              {(conf.adults_count || conf.adults) > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Age 6 & Above ({(conf.adults_count || conf.adults)} × ₹150/hr × {(conf.duration_hrs || conf.hours)} hrs)</span>
                  <span className="font-semibold text-primary">₹{fmtCurrency((conf.adults_count || conf.adults) * POOL_RATES.ADULT * (conf.duration_hrs || conf.hours))}</span>
                </div>
              )}
              {(conf.kids_count || conf.kids) > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Age 1 to 5 Years ({(conf.kids_count || conf.kids)} × ₹100/hr × {(conf.duration_hrs || conf.hours)} hrs)</span>
                  <span className="font-semibold text-primary">₹{fmtCurrency((conf.kids_count || conf.kids) * POOL_RATES.KIDS * (conf.duration_hrs || conf.hours))}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                <div>
                  <span className="font-heading text-primary block">Total Paid</span>
                  <span className="text-[11px] font-normal text-emerald-700">Tax Inclusive</span>
                </div>
                <span className="font-heading text-secondary text-2xl">₹{fmtCurrency(conf.amount)}</span>
              </div>
            </div>

            {/* PhonePe QR Code on Pool Ticket */}
            <div className="border border-secondary/20 rounded-xl p-3 bg-cream/70 flex items-center gap-3">
              <img
                src="/payment-qr.jpg"
                alt="PhonePe QR Code - D K STAR RESORTS"
                className="w-14 h-auto object-contain rounded border border-gray-300 shadow-xs shrink-0"
              />
              <div className="text-[9px] space-y-0.5 font-bold text-gray-600">
                <p className="text-primary font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1">
                  <span className="text-[#5f259f]">PhonePe</span> QR Verified
                </p>
                <p><span className="text-secondary">Payee:</span> D K STAR RESORTS</p>
                <p><span className="text-secondary">Pass Type:</span> Wonders Swimming Pool Hourly Pass</p>
                <p className="text-[8.5px] text-gray-400 font-normal">Present this ticket and PhonePe transaction slip at pool deck</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-5 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 mb-4">
              Please present this confirmation ticket at the pool entrance desk. Free access is always active for in-house room & hall guests.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 btn-outline py-3 flex items-center justify-center gap-2 text-xs"
              >
                <Printer size={14} /> Print Ticket
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedSlot(null);
                  setBookingDate('');
                  setHours(1);
                  setAdults(1);
                  setKids(0);
                  setGuestName('');
                  setGuestEmail('');
                  setGuestPhone('');
                  setConfirmed(null);
                }}
                className="flex-1 btn-primary py-3 text-xs"
              >
                Book Another Slot
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // MAIN PAGE
  // ════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center">
        <img
          src="/pool4.webp"
          alt="Wonders Swimming Pool at DK Star Resorts"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waves size={28} className="text-secondary" />
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-sm">Resort Leisure Facility</span>
            <Waves size={28} className="text-secondary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4">
            Wonders Swimming Pool
          </h1>
          <p className="text-white/90 text-lg max-w-xl mx-auto">
            Temperature-controlled paradise with leisure mushroom fountain, covered pavilion, and ambient night illumination.
          </p>
        </motion.div>
      </section>

      {/* ── Feature Strip ─────────────────────────────────── */}
      <section className="bg-primary text-white py-5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.label} className="text-center">
              <f.icon size={22} className="text-secondary mx-auto mb-1" />
              <div className="font-heading font-bold text-white text-lg">{f.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Step Progress ──────────────────────────────────── */}
      <section className="bg-cream border-b border-gray-200 py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-center gap-2">
          {['Select Slot', 'Your Details', 'Confirmed'].map((label, i) => {
            const num = i + 1;
            const active = step === num;
            const done = step > num;
            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                    ${done ? 'bg-secondary border-secondary text-white' : active ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                    {done ? <CheckCircle size={14} /> : num}
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider hidden sm:block
                    ${active ? 'text-primary' : done ? 'text-secondary' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 max-w-16 ${done ? 'bg-secondary' : 'bg-gray-200'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ── Left: Slot Selection or Form ─────────────────── */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">

            {/* STEP 1 — Slot Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* ── Complimentary Pool Access Notice for Room & Hall Bookings ── */}
                <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Waves size={24} />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading font-extrabold text-base sm:text-lg text-emerald-950">
                          Room & Function Hall Bookings: 100% FREE Pool Access!
                        </span>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                          Complimentary Stay Perk
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                        If you have booked any of our <strong>9 Prestige Rooms</strong> or celebrated at <strong>Nakshatra Hall 1 & 2</strong>, swimming pool access is <strong>completely FREE</strong> for all registered guests throughout your stay. No tickets required — simply present your room key or booking confirmation at the pool deck!
                      </p>
                      <div className="pt-2 border-t border-emerald-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-emerald-900 font-semibold flex items-center gap-1.5">
                          <Sparkles size={14} className="text-emerald-600" />
                          <span>Day Visitors / Outside Guests: Purchase session slots below</span>
                        </span>
                        <Link to="/booking" className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1">
                          Book a Room or Hall Stay →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                  <h2 className="text-3xl font-heading font-bold text-primary">Day Visitor Pool Tickets</h2>
                  <span className="text-xs text-secondary font-bold uppercase tracking-wider">Hourly Pay-Per-Use Tariff</span>
                </div>
                <p className="text-gray-500 mb-8 text-sm">Select date, hours, guest age category, and your preferred session window. All prices are inclusive of taxes.</p>

                {/* Date Picker */}
                <div className="mb-8">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    <Calendar size={12} className="inline mr-1" /> Select Date
                  </label>
                  <input
                    type="date"
                    min={today()}
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="border-b-2 border-gray-200 focus:border-secondary outline-none py-3 pr-4 text-primary font-semibold bg-transparent w-full max-w-xs"
                  />
                </div>

                {/* Duration in Hours */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <Clock size={13} className="text-secondary" /> Duration (Hours)
                    </label>
                    <span className="text-xs font-bold text-secondary">{hours} Hour{hours > 1 ? 's' : ''} Selected</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[1, 2, 3, 4, 5].map((hr) => (
                      <button
                        key={hr}
                        type="button"
                        onClick={() => setHours(hr)}
                        className={`py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 text-center cursor-pointer ${
                          hours === hr
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-secondary hover:bg-cream'
                        }`}
                      >
                        {hr} {hr === 1 ? 'Hour' : 'Hours'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Counts by Age Group */}
                <div className="mb-8 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                    <Users size={12} className="inline mr-1" /> Select Guests by Age Category
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Age 6 & Above (₹150/hr) */}
                    <div className="p-4 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-between shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-primary text-base">Age 6 & Above</span>
                          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded">Standard</span>
                        </div>
                        <p className="text-secondary font-bold text-xs mt-0.5">₹150 / hr per person</p>
                        <span className="text-[11px] text-gray-400">Adults and older children</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setAdults(a => Math.max(0, a - 1))}
                          className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-primary font-bold hover:border-secondary hover:bg-cream transition-colors text-base"
                        >−</button>
                        <span className="text-xl font-heading font-bold text-primary w-6 text-center">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(a => Math.min(25, a + 1))}
                          className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-primary font-bold hover:border-secondary hover:bg-cream transition-colors text-base"
                        >+</button>
                      </div>
                    </div>

                    {/* Age 1 to 5 (₹100/hr) */}
                    <div className="p-4 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-between shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-primary text-base">Age 1 to 5 Years</span>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Kids</span>
                        </div>
                        <p className="text-secondary font-bold text-xs mt-0.5">₹100 / hr per child</p>
                        <span className="text-[11px] text-gray-400">Toddlers & young children</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setKids(k => Math.max(0, k - 1))}
                          className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-primary font-bold hover:border-secondary hover:bg-cream transition-colors text-base"
                        >−</button>
                        <span className="text-xl font-heading font-bold text-primary w-6 text-center">{kids}</span>
                        <button
                          type="button"
                          onClick={() => setKids(k => Math.min(20, k + 1))}
                          className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-primary font-bold hover:border-secondary hover:bg-cream transition-colors text-base"
                        >+</button>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 flex justify-between px-1">
                    <span>Total pool swimmers: <strong>{totalGuests}</strong> ({adults} Age 6+, {kids} Age 1-5)</span>
                    <span className="text-emerald-700 font-semibold">* Children under 12 require adult supervision</span>
                  </div>
                </div>

                {/* Session Windows */}
                <div className="space-y-4 mb-8">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                    <Clock size={12} className="inline mr-1" /> Select Session Window
                  </label>
                  {SLOTS.map((s) => {
                    const Icon = s.icon;
                    const chosen = selectedSlot === s.id;
                    return (
                      <motion.button
                        key={s.id}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedSlot(s.id)}
                        className={`w-full text-left p-6 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
                          chosen
                            ? `${s.border} bg-white shadow-lg ring-2 ring-secondary/20`
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0 shadow-md`}>
                              <Icon size={22} className="text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-heading font-bold text-primary text-lg">{s.label}</h3>
                                <span className="text-[10px] bg-secondary/15 text-secondary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Hourly Passes
                                </span>
                              </div>
                              <p className="text-secondary font-bold text-sm mb-2 flex items-center gap-1">
                                <Clock size={12} /> {s.time}
                              </p>
                              <p className="text-gray-500 text-sm mb-3">{s.desc}</p>
                              <div className="flex flex-wrap gap-2">
                                {s.perks.map(p => (
                                  <span key={p} className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                                    ✓ {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Tariff</div>
                            <div className="text-base font-heading font-bold text-primary">₹150 <span className="text-[10px] font-normal text-gray-500">(Age 6+)</span></div>
                            <div className="text-base font-heading font-bold text-secondary">₹100 <span className="text-[10px] font-normal text-gray-500">(Age 1-5)</span></div>
                            <div className="text-[10px] text-gray-400 mt-1">per hour / tax incl.</div>
                            {chosen && (
                              <div className="mt-2 w-6 h-6 rounded-full bg-secondary flex items-center justify-center ml-auto">
                                <CheckCircle size={14} className="text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {error && (
                  <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">{error}</p>
                )}

                <button onClick={proceedToForm} className="w-full btn-primary py-5 text-base shadow-lg shadow-primary/20 cursor-pointer">
                  Continue to Details →
                </button>
              </motion.div>
            )}

            {/* STEP 2 — Guest Details Form */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors cursor-pointer">
                  <ArrowLeft size={16} /> Back to slot & guest selection
                </button>
                <h2 className="text-3xl font-heading font-bold text-primary mb-2">Your Details</h2>
                <p className="text-gray-500 mb-6 text-sm">Almost there! Fill in your details to confirm your swimming pool reservation.</p>

                {/* Chosen Summary Card */}
                <div className="p-4 bg-cream rounded-xl border border-secondary/30 mb-8 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-primary font-semibold">
                    <span>{slot?.label} ({slot?.time})</span>
                    <span>{fmtDate(bookingDate)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Duration: <strong>{hours} Hour{hours > 1 ? 's' : ''}</strong></span>
                    <span>Guests: <strong>{totalGuests}</strong> ({adults} Age 6+, {kids} Age 1-5)</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-secondary/20 font-bold text-primary text-sm">
                    <span>Total Amount (Tax Incl.):</span>
                    <span className="text-secondary font-heading text-base">₹{fmtCurrency(total)}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <User size={11} /> Full Name *
                      </label>
                      <input
                        type="text" required
                        value={guestName} onChange={e => setGuestName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full border-b-2 border-gray-200 focus:border-secondary outline-none py-3 bg-transparent text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <Mail size={11} /> Email *
                      </label>
                      <input
                        type="email" required
                        value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full border-b-2 border-gray-200 focus:border-secondary outline-none py-3 bg-transparent text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <Phone size={11} /> Phone *
                      </label>
                      <input
                        type="tel" required
                        value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                        placeholder="+91 94894 55977"
                        className="w-full border-b-2 border-gray-200 focus:border-secondary outline-none py-3 bg-transparent text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <Users size={11} /> Duration & Guests
                      </label>
                      <input
                        type="text" readOnly
                        value={`${hours} hr(s) · ${totalGuests} guests (${adults} Age 6+, ${kids} Age 1-5)`}
                        className="w-full border-b-2 border-gray-100 outline-none py-3 bg-transparent text-primary font-semibold text-xs cursor-default"
                      />
                    </div>
                  </div>

                  {/* PhonePe QR Code Scan & Pay Box for Pool */}
                  <div className="p-4 bg-white border-2 border-secondary/40 rounded-xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5f259f] text-white flex items-center justify-center font-bold text-xs">पे</span>
                        <span className="font-heading font-bold text-primary text-xs uppercase tracking-wider">
                          Scan & Pay via PhonePe QR Code
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                        Official Pool Pass
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-4 items-center">
                      <div className="flex flex-col items-center justify-center bg-black p-2 rounded-lg border border-secondary/30">
                        <img
                          src="/payment-qr.jpg"
                          alt="PhonePe QR Code - D K STAR RESORTS"
                          className="w-full max-w-[110px] h-auto object-contain rounded"
                        />
                        <span className="text-[8px] font-bold text-white tracking-widest uppercase mt-1">D K STAR RESORTS</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-cream/80 rounded-lg border border-secondary/20 flex justify-between items-baseline">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold block">Pass Payable Amount</span>
                            <span className="text-secondary font-heading font-extrabold text-base">₹{fmtCurrency(total)}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold">Tax Inclusive</span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                            UPI Reference / UTR No. (Optional)
                          </label>
                          <input
                            type="text"
                            value={paymentUtr}
                            onChange={(e) => setPaymentUtr(e.target.value)}
                            placeholder="12-digit UTR after scanning QR"
                            className="w-full border border-gray-200 focus:border-secondary rounded-lg px-2.5 py-2 text-xs outline-none bg-white font-mono"
                          />
                          <p className="text-[10px] text-gray-400">Scan QR using PhonePe, GPay, Paytm, or BHIM. Payee: <strong>D K STAR RESORTS</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-lg">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-5 text-base shadow-lg shadow-primary/20 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? 'Confirming Ticket…' : `Pay ₹${fmtCurrency(total)} & Confirm Ticket`}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                    All taxes inclusive · Instant confirmation
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Booking Summary Sidebar ───────────────── */}
        <div className="space-y-6">
          {/* Official Rate Card */}
          <div className="bg-white border-2 border-secondary/30 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
                Official Pool Tariff
              </span>
              <span className="text-[10px] bg-secondary/15 text-secondary font-bold px-2 py-0.5 rounded">
                Hourly Rate
              </span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <div>
                  <span className="font-bold text-primary block">Age 6 & Above</span>
                  <span className="text-[11px] text-gray-400">Adults & Older Children</span>
                </div>
                <span className="font-heading font-bold text-primary text-sm">₹150 / hr</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <div>
                  <span className="font-bold text-primary block">Age 1 to 5 Years</span>
                  <span className="text-[11px] text-gray-400">Toddlers & Young Kids</span>
                </div>
                <span className="font-heading font-bold text-secondary text-sm">₹100 / hr</span>
              </div>
              <div className="flex justify-between items-center py-1.5 bg-emerald-50 px-2.5 rounded-lg text-emerald-900 border border-emerald-200">
                <span className="font-bold">Room & Hall Guests</span>
                <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px]">100% FREE</span>
              </div>
              <p className="text-[10.5px] text-gray-400 text-center pt-1">* All rates are strictly per hour & inclusive of taxes.</p>
            </div>
          </div>

          {/* Room / Hall In-house Guest Callout */}
          <div className="bg-[#4A3728] text-white rounded-xl p-5 border-l-4 border-secondary space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-secondary font-bold text-[11px] uppercase tracking-wider">
              <Sparkles size={14} />
              <span>In-House Resident Privilege</span>
            </div>
            <h4 className="font-heading font-bold text-base text-white">Booked a Room or Hall?</h4>
            <p className="text-xs text-gray-200 leading-relaxed">
              You do <strong>not</strong> need to pay or purchase tickets! Swimming pool entry is <strong>100% complimentary</strong> for all guests with room or hall reservations throughout their stay.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-gray-300">Show room key at pool deck</span>
              <Link to="/booking" className="text-xs font-bold text-secondary hover:text-white transition-colors underline">
                Reserve Room / Hall →
              </Link>
            </div>
          </div>

          {/* Ticket Summary */}
          <div className="bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden sticky top-28">
            <div className="bg-primary px-6 py-4">
              <h3 className="text-white font-heading font-bold text-lg">Ticket Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              {selectedSlot && slot ? (
                <>
                  <div className={`p-3 rounded-lg ${slot.bg} border ${slot.border}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <slot.icon size={16} className="text-primary" />
                      <span className="font-bold text-primary text-sm">{slot.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{slot.time}</p>
                  </div>

                  {bookingDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="font-semibold text-primary">{fmtDate(bookingDate)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-semibold text-primary">{hours} Hour{hours > 1 ? 's' : ''}</span>
                  </div>

                  <div className="space-y-1.5 border-t border-gray-100 pt-2 text-xs">
                    {adults > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>{adults} × Age 6+ (@ ₹150/hr × {hours} hr)</span>
                        <span className="font-semibold text-primary">₹{fmtCurrency(adults * POOL_RATES.ADULT * hours)}</span>
                      </div>
                    )}
                    {kids > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>{kids} × Age 1-5 (@ ₹100/hr × {hours} hr)</span>
                        <span className="font-semibold text-primary">₹{fmtCurrency(kids * POOL_RATES.KIDS * hours)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline font-bold">
                    <div>
                      <span className="font-heading text-primary block">Total Payable</span>
                      <span className="text-[10px] text-emerald-700 font-normal">All Taxes Inclusive</span>
                    </div>
                    <span className="font-heading text-secondary text-2xl">₹{fmtCurrency(total)}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <Waves size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a session window to calculate tariff</p>
                </div>
              )}
            </div>
          </div>

          {/* Pool Rules */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-3">Pool Guidelines & Access</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              {[
                'FREE access for all in-house Room & Function Hall guests',
                'Outside day visitors must hold a valid paid slot booking',
                'Swim cap mandatory for all swimmers',
                'No outside food or drinks allowed on deck',
                'Children under 12 need adult supervision',
                'Please shower before entering the pool',
                'Non-swimmers must wear floats'
              ].map(r => (
                <li key={r} className="flex items-start gap-2">
                  <span className="text-secondary font-bold shrink-0">→</span> {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="bg-primary text-white rounded-xl p-5">
            <h4 className="font-heading font-bold mb-3 text-secondary">Need Help?</h4>
            <p className="text-xs text-gray-300 mb-3">Call our front desk for group bookings or special requests.</p>
            <a href="tel:+919489455977" className="flex items-center gap-2 text-white font-semibold text-sm hover:text-secondary transition-colors">
              <Phone size={14} /> +91 9489455977
            </a>
          </div>
        </div>
      </div>

      {/* ── Pool Photographs Strip ───────────────────────── */}
      <section className="bg-cream py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-xs block mb-2">
              Visual Tour
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              Wonders Swimming Pool Gallery
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Crystal-clear waters, mushroom splash fountain, and enchanting evening LED illumination
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { src: '/pool1.webp', caption: 'Daylight Pool Deck & Water Umbrella' },
              { src: '/pool2.webp', caption: 'Sunset Ambience & Pool Deck' },
              { src: '/pool3.webp', caption: 'Fountain Splash & Dining Pavilion' },
              { src: '/pool4.webp', caption: 'Night Swimming & Underwater LED Glow' },
            ].map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-64 overflow-hidden rounded-xl shadow-md border border-gray-200"
              >
                <img
                  src={p.src}
                  alt={p.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold drop-shadow">
                  {p.caption}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery / Reviews Strip ───────────────────────── */}
      <section className="bg-primary/5 border-t border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-primary text-center mb-3">What Our Guests Say</h2>
          <p className="text-gray-500 text-center mb-10 text-sm">About the Wonders Swimming Pool experience</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', stars: 5, text: 'The evening slot was absolutely magical — ambient lights, cool water, and total peace. Will book again!' },
              { name: 'Rajan M.', stars: 5, text: 'Morning sessions are the best. The hill view at sunrise while swimming is unforgettable.' },
              { name: 'Kavya R.', stars: 5, text: 'Booked the afternoon slot for my family. Kids loved the floats and the water was perfectly warm.' },
            ].map(review => (
              <div key={review.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{review.text}"</p>
                <p className="text-primary font-bold text-sm">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pool;
