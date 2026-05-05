import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  Settings, 
  LogOut,
  Search,
  Bell,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { name: 'Total Bookings', value: '124', icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Available Rooms', value: '8/15', icon: BedDouble, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Total Guests', value: '342', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Pending Enquiries', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const recentBookings = [
    { id: '#BK-1024', guest: 'Rahul Sharma', room: 'Luxury Stag Suite', date: 'Oct 24-27', status: 'Confirmed', amount: '₹36,000' },
    { id: '#BK-1025', guest: 'Priya Patel', room: 'Forest View Deluxe', date: 'Oct 25-26', status: 'Pending', amount: '₹8,500' },
    { id: '#BK-1026', guest: 'Amit Verma', room: 'Family Heritage Villa', date: 'Oct 28-30', status: 'Completed', amount: '₹36,000' },
    { id: '#BK-1027', guest: 'Sneha Reddy', room: 'Luxury Stag Suite', date: 'Nov 02-05', status: 'Cancelled', amount: '₹0' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white hidden lg:flex flex-col">
        <div className="p-8 border-b border-white/10">
          <img src="/logo-v2.png" alt="Logo" className="h-16 w-auto brightness-0 invert" />
          <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-2">Admin Control</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-secondary text-primary font-bold' : 'hover:bg-white/5'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'bookings' ? 'bg-secondary text-primary font-bold' : 'hover:bg-white/5'}`}
          >
            <CalendarCheck size={20} /> Bookings
          </button>
          <button 
            onClick={() => setActiveTab('rooms')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'rooms' ? 'bg-secondary text-primary font-bold' : 'hover:bg-white/5'}`}
          >
            <BedDouble size={20} /> Rooms
          </button>
          <button 
            onClick={() => setActiveTab('guests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'guests' ? 'bg-secondary text-primary font-bold' : 'hover:bg-white/5'}`}
          >
            <Users size={20} /> Guests
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search bookings, guests..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-secondary/20 outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-primary">Admin User</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-primary">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 overflow-y-auto">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-heading font-bold text-primary">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm">Welcome back, here's what's happening today.</p>
            </div>
            <button className="btn-primary text-xs px-6 py-2">
              Export Report
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className={`${stat.bg} ${stat.color} p-4 rounded-lg`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.name}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-heading font-bold text-primary">Recent Bookings</h3>
              <button className="text-secondary text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.1em] font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room Type</th>
                    <th className="px-6 py-4">Check-in/out</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary">{booking.id}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.guest}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.room}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">{booking.amount}</td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
