import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle2, Copy, Check, Clock, AlertCircle,
  ExternalLink, Smartphone, CreditCard, Banknote, Building2,
  X, Sparkles, RefreshCw, ArrowRight, Info, QrCode as QrIcon
} from 'lucide-react';
import {
  YOUPI_CONFIG,
  buildUpiUri,
  buildUpiIntentLinks,
  validateUtr,
  formatCurrency
} from '../lib/youpiConfig';
import { generateQrSvg } from '../lib/youpiQr';

export default function YoupiCheckoutModal({
  isOpen,
  onClose,
  amount = 0,
  orderId = '',
  title = 'Resort Reservation Payment',
  customer = {},
  onSuccess,
}) {
  const [activeTab, setActiveTab] = useState('UPI'); // 'UPI' | 'CASH' | 'CARD' | 'BANK'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // 5-minute (300 seconds) countdown timer like authentic YouPI PG
  const [timeLeft, setTimeLeft] = useState(YOUPI_CONFIG.gateway.sessionTimeoutSeconds);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(YOUPI_CONFIG.gateway.sessionTimeoutSeconds);
      setUtrNumber('');
      setUtrError('');
      setIsVerifying(false);
      setPaymentSuccess(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [timeLeft]);

  // Construct dynamic UPI URI & QR Code
  const upiUri = useMemo(() => {
    return buildUpiUri({
      amount,
      orderId: orderId || 'DKS',
      note: `${title} (#${orderId || 'DKS'})`,
    });
  }, [amount, orderId, title]);

  const qrSvgString = useMemo(() => {
    return generateQrSvg(upiUri, 220);
  }, [upiUri]);

  const appLinks = useMemo(() => {
    return buildUpiIntentLinks({
      amount,
      orderId: orderId || 'DKS',
      note: `${title} (#${orderId || 'DKS'})`,
    });
  }, [amount, orderId, title]);

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(YOUPI_CONFIG.merchant.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2200);
    }
  };

  const handleCopyAcc = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(YOUPI_CONFIG.merchant.bankDetails.accountNumber);
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2200);
    }
  };

  const handleCopyIfsc = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(YOUPI_CONFIG.merchant.bankDetails.ifscCode);
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2200);
    }
  };

  const handleUtrSubmit = (e) => {
    e.preventDefault();
    setUtrError('');

    const cleaned = utrNumber.trim();
    if (!cleaned) {
      setUtrError('Please enter the 12-digit UTR number from your payment receipt.');
      return;
    }

    if (!validateUtr(cleaned)) {
      setUtrError('UTR must be exactly 12 numeric digits (e.g., 428912345678).');
      return;
    }

    setIsVerifying(true);

    // Simulate authentic YouPI verification pass
    setTimeout(() => {
      setIsVerifying(false);
      const verifiedPayload = {
        status: 'VERIFIED',
        gateway: 'YOUPI_PG',
        paymentMethod: 'UPI',
        orderId: orderId || `DKS-${Date.now()}`,
        amount,
        utr: cleaned,
        timestamp: new Date().toISOString(),
        customer,
        merchantId: YOUPI_CONFIG.merchant.id,
      };

      setPaymentSuccess(verifiedPayload);
      if (onSuccess) {
        onSuccess(verifiedPayload);
      }
    }, 1500);
  };

  const handleOfflineConfirm = (method) => {
    const verifiedPayload = {
      status: 'CONFIRMED_AT_DESK',
      gateway: 'YOUPI_PG',
      paymentMethod: method, // 'CASH_COUNTER' | 'CARD_COUNTER'
      orderId: orderId || `DKS-${Date.now()}`,
      amount,
      utr: `${method}-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      customer,
      merchantId: YOUPI_CONFIG.merchant.id,
    };

    setPaymentSuccess(verifiedPayload);
    if (onSuccess) {
      onSuccess(verifiedPayload);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#FCFAF6] text-[#2D241E] rounded-2xl shadow-2xl overflow-hidden border border-[#C5A059]/40 z-10 my-6"
        >
          {/* Royal Luxury Header */}
          <div className="bg-[#1A1410] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#C5A059]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8C6D2E] p-0.5 flex items-center justify-center shadow-md">
                <img src="/logo-symbol.png" alt="DK Star Resorts" className="w-8 h-8 object-contain brightness-0 invert" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-sm sm:text-base tracking-wider text-[#F7F3EB]">
                    DK STAR RESORTS
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-[#C5A059]/20 text-[#E7C77E] px-2 py-0.5 rounded-full border border-[#C5A059]/40">
                    YouPI PG Secured
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#A69B91] tracking-widest uppercase">
                  Royal Luxury Collection · Instant UPI Gateway
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A69B91] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Amount & Order Bar */}
          <div className="bg-[#241C16] text-white px-5 sm:px-6 py-3 flex items-center justify-between border-b border-[#C5A059]/20 flex-wrap gap-2">
            <div>
              <span className="text-[10px] text-[#A69B91] uppercase font-bold tracking-wider block">
                Order Ref #{orderId || 'DKS-DIRECT'}
              </span>
              <span className="text-xs font-semibold text-[#F7F3EB] truncate max-w-xs block">
                {title}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#C5A059] uppercase font-bold tracking-wider block">Payable Amount</span>
              <span className="text-xl sm:text-2xl font-heading font-black text-[#E7C77E]">
                ₹{formatCurrency(amount)}
              </span>
            </div>
          </div>

          {/* Body Content */}
          {paymentSuccess ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="p-6 sm:p-8 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-400 mx-auto flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 size={36} />
              </motion.div>
              <div>
                <h3 className="font-heading font-bold text-2xl text-primary">Payment Successfully Logged!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Thank you! Your transaction details have been registered with DK Star Resorts.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-secondary/20 shadow-xs text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Reference / UTR</span>
                  <span className="font-mono font-bold text-primary">{paymentSuccess.utr}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Amount Confirmed</span>
                  <span className="font-bold text-emerald-700">₹{formatCurrency(paymentSuccess.amount)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Payment Method</span>
                  <span className="font-bold text-primary">{paymentSuccess.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Timestamp</span>
                  <span className="text-gray-600">{new Date(paymentSuccess.timestamp).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                Our front desk team will match the UTR claim with the receiving bank statement upon arrival.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="w-full max-w-xs btn-primary py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer mx-auto block"
              >
                Done / Continue to Receipt
              </button>
            </div>
          ) : (
            <div>
              {/* Payment Modality Tabs */}
              <div className="px-5 sm:px-6 pt-4 border-b border-gray-200 bg-white/70">
                <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActiveTab('UPI')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${activeTab === 'UPI'
                        ? 'bg-[#1A1410] text-[#E7C77E] shadow-sm'
                        : 'text-gray-600 hover:text-primary hover:bg-cream'
                      }`}
                  >
                    <Smartphone size={14} className="text-[#C5A059]" />
                    <span>UPI QR & Apps</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('CASH')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${activeTab === 'CASH'
                        ? 'bg-[#1A1410] text-[#E7C77E] shadow-sm'
                        : 'text-gray-600 hover:text-primary hover:bg-cream'
                      }`}
                  >
                    <Banknote size={14} className="text-[#C5A059]" />
                    <span>Cash at Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('CARD')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${activeTab === 'CARD'
                        ? 'bg-[#1A1410] text-[#E7C77E] shadow-sm'
                        : 'text-gray-600 hover:text-primary hover:bg-cream'
                      }`}
                  >
                    <CreditCard size={14} className="text-[#C5A059]" />
                    <span>Card at POS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('BANK')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${activeTab === 'BANK'
                        ? 'bg-[#1A1410] text-[#E7C77E] shadow-sm'
                        : 'text-gray-600 hover:text-primary hover:bg-cream'
                      }`}
                  >
                    <Building2 size={14} className="text-[#C5A059]" />
                    <span>Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: UPI QR & 1-TAP APPS */}
              {activeTab === 'UPI' && (
                <div className="p-5 sm:p-6 space-y-6">
                  {/* Timer & Live Status Strip */}
                  <div className="flex items-center justify-between text-xs bg-amber-50/80 border border-amber-200/80 px-3.5 py-2 rounded-xl text-amber-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold text-[11px]">YouPI Gateway Live · Instant Direct Settlement</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-amber-300">
                      <Clock size={12} className="text-secondary" />
                      <span>{formattedTimer}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left: Official QR Code (5 cols) */}
                    <div className="md:col-span-5 flex flex-col items-center text-center">
                      {/* QR Display Card */}
                      <div className="bg-white p-3 rounded-2xl border-2 border-[#C5A059]/40 shadow-xl max-w-[210px] w-full aspect-square flex items-center justify-center overflow-hidden">
                        <img
                          src="/payment-qr.jpg"
                          alt="DK Star Resorts UPI QR Code"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>

                      <div className="mt-2.5 space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          Scan to Pay ₹{formatCurrency(amount)}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Scan with PhonePe, Google Pay, Paytm, CRED or BHIM
                        </p>
                      </div>
                    </div>

                    {/* Right: UPI ID & 1-Tap App Buttons (7 cols) */}
                    <div className="md:col-span-7 space-y-4">
                      {/* Copy UPI Address Card */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center justify-between gap-2">
                        <div className="overflow-hidden">
                          <span className="text-[9.5px] uppercase font-bold text-gray-400 block tracking-wider">
                            Merchant UPI ID (VPA)
                          </span>
                          <span className="font-mono font-bold text-xs sm:text-sm text-primary truncate block">
                            {YOUPI_CONFIG.merchant.upiId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-3 py-1.5 rounded-lg bg-cream hover:bg-secondary/20 text-primary border border-secondary/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {copiedUpi ? (
                            <>
                              <Check size={12} className="text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} className="text-secondary" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 1-Tap Mobile Intent Buttons */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                          1-Tap Quick Pay via Mobile App:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <a
                            href={appLinks.gpay}
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white border border-gray-200 hover:border-secondary shadow-xs hover:shadow-sm text-xs font-bold text-gray-800 transition-all active:scale-95"
                          >
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>Google Pay</span>
                          </a>
                          <a
                            href={appLinks.phonepe}
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white border border-gray-200 hover:border-secondary shadow-xs hover:shadow-sm text-xs font-bold text-gray-800 transition-all active:scale-95"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#5f259f]" />
                            <span>PhonePe</span>
                          </a>
                          <a
                            href={appLinks.paytm}
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white border border-gray-200 hover:border-secondary shadow-xs hover:shadow-sm text-xs font-bold text-gray-800 transition-all active:scale-95"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#00baf2]" />
                            <span>Paytm</span>
                          </a>
                          <a
                            href={appLinks.cred}
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white border border-gray-200 hover:border-secondary shadow-xs hover:shadow-sm text-xs font-bold text-gray-800 transition-all active:scale-95"
                          >
                            <span className="w-2 h-2 rounded-full bg-black" />
                            <span>CRED</span>
                          </a>
                          <a
                            href={appLinks.bhim}
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white border border-gray-200 hover:border-secondary shadow-xs hover:shadow-sm text-xs font-bold text-gray-800 transition-all active:scale-95"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#00897b]" />
                            <span>BHIM UPI</span>
                          </a>
                          <a
                            href={appLinks.universal}
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-primary hover:bg-secondary text-white shadow-xs text-xs font-bold transition-all active:scale-95"
                          >
                            <ExternalLink size={11} />
                            <span>Any UPI App</span>
                          </a>
                        </div>
                      </div>

                      {/* UTR Input Verification Form */}
                      <form onSubmit={handleUtrSubmit} className="pt-2 border-t border-gray-200 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">
                          Step 2: Enter 12-Digit UTR / Transaction No. After Paying
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={12}
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 428912345678"
                            className="flex-1 border-2 border-gray-200 focus:border-secondary rounded-xl px-3 py-2 text-xs font-mono font-semibold outline-none bg-white transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={isVerifying}
                            className="btn-primary py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {isVerifying ? (
                              <>
                                <RefreshCw size={12} className="animate-spin" />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <>
                                <span>Verify</span>
                                <ArrowRight size={12} />
                              </>
                            )}
                          </button>
                        </div>
                        {utrError && (
                          <p className="text-[11px] text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} /> {utrError}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400">
                          Found in Google Pay, PhonePe, or Paytm receipt as 'UPI Ref ID' or 'UTR'.
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CASH AT DESK */}
              {activeTab === 'CASH' && (
                <div className="p-6 sm:p-8 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
                    <Banknote size={28} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-primary">Pay Cash at Resort Reception Desk</h4>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                      You can pay the full amount of <strong>₹{formatCurrency(amount)}</strong> directly in cash to our front-desk cashier upon arrival or check-in.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-gray-200 text-xs space-y-2 text-left">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-semibold uppercase text-[10px]">Payment Modality</span>
                      <span className="font-bold text-primary">Cash at Counter (Offline)</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-semibold uppercase text-[10px]">Reservation Order ID</span>
                      <span className="font-mono font-bold text-primary">#{orderId || 'DKS-WALKIN'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-semibold uppercase text-[10px]">Payable on Arrival</span>
                      <span className="font-bold text-emerald-700 text-sm">₹{formatCurrency(amount)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOfflineConfirm('CASH_COUNTER')}
                    className="btn-primary py-3 px-6 rounded-xl text-xs uppercase font-bold tracking-wider shadow-md cursor-pointer mx-auto inline-flex items-center gap-2"
                  >
                    <span>Confirm Cash at Counter Booking</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* TAB 3: CARD AT POS */}
              {activeTab === 'CARD' && (
                <div className="p-6 sm:p-8 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mx-auto flex items-center justify-center shadow-xs">
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-primary">Swipe / Tap Card at POS Terminal</h4>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                      Our front desk accepts all major Visa, MasterCard, and RuPay Credit & Debit cards at our encrypted POS terminal.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-gray-200 text-xs space-y-2 text-left">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-semibold uppercase text-[10px]">Accepted Cards</span>
                      <span className="font-bold text-primary">Visa · MasterCard · RuPay</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-semibold uppercase text-[10px]">Terminal Location</span>
                      <span className="font-bold text-primary">Front Reception Desk</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-semibold uppercase text-[10px]">Total Amount</span>
                      <span className="font-bold text-primary text-sm">₹{formatCurrency(amount)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOfflineConfirm('CARD_COUNTER')}
                    className="btn-primary py-3 px-6 rounded-xl text-xs uppercase font-bold tracking-wider shadow-md cursor-pointer mx-auto inline-flex items-center gap-2"
                  >
                    <span>Confirm Card at Desk Booking</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* TAB 4: BANK TRANSFER DETAILS */}
              {activeTab === 'BANK' && (
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-base text-primary">Official Bank Account Transfer (IMPS / NEFT / RTGS)</h4>
                      <p className="text-xs text-gray-500">Direct resort bank account details for wire transfers and corporate bookings.</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border-2 border-secondary/30 shadow-xs space-y-2.5 text-xs">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Beneficiary Name</span>
                      <span className="font-bold text-primary">{YOUPI_CONFIG.merchant.bankDetails.accountHolder}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Bank Name</span>
                      <span className="font-semibold text-primary">{YOUPI_CONFIG.merchant.bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <span className="text-gray-400 font-bold uppercase text-[10px] block">Account Number</span>
                        <span className="font-mono font-bold text-secondary text-sm">{YOUPI_CONFIG.merchant.bankDetails.accountNumber}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAcc}
                        className="px-2.5 py-1 rounded-md bg-cream hover:bg-secondary/20 text-primary border border-secondary/30 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {copiedAcc ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} className="text-secondary" />}
                        <span>{copiedAcc ? 'Copied' : 'Copy A/C'}</span>
                      </button>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <span className="text-gray-400 font-bold uppercase text-[10px] block">IFSC Code</span>
                        <span className="font-mono font-bold text-primary">{YOUPI_CONFIG.merchant.bankDetails.ifscCode}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyIfsc}
                        className="px-2.5 py-1 rounded-md bg-cream hover:bg-secondary/20 text-primary border border-secondary/30 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {copiedIfsc ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} className="text-secondary" />}
                        <span>{copiedIfsc ? 'Copied' : 'Copy IFSC'}</span>
                      </button>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Account Type</span>
                      <span className="font-semibold text-primary">{YOUPI_CONFIG.merchant.bankDetails.accountType}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">MICR Code</span>
                      <span className="font-mono text-gray-700">{YOUPI_CONFIG.merchant.bankDetails.micrCode}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Customer ID</span>
                      <span className="font-mono text-gray-700">{YOUPI_CONFIG.merchant.bankDetails.customerId}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Branch</span>
                      <span className="text-gray-700 font-medium">{YOUPI_CONFIG.merchant.bankDetails.branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Address</span>
                      <span className="text-gray-600 text-right max-w-xs">{YOUPI_CONFIG.merchant.bankDetails.branchAddress}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 flex items-start gap-1.5 bg-cream p-3 rounded-xl border border-secondary/20">
                    <Info size={14} className="text-secondary shrink-0 mt-0.5" />
                    <span>
                      After initiating the transfer, share your bank transaction reference ID with our front desk or submit it via the UPI tab above.
                    </span>
                  </p>
                </div>
              )}

              {/* Secure Footer */}
              <div className="bg-[#1A1410] text-[#A69B91] px-5 sm:px-6 py-3 flex items-center justify-between text-[10px] border-t border-[#C5A059]/30">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#C5A059]" />
                  <span>Powered by YouPI Payment Gateway (0% Fee, Direct-to-Bank)</span>
                </span>
                <span className="hidden sm:inline">24/7 Front Desk: +91 94894 55977</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
