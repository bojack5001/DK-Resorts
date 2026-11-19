import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CreditCard, Sparkles, ShieldCheck, Building, Waves,
  Home as HomeIcon, Phone, Mail, User, ArrowRight,
  Clock, Calendar, HelpCircle, CheckCircle2, Building2
} from 'lucide-react';
import { YOUPI_CONFIG, formatCurrency, generateYoupiOrderId } from '../lib/youpiConfig';
import YoupiCheckoutModal from '../components/YoupiCheckoutModal';
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
  const [error, setError] = useState('');

  // Gateway Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState('');
  const [finalReceipt, setFinalReceipt] = useState(null);

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
    serviceDescription = `Wonders Pool: ${poolHours} hr(s) · ${poolAdults} (Age 6+) & ${poolKids} (Age 1-5)`;
  } else if (category === 'custom') {
    computedAmount = Number(customAmount) || 0;
    serviceDescription = customDescription || 'Custom Deposit / Balance Payment';
  }

  const handleOpenGateway = (e) => {
    e.preventDefault();
    setError('');

    if (computedAmount <= 0) {
      setError('Please select a valid service or enter a valid payment amount.');
      return;
    }
    if (!guestName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!guestPhone.trim()) {
      setError('Please provide your contact phone number.');
      return;
    }

    const orderId = bookingRef.trim() || generateYoupiOrderId('DKS');
    setActiveOrderId(orderId);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = async (verifiedPayload) => {
    const receiptData = {
      ...verifiedPayload,
      guestName,
      guestPhone,
      guestEmail,
      serviceDescription,
      category,
    };

    setFinalReceipt(receiptData);

    // Persist to Supabase if available
    try {
      if (supabase) {
        await supabase.from('payments').insert({
          order_id: verifiedPayload.orderId,
          guest_name: guestName,
          guest_phone: guestPhone,
          guest_email: guestEmail,
          amount: verifiedPayload.amount,
          utr_number: verifiedPayload.utr,
          payment_method: verifiedPayload.paymentMethod,
          status: verifiedPayload.status,
          service_description: serviceDescription,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('[Supabase] payment logging notice:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
      
      {/* ── Hero Banner ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs uppercase font-bold tracking-widest">
            <Sparkles size={13} /> YouPI Payment Gateway
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-primary">
            Pay Online with YouPI
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Zero-fee, instant UPI and direct bank settlement for your stay at <strong>DK STAR RESORTS</strong>.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Receipt view if paid */}
        {finalReceipt ? (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-secondary/30 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Payment Recorded
              </span>
              <h2 className="text-2xl font-heading font-bold text-primary mt-2">Transaction Confirmed</h2>
              <p className="text-xs text-gray-500 mt-1">
                Your payment reference has been submitted to the resort front desk.
              </p>
            </div>

            <div className="bg-cream/60 p-5 rounded-xl border border-secondary/20 text-xs space-y-2.5 text-left">
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-bold uppercase text-[10px]">Order ID</span>
                <span className="font-mono font-bold text-primary">#{finalReceipt.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-bold uppercase text-[10px]">Service</span>
                <span className="font-semibold text-primary">{finalReceipt.serviceDescription}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-bold uppercase text-[10px]">Guest Name</span>
                <span className="font-semibold text-primary">{finalReceipt.guestName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-bold uppercase text-[10px]">UTR / Reference</span>
                <span className="font-mono font-bold text-secondary text-sm">{finalReceipt.utr}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-gray-500 font-bold uppercase text-[10px]">Amount Paid</span>
                <span className="font-heading font-extrabold text-xl text-primary">₹{formatCurrency(finalReceipt.amount)}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-outline py-2.5 px-6 text-xs uppercase font-bold tracking-wider rounded-lg cursor-pointer"
              >
                Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setFinalReceipt(null)}
                className="btn-primary py-2.5 px-6 text-xs uppercase font-bold tracking-wider rounded-lg cursor-pointer"
              >
                New Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Category Selector & Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6">
              
              {/* Service Category Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Select Booking Service
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'rooms',  label: 'Prestige Rooms', icon: HomeIcon },
                    { id: 'halls',  label: 'Party Halls',    icon: Building },
                    { id: 'pool',   label: 'Wonders Pool',   icon: Waves },
                    { id: 'custom', label: 'Custom Deposit', icon: CreditCard },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const active = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer text-center ${
                          active
                            ? 'border-secondary bg-cream text-primary font-bold shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                        }`}
                      >
                        <Icon size={18} className={active ? 'text-secondary' : 'text-gray-400'} />
                        <span className="text-[11px] font-semibold mt-1">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Service Inputs */}
              {category === 'rooms' && (
                <div className="space-y-4 p-4 bg-cream/50 rounded-xl border border-secondary/20">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Select Room</label>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-primary outline-none focus:border-secondary"
                    >
                      {ROOM_TARIFFS.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} — {r.type} (₹{formatCurrency(r.weekday)} / ₹{formatCurrency(r.weekend)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Day Tariff</label>
                      <select
                        value={roomDayType}
                        onChange={(e) => setRoomDayType(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-primary outline-none focus:border-secondary"
                      >
                        <option value="weekday">Weekday (Mon–Fri): ₹{formatCurrency(selectedRoom.weekday)}</option>
                        <option value="weekend">Weekend (Sat–Sun): ₹{formatCurrency(selectedRoom.weekend)}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Number of Nights</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={roomNights}
                        onChange={(e) => setRoomNights(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-primary outline-none focus:border-secondary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'halls' && (
                <div className="space-y-4 p-4 bg-cream/50 rounded-xl border border-secondary/20">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Select Hall</label>
                    <select
                      value={selectedHallId}
                      onChange={(e) => setSelectedHallId(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-primary outline-none focus:border-secondary"
                    >
                      {HALL_TARIFFS.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} — {h.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Tariff Schedule</label>
                      <select
                        value={hallDayType}
                        onChange={(e) => setHallDayType(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-primary outline-none focus:border-secondary"
                      >
                        <option value="weekday">Weekday (Mon–Fri): ₹{formatCurrency(selectedHall.weekday)}</option>
                        <option value="weekend">Weekend (Sat–Sun): ₹{formatCurrency(selectedHall.weekend)}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Number of Days</label>
                      <input
                        type="number"
                        min="1"
                        max="7"
                        value={hallDays}
                        onChange={(e) => setHallDays(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-primary outline-none focus:border-secondary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'pool' && (
                <div className="space-y-4 p-4 bg-cream/50 rounded-xl border border-secondary/20">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Duration (Hours)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(h => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setPoolHours(h)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                            poolHours === h ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'
                          }`}
                        >
                          {h} {h === 1 ? 'Hr' : 'Hrs'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Age 6+ (₹150/hr)</label>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={poolAdults}
                        onChange={(e) => setPoolAdults(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-primary outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Age 1–5 (₹100/hr)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={poolKids}
                        onChange={(e) => setPoolKids(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-primary outline-none focus:border-secondary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'custom' && (
                <div className="space-y-3 p-4 bg-cream/50 rounded-xl border border-secondary/20">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Amount to Pay (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 5000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-primary outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Payment Purpose</label>
                    <input
                      type="text"
                      placeholder="e.g. Advance deposit for Room 03 booking"
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-medium text-primary outline-none focus:border-secondary"
                    />
                  </div>
                </div>
              )}

              {/* Guest Details Form */}
              <form onSubmit={handleOpenGateway} className="space-y-4 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1 mb-1">
                      <User size={12} /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-primary outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1 mb-1">
                      <Phone size={12} /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94894 55977"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-primary outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1 mb-1">
                      <Mail size={12} /> Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-primary outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
                      Existing Booking Ref # (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DKS-123456"
                      value={bookingRef}
                      onChange={(e) => setBookingRef(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-primary font-mono outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {error}
                  </p>
                )}

                {/* Submit to Launch YouPI */}
                <button
                  type="submit"
                  disabled={computedAmount <= 0}
                  className="w-full btn-primary py-4 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  <span>Launch YouPI Gateway & Pay ₹{formatCurrency(computedAmount)}</span>
                </button>
              </form>

            </div>

            {/* Right Column: Bank Details & Direct Settlement Information (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Bank Account Transfer Card */}
              <div className="bg-[#1A1410] text-white p-6 sm:p-7 rounded-2xl shadow-xl border border-[#C5A059]/40 space-y-4">
                <div className="flex items-center gap-2.5 text-[#C5A059] text-xs uppercase font-bold tracking-widest">
                  <Building2 size={16} />
                  <span>Direct Bank Account Transfer</span>
                </div>
                <h3 className="text-lg font-heading font-bold text-white">
                  IMPS / NEFT / RTGS Wire Details
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  For high-value reservations, event booking advances, or corporate wire transfers:
                </p>

                <div className="space-y-2 text-xs bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Account Name:</span>
                    <span className="font-bold text-white">{YOUPI_CONFIG.merchant.bankDetails.accountHolder}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Bank Name:</span>
                    <span className="font-semibold text-white">{YOUPI_CONFIG.merchant.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Account Number:</span>
                    <span className="font-mono font-bold text-[#E7C77E]">{YOUPI_CONFIG.merchant.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">IFSC Code:</span>
                    <span className="font-mono font-bold text-white">{YOUPI_CONFIG.merchant.bankDetails.ifscCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Branch:</span>
                    <span className="text-gray-300">{YOUPI_CONFIG.merchant.bankDetails.branch}</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#C5A059] shrink-0" />
                  <span>100% Direct settlement to resort verified account.</span>
                </div>
              </div>

              {/* Help & Support Assistance */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-xs">
                <div className="flex items-center gap-2 text-primary font-heading font-bold text-sm">
                  <HelpCircle size={16} className="text-secondary" /> Need Payment Support?
                </div>
                <p className="text-gray-500 leading-relaxed">
                  Call our 24/7 front desk for assistance with UPI limits, corporate GST invoices, or date rescheduling:
                </p>
                <div className="space-y-1.5 font-semibold text-primary pt-1">
                  <a href="tel:+919489455977" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                    <Phone size={13} /> +91 94894 55977
                  </a>
                  <a href="mailto:dkstarresorts@gmail.com" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <Mail size={13} /> dkstarresorts@gmail.com
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ── YouPI Checkout Modal ───────────────────────────────── */}
      <YoupiCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={computedAmount}
        orderId={activeOrderId}
        title={serviceDescription}
        customer={{
          name: guestName,
          phone: guestPhone,
          email: guestEmail,
        }}
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
};

export default Payment;
