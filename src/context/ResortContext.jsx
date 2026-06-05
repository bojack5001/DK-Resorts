import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getDBRooms, 
  getDBHalls, 
  getDBBookings, 
  getDBRoomStates,
  saveDBRooms,
  saveDBHalls,
  saveDBBookings,
  saveDBRoomStates
} from '../lib/db';

const ResortContext = createContext();

export const ResortProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomStates, setRoomStates] = useState({});

  useEffect(() => {
    setRooms(getDBRooms());
    setHalls(getDBHalls());
    setBookings(getDBBookings());
    setRoomStates(getDBRoomStates());
  }, []);

  const calculateAmount = (itemId, itemType, checkInStr, checkOutStr) => {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);
    let diffDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays) || diffDays <= 0) diffDays = 1;

    if (itemType === 'room') {
      const room = rooms.find(r => r.id === Number(itemId));
      return (room ? room.price : 5000) * diffDays;
    } else {
      const hall = halls.find(h => h.id === itemId);
      return (hall ? hall.price : 25000) * diffDays;
    }
  };

  const addBooking = (newBookingData) => {
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const amount = calculateAmount(
      newBookingData.itemId,
      newBookingData.itemType,
      newBookingData.checkIn,
      newBookingData.checkOut
    );

    const booking = {
      id,
      ...newBookingData,
      itemId: newBookingData.itemType === 'room' ? Number(newBookingData.itemId) : newBookingData.itemId,
      amount,
      status: newBookingData.status || "Pending",
      created_at: new Date().toISOString()
    };

    const updatedBookings = [booking, ...bookings];
    setBookings(updatedBookings);
    saveDBBookings(updatedBookings);

    // If immediate check-in (e.g. walk-in)
    if (booking.status === 'Checked-in') {
      const updatedStates = {
        ...roomStates,
        [booking.itemId]: { status: 'occupied', bookingId: id }
      };
      setRoomStates(updatedStates);
      saveDBRoomStates(updatedStates);
    }

    return booking;
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBookings(updated);
    saveDBBookings(updated);

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Side-effects on room states based on check-in/out
    let updatedStates = { ...roomStates };
    if (newStatus === 'Checked-in') {
      updatedStates[booking.itemId] = { status: 'occupied', bookingId };
    } else if (newStatus === 'Checked-out') {
      updatedStates[booking.itemId] = { status: 'dirty' };
    } else if (newStatus === 'Cancelled') {
      // If cancelling an active check-in
      if (roomStates[booking.itemId]?.bookingId === bookingId) {
        updatedStates[booking.itemId] = { status: 'available' };
      }
    }
    setRoomStates(updatedStates);
    saveDBRoomStates(updatedStates);
  };

  const updateRoomPricing = (roomId, newPrice) => {
    const updated = rooms.map(r => {
      if (r.id === Number(roomId)) {
        return { ...r, price: Number(newPrice) };
      }
      return r;
    });
    setRooms(updated);
    saveDBRooms(updated);
  };

  const updateRoomDetails = (roomId, updatedFields) => {
    const updated = rooms.map(r => {
      if (r.id === Number(roomId)) {
        return { ...r, ...updatedFields };
      }
      return r;
    });
    setRooms(updated);
    saveDBRooms(updated);
  };

  const updateHallPricing = (hallId, newPrice) => {
    const updated = halls.map(h => {
      if (h.id === hallId) {
        return { ...h, price: Number(newPrice) };
      }
      return h;
    });
    setHalls(updated);
    saveDBHalls(updated);
  };

  const updateHallDetails = (hallId, updatedFields) => {
    const updated = halls.map(h => {
      if (h.id === hallId) {
        return { ...h, ...updatedFields };
      }
      return h;
    });
    setHalls(updated);
    saveDBHalls(updated);
  };

  const setRoomCleaningStatus = (itemId, cleanStatus) => {
    const updated = {
      ...roomStates,
      [itemId]: { 
        status: cleanStatus, 
        bookingId: cleanStatus === 'occupied' ? roomStates[itemId]?.bookingId : undefined 
      }
    };
    setRoomStates(updated);
    saveDBRoomStates(updated);
  };

  return (
    <ResortContext.Provider value={{
      rooms,
      halls,
      bookings,
      roomStates,
      addBooking,
      updateBookingStatus,
      updateRoomPricing,
      updateRoomDetails,
      updateHallPricing,
      updateHallDetails,
      setRoomCleaningStatus,
      calculateAmount
    }}>
      {children}
    </ResortContext.Provider>
  );
};

export const useResort = () => {
  const context = useContext(ResortContext);
  if (!context) {
    throw new Error('useResort must be used within a ResortProvider');
  }
  return context;
};
