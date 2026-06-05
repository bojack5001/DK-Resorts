import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ResortProvider } from './context/ResortContext';

// Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import FunctionHall from './pages/FunctionHall';
import Booking from './pages/Booking';
import Pool from './pages/Pool';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Reception from './pages/Reception';
import MyBookings from './pages/MyBookings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ResortProvider>
        <Router>
          <AppContent />
        </Router>
      </ResortProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const location = useLocation();
  // Hide Navbar/Footer for staff dashboards
  const isStaffPortal = location.pathname.startsWith('/admin') || location.pathname.startsWith('/reception');

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {!isStaffPortal && <Navbar />}
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/function-hall" element={<FunctionHall />} />
          <Route path="/pool" element={<Pool />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reception" element={<Reception />} />
        </Routes>
      </main>
      {!isStaffPortal && <Footer />}
    </div>
  );
}

export default App;
