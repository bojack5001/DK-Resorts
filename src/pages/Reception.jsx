import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  DoorOpen, 
  ClipboardList, 
  FileText, 
  CheckCircle, 
  Activity, 
  Sparkles, 
  Lock, 
  UserPlus, 
  LogOut,
  Calendar,
  Phone,
  Mail,
  Home,
  Check,
  X,
  CreditCard,
  Printer
} from 'lucide-react';
import { useResort } from '../context/ResortContext';

const Reception = () => {
  const { 
    rooms, 
    halls, 
    bookings, 
    roomStates, 
    addBooking, 
    updateBookingStatus, 
    setRoomCleaningStatus 
  } = useResort();

  // Formatting Helpers for redesigned Invoice
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

  // Credentials State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInStaff, setLoggedInStaff] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Authorised staff accounts
  const STAFF_ACCOUNTS = [
    { username: 'deena@staff', password: 'deena@123', displayName: 'Deena', initials: 'DS' },
    { username: 'jagan@staff', password: 'deena@123', displayName: 'Jagan', initials: 'JS' },
  ];

  // UI Active view tabs
  const [activeTab, setActiveTab] = useState('grid'); // 'grid', 'walkin', 'search'
  const [searchQuery, setSearchQuery] = useState('');

  // Selected cell detail modal
  const [selectedCell, setSelectedCell] = useState(null); // { item, type, status, booking }
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [showCheckoutInvoice, setShowCheckoutInvoice] = useState(null); // Booking object

  // Form states for frontdesk walk-in
  const [walkinGuestName, setWalkinGuestName] = useState('');
  const [walkinGuestEmail, setWalkinGuestEmail] = useState('');
  const [walkinGuestPhone, setWalkinGuestPhone] = useState('');
  const [walkinCheckOut, setWalkinCheckOut] = useState('');
  const [walkinGuestsCount, setWalkinGuestsCount] = useState(1);

  const handleLogin = (e) => {
    e.preventDefault();
    const match = STAFF_ACCOUNTS.find(
      acc => acc.username === username.trim() && acc.password === password
    );
    if (match) {
      setIsAuthenticated(true);
      setLoggedInStaff(match);
      setLoginError('');
    } else {
      setLoginError('Access Denied. Please check your staff credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInStaff(null);
    setUsername('');
    setPassword('');
  };

  // Helper: Find today's active or pending checkin bookings
  const getTodayBooking = (itemId, itemType) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return bookings.find(b => {
      const bId = itemType === 'room' ? Number(b.itemId) : b.itemId;
      const matchId = itemType === 'room' ? Number(itemId) : itemId;
      return (
        bId === matchId && 
        b.itemType === itemType && 
        (b.status === 'Confirmed' || b.status === 'Checked-in' || b.status === 'Pending') &&
        todayStr >= b.checkIn && 
        todayStr <= b.checkOut
      );
    });
  };

  // Helper: Get cell details (status, booking)
  const getCellDetails = (item, type) => {
    const stateObj = roomStates[item.id] || { status: 'available' };
    const todayBooking = getTodayBooking(item.id, type);
    
    let visualStatus = stateObj.status; // 'available', 'occupied', 'dirty'
    if (visualStatus === 'available' && todayBooking && todayBooking.status === 'Confirmed') {
      visualStatus = 'booked'; // Highlight as booked (orange) if confirmed booking exists today
    }

    return {
      visualStatus, // 'available' (green), 'booked' (orange), 'occupied' (blue), 'dirty' (red)
      booking: todayBooking
    };
  };

  const handleCellClick = (item, type, details) => {
    setSelectedCell({
      item,
      type,
      status: details.visualStatus,
      booking: details.booking
    });
  };

  // Check in a guest who has a booking
  const handleCheckIn = (bookingId) => {
    updateBookingStatus(bookingId, 'Checked-in');
    if (selectedCell) {
      setSelectedCell(prev => ({
        ...prev,
        status: 'occupied',
        booking: { ...prev.booking, status: 'Checked-in' }
      }));
    }
  };

  // Trigger check out
  const handleCheckOut = (booking) => {
    updateBookingStatus(booking.id, 'Checked-out');
    setShowCheckoutInvoice(booking);
    setSelectedCell(null);
  };

  // Handle cleaning completed
  const handleCleaned = (itemId) => {
    setRoomCleaningStatus(itemId, 'available');
    setSelectedCell(null);
  };

  // Front desk walk-in submission
  const handleWalkinSubmit = (e) => {
    e.preventDefault();
    if (!selectedCell) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newBookingData = {
      itemId: selectedCell.item.id,
      itemName: selectedCell.item.name,
      itemType: selectedCell.type,
      guestName: walkinGuestName,
      guestEmail: walkinGuestEmail,
      guestPhone: walkinGuestPhone,
      checkIn: todayStr,
      checkOut: walkinCheckOut,
      guests: Number(walkinGuestsCount),
      status: 'Checked-in' // Walk-ins check-in immediately
    };

    addBooking(newBookingData);
    
    // Reset inputs
    setWalkinGuestName('');
    setWalkinGuestEmail('');
    setWalkinGuestPhone('');
    setWalkinCheckOut('');
    setWalkinGuestsCount(1);
    setSelectedCell(null);
    setShowWalkinModal(false);
  };

  // Filtered check-in ledger search
  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    return (b.guestName  || '').toLowerCase().includes(q) ||
           (b.id         || '').toLowerCase().includes(q) ||
           (b.guestEmail || '').toLowerCase().includes(q) ||
           (b.guestPhone || '').includes(q);
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#3A2D23] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/15 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/25 rounded-full filter blur-[80px]" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-2xl text-white z-10"
        >
          <div className="text-center mb-8">
            <img src="/logo-v2.png" alt="DK Logo" className="h-16 mx-auto brightness-0 invert" />
            <h2 className="text-2xl font-heading font-bold mt-4 tracking-wider">Front Desk Terminal</h2>
            <p className="text-xs uppercase tracking-widest text-secondary font-bold mt-1">Receptionist Access</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-500/20 border-l-4 border-red-500 text-red-200 text-xs rounded">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-300">Front Desk Username</label>
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. deena@staff"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded text-sm focus:border-secondary outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-300">Passcode</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded text-sm focus:border-secondary outline-none transition-colors"
              />
            </div>
            <button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-primary py-3.5 font-bold uppercase tracking-widest text-xs transition-colors rounded shadow-lg shadow-secondary/15 flex items-center justify-center gap-2">
              <Lock size={16} /> Open Front Desk
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="h-20 bg-primary text-white flex items-center justify-between px-6 md:px-8 shrink-0 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/logo-v2.png" alt="DK Logo" className="h-10 w-auto brightness-0 invert" />
          <div className="hidden md:block h-6 w-px bg-white/20" />
          <span className="hidden md:inline text-xs uppercase tracking-[0.2em] font-bold text-secondary">Front Desk Operations</span>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-1">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'grid' ? 'bg-secondary text-primary' : 'text-gray-300 hover:text-white'}`}
          >
            Room Grid
          </button>
          <button 
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'search' ? 'bg-secondary text-primary' : 'text-gray-300 hover:text-white'}`}
          >
            Guest Registry
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider"
        >
          <LogOut size={16} /> Exit Desk
        </button>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* TAB: GRID MAP */}
        {activeTab === 'grid' && (
          <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary flex items-center gap-2">
                  <Activity size={24} className="text-secondary animate-pulse" /> Live Status Grid
                </h1>
                <p className="text-gray-500 text-xs mt-1">Interactive overview of all 10 guest rooms and 2 function halls.</p>
              </div>

              {/* Status Indicators */}
              <div className="flex flex-wrap gap-4 mt-3 md:mt-0 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-green-500 rounded" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-amber-500 rounded" /> Booked Today</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-blue-500 rounded" /> Occupied</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-red-500 rounded" /> Cleaning Req.</span>
              </div>
            </div>

            {/* Grid of rooms */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Guest Rooms</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {rooms.map(room => {
                  const details = getCellDetails(room, 'room');
                  const cardColor = {
                    available: 'bg-green-50 border-green-200 hover:border-green-400 text-green-700',
                    booked: 'bg-amber-50 border-amber-200 hover:border-amber-400 text-amber-700',
                    occupied: 'bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-700',
                    dirty: 'bg-red-50 border-red-200 hover:border-red-400 text-red-700'
                  }[details.visualStatus];

                  return (
                    <motion.button
                      whileHover={{ y: -2 }}
                      key={room.id}
                      onClick={() => handleCellClick(room, 'room', details)}
                      className={`border p-6 rounded-xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer shadow-sm relative ${cardColor}`}
                    >
                      <span className="text-2xl font-bold font-heading">{room.id}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold mt-1 truncate max-w-full">{room.name}</span>
                      <span className="text-[8px] uppercase tracking-widest opacity-60 mt-1 font-bold">
                        {details.visualStatus}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Grid of halls */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Function Halls</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {halls.map(hall => {
                  const details = getCellDetails(hall, 'hall');
                  const cardColor = {
                    available: 'bg-green-50 border-green-200 hover:border-green-400 text-green-700',
                    booked: 'bg-amber-50 border-amber-200 hover:border-amber-400 text-amber-700',
                    occupied: 'bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-700',
                    dirty: 'bg-red-50 border-red-200 hover:border-red-400 text-red-700'
                  }[details.visualStatus];

                  return (
                    <motion.button
                      whileHover={{ y: -2 }}
                      key={hall.id}
                      onClick={() => handleCellClick(hall, 'hall', details)}
                      className={`border p-6 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer shadow-sm ${cardColor}`}
                    >
                      <div>
                        <h4 className="text-xl font-heading font-bold">{hall.name}</h4>
                        <span className="text-[10px] uppercase tracking-wider font-bold mt-1 opacity-70 block">{hall.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold uppercase tracking-wider block">{details.visualStatus}</span>
                        <span className="text-[9px] opacity-60 mt-0.5 block">Cap: {hall.capacity} max</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SEARCH LOGS */}
        {activeTab === 'search' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">Guest Directory</h1>
              <p className="text-gray-500 text-xs mt-1">Look up check-in details, contact details, and logs quickly.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search guest name, email, booking ID or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 rounded outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 font-medium text-sm text-primary shadow-sm"
              />
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[9px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Selected Unit</th>
                    <th className="px-6 py-4">Stay Range</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-xs font-semibold">
                        No matches found.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-primary">{b.id}</td>
                        <td className="px-6 py-4 font-medium">
                          <p className="font-bold text-primary">{b.guestName}</p>
                          <p className="text-[10px] text-gray-400">{b.guestEmail} | {b.guestPhone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-700">{b.itemName}</p>
                          <span className="text-[9px] font-bold text-secondary uppercase">{b.itemType}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {b.checkIn} to {b.checkOut}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            b.status === 'Checked-in' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            b.status === 'Checked-out' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                            b.status === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* DRAWER/MODAL: CELL ACTION */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-end p-0">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto"
          >
            {/* Modal Top */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <span className="text-secondary text-[10px] font-bold uppercase tracking-widest">{selectedCell.type} DETAILS</span>
                  <h3 className="text-2xl font-heading font-bold text-primary">{selectedCell.item.name}</h3>
                </div>
                <button onClick={() => setSelectedCell(null)} className="text-gray-400 hover:text-primary">
                  <X size={20} />
                </button>
              </div>

              {/* Card info */}
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 flex gap-4">
                <img src={selectedCell.item.image} alt={selectedCell.item.name} className="w-24 h-20 object-cover rounded" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-primary">Price: ₹{selectedCell.item.price.toLocaleString('en-IN')}/{selectedCell.type === 'room' ? 'Night' : 'Day'}</p>
                  <p className="text-gray-500">Capacity: {selectedCell.item.capacity} guests</p>
                  <p className="text-gray-400 line-clamp-2">{selectedCell.item.description}</p>
                </div>
              </div>

              {/* Status specific panel */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Occupancy</h4>
                
                {/* Available Status */}
                {selectedCell.status === 'available' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 text-xs">
                      This unit is vacant and prepared for check-in.
                    </div>
                    <button 
                      onClick={() => setShowWalkinModal(true)}
                      className="w-full btn-primary py-3 text-xs flex justify-center items-center gap-2"
                    >
                      <UserPlus size={16} /> Walk-In Check-In
                    </button>
                  </div>
                )}

                {/* Booked Status */}
                {selectedCell.status === 'booked' && selectedCell.booking && (
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 text-xs">
                      Confirmed booking scheduled for check-in today.
                    </div>
                    <div className="text-xs space-y-2.5 border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 font-semibold text-gray-500">
                        <span>GUEST NAME</span>
                        <span className="text-primary font-bold">{selectedCell.booking.guestName}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 font-semibold text-gray-500">
                        <span>PHONE / EMAIL</span>
                        <span className="text-primary">{selectedCell.booking.guestPhone}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 font-semibold text-gray-500">
                        <span>STAY LENGTH</span>
                        <span className="text-primary">{selectedCell.booking.checkIn} to {selectedCell.booking.checkOut}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-gray-500">
                        <span>AMOUNT TO COLLECT</span>
                        <span className="text-secondary font-bold">₹{selectedCell.booking.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCheckIn(selectedCell.booking.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
                    >
                      <CheckCircle size={16} /> Complete Check-In
                    </button>
                  </div>
                )}

                {/* Occupied Status */}
                {selectedCell.status === 'occupied' && selectedCell.booking && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 text-xs">
                      Guest is currently registered in this unit.
                    </div>
                    <div className="text-xs space-y-2.5 border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 font-semibold text-gray-500">
                        <span>REGISTERED GUEST</span>
                        <span className="text-primary font-bold">{selectedCell.booking.guestName}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 font-semibold text-gray-500">
                        <span>PHONE / EMAIL</span>
                        <span className="text-primary">{selectedCell.booking.guestPhone}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 font-semibold text-gray-500">
                        <span>CHECK-IN</span>
                        <span className="text-primary">{selectedCell.booking.checkIn}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 font-semibold text-gray-500">
                        <span>EXPECTED CHECK-OUT</span>
                        <span className="text-primary font-bold">{selectedCell.booking.checkOut}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-gray-500">
                        <span>TOTAL LEDGER BILL</span>
                        <span className="text-secondary font-bold">₹{selectedCell.booking.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCheckOut(selectedCell.booking)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
                    >
                      <DoorOpen size={16} /> Check-Out Guest & Bill
                    </button>
                  </div>
                )}

                {/* Dirty Status */}
                {selectedCell.status === 'dirty' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs">
                      This unit requires cleaning and sanitization before it can be assigned to new arrivals.
                    </div>
                    <button 
                      onClick={() => handleCleaned(selectedCell.item.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
                    >
                      <Sparkles size={16} /> Mark Cleaned & Ready
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setSelectedCell(null)}
              className="w-full btn-outline py-2.5 text-xs mt-6"
            >
              Close Panel
            </button>
          </motion.div>
        </div>
      )}

      {/* MODAL: WALK-IN BOOKING FORM */}
      {showWalkinModal && selectedCell && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white shadow-2xl p-8 rounded-xl border border-gray-100"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-xl font-heading font-bold text-primary">Walk-In: Unit {selectedCell.item.id || selectedCell.item.name}</h3>
              <button onClick={() => setShowWalkinModal(false)} className="text-gray-400 hover:text-primary">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleWalkinSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Guest Full Name</label>
                <input 
                  required
                  type="text" 
                  value={walkinGuestName}
                  onChange={(e) => setWalkinGuestName(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none font-medium"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={walkinGuestPhone}
                  onChange={(e) => setWalkinGuestPhone(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={walkinGuestEmail}
                  onChange={(e) => setWalkinGuestEmail(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none font-medium"
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Check-Out Date</label>
                  <input 
                    required
                    type="date" 
                    value={walkinCheckOut}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setWalkinCheckOut(e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2 text-sm outline-none font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Guest Count</label>
                  <input 
                    required
                    type="number" 
                    min={1}
                    value={walkinGuestsCount}
                    onChange={(e) => setWalkinGuestsCount(Number(e.target.value))}
                    className="w-full border border-gray-200 px-3 py-2 text-sm outline-none font-medium"
                  />
                </div>
              </div>
              <button type="submit" className="w-full btn-primary py-3 text-xs mt-4">
                Check-In & Save Booking
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: CHECK-OUT INVOICE PRINTOUT */}
      {/* MODAL: CHECK-OUT INVOICE PRINTOUT */}
      {showCheckoutInvoice && (() => {
        const total = showCheckoutInvoice.amount;
        const subtotal = Math.round(total / 1.18 * 100) / 100;
        const gstTotal = Math.round((total - subtotal) * 100) / 100;
        const cgst = Math.round((gstTotal / 2) * 100) / 100;
        const sgst = Math.round((gstTotal - cgst) * 100) / 100;
        const nights = getNights(showCheckoutInvoice.checkIn, showCheckoutInvoice.checkOut);
        
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            {/* Inject print stylesheet rule */}
            <style>{`
              @media print {
                body {
                  background: white !important;
                  color: black !important;
                }
                .print-hide {
                  display: none !important;
                }
                #invoice-print-container {
                  position: fixed;
                  left: 0;
                  top: 0;
                  width: 210mm;
                  height: 297mm;
                  padding: 15mm 20mm;
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
                  size: A4 portrait;
                  margin: 0;
                }
              }
            `}</style>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              id="invoice-print-container"
              className="bg-white shadow-2xl p-10 rounded-xl border border-gray-150 relative max-w-4xl w-[850px] font-body text-primary print:p-0 print:shadow-none print:border-none print:m-0"
            >
              {/* Corner palm leaves decorative vectors (only shown on screen and high quality print) */}
              <div className="absolute bottom-0 left-0 w-44 h-44 pointer-events-none opacity-15 print:opacity-35">
                <svg viewBox="0 0 120 120" className="w-full h-full fill-green-800">
                  <path d="M0,120 Q30,90 90,60 C70,75 50,85 0,120 Z" />
                  <path d="M0,120 Q40,70 110,40 C85,60 60,75 0,120 Z" />
                  <path d="M0,120 Q50,50 120,20 C95,45 70,65 0,120 Z" />
                  <path d="M0,120 Q60,35 110,0 C90,30 65,55 0,120 Z" />
                  <path d="M0,120 Q70,20 90,0 C75,20 55,45 0,120 Z" />
                </svg>
              </div>

              <div className="absolute bottom-0 right-0 w-44 h-44 pointer-events-none opacity-15 print:opacity-35 transform scale-x-[-1]">
                <svg viewBox="0 0 120 120" className="w-full h-full fill-green-800">
                  <path d="M0,120 Q30,90 90,60 C70,75 50,85 0,120 Z" />
                  <path d="M0,120 Q40,70 110,40 C85,60 60,75 0,120 Z" />
                  <path d="M0,120 Q50,50 120,20 C95,45 70,65 0,120 Z" />
                  <path d="M0,120 Q60,35 110,0 C90,30 65,55 0,120 Z" />
                  <path d="M0,120 Q70,20 90,0 C75,20 55,45 0,120 Z" />
                </svg>
              </div>

              {/* TOP HEADER SECTION */}
              <div className="grid grid-cols-[1fr_2fr_1.5fr] gap-4 items-center pb-6 border-b border-secondary/15">
                {/* Logo & Slogan */}
                <div className="flex flex-col items-start text-left">
                  <img src="/logo-v2.png" alt="DK Logo" className="h-16 w-auto object-contain brightness-95" />
                  <p className="text-[7.5px] uppercase tracking-[0.15em] font-extrabold text-secondary mt-1 whitespace-nowrap">LUXURY IN THE HEART OF NATURE</p>
                </div>

                {/* Document Title */}
                <div className="flex flex-col items-center justify-center text-center">
                  <h2 className="text-3xl font-heading font-bold text-primary tracking-widest uppercase">Invoice</h2>
                  <div className="flex items-center gap-1.5 my-1 w-24">
                    <div className="h-[1.5px] bg-secondary grow"></div>
                    <div className="w-1.5 h-1.5 rotate-45 bg-secondary"></div>
                    <div className="h-[1.5px] bg-secondary grow"></div>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium italic">Thank you for choosing DK Star Resorts</p>
                </div>

                {/* Metadata Details */}
                <div className="text-[10px] leading-relaxed space-y-1 bg-cream border border-secondary/15 p-3 rounded-lg self-center justify-self-end w-[220px]">
                  <div className="grid grid-cols-[100px_8px_1fr] font-bold">
                    <span className="text-gray-500 font-semibold uppercase tracking-wider text-[8px]">Invoice No.</span>
                    <span className="text-gray-400">:</span>
                    <span className="text-primary font-mono">{`DKS/INV/2026/${showCheckoutInvoice.id.replace('BK-', '')}`}</span>
                  </div>
                  <div className="grid grid-cols-[100px_8px_1fr] font-bold">
                    <span className="text-gray-500 font-semibold uppercase tracking-wider text-[8px]">Date</span>
                    <span className="text-gray-400">:</span>
                    <span className="text-primary">{formatDate(new Date())}</span>
                  </div>
                  <div className="grid grid-cols-[100px_8px_1fr] font-bold">
                    <span className="text-gray-500 font-semibold uppercase tracking-wider text-[8px]">Check-In Date</span>
                    <span className="text-gray-400">:</span>
                    <span className="text-primary">{formatDate(showCheckoutInvoice.checkIn)}</span>
                  </div>
                  <div className="grid grid-cols-[100px_8px_1fr] font-bold">
                    <span className="text-gray-500 font-semibold uppercase tracking-wider text-[8px]">Check-Out Date</span>
                    <span className="text-gray-400">:</span>
                    <span className="text-primary">{formatDate(showCheckoutInvoice.checkOut)}</span>
                  </div>
                </div>
              </div>

              {/* BILLED TO & RESERVATION DETAILS */}
              <div className="grid grid-cols-2 gap-8 my-6">
                {/* Column 1: Billed To */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-secondary border-b border-secondary/15 pb-1">Billed To</h4>
                  <div className="text-[10px] space-y-1 text-gray-700">
                    <p className="font-bold text-xs text-primary">{showCheckoutInvoice.guestName}</p>
                    <p>45, Lake View Road</p>
                    <p>Saidapet, Chennai – 600015, Tamil Nadu</p>
                    <p>India</p>
                    <p className="pt-0.5"><span className="font-bold text-gray-500 uppercase text-[8px]">Phone:</span> {showCheckoutInvoice.guestPhone}</p>
                    <p><span className="font-bold text-gray-500 uppercase text-[8px]">Email:</span> {showCheckoutInvoice.guestEmail}</p>
                  </div>
                </div>

                {/* Column 2: Reservation Details */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-secondary border-b border-secondary/15 pb-1">Reservation Details</h4>
                  <div className="text-[10px] space-y-1 text-gray-700">
                    <div className="grid grid-cols-[90px_8px_1fr]">
                      <span className="font-semibold text-gray-500 uppercase text-[8px]">Booking ID</span>
                      <span>:</span>
                      <span className="font-bold text-primary">{`DKS/BOOK/2026/${showCheckoutInvoice.id.replace('BK-', '')}`}</span>
                    </div>
                    <div className="grid grid-cols-[90px_8px_1fr]">
                      <span className="font-semibold text-gray-500 uppercase text-[8px]">Room Type</span>
                      <span>:</span>
                      <span className="font-bold text-primary truncate" title={getRoomTypeOrName(showCheckoutInvoice)}>
                        {getRoomTypeOrName(showCheckoutInvoice)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[90px_8px_1fr]">
                      <span className="font-semibold text-gray-500 uppercase text-[8px]">Room No.</span>
                      <span>:</span>
                      <span className="font-bold text-primary">{showCheckoutInvoice.itemId}</span>
                    </div>
                    <div className="grid grid-cols-[90px_8px_1fr]">
                      <span className="font-semibold text-gray-500 uppercase text-[8px]">No. of Guests</span>
                      <span>:</span>
                      <span className="text-primary">{showCheckoutInvoice.guests} {showCheckoutInvoice.guests > 1 ? 'Adults' : 'Adult'}</span>
                    </div>
                    <div className="grid grid-cols-[90px_8px_1fr]">
                      <span className="font-semibold text-gray-500 uppercase text-[8px]">Payment Method</span>
                      <span>:</span>
                      <span className="font-bold text-primary">UPI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEMIZED TABLE */}
              <div className="border border-gray-200 rounded-lg overflow-hidden my-6">
                <table className="w-full text-xs">
                  <thead className="bg-primary text-white text-[9.5px] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Description</th>
                      <th className="px-4 py-2.5 text-center w-[80px]">Qty</th>
                      <th className="px-4 py-2.5 text-right w-[120px]">Rate (INR)</th>
                      <th className="px-4 py-2.5 text-right w-[120px]">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 font-medium text-gray-700 bg-white">
                    {/* Room charge row */}
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-left font-bold text-primary">
                        <div>Room Charge ({formatDate(showCheckoutInvoice.checkIn)} – {formatDate(showCheckoutInvoice.checkOut)})</div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500">{nights} {nights > 1 ? 'Nights' : 'Night'}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(subtotal / nights)}</td>
                      <td className="px-4 py-3 text-right font-bold text-primary">{formatCurrency(subtotal)}</td>
                    </tr>
                    
                    {/* Breakfast row */}
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-left text-gray-600 italic">Complimentary Breakfast</td>
                      <td className="px-4 py-3 text-center text-gray-500">{nights * showCheckoutInvoice.guests}</td>
                      <td className="px-4 py-3 text-right text-gray-600">0.00</td>
                      <td className="px-4 py-3 text-right font-bold text-primary">0.00</td>
                    </tr>

                    {/* Wifi row */}
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-left text-gray-600 italic">Complimentary High-speed WiFi & Spa Access</td>
                      <td className="px-4 py-3 text-center text-gray-500">1 Package</td>
                      <td className="px-4 py-3 text-right text-gray-600">0.00</td>
                      <td className="px-4 py-3 text-right font-bold text-primary">0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* TOTALS & NOTES LAYOUT */}
              <div className="grid grid-cols-[1.2fr_1fr] gap-8 items-start my-6">
                {/* Notes and Signature */}
                <div className="space-y-4">
                  <div className="text-[9px] leading-relaxed space-y-1">
                    <h5 className="font-bold text-primary uppercase tracking-wider text-[10px]">Notes</h5>
                    <ul className="list-disc pl-4 text-gray-500 space-y-0.5 font-bold">
                      <li>Thank you for staying with us.</li>
                      <li>Please settle the bill at the time of check-out.</li>
                      <li>For any queries, please contact the front desk.</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    {/* Artistic signature SVG path */}
                    <svg className="w-32 h-10 text-primary opacity-90" viewBox="0 0 150 50">
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
                    <div className="h-px bg-secondary/35 w-40 mt-1"></div>
                    <p className="text-[9px] font-bold text-primary mt-1">Authorized Signature</p>
                    <p className="text-[7.5px] text-gray-400 font-bold uppercase tracking-widest">DK Star Resorts</p>
                  </div>
                </div>

                {/* Subtotal table & Amount in Words */}
                <div className="space-y-4">
                  <div className="text-[10px] space-y-2 border-t border-b border-gray-150 py-3">
                    <div className="flex justify-between font-bold text-gray-500 tracking-wider">
                      <span>SUBTOTAL</span>
                      <span className="text-primary">₹ {formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-500 tracking-wider">
                      <span>CGST (9%)</span>
                      <span className="text-primary">₹ {formatCurrency(cgst)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-500 tracking-wider">
                      <span>SGST (9%)</span>
                      <span className="text-primary">₹ {formatCurrency(sgst)}</span>
                    </div>
                    <div className="bg-[#4A3728] text-white p-2.5 rounded flex justify-between font-bold text-xs tracking-widest mt-1">
                      <span>TOTAL AMOUNT</span>
                      <span className="text-secondary">₹ {formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Word Amount representation */}
                  <div className="bg-cream/50 border border-secondary/10 p-2.5 rounded text-[8.5px] text-gray-500 font-bold leading-normal">
                    <span className="text-primary font-extrabold uppercase tracking-wide block mb-0.5">Amount in Words:</span>
                    {numberToWords(total)}
                  </div>
                </div>
              </div>

              {/* UPI PAYMENTS & GST INFO BOX */}
              <div className="border border-secondary/15 rounded-lg p-3 bg-cream/70 flex items-center gap-4 my-6">
                {/* SVG mock QR Code */}
                <svg className="w-12 h-12 text-primary shrink-0" viewBox="0 0 100 100">
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
                <div className="text-[9px] space-y-0.5 font-bold text-gray-500">
                  <p className="text-primary font-extrabold text-[10px] tracking-wider uppercase">Scan to Pay</p>
                  <p><span className="text-secondary">UPI ID:</span> dkstarresorts@upi</p>
                  <p><span className="text-secondary">GSTIN:</span> 33AAXFDK1234H1Z5</p>
                </div>
              </div>

              {/* CONTACT FOOTER */}
              <div className="border-t border-secondary/15 pt-4 mt-6">
                <div className="grid grid-cols-3 gap-6 text-[8px] font-bold text-gray-500">
                  <div className="flex items-start gap-1.5">
                    <Users size={12} className="text-secondary shrink-0" />
                    <div>
                      <p className="text-primary uppercase tracking-wide font-extrabold mb-0.5">Guest Contact</p>
                      <p>{showCheckoutInvoice.guestName}</p>
                      <p className="font-mono text-gray-400">{showCheckoutInvoice.guestPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Phone size={12} className="text-secondary shrink-0" />
                    <div>
                      <p className="text-primary uppercase tracking-wide font-extrabold mb-0.5">Resort Desk</p>
                      <p className="font-mono">+91 94894 55977</p>
                      <p className="lowercase font-mono text-gray-400">dkresort01@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Home size={12} className="text-secondary shrink-0" />
                    <div>
                      <p className="text-primary uppercase tracking-wide font-extrabold mb-0.5">www.dkstarresorts.com</p>
                      <p className="leading-relaxed">No 202/2, PONNIYAMMAN Kovil Street, KOLLAIMEDU VP MAHAL Backside, Vanjur, Vellore - 632006, Tamil Nadu, India.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* print-hide CTA buttons */}
              <div className="mt-8 flex gap-4 print-hide">
                <button 
                  onClick={() => window.print()}
                  className="w-1/2 btn-outline py-2.5 text-xs flex justify-center items-center gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-50 font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Printer size={13} /> Print Invoice
                </button>
                <button 
                  onClick={() => setShowCheckoutInvoice(null)}
                  className="w-1/2 btn-primary py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Dismiss & Clean Unit
                </button>
              </div>
            </motion.div>
          </div>
        );
      })()}
    </div>
  );
};

export default Reception;
