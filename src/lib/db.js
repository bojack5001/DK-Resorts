/**
 * db.js — DK Resorts data layer
 * Uses Supabase when connected, falls back to localStorage for offline dev.
 */
import { supabase } from './supabaseClient';

// ─── Seed data (used for localStorage fallback & initial DB seeding) ──────────

const INITIAL_ROOMS = [
  { id: 101, name: "Cozy Standard",         type: "Standard Room",  price: 4500,  capacity: 2, description: "A snug and functional room featuring a plush double bed, working desk, and modern amenities ideal for short stays.", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","TV"] },
  { id: 102, name: "Classic Double",        type: "Standard Room",  price: 6000,  capacity: 2, description: "Spacious classic design equipped with a queen bed, warm lighting, and a refreshing garden view from the window.", image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","Mini Fridge"] },
  { id: 103, name: "Forest View Deluxe",    type: "Deluxe Room",    price: 8500,  capacity: 2, description: "Experience the tranquility of nature in our forest view rooms, designed with earthy tones and premium amenities.", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","Private Balcony","Tea Maker"] },
  { id: 104, name: "Garden View Executive", type: "Executive Room", price: 10500, capacity: 2, description: "Elegantly styled executive room overlooking our manicured botanical gardens, offering a workstation and lounge chair.", image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","Smart TV","Safe Deposit"] },
  { id: 105, name: "Poolside Cabin",        type: "Cabin",          price: 12500, capacity: 2, description: "Charming cabin situated steps away from our infinity pool, featuring direct deck access and a private outdoor seating space.", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","Pool Access","Mini Bar"] },
  { id: 106, name: "Luxury Stag Suite",     type: "Premium Suite",  price: 15000, capacity: 2, description: "Our flagship suite offering panoramic views of the forest, featuring a private balcony and a mahogany soaking tub.", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","Soaking Tub","In-room Dining"] },
  { id: 107, name: "Canopy Treehouse",      type: "Chalet",         price: 18000, capacity: 2, description: "Elevated high amongst the trees, this luxury wood chalet offers absolute seclusion, glass walls, and stargazing skylights.", image: "https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","Skylight","Hammock"] },
  { id: 108, name: "Family Heritage Villa", type: "Family Villa",   price: 22000, capacity: 4, description: "Perfect for families, this spacious villa includes two bedrooms, a private living area, and direct garden access.", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","Kitchenette","Garden Area"] },
  { id: 109, name: "Vintage Royal Suite",   type: "Premium Suite",  price: 26000, capacity: 2, description: "Adorned with colonial-era antiques and royal drapes, this suite features a four-poster bed, private study, and butler service.", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","Butler Service","Espresso Machine"] },
  { id: 110, name: "Presidential Penthouse",type: "Penthouse",      price: 38000, capacity: 4, description: "The crown jewel of DK Resorts. Spanning the entire top floor, it hosts a private hot tub, wrap-around terrace, and dining hall.", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities: ["Wifi","AC","Hot Tub","Private Terrace","Sound System"] },
];

const INITIAL_HALLS = [
  { id: "open-hall", name: "Grand Lawn & Pavilion", type: "Open Function Hall", price: 75000, capacity: 1000, description: "An expansive lush green lawn bordered by scenic woods, featuring a central covered wooden pavilion, ideal for dream weddings and massive corporate events.", image: "/exquisite_venues_bg.jpg", amenities: ["Outdoor Seating","Catering Stall setup","Surround Sound","Bridal Suites","Valet Parking"] },
  { id: "mini-hall", name: "The Oak Room",          type: "Mini Function Hall",  price: 25000, capacity: 150,  description: "An elegant, air-conditioned indoor banquet hall panelled with oak wood, designed for birthdays, small gatherings, conferences, and intimate celebrations.", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", amenities: ["Central AC","Projector & Screen","Banquet Chairs","Stage Setup","Attached Dining Hall"] },
];

const INITIAL_ROOM_STATES = {
  101: { status: "available" },
  102: { status: "available" },
  103: { status: "occupied", bookingId: "BK-1002" },
  104: { status: "available" },
  105: { status: "dirty" },
  106: { status: "available" },
  107: { status: "available" },
  108: { status: "dirty" },
  109: { status: "available" },
  110: { status: "available" },
  "open-hall": { status: "available" },
  "mini-hall":  { status: "available" },
};

const INITIAL_GALLERY = [
  { id: 1, url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
  { id: 2, url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80" },
  { id: 3, url: "/exquisite_venues_bg.jpg" },
  { id: 4, url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80" },
  { id: 5, url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80" },
  { id: 6, url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ls = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const lsSave = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ─── ROOMS ────────────────────────────────────────────────────────────────────

export const getDBRooms = async () => {
  if (supabase) {
    const { data, error } = await supabase.from('rooms').select('*').order('id');
    if (!error && data?.length) return data;
  }
  // localStorage fallback
  const cached = ls('dk_rooms');
  if (cached) return cached;
  lsSave('dk_rooms', INITIAL_ROOMS);
  return INITIAL_ROOMS;
};

export const saveDBRooms = async (rooms) => {
  lsSave('dk_rooms', rooms);
  if (!supabase) return;
  for (const room of rooms) {
    await supabase.from('rooms').upsert({
      id:          room.id,
      name:        room.name,
      type:        room.type,
      price:       room.price,
      capacity:    room.capacity,
      description: room.description,
      image:       room.image,
      amenities:   room.amenities,
    }, { onConflict: 'id' });
  }
};

export const updateDBRoom = async (roomId, fields) => {
  if (supabase) {
    const { error } = await supabase.from('rooms').update(fields).eq('id', roomId);
    if (error) console.error('[Supabase] updateDBRoom:', error.message);
  }
  const cached = ls('dk_rooms') || INITIAL_ROOMS;
  lsSave('dk_rooms', cached.map(r => r.id === Number(roomId) ? { ...r, ...fields } : r));
};

// ─── HALLS ────────────────────────────────────────────────────────────────────

export const getDBHalls = async () => {
  if (supabase) {
    const { data, error } = await supabase.from('halls').select('*');
    if (!error && data?.length) return data;
  }
  const cached = ls('dk_halls');
  if (cached) return cached;
  lsSave('dk_halls', INITIAL_HALLS);
  return INITIAL_HALLS;
};

export const saveDBHalls = async (halls) => {
  lsSave('dk_halls', halls);
  if (!supabase) return;
  for (const hall of halls) {
    await supabase.from('halls').upsert({
      id:          hall.id,
      name:        hall.name,
      type:        hall.type,
      price:       hall.price,
      capacity:    hall.capacity,
      description: hall.description,
      image:       hall.image,
      amenities:   hall.amenities,
    }, { onConflict: 'id' });
  }
};

export const updateDBHall = async (hallId, fields) => {
  if (supabase) {
    const { error } = await supabase.from('halls').update(fields).eq('id', hallId);
    if (error) console.error('[Supabase] updateDBHall:', error.message);
  }
  const cached = ls('dk_halls') || INITIAL_HALLS;
  lsSave('dk_halls', cached.map(h => h.id === hallId ? { ...h, ...fields } : h));
};

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

// ─── Normalize Supabase snake_case → camelCase for booking rows ───────────────
const normalizeBooking = (row) => ({
  id:          row.id,
  itemId:      isNaN(row.item_id) ? row.item_id : Number(row.item_id),
  itemName:    row.item_name,
  itemType:    row.item_type,
  guestName:   row.guest_name,
  guestEmail:  row.guest_email  || '',
  guestPhone:  row.guest_phone  || '',
  checkIn:     row.check_in,
  checkOut:    row.check_out,
  guests:      row.guests,
  status:      row.status,
  amount:      row.amount,
  created_at:  row.created_at,
});

export const getDBBookings = async () => {
  if (supabase) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data?.length) return data.map(normalizeBooking);
  }
  const cached = ls('dk_bookings');
  if (cached) return cached;
  lsSave('dk_bookings', []);
  return [];
};

export const saveDBBooking = async (booking) => {
  if (supabase) {
    const { error } = await supabase.from('bookings').upsert({
      id:           booking.id,
      item_id:      String(booking.itemId),
      item_name:    booking.itemName,
      item_type:    booking.itemType,
      guest_name:   booking.guestName,
      guest_email:  booking.guestEmail,
      guest_phone:  booking.guestPhone,
      check_in:     booking.checkIn,
      check_out:    booking.checkOut,
      guests:       booking.guests,
      status:       booking.status,
      amount:       booking.amount,
      created_at:   booking.created_at,
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase] saveDBBooking:', error.message);
  }
  const cached = ls('dk_bookings') || [];
  const idx = cached.findIndex(b => b.id === booking.id);
  if (idx >= 0) cached[idx] = booking; else cached.unshift(booking);
  lsSave('dk_bookings', cached);
};

export const saveDBBookings = async (bookings) => {
  lsSave('dk_bookings', bookings);
  if (!supabase) return;
  for (const booking of bookings) {
    await saveDBBooking(booking);
  }
};

export const updateDBBookingStatus = async (bookingId, newStatus) => {
  if (supabase) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);
    if (error) console.error('[Supabase] updateDBBookingStatus:', error.message);
  }
  const cached = ls('dk_bookings') || [];
  lsSave('dk_bookings', cached.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
};

// ─── ROOM STATES ──────────────────────────────────────────────────────────────

export const getDBRoomStates = async () => {
  if (supabase) {
    const { data, error } = await supabase.from('room_states').select('*');
    if (!error && data?.length) {
      // Convert array rows → { [roomId]: { status, bookingId } }
      return data.reduce((acc, row) => {
        const key = isNaN(row.room_id) ? row.room_id : Number(row.room_id);
        acc[key] = { status: row.status, bookingId: row.booking_id || undefined };
        return acc;
      }, {});
    }
  }
  const cached = ls('dk_room_states');
  if (cached) return cached;
  lsSave('dk_room_states', INITIAL_ROOM_STATES);
  return INITIAL_ROOM_STATES;
};

export const saveDBRoomStates = async (roomStates) => {
  lsSave('dk_room_states', roomStates);
  if (!supabase) return;
  const rows = Object.entries(roomStates).map(([roomId, state]) => ({
    room_id:    String(roomId),
    status:     state.status,
    booking_id: state.bookingId || null,
  }));
  const { error } = await supabase.from('room_states').upsert(rows, { onConflict: 'room_id' });
  if (error) console.error('[Supabase] saveDBRoomStates:', error.message);
};

// ─── GALLERY ──────────────────────────────────────────────────────────────────

export const getDBGallery = async () => {
  if (supabase) {
    const { data, error } = await supabase.from('gallery').select('*').order('id');
    if (!error && data?.length) return data;
  }
  const cached = ls('dk_gallery');
  if (cached) return cached;
  lsSave('dk_gallery', INITIAL_GALLERY);
  return INITIAL_GALLERY;
};

export const addDBGalleryPhoto = async (url) => {
  const newPhoto = { id: Date.now(), url };
  if (supabase) {
    const { data, error } = await supabase.from('gallery').insert({ url }).select().single();
    if (!error && data) {
      newPhoto.id = data.id;
    } else {
      console.error('[Supabase] addDBGalleryPhoto:', error?.message);
    }
  }
  const cached = ls('dk_gallery') || [];
  lsSave('dk_gallery', [...cached, newPhoto]);
  return newPhoto;
};

export const removeDBGalleryPhoto = async (id) => {
  if (supabase) {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) console.error('[Supabase] removeDBGalleryPhoto:', error.message);
  }
  const cached = ls('dk_gallery') || [];
  lsSave('dk_gallery', cached.filter(item => item.id !== id));
};

export const saveDBGallery = async (gallery) => {
  lsSave('dk_gallery', gallery);
};

// ─── Legacy sync wrappers (kept for backward compat) ─────────────────────────
export const initializeDB = () => {};

// ─── CONTACT MESSAGES ──────────────────────────────────────────────────────────

export const getDBContactMessages = async () => {
  if (supabase) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data?.length) return data;
  }
  return ls('dk_contact_messages') || [];
};

export const saveDBContactMessage = async (msgData) => {
  const newMsg = {
    ...msgData,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from('contact_messages').insert(newMsg);
    if (error) {
      console.warn('[Supabase] contact_messages insert failed, falling back to localStorage:', error.message);
    }
  }

  // Fallback to localStorage
  const cached = ls('dk_contact_messages') || [];
  newMsg.id = Date.now(); // local ID
  cached.unshift(newMsg);
  lsSave('dk_contact_messages', cached);
  
  return newMsg;
};
