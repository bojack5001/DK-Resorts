import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  LogOut,
  Search,
  Bell,
  MoreVertical,
  Check,
  X,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Lock,
  Plus,
  Coins,
  ShieldCheck,
  Clock,
  Sparkles,
  Image
} from 'lucide-react';
import { useResort } from '../../context/ResortContext';

const Admin = () => {
  const { 
    rooms, 
    halls, 
    bookings, 
    roomStates, 
    updateBookingStatus, 
    updateRoomDetails, 
    updateHallDetails,
    calculateAmount,
    gallery,
    addGalleryPhoto,
    removeGalleryPhoto
  } = useResort();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Authorised admin accounts
  const ADMIN_ACCOUNTS = [
    { username: 'deena@admin', password: 'deena@123', displayName: 'Deena', initials: 'DA' },
    { username: 'jagan@admin', password: 'deena@123', displayName: 'Jagan', initials: 'JA' },
  ];

  // Active tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal / Editing states
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  // Form states for booking editing
  const [editGuestName, setEditGuestName] = useState('');
  const [editGuestEmail, setEditGuestEmail] = useState('');
  const [editGuestPhone, setEditGuestPhone] = useState('');
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [editGuestsCount, setEditGuestsCount] = useState(1);

  // Form states for room editing
  const [editRoomName, setEditRoomName] = useState('');
  const [editRoomPrice, setEditRoomPrice] = useState(0);
  const [editRoomCapacity, setEditRoomCapacity] = useState(2);
  const [editRoomDescription, setEditRoomDescription] = useState('');

  // Form states for gallery photo
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Handle credentials verification
  const handleLogin = (e) => {
    e.preventDefault();
    const match = ADMIN_ACCOUNTS.find(
      acc => acc.username === username.trim() && acc.password === password
    );
    if (match) {
      setIsAuthenticated(true);
      setLoggedInUser(match);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
    setUsername('');
    setPassword('');
  };

  // Stats calculation
  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;

  const occupiedCount = Object.values(roomStates).filter(r => r.status === 'occupied').length;
  const totalItemsCount = rooms.length + halls.length;

  const stats = [
    { name: 'Total Bookings', value: bookings.length.toString(), icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Occupied Status', value: `${occupiedCount}/${totalItemsCount}`, icon: BedDouble, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: Coins, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Pending Approvals', value: pendingBookingsCount.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  // Excel reporting function
  const handleExport = () => {
    try {
      const headers = [['Booking ID', 'Guest Name', 'Email', 'Phone', 'Item Booked', 'Category', 'Check-In', 'Check-Out', 'Status', 'Revenue']];
      const dataRows = bookings.map(b => [
        b.id,
        b.guestName,
        b.guestEmail,
        b.guestPhone,
        b.itemName,
        b.itemType,
        b.checkIn,
        b.checkOut,
        b.status,
        b.amount
      ]);
      
      const combinedData = [...headers, ...dataRows];
      const worksheet = XLSX.utils.aoa_to_sheet(combinedData);
      
      const wscols = [
        { wch: 12 }, // Booking ID
        { wch: 20 }, // Guest Name
        { wch: 25 }, // Email
        { wch: 16 }, // Phone
        { wch: 25 }, // Item Name
        { wch: 12 }, // Category
        { wch: 15 }, // Check-in
        { wch: 15 }, // Check-out
        { wch: 15 }, // Status
        { wch: 15 }  // Amount
      ];
      worksheet['!cols'] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Resort Bookings Report");
      
      const fileName = `DK_Resorts_Revenue_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("Failed to export Excel report.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Checked-in': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Checked-out': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Edit Booking Trigger
  const startEditBooking = (booking) => {
    setEditingBooking(booking);
    setEditGuestName(booking.guestName);
    setEditGuestEmail(booking.guestEmail);
    setEditGuestPhone(booking.guestPhone);
    setEditCheckIn(booking.checkIn);
    setEditCheckOut(booking.checkOut);
    setEditGuestsCount(booking.guests);
  };

  const saveBookingEdit = (e) => {
    e.preventDefault();
    if (!editingBooking) return;

    // Recalculate billing rate
    const days = Math.ceil((new Date(editCheckOut) - new Date(editCheckIn)) / (1000 * 3600 * 24)) || 1;
    let baseRate = 5000;
    if (editingBooking.itemType === 'room') {
      const room = rooms.find(r => r.id === editingBooking.itemId);
      if (room) baseRate = room.price;
    } else {
      const hall = halls.find(h => h.id === editingBooking.itemId);
      if (hall) baseRate = hall.price;
    }
    const newAmount = baseRate * days * 1.18; // Includes GST simulation

    // Update in bookings array in local storage
    const stored = JSON.parse(localStorage.getItem('dk_bookings')) || [];
    const updated = stored.map(b => {
      if (b.id === editingBooking.id) {
        return {
          ...b,
          guestName: editGuestName,
          guestEmail: editGuestEmail,
          guestPhone: editGuestPhone,
          checkIn: editCheckIn,
          checkOut: editCheckOut,
          guests: Number(editGuestsCount),
          amount: Math.round(newAmount)
        };
      }
      return b;
    });

    localStorage.setItem('dk_bookings', JSON.stringify(updated));
    window.location.reload(); // Quick refresh to reload context state
  };

  const deleteBookingRecord = (id) => {
    if (window.confirm(`Are you sure you want to permanently delete Booking ${id}?`)) {
      const stored = JSON.parse(localStorage.getItem('dk_bookings')) || [];
      const filtered = stored.filter(b => b.id !== id);
      localStorage.setItem('dk_bookings', JSON.stringify(filtered));
      window.location.reload();
    }
  };

  // Edit Room / Hall Trigger
  const startEditRoom = (item, type) => {
    setEditingRoom({ ...item, type });
    setEditRoomName(item.name);
    setEditRoomPrice(item.price);
    setEditRoomCapacity(item.capacity);
    setEditRoomDescription(item.description);
  };

  const saveRoomEdit = (e) => {
    e.preventDefault();
    if (!editingRoom) return;

    if (editingRoom.type === 'room') {
      updateRoomDetails(editingRoom.id, {
        name: editRoomName,
        price: Number(editRoomPrice),
        capacity: Number(editRoomCapacity),
        description: editRoomDescription
      });
    } else {
      updateHallDetails(editingRoom.id, {
        name: editRoomName,
        price: Number(editRoomPrice),
        capacity: Number(editRoomCapacity),
        description: editRoomDescription
      });
    }

    setEditingRoom(null);
  };

  // Filtered booking data
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Login Card
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative blur rings */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/15 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full filter blur-[80px]" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-2xl text-white z-10"
        >
          <div className="text-center mb-8">
            <img src="/logo-v2.png" alt="DK Logo" className="h-16 mx-auto brightness-0 invert" />
            <h2 className="text-2xl font-heading font-bold mt-4 tracking-wider">Superuser Portal</h2>
            <p className="text-xs uppercase tracking-widest text-secondary font-bold mt-1">Management Access Gate</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-500/20 border-l-4 border-red-500 text-red-200 text-xs rounded">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-300">Username</label>
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. deena@admin"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded text-sm focus:border-secondary outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-300">Password</label>
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
              <ShieldCheck size={16} /> Authenticate Gate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white hidden lg:flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <img src="/logo-v2.png" alt="Logo" className="h-14 w-auto brightness-0 invert" />
          <p className="text-[9px] uppercase tracking-widest text-secondary font-bold mt-2">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors text-sm uppercase tracking-wider font-semibold ${activeTab === 'dashboard' ? 'bg-secondary text-primary' : 'hover:bg-white/5 text-gray-300'}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors text-sm uppercase tracking-wider font-semibold ${activeTab === 'bookings' ? 'bg-secondary text-primary' : 'hover:bg-white/5 text-gray-300'}`}
          >
            <CalendarCheck size={18} /> Bookings ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('rooms')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors text-sm uppercase tracking-wider font-semibold ${activeTab === 'rooms' ? 'bg-secondary text-primary' : 'hover:bg-white/5 text-gray-300'}`}
          >
            <BedDouble size={18} /> Rooms & Halls
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors text-sm uppercase tracking-wider font-semibold ${activeTab === 'gallery' ? 'bg-secondary text-primary' : 'hover:bg-white/5 text-gray-300'}`}
          >
            <Image size={18} /> Gallery Manager
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-red-500/10 text-red-400 transition-colors text-sm font-semibold uppercase tracking-wider"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <span className="lg:hidden font-heading font-bold text-primary text-xl">DK STAFF</span>
            <span className="hidden lg:block text-xs text-gray-400 font-bold uppercase tracking-widest">Resort Core System v1.4.2</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-bold text-primary">{loggedInUser?.displayName}</p>
              <p className="text-[10px] text-secondary uppercase font-bold tracking-widest">{loggedInUser?.username}</p>
            </div>
            <div className="w-10 h-10 bg-secondary text-primary font-bold rounded-full flex items-center justify-center text-sm">
              {loggedInUser?.initials}
            </div>
          </div>
        </header>

        {/* Dynamic Body Panel */}
        <main className="p-6 md:p-8 overflow-y-auto flex-1">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-primary">Management Center</h1>
                  <p className="text-gray-500 text-sm">Real-time resort performance stats, booking volumes, and details.</p>
                </div>
                <button 
                  onClick={handleExport}
                  className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2 group shadow-lg shadow-primary/10"
                >
                  <FileSpreadsheet size={16} className="group-hover:scale-110 transition-transform" />
                  Export Ledger
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div 
                    key={stat.name}
                    className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`${stat.bg} ${stat.color} p-4 rounded-lg`}>
                      <stat.icon size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.name}</p>
                      <p className="text-xl font-bold text-primary mt-0.5">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphic Chart + Room overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Custom SVG graph area */}
                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <h3 className="font-heading font-bold text-primary text-lg">Estimated Revenue Curve</h3>
                    <span className="text-[10px] bg-secondary/15 text-secondary px-2 py-0.5 rounded font-bold uppercase tracking-wider">Monthly Projection (2026)</span>
                  </div>
                  {/* Beautiful SVG graph */}
                  <div className="h-64 w-full pt-4">
                    <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                      
                      {/* Spline Area */}
                      <path 
                        d="M 0 170 Q 100 120 200 140 T 400 60 L 500 80 L 500 200 L 0 200 Z" 
                        fill="url(#colorRevenue)" 
                      />
                      {/* Spline Stroke */}
                      <path 
                        d="M 0 170 Q 100 120 200 140 T 400 60 L 500 80" 
                        fill="none" 
                        stroke="#C5A059" 
                        strokeWidth="3" 
                      />
                      
                      {/* Graph dots */}
                      <circle cx="100" cy="145" r="4" fill="#4A3728" stroke="#C5A059" strokeWidth="2" />
                      <circle cx="200" cy="140" r="4" fill="#4A3728" stroke="#C5A059" strokeWidth="2" />
                      <circle cx="300" cy="90" r="4" fill="#4A3728" stroke="#C5A059" strokeWidth="2" />
                      <circle cx="400" cy="60" r="4" fill="#4A3728" stroke="#C5A059" strokeWidth="2" />
                    </svg>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                      <span>Jan/Feb</span>
                      <span>Mar/Apr</span>
                      <span>May/Jun</span>
                      <span>Jul/Aug</span>
                      <span>Sep/Oct</span>
                      <span>Nov/Dec</span>
                    </div>
                  </div>
                </div>

                {/* Quick breakdown card */}
                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm space-y-4">
                  <h3 className="font-heading font-bold text-primary text-lg">Occupancy Ratio</h3>
                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                        <span>Rooms Occupied</span>
                        <span>{Object.values(roomStates).slice(0, 10).filter(r => r.status === 'occupied').length} / 10</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2">
                        <div 
                          className="bg-primary h-2" 
                          style={{ width: `${(Object.values(roomStates).slice(0, 10).filter(r => r.status === 'occupied').length / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                        <span>Halls Occupied</span>
                        <span>{Object.values(roomStates).slice(10, 12).filter(r => r.status === 'occupied').length} / 2</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2">
                        <div 
                          className="bg-secondary h-2" 
                          style={{ width: `${(Object.values(roomStates).slice(10, 12).filter(r => r.status === 'occupied').length / 2) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-cream p-4 rounded text-xs text-gray-600 leading-relaxed border border-secondary/15">
                      <strong>Occupancy alert:</strong> Reception has checked in guests into {occupiedCount} locations. Rooms needing housekeeping will appear in red on their grid.
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings shortcut */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-heading font-bold text-primary text-lg">Upcoming Log</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-secondary text-xs font-bold uppercase tracking-widest hover:underline">Manage All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[9px] uppercase tracking-wider font-bold text-gray-500">
                      <tr>
                        <th className="px-6 py-4">Booking ID</th>
                        <th className="px-6 py-4">Guest</th>
                        <th className="px-6 py-4">Accommodation</th>
                        <th className="px-6 py-4">Dates</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Billing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {bookings.slice(0, 3).map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-primary">{booking.id}</td>
                          <td className="px-6 py-4 text-gray-600 font-medium">{booking.guestName}</td>
                          <td className="px-6 py-4 text-gray-600">{booking.itemName}</td>
                          <td className="px-6 py-4 text-gray-600 text-xs">{booking.checkIn} to {booking.checkOut}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-primary">₹{booking.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-primary">Bookings Ledger</h1>
                  <p className="text-gray-500 text-sm">Approve pending applications, modify reservations, or search guests logs.</p>
                </div>
              </div>

              {/* Filters & search */}
              <div className="bg-white p-4 border border-gray-100 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by ID, name, or room..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-secondary/15 focus:border-secondary outline-none text-xs text-primary font-medium"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                  {['All', 'Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 border text-xs font-bold uppercase tracking-wider rounded whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[9px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Guest Info</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Stay Dates</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Revenue</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                            No reservations match the specified search or filter.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-primary">{b.id}</td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-primary">{b.guestName}</p>
                              <p className="text-[10px] text-gray-400">{b.guestEmail} | {b.guestPhone}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-700">{b.itemName}</p>
                              <span className="text-[9px] bg-secondary/10 border border-secondary/15 text-secondary px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                {b.itemType}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-600">
                              <p className="font-bold text-primary">{b.checkIn}</p>
                              <p className="text-gray-400">to {b.checkOut}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-0.5 border text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusColor(b.status)}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-primary">₹{b.amount.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex gap-1.5 justify-end">
                                {b.status === 'Pending' && (
                                  <>
                                    <button 
                                      onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                                      title="Approve Booking"
                                      className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 border border-green-100 rounded transition-colors"
                                    >
                                      <Check size={14} />
                                    </button>
                                    <button 
                                      onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                                      title="Reject Booking"
                                      className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded transition-colors"
                                    >
                                      <X size={14} />
                                    </button>
                                  </>
                                )}
                                {b.status !== 'Cancelled' && b.status !== 'Checked-out' && (
                                  <button 
                                    onClick={() => startEditBooking(b)}
                                    title="Edit Reservation"
                                    className="p-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                )}
                                <button 
                                  onClick={() => deleteBookingRecord(b.id)}
                                  title="Delete Record"
                                  className="p-1.5 bg-red-50/50 text-red-500 hover:bg-red-100 border border-red-200 rounded transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ROOMS & HALLS MANAGER */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-primary">Accommodation Inventory</h1>
                <p className="text-gray-500 text-sm">Review, rename, adjust rates, and edit details of resort rooms and halls dynamically.</p>
              </div>

              {/* Grid of rooms & halls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map(room => (
                  <div key={room.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="h-44 relative">
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-primary text-white font-bold px-3 py-1 rounded text-xs">
                          ₹{room.price.toLocaleString('en-IN')}/Night
                        </div>
                      </div>
                      <div className="p-6 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-heading font-bold text-primary text-xl">{room.name}</h3>
                          <span className="text-[9px] bg-secondary/15 text-secondary border border-secondary/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Room {room.id}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{room.description}</p>
                      </div>
                    </div>
                    <div className="p-6 pt-0 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Cap: {room.capacity} guests</span>
                      <button 
                        onClick={() => startEditRoom(room, 'room')}
                        className="text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Edit2 size={13} /> Edit Config
                      </button>
                    </div>
                  </div>
                ))}

                {halls.map(hall => (
                  <div key={hall.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="h-44 relative">
                        <img src={hall.image} alt={hall.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-secondary text-primary font-bold px-3 py-1 rounded text-xs">
                          ₹{hall.price.toLocaleString('en-IN')}/Day
                        </div>
                      </div>
                      <div className="p-6 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-heading font-bold text-primary text-xl">{hall.name}</h3>
                          <span className="text-[9px] bg-primary/10 text-primary border border-primary/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Venue</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{hall.description}</p>
                      </div>
                    </div>
                    <div className="p-6 pt-0 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Cap: {hall.capacity} max</span>
                      <button 
                        onClick={() => startEditRoom(hall, 'hall')}
                        className="text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Edit2 size={13} /> Edit Config
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GALLERY MANAGER */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-primary">Visual Gallery Manager</h1>
                <p className="text-gray-500 text-sm">Add new memories or remove existing photos from the public gallery page.</p>
              </div>

              {/* Add Photo Form & Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm space-y-4 lg:col-span-1">
                  <h3 className="font-heading font-bold text-primary text-lg">Add New Photo</h3>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPhotoUrl.trim()) return;
                    addGalleryPhoto(newPhotoUrl.trim());
                    setNewPhotoUrl('');
                  }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Image URL</label>
                      <input 
                        type="url" 
                        required
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-secondary hover:bg-secondary/90 text-primary py-2.5 text-xs font-bold uppercase tracking-widest transition-colors rounded shadow-md flex items-center justify-center gap-1.5 font-semibold"
                    >
                      <Plus size={14} /> Add to Gallery
                    </button>
                  </form>

                  {newPhotoUrl.trim() && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Live Preview</p>
                      <div className="h-40 w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                        <img 
                          src={newPhotoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Existing Gallery Grid */}
                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm lg:col-span-2 space-y-4">
                  <h3 className="font-heading font-bold text-primary text-lg">Current Photos ({gallery.length})</h3>
                  
                  {gallery.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-sm">
                      No photos in the gallery. Use the panel on the left to add some!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {gallery.map((photo) => (
                        <div key={photo.id} className="group relative h-48 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                          <img src={photo.url} alt="Gallery item" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to remove this photo from the gallery?")) {
                                  removeGalleryPhoto(photo.id);
                                }
                              }}
                              className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
                              title="Delete Photo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: EDIT BOOKING */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-white shadow-2xl p-8 rounded-xl border border-gray-100"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-xl font-heading font-bold text-primary">Edit Booking: {editingBooking.id}</h3>
              <button onClick={() => setEditingBooking(null)} className="text-gray-400 hover:text-primary">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveBookingEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Guest Name</label>
                <input 
                  required
                  type="text" 
                  value={editGuestName}
                  onChange={(e) => setEditGuestName(e.target.value)}
                  className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Guest Email</label>
                  <input 
                    required
                    type="email" 
                    value={editGuestEmail}
                    onChange={(e) => setEditGuestEmail(e.target.value)}
                    className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Guest Phone</label>
                  <input 
                    required
                    type="text" 
                    value={editGuestPhone}
                    onChange={(e) => setEditGuestPhone(e.target.value)}
                    className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Check-in Date</label>
                  <input 
                    required
                    type="date" 
                    value={editCheckIn}
                    onChange={(e) => setEditCheckIn(e.target.value)}
                    className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Check-out Date</label>
                  <input 
                    required
                    type="date" 
                    value={editCheckOut}
                    onChange={(e) => setEditCheckOut(e.target.value)}
                    className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Guest Count</label>
                <input 
                  required
                  type="number" 
                  value={editGuestsCount}
                  onChange={(e) => setEditGuestsCount(e.target.value)}
                  className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setEditingBooking(null)} className="w-1/2 btn-outline py-2.5 text-xs">
                  Discard Changes
                </button>
                <button type="submit" className="w-1/2 btn-primary py-2.5 text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: EDIT ROOM/HALL CONFIG */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-white shadow-2xl p-8 rounded-xl border border-gray-100"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-xl font-heading font-bold text-primary">Modify Inventory: {editingRoom.name}</h3>
              <button onClick={() => setEditingRoom(null)} className="text-gray-400 hover:text-primary">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveRoomEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Configuration Name</label>
                <input 
                  required
                  type="text" 
                  value={editRoomName}
                  onChange={(e) => setEditRoomName(e.target.value)}
                  className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Price (₹ per day/night)</label>
                  <input 
                    required
                    type="number" 
                    value={editRoomPrice}
                    onChange={(e) => setEditRoomPrice(e.target.value)}
                    className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Capacity Limit</label>
                  <input 
                    required
                    type="number" 
                    value={editRoomCapacity}
                    onChange={(e) => setEditRoomCapacity(e.target.value)}
                    className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Short Description</label>
                <textarea 
                  required
                  value={editRoomDescription}
                  onChange={(e) => setEditRoomDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 focus:border-secondary px-3 py-2 text-sm outline-none font-medium"
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setEditingRoom(null)} className="w-1/2 btn-outline py-2.5 text-xs">
                  Cancel Edits
                </button>
                <button type="submit" className="w-1/2 btn-primary py-2.5 text-xs">
                  Update Configuration
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;
