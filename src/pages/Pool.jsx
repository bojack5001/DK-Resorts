import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import {
  Waves, Sun, Sunset, Moon, Users, Calendar, Phone, Mail,
  User, CheckCircle, Clock, Droplets, Wind, Thermometer,
  ArrowLeft, Printer, Star
} from 'lucide-react';

// ─── Slot Config ─────────────────────────────────────────────
const SLOTS = [
  {
    id: 'morning',
    label: 'Morning Lap',
    time: '06:00 AM – 10:00 AM',
    duration: '4 hrs',
    price: 400,
    icon: Sun,
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    desc: 'Start your day with a refreshing swim as the sun rises over the hills.',
    perks: ['Lifeguard on duty', 'Towels included', 'Morning snack bar open'],
  },
  {
    id: 'afternoon',
    label: 'Afternoon Splash',
    time: '03:00 PM – 06:00 PM',
    duration: '3 hrs',
    price: 350,
    icon: Sunset,
    color: 'from-blue-400 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    desc: 'Cool off from the afternoon heat in our temperature-controlled infinity pool.',
    perks: ['Poolside service', 'Inflatable floats available', 'Shaded loungers'],
  },
  {
    id: 'evening',
    label: 'Evening Glow',
    time: '07:00 PM – 09:00 PM',
    duration: '2 hrs',
    price: 500,
    icon: Moon,
    color: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-300',
    desc: 'A magical twilight swim under ambient lighting with panoramic hill views.',
    perks: ['Ambient lighting', 'Poolside beverages', 'Exclusive & serene'],
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
  const [step, setStep] = useState(1); // 1=slot, 2=form, 3=confirmed
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const slot = SLOTS.find(s => s.id === selectedSlot);
  const subtotal = slot ? slot.price * guests : 0;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  // ── Step 1 → Step 2 ──────────────────────────────────────
  const proceedToForm = () => {
    if (!selectedSlot) { setError('Please select a time slot.'); return; }
    if (!bookingDate)  { setError('Please select a date.'); return; }
    if (bookingDate < today()) { setError('Date cannot be in the past.'); return; }
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
        guest_name:   guestName,
        guest_email:  guestEmail,
        guest_phone:  guestPhone,
        guests:       Number(guests),
        amount:       total,
        status:       'Confirmed',
        created_at:   new Date().toISOString(),
      };

      if (supabase) {
        const { error: sbError } = await supabase.from('pool_bookings').insert(booking);
        if (sbError) throw sbError;
      }

      setConfirmed({ ...booking, slotLabel: slot.label, slotTime: slot.time });
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
            <h1 className="text-3xl font-heading font-bold text-white mb-1">Booking Confirmed!</h1>
            <p className="text-secondary font-semibold tracking-widest uppercase text-xs">DK Star Resorts — Crystal Infinity Pool</p>
          </div>

          {/* Booking ID banner */}
          <div className="bg-secondary/10 border-b border-secondary/20 px-8 py-4 flex justify-between items-center">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Booking ID</span>
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
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Email</p>
                <p className="font-semibold text-primary text-sm">{conf.guest_email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Date</p>
                <p className="font-semibold text-primary">{fmtDate(conf.booking_date)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Time Slot</p>
                <p className="font-semibold text-primary">{conf.slotLabel}</p>
                <p className="text-xs text-gray-400">{conf.slotTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Guests</p>
                <p className="font-semibold text-primary">{conf.guests} {conf.guests === 1 ? 'Person' : 'Persons'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Phone</p>
                <p className="font-semibold text-primary">{conf.guest_phone || '—'}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Pool Entry × {conf.guests}</span>
                <span>₹{fmtCurrency(conf.amount / 1.18 * conf.guests / conf.guests)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>GST (18%)</span>
                <span>₹{fmtCurrency(conf.amount - Math.round(conf.amount / 1.18))}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                <span className="font-heading text-primary">Total Paid</span>
                <span className="font-heading text-secondary">₹{fmtCurrency(conf.amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-5 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 mb-4">
              Please show this confirmation at the pool entrance. Arrive 10 minutes before your slot.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 btn-outline py-3 flex items-center justify-center gap-2 text-xs"
              >
                <Printer size={14} /> Print Ticket
              </button>
              <button
                onClick={() => { setStep(1); setSelectedSlot(null); setBookingDate(''); setGuests(1); setGuestName(''); setGuestEmail(''); setGuestPhone(''); setConfirmed(null); }}
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
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1800&q=80"
          alt="Crystal Infinity Pool at DK Star Resorts"
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
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-sm">Swimming Pool</span>
            <Waves size={28} className="text-secondary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4">
            Crystal Infinity Pool
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Temperature-controlled paradise with breathtaking hill views. Reserve your private slot today.
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
                <h2 className="text-3xl font-heading font-bold text-primary mb-2">Choose Your Slot</h2>
                <p className="text-gray-500 mb-8 text-sm">Select a time slot and date for your pool session.</p>

                {/* Date picker */}
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

                {/* Guests */}
                <div className="mb-8">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    <Users size={12} className="inline mr-1" /> Number of Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGuests(g => Math.max(1, g - 1))}
                      className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-primary font-bold hover:border-secondary transition-colors text-lg"
                    >−</button>
                    <span className="text-2xl font-heading font-bold text-primary w-8 text-center">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(g => Math.min(20, g + 1))}
                      className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-primary font-bold hover:border-secondary transition-colors text-lg"
                    >+</button>
                    <span className="text-xs text-gray-400">Max 20 guests per booking</span>
                  </div>
                </div>

                {/* Slot cards */}
                <div className="space-y-4 mb-8">
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
                        className={`w-full text-left p-6 border-2 rounded-xl transition-all duration-200 ${chosen ? `${s.border} bg-white shadow-lg` : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0 shadow-md`}>
                              <Icon size={22} className="text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-heading font-bold text-primary text-lg">{s.label}</h3>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s.duration}</span>
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
                            <div className="text-2xl font-heading font-bold text-primary">₹{s.price}</div>
                            <div className="text-xs text-gray-400">per person</div>
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

                <button onClick={proceedToForm} className="w-full btn-primary py-5 text-base shadow-lg shadow-primary/20">
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
                <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
                  <ArrowLeft size={16} /> Back to slot selection
                </button>
                <h2 className="text-3xl font-heading font-bold text-primary mb-2">Your Details</h2>
                <p className="text-gray-500 mb-8 text-sm">Almost there! Fill in your details to confirm the booking.</p>

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
                        <Phone size={11} /> Phone
                      </label>
                      <input
                        type="tel"
                        value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full border-b-2 border-gray-200 focus:border-secondary outline-none py-3 bg-transparent text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <Users size={11} /> Guests
                      </label>
                      <input
                        type="number" min="1" max="20" readOnly
                        value={guests}
                        className="w-full border-b-2 border-gray-100 outline-none py-3 bg-transparent text-primary font-semibold cursor-default"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-lg">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-5 text-base shadow-lg shadow-primary/20 disabled:opacity-60"
                  >
                    {isSubmitting ? 'Confirming Booking…' : 'Confirm Pool Booking'}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                    Secure booking · Instant confirmation
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Booking Summary Sidebar ───────────────── */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden sticky top-28">
            <div className="bg-primary px-6 py-4">
              <h3 className="text-white font-heading font-bold text-lg">Booking Summary</h3>
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
                    <span className="text-gray-500">Guests</span>
                    <span className="font-semibold text-primary">{guests} × ₹{slot.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{fmtCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>GST (18%)</span>
                    <span>₹{fmtCurrency(gst)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
                    <span className="font-heading text-primary">Total</span>
                    <span className="font-heading text-secondary text-xl">₹{fmtCurrency(total)}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <Waves size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a slot to see pricing</p>
                </div>
              )}
            </div>
          </div>

          {/* Pool Rules */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-3">Pool Rules</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              {['Swim cap mandatory for all', 'No outside food or drinks', 'Children under 12 need adult supervision', 'Please shower before entering', 'Non-swimmers must wear floats'].map(r => (
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

      {/* ── Gallery / Reviews Strip ───────────────────────── */}
      <section className="bg-primary/5 border-t border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-primary text-center mb-3">What Our Guests Say</h2>
          <p className="text-gray-500 text-center mb-10 text-sm">About the Crystal Infinity Pool experience</p>
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
