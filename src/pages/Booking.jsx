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

  // Formatting Helpers for redesigned Receipt
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getRoomTypeOrName = (booking) => {
    if (booking.itemType === 'room') {
      const r = rooms.find(item => item.id === Number(booking.itemId));
      return r ? r.name : 'Premium Room';
    } else {
      const h = halls.find(item => item.id === booking.itemId);
      return h ? h.name : 'Function Hall';
    }
  };

  const getNights = (checkInStr, checkOutStr) => {
    const inDate = new Date(checkInStr);
    const outDate = new Date(checkOutStr);
    let diff = Math.ceil((outDate - inDate) / (1000 * 3600 * 24));
    return diff <= 0 ? 1 : diff;
  };

  const formatCurrency = (val) => {
    return Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const numberToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convert = (n) => {
      if (n < 20) return a[n];
      const digit = n % 10;
      if (n < 100) return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };

    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);
    
    let result = convert(integerPart) + ' Rupees';
    if (decimalPart > 0) {
      result += ' and ' + convert(decimalPart) + ' Paise';
    }
    return result + ' Only';
  };

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

  // Support direct booking lookup by URL parameters (for My Bookings page "View Ticket" option)
  const bookingIdParam = searchParams.get('bookingId');
  useEffect(() => {
    if (bookingIdParam && bookings.length > 0) {
      const found = bookings.find(b => b.id === bookingIdParam);
      if (found) {
        setConfirmedBooking(found);
      }
    }
  }, [bookingIdParam, bookings]);

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
    const total = confirmedBooking.amount;
    const subtotal = Math.round(total / 1.18 * 100) / 100;
    const gstTotal = Math.round((total - subtotal) * 100) / 100;
    const cgst = Math.round((gstTotal / 2) * 100) / 100;
    const sgst = Math.round((gstTotal - cgst) * 100) / 100;
    const nights = getNights(confirmedBooking.checkIn, confirmedBooking.checkOut);

    return (
      <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex items-center justify-center px-4 print:p-0 print:bg-white">
        {/* Inject print landscape styles */}
        <style>{`
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print-hide {
              display: none !important;
            }
            #receipt-print-container {
              position: fixed;
              left: 0;
              top: 0;
              width: 297mm;
              height: 210mm;
              padding: 10mm 15mm;
              margin: 0;
              border: none !important;
              box-shadow: none !important;
              background: white !important;
              z-index: 9999999;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            @page {
              size: A4 landscape;
              margin: 0;
            }
          }
        `}</style>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          id="receipt-print-container"
          className="max-w-6xl w-[1000px] bg-white shadow-2xl p-8 rounded-xl border border-gray-150 relative font-body text-primary print:p-0 print:shadow-none print:border-none print:m-0 print:rounded-none"
        >
          {/* Hanging Vertical Ribbon Graphic - Top Right (as in reference image) */}
          <div className="absolute top-0 right-10 w-8 h-12 bg-[#4A3728] flex items-center justify-center rounded-b-md shadow-md print:bg-[#4A3728]">
            <span className="text-secondary font-bold text-lg">★</span>
          </div>

          {/* Palm leaves decorations in corners */}
          <div className="absolute bottom-0 left-0 w-36 h-36 pointer-events-none opacity-15 print:opacity-30">
            <svg viewBox="0 0 120 120" className="w-full h-full fill-green-800">
              <path d="M0,120 Q30,90 90,60 C70,75 50,85 0,120 Z" />
              <path d="M0,120 Q40,70 110,40 C85,60 60,75 0,120 Z" />
              <path d="M0,120 Q50,50 120,20 C95,45 70,65 0,120 Z" />
              <path d="M0,120 Q60,35 110,0 C90,30 65,55 0,120 Z" />
              <path d="M0,120 Q70,20 90,0 C75,20 55,45 0,120 Z" />
            </svg>
          </div>

          <div className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none opacity-15 print:opacity-35 transform scale-x-[-1]">
            <svg viewBox="0 0 120 120" className="w-full h-full fill-green-800">
              <path d="M0,120 Q30,90 90,60 C70,75 50,85 0,120 Z" />
              <path d="M0,120 Q40,70 110,40 C85,60 60,75 0,120 Z" />
              <path d="M0,120 Q50,50 120,20 C95,45 70,65 0,120 Z" />
              <path d="M0,120 Q60,35 110,0 C90,30 65,55 0,120 Z" />
              <path d="M0,120 Q70,20 90,0 C75,20 55,45 0,120 Z" />
            </svg>
          </div>

          {/* TWO COLUMN CONTENT LAYOUT */}
          <div className="grid grid-cols-[1.1fr_1.3fr] gap-8 pb-4">
            
            {/* LEFT COLUMN: GUEST & STAY INFORMATION */}
            <div className="space-y-4 border-r border-gray-100 pr-8">
              
              {/* Logo block */}
              <div className="flex flex-col items-start text-left">
                <img src="/logo-v2.png" alt="DK Logo" className="h-16 w-auto object-contain brightness-95" />
                <p className="text-[7px] uppercase tracking-[0.2em] font-extrabold text-secondary mt-1 whitespace-nowrap">LUXURY IN THE HEART OF NATURE</p>
              </div>

              {/* Guest Info Section */}
              <div className="space-y-2">
                <div className="bg-[#4A3728] text-white text-[9px] font-bold py-1 px-2.5 uppercase tracking-widest rounded flex items-center gap-1.5">
                  <User size={10} /> Guest Information
                </div>
                <div className="text-[10px] space-y-1 text-gray-700 leading-normal pl-1 text-left">
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">Guest Name</span>
                    <span>:</span>
                    <span className="font-bold text-primary">{confirmedBooking.guestName}</span>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">Phone</span>
                    <span>:</span>
                    <span className="text-primary font-mono">{confirmedBooking.guestPhone}</span>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">Email</span>
                    <span>:</span>
                    <span className="text-primary">{confirmedBooking.guestEmail}</span>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">Address</span>
                    <span>:</span>
                    <span className="text-primary leading-tight">
                      45, Lake View Road, Saidapet, Chennai – 600015, Tamil Nadu, India.
                    </span>
                  </div>
                </div>
              </div>

              {/* Stay Info Section */}
              <div className="space-y-2">
                <div className="bg-[#4A3728] text-white text-[9px] font-bold py-1 px-2.5 uppercase tracking-widest rounded flex items-center gap-1.5">
                  <Calendar size={10} /> Stay Information
                </div>
                <div className="text-[10px] space-y-1 text-gray-700 leading-normal pl-1 text-left">
                  <div className="grid grid-cols-[90px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">Check-In Date</span>
                    <span>:</span>
                    <span className="text-primary font-bold">{formatDate(confirmedBooking.checkIn)}</span>
                  </div>
                  <div className="grid grid-cols-[90px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">Check-Out Date</span>
                    <span>:</span>
                    <span className="text-primary font-bold">{formatDate(confirmedBooking.checkOut)}</span>
                  </div>
                  <div className="grid grid-cols-[90px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">No. of Nights</span>
                    <span>:</span>
                    <span className="text-primary font-bold">{nights} {nights > 1 ? 'Nights' : 'Night'}</span>
                  </div>
                  <div className="grid grid-cols-[90px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">Room Type</span>
                    <span>:</span>
                    <span className="text-primary font-bold truncate" title={getRoomTypeOrName(confirmedBooking)}>
                      {getRoomTypeOrName(confirmedBooking)}
                    </span>
                  </div>
                  <div className="grid grid-cols-[90px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">Room No.</span>
                    <span>:</span>
                    <span className="text-primary font-bold">{confirmedBooking.itemId}</span>
                  </div>
                  <div className="grid grid-cols-[90px_10px_1fr]">
                    <span className="font-bold text-gray-500 uppercase text-[8px]">No. of Guests</span>
                    <span>:</span>
                    <span className="text-primary">{confirmedBooking.guests} {confirmedBooking.guests > 1 ? 'Adults' : 'Adult'}</span>
                  </div>
                </div>
              </div>

              {/* Booking Message & Signature */}
              <div className="pt-2 flex justify-between items-end gap-2 text-left">
                <div className="border border-secondary/15 bg-cream/40 p-2.5 rounded text-[8px] text-gray-500 font-bold leading-normal max-w-[210px] relative">
                  <span className="text-secondary text-lg absolute -top-1.5 -left-1 opacity-20">“</span>
                  Thank you for booking with us. We look forward to welcoming you to a refreshing and memorable stay.
                </div>
                
                <div className="text-right whitespace-nowrap">
                  <svg className="w-24 h-8 text-primary opacity-90 mx-auto" viewBox="0 0 150 50">
                    <path 
                      d="M10,38 C25,28 35,8 45,28 C55,48 65,18 78,28 C90,38 105,18 120,28 C135,38 145,28 148,32" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M35,28 C55,18 85,14 110,24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.2" 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="h-px bg-secondary/35 w-28 mt-0.5 ml-auto"></div>
                  <p className="text-[8px] font-bold text-primary mt-0.5">Authorized Signature</p>
                  <p className="text-[7px] text-gray-400 font-bold uppercase tracking-wider">DK Star Resorts</p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: BOOKING RECEIPT DETAILS */}
            <div className="space-y-4 relative text-left">
              
              {/* Header Title */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-primary tracking-widest uppercase">Booking Receipt</h2>
                <div className="flex items-center gap-1 my-1 w-20">
                  <div className="h-[1.5px] bg-secondary grow"></div>
                  <div className="w-1 h-1 rotate-45 bg-secondary"></div>
                  <div className="h-[1.5px] bg-secondary grow"></div>
                </div>
              </div>

              {/* Receipt Metadata block */}
              <div className="text-[9.5px] leading-relaxed space-y-1 bg-cream/70 border border-secondary/15 p-2.5 rounded-lg w-[260px]">
                <div className="grid grid-cols-[110px_8px_1fr] font-bold">
                  <span className="text-gray-500 font-semibold uppercase text-[8px]">Receipt No.</span>
                  <span>:</span>
                  <span className="text-primary font-mono">{`DKS/REC/2026/${confirmedBooking.id.replace('BK-', '')}`}</span>
                </div>
                <div className="grid grid-cols-[110px_8px_1fr] font-bold">
                  <span className="text-gray-500 font-semibold uppercase text-[8px]">Booking ID</span>
                  <span>:</span>
                  <span className="text-primary font-mono">{`DKS/BOOK/2026/${confirmedBooking.id.replace('BK-', '')}`}</span>
                </div>
                <div className="grid grid-cols-[110px_8px_1fr] font-bold">
                  <span className="text-gray-500 font-semibold uppercase text-[8px]">Date</span>
                  <span>:</span>
                  <span className="text-primary">{formatDate(new Date())}</span>
                </div>
                <div className="grid grid-cols-[110px_8px_1fr] font-bold">
                  <span className="text-gray-500 font-semibold uppercase text-[8px]">Payment Mode</span>
                  <span>:</span>
                  <span className="text-primary">UPI</span>
                </div>
                <div className="grid grid-cols-[110px_8px_1fr] font-bold">
                  <span className="text-gray-500 font-semibold uppercase text-[8px]">Payment Status</span>
                  <span>:</span>
                  <span className="text-green-700 uppercase font-extrabold text-[8px]">PAID</span>
                </div>
              </div>

              {/* Booking Details Table */}
              <div className="space-y-1.5">
                <div className="bg-[#4A3728] text-white text-[9px] font-bold py-1 px-2.5 uppercase tracking-widest rounded flex items-center gap-1.5">
                  <Home size={10} /> Booking Details
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-[10px]">
                    <thead className="bg-[#4A3728] text-white text-[8px] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-3 py-1.5 text-left">Description</th>
                        <th className="px-3 py-1.5 text-center w-[60px]">Qty</th>
                        <th className="px-3 py-1.5 text-right w-[90px]">Rate</th>
                        <th className="px-3 py-1.5 text-right w-[95px]">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 font-medium text-gray-700 bg-white">
                      {/* Room Charge */}
                      <tr>
                        <td className="px-3 py-2 text-left font-bold text-primary">
                          Room Charge ({formatDate(confirmedBooking.checkIn)} – {formatDate(confirmedBooking.checkOut)})
                        </td>
                        <td className="px-3 py-2 text-center text-gray-500">{nights} {nights > 1 ? 'Nights' : 'Night'}</td>
                        <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(subtotal / nights)}</td>
                        <td className="px-3 py-2 text-right font-bold text-primary">{formatCurrency(subtotal)}</td>
                      </tr>
                      {/* Breakfast */}
                      <tr>
                        <td className="px-3 py-2 text-left text-gray-600 italic">Complimentary Breakfast</td>
                        <td className="px-3 py-2 text-center text-gray-500">{nights * confirmedBooking.guests}</td>
                        <td className="px-3 py-2 text-right text-gray-600">0.00</td>
                        <td className="px-3 py-2 text-right font-bold text-primary">0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CGST, SGST, Subtotal, Amount in Words */}
              <div className="grid grid-cols-[1fr_180px] gap-4 items-start pt-1.5">
                <div className="bg-cream/50 border border-secondary/10 p-2 rounded text-[8px] text-gray-500 font-bold leading-normal">
                  <span className="text-primary font-extrabold uppercase tracking-wide block mb-0.5">Amount in Words:</span>
                  {numberToWords(total)}
                </div>

                <div className="text-[9.5px] space-y-1.5 leading-tight">
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>SUBTOTAL</span>
                    <span className="text-primary">₹ {formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>CGST (9%)</span>
                    <span className="text-primary">₹ {formatCurrency(cgst)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>SGST (9%)</span>
                    <span className="text-primary">₹ {formatCurrency(sgst)}</span>
                  </div>
                  <div className="bg-[#4A3728] text-white p-2 rounded flex justify-between font-extrabold text-[10px] tracking-wider">
                    <span>TOTAL</span>
                    <span className="text-secondary">₹ {formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* UPI PAYMENTS QR & NOTES BOX */}
              <div className="grid grid-cols-[1.1fr_1fr] gap-4 pt-1 items-stretch">
                {/* UPI QR code box */}
                <div className="border border-secondary/15 rounded-lg p-2 bg-cream/70 flex items-center gap-3">
                  <svg className="w-10 h-10 text-primary shrink-0" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="4" y="4" width="22" height="22" fill="white" />
                    <rect x="8" y="8" width="14" height="14" fill="currentColor" />

                    <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="74" y="4" width="22" height="22" fill="white" />
                    <rect x="78" y="8" width="14" height="14" fill="currentColor" />

                    <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                    <rect x="4" y="74" width="22" height="22" fill="white" />
                    <rect x="8" y="78" width="14" height="14" fill="currentColor" />

                    <rect x="40" y="10" width="10" height="20" fill="currentColor" />
                    <rect x="55" y="5" width="10" height="10" fill="currentColor" />
                    <rect x="45" y="40" width="15" height="15" fill="currentColor" />
                    <rect x="15" y="45" width="10" height="10" fill="currentColor" />
                    <rect x="75" y="45" width="20" height="10" fill="currentColor" />
                    <rect x="40" y="70" width="15" height="10" fill="currentColor" />
                    <rect x="80" y="80" width="10" height="15" fill="currentColor" />
                    <rect x="60" y="75" width="10" height="20" fill="currentColor" />
                  </svg>
                  <div className="text-[8px] space-y-0.5 font-bold text-gray-500">
                    <p className="text-primary font-extrabold text-[9px] tracking-wider uppercase">Scan to Pay</p>
                    <p><span className="text-secondary">UPI ID:</span> dkstarresorts@upi</p>
                    <p><span className="text-secondary">GSTIN:</span> 33AAXFDK1234H1Z5</p>
                  </div>
                </div>

                {/* Right note box */}
                <div className="border border-secondary/15 rounded-lg p-2.5 bg-cream/70 text-[8px] leading-relaxed text-gray-500 font-bold flex flex-col justify-center">
                  <p className="text-primary uppercase tracking-wider font-extrabold mb-1">Note:</p>
                  <p>• Please keep this receipt for your records.</p>
                  <p>• For any queries, please contact the front desk.</p>
                </div>
              </div>

            </div>
          </div>

          {/* CONTACT & ENQUIRIES FOOTER */}
          <div className="border-t border-secondary/15 pt-3 mt-2">
            <div className="grid grid-cols-3 gap-6 text-[8px] font-bold text-gray-500 text-left">
              <div className="flex items-start gap-1.5">
                <User size={12} className="text-secondary shrink-0" />
                <div>
                  <p className="text-primary uppercase tracking-wide font-extrabold mb-0.5">Guest Information</p>
                  <p>{confirmedBooking.guestName}</p>
                  <p className="font-mono text-gray-400">{confirmedBooking.guestPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Phone size={12} className="text-secondary shrink-0" />
                <div>
                  <p className="text-primary uppercase tracking-wide font-extrabold mb-0.5">Resort Contact</p>
                  <p className="font-mono">+91 94894 55977</p>
                  <p className="lowercase font-mono text-gray-400">dkresort01@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Home size={12} className="text-secondary shrink-0" />
                <div>
                  <p className="text-primary uppercase tracking-wide font-extrabold mb-0.5">www.dkstarresorts.com</p>
                  <p className="leading-relaxed text-gray-400">No 202/2, PONNIYAMMAN Kovil Street, KOLLAIMEDU VP MAHAL Backside, Vanjur, Vellore - 632006, Tamil Nadu, India.</p>
                </div>
              </div>
            </div>
          </div>

          {/* print-hide CTA buttons */}
          <div className="mt-6 flex gap-4 print-hide">
            <button 
              onClick={() => setConfirmedBooking(null)}
              className="w-1/3 btn-outline py-2 text-xs flex justify-center items-center gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-50 font-bold uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft size={13} /> New Booking
            </button>
            <button 
              onClick={handlePrint}
              className="w-1/3 btn-outline py-2 text-xs flex justify-center items-center gap-1.5 border-secondary text-secondary hover:bg-secondary/10 font-bold uppercase tracking-wider cursor-pointer"
            >
              <Printer size={13} /> Print Receipt
            </button>
            <Link 
              to="/my-bookings"
              className="w-1/3 btn-primary py-2 text-xs font-bold uppercase tracking-wider text-center flex justify-center items-center cursor-pointer"
            >
              Go to My Bookings
            </Link>
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
