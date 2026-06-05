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
    return b.guestName.toLowerCase().includes(q) || 
           b.id.toLowerCase().includes(q) || 
           b.guestEmail.toLowerCase().includes(q) ||
           b.guestPhone.includes(q);
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
      {showCheckoutInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white shadow-2xl p-8 rounded-xl border border-gray-100 relative print:p-0 print:border-none"
          >
            {/* Invoice Ticket Design */}
            <div className="text-center pb-6 border-b border-gray-100">
              <img src="/logo-v2.png" alt="Logo" className="h-10 mx-auto mb-2 text-primary" />
              <h3 className="text-xl font-heading font-bold text-primary">Stay Invoice Summary</h3>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-0.5">DK Star Resorts Front Desk</p>
            </div>

            <div className="py-6 space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase tracking-wider font-bold">Booking ID</span>
                <span className="text-primary font-bold">{showCheckoutInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase tracking-wider font-bold">Guest Name</span>
                <span className="text-primary font-bold">{showCheckoutInvoice.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase tracking-wider font-bold">Stay Period</span>
                <span className="text-primary">{showCheckoutInvoice.checkIn} to {showCheckoutInvoice.checkOut}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-400 uppercase tracking-wider font-bold">Booked Unit</span>
                <span className="text-primary font-bold">{showCheckoutInvoice.itemName}</span>
              </div>
              
              {/* Calculations */}
              <div className="space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Room Charge</span>
                  <span>₹{(showCheckoutInvoice.amount / 1.18).toFixed(0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>₹{(showCheckoutInvoice.amount - (showCheckoutInvoice.amount / 1.18)).toFixed(0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-3">
                  <span className="text-primary">Total Bill Settled</span>
                  <span className="text-secondary">₹{showCheckoutInvoice.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-[10px] text-center rounded">
              Payment Status: Succeeded via Credit/Debit Settlement
            </div>

            <div className="mt-8 flex gap-4 print:hidden">
              <button 
                onClick={() => window.print()}
                className="w-1/2 btn-outline py-2.5 text-xs flex justify-center items-center gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Printer size={13} /> Print Invoice
              </button>
              <button 
                onClick={() => setShowCheckoutInvoice(null)}
                className="w-1/2 btn-primary py-2.5 text-xs"
              >
                Dismiss & Clean Unit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reception;
