import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getDBRooms,
  getDBHalls,
  getDBBookings,
  getDBRoomStates,
  getDBGallery,
  saveDBRooms,
  saveDBHalls,
  saveDBBookings,
  saveDBBooking,
  saveDBRoomStates,
  updateDBBookingStatus,
  updateDBRoom,
  updateDBHall,
  addDBGalleryPhoto,
  removeDBGalleryPhoto,
  saveDBGallery,
  getDBContactMessages,
} from '../lib/db';

const ResortContext = createContext();

export const ResortProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomStates, setRoomStates] = useState({});
  const [gallery, setGallery] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [r, h, b, rs, g, cm] = await Promise.all([
          getDBRooms(),
          getDBHalls(),
          getDBBookings(),
          getDBRoomStates(),
          getDBGallery(),
          getDBContactMessages(),
        ]);
        setRooms(r || []);
        setHalls(h || []);
        setBookings(b || []);
        setRoomStates(rs || {});
        setGallery(g || []);
        setContactMessages(cm || []);
      } catch (err) {
        console.error('[ResortContext] init error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
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

  const addBooking = async (newBookingData) => {
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
      status: newBookingData.status || 'Pending',
      created_at: new Date().toISOString(),
    };

    const updatedBookings = [booking, ...bookings];
    setBookings(updatedBookings);
    await saveDBBooking(booking);

    // If immediate check-in (walk-in)
    if (booking.status === 'Checked-in') {
      const updatedStates = {
        ...roomStates,
        [booking.itemId]: { status: 'occupied', bookingId: id },
      };
      setRoomStates(updatedStates);
      await saveDBRoomStates(updatedStates);
    }

    return booking;
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    setBookings(updated);
    await updateDBBookingStatus(bookingId, newStatus);

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    let updatedStates = { ...roomStates };
    if (newStatus === 'Checked-in') {
      updatedStates[booking.itemId] = { status: 'occupied', bookingId };
    } else if (newStatus === 'Checked-out') {
      updatedStates[booking.itemId] = { status: 'dirty' };
    } else if (newStatus === 'Cancelled') {
      if (roomStates[booking.itemId]?.bookingId === bookingId) {
        updatedStates[booking.itemId] = { status: 'available' };
      }
    }
    setRoomStates(updatedStates);
    await saveDBRoomStates(updatedStates);
  };

  const updateRoomPricing = async (roomId, newPrice) => {
    const updated = rooms.map(r =>
      r.id === Number(roomId) ? { ...r, price: Number(newPrice) } : r
    );
    setRooms(updated);
    await updateDBRoom(Number(roomId), { price: Number(newPrice) });
  };

  const updateRoomDetails = async (roomId, updatedFields) => {
    const updated = rooms.map(r =>
      r.id === Number(roomId) ? { ...r, ...updatedFields } : r
    );
    setRooms(updated);
    await updateDBRoom(Number(roomId), updatedFields);
  };

  const updateHallPricing = async (hallId, newPrice) => {
    const updated = halls.map(h =>
      h.id === hallId ? { ...h, price: Number(newPrice) } : h
    );
    setHalls(updated);
    await updateDBHall(hallId, { price: Number(newPrice) });
  };

  const updateHallDetails = async (hallId, updatedFields) => {
    const updated = halls.map(h =>
      h.id === hallId ? { ...h, ...updatedFields } : h
    );
    setHalls(updated);
    await updateDBHall(hallId, updatedFields);
  };

  const setRoomCleaningStatus = async (itemId, cleanStatus) => {
    const updated = {
      ...roomStates,
      [itemId]: {
        status: cleanStatus,
        bookingId: cleanStatus === 'occupied' ? roomStates[itemId]?.bookingId : undefined,
      },
    };
    setRoomStates(updated);
    await saveDBRoomStates(updated);
  };

  const addGalleryPhoto = async (url) => {
    const newPhoto = await addDBGalleryPhoto(url);
    setGallery(prev => [...prev, newPhoto]);
    return newPhoto;
  };

  const removeGalleryPhoto = async (id) => {
    setGallery(prev => prev.filter(item => item.id !== id));
    await removeDBGalleryPhoto(id);
  };

  return (
    <ResortContext.Provider value={{
      rooms,
      halls,
      bookings,
      roomStates,
      gallery,
      contactMessages,
      loading,
      addBooking,
      updateBookingStatus,
      updateRoomPricing,
      updateRoomDetails,
      updateHallPricing,
      updateHallDetails,
      setRoomCleaningStatus,
      calculateAmount,
      addGalleryPhoto,
      removeGalleryPhoto,
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
