/**
 * db.js — DK Star Resorts data layer
 * Solar System theme — 9 rooms (Mercury–Pluto) + Sun Hall + Moon Hall
 * Supports weekday / weekend dual pricing.
 * Uses Supabase when connected, falls back to localStorage for offline dev.
 */
import { supabase } from './supabaseClient';

// ─── Seed data (used for localStorage fallback & initial DB seeding) ──────────

const INITIAL_ROOMS = [
  {
    id: 1, name: 'Mercury', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. Cozy and comfortable standard room perfect for a relaxing getaway.',
    image: '/mercury1.png',
    images: ['/mercury1.png', '/mercury2.png', '/mercury3.png', '/mercury4.png'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom']
  },
  {
    id: 2, name: 'Venus', type: 'Family Double Bedroom',
    price: 3999, price_weekday: 3999, price_weekend: 3499, capacity: 4,
    description: 'Two bedrooms, two beds, one bathroom with an additional inside room. Ideal for families seeking extra space and comfort.',
    image: '/venus1.png',
    images: ['/venus1.png', '/venus2.png', '/venus3.png', '/venus4.png', '/venus5.png'],
    amenities: ['WiFi', 'AC', 'TV', 'Two Bedrooms', 'Extra Room']
  },
  {
    id: 3, name: 'Jupiter', type: 'Master Family Suite',
    price: 3499, price_weekday: 3499, price_weekend: 3999, capacity: 4,
    description: 'Master bedroom with attached additional bedroom and two beds. A premium suite experience for families.',
    image: '/jupiter1.png',
    images: ['/jupiter1.png', '/jupiter2.png', '/jupiter3.png', '/jupiter4.png', '/jupiter5.png'],
    amenities: ['WiFi', 'AC', 'Smart TV', 'Master Suite', 'Two Beds']
  },
  {
    id: 4, name: 'Earth', type: 'Balcony View Room',
    price: 2999, price_weekday: 2999, price_weekend: 3499, capacity: 2,
    description: 'One bedroom with a private balcony offering stunning scenic views. Perfect for a romantic retreat.',
    image: '/earth1.png',
    images: ['/earth1.png', '/earth2.png', '/earth3.png', '/earth4.png'],
    amenities: ['WiFi', 'AC', 'TV', 'Private Balcony', 'Scenic View']
  },
  {
    id: 5, name: 'Mars', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. A well-appointed standard room for a comfortable stay.',
    image: '/mars1.png',
    images: ['/mars1.png', '/mars2.png', '/mars3.png'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom']
  },
  {
    id: 6, name: 'Saturn', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. Modern amenities ensuring a relaxing and pleasant stay.',
    image: '/saturn1.png',
    images: ['/saturn1.png', '/saturn2.png', '/saturn3.png'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom']
  },
  {
    id: 7, name: 'Uranus', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. Serene and comfortable room for a peaceful retreat.',
    image: '/uranus1.png',
    images: ['/uranus1.png', '/uranus2.png'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom']
  },
  {
    id: 8, name: 'Neptune', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. A comfortable standard room with all essential amenities.',
    image: '/neptune1.png',
    images: ['/neptune1.png', '/neptune2.png', '/neptune3.png'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom']
  },
  {
    id: 9, name: 'Pluto', type: 'Hall Attached Room',
    price: 0, price_weekday: 0, price_weekend: 0, capacity: 2,
    description: 'Attached room included with the Sun Hall package. This room is not charged separately when Sun Hall is booked.',
    image: '/pluto1.jpg',
    images: ['/pluto1.jpg', '/pluto2.jpg'],
    amenities: ['WiFi', 'AC', 'Included in Sun Hall Package'],
    isSunHallPackage: true
  },
];

const INITIAL_HALLS = [
  {
    id: 'sun-hall',
    name: 'Sun Hall',
    type: 'Outdoor Party Hall',
    price: 20000,
    price_weekday: 20000,
    price_weekend: 23000,
    capacity: 200,
    hasSeparateRoom: true,
    separateRoomNote: 'Includes Pluto Attached Room',
    description: 'Expansive outdoor event space for weddings, receptions, birthday celebrations, corporate gatherings and family functions. Includes the Pluto attached room in the package.',
    image: '/outdoor1.png',
    images: ['/outdoor1.png', '/outdoor2.png', '/outdoor3.png', '/outdoor4.png'],
    amenities: [
      'Outdoor Event Space',
      'Pluto Room Included',
      'Catering Setup',
      'DJ Ready',
      'Event Lighting',
      'Valet Parking'
    ]
  },
  {
    id: 'moon-hall',
    name: 'Moon Hall',
    type: 'Indoor Party Hall',
    price: 15000,
    price_weekday: 15000,
    price_weekend: 18000,
    capacity: 100,
    hasSeparateRoom: false,
    description: 'Elegant climate-controlled indoor hall for birthday parties, engagement functions, corporate meetings and private events.',
    image: '/indoor1.png',
    images: ['/indoor1.png', '/indoor2.png', '/indoor3.png', '/indoor4.png', '/indoor5.png'],
    amenities: [
      'Central AC',
      'Indoor Setup',
      'AV System',
      'Projector',
      'Banquet Seating',
      'Private Restrooms'
    ]
  },
];

const INITIAL_ROOM_STATES = {
  1: { status: 'available' },
  2: { status: 'available' },
  3: { status: 'available' },
  4: { status: 'available' },
  5: { status: 'available' },
  6: { status: 'available' },
  7: { status: 'available' },
  8: { status: 'available' },
  9: { status: 'available' },
  'sun-hall':  { status: 'available' },
  'moon-hall': { status: 'available' },
};

const INITIAL_GALLERY = [
  { id: 1, url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
  { id: 2, url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' },
  { id: 3, url: '/exquisite_venues_bg.jpg' },
  { id: 4, url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80' },
  { id: 5, url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
  { id: 6, url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ls = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const lsSave = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ─── Weekday / Weekend Price Helper ──────────────────────────────────────────

/**
 * Returns the correct price for an item based on the booking date.
 * Mon–Fri = weekday price, Sat–Sun = weekend price.
 * @param {Object} item  - room or hall object with price_weekday / price_weekend
 * @param {string|Date} dateStr - check-in date (string or Date)
 * @returns {{ price: number, label: 'Weekday' | 'Weekend' }}
 */
export const getPriceForDate = (item, dateStr) => {
  if (!dateStr) {
    const p = item.price_weekday ?? item.price ?? 0;
    return { price: p, label: 'Weekday' };
  }
  const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
  const day = d.getDay(); // 0=Sun, 6=Sat
  const isWeekend = day === 0 || day === 6;
  const price = isWeekend
    ? (item.price_weekend ?? item.price ?? 0)
    : (item.price_weekday ?? item.price ?? 0);
  return { price, label: isWeekend ? 'Weekend' : 'Weekday' };
};

// ─── Inventory Version Sync ──────────────────────────────────────────────────
const CURRENT_INVENTORY_VERSION = 'v4_halls_pricing_swapped';

const syncInventoryIfNeeded = () => {
  const version = ls('dk_inventory_version');
  const cachedRooms = ls('dk_rooms');
  if (version !== CURRENT_INVENTORY_VERSION || !cachedRooms || cachedRooms.length !== 9) {
    lsSave('dk_rooms', INITIAL_ROOMS);
    lsSave('dk_halls', INITIAL_HALLS);
    lsSave('dk_room_states', INITIAL_ROOM_STATES);

    // Remap any existing bookings with old IDs
    const bookings = ls('dk_bookings');
    if (bookings && Array.isArray(bookings)) {
      const idMap = { 101:1, 102:2, 103:3, 104:4, 105:5, 106:6, 107:7, 108:8 };
      const updated = bookings
        .filter(b => b.itemId !== 109 && b.itemId !== 110)
        .map(b => {
          if (idMap[b.itemId]) return { ...b, itemId: idMap[b.itemId] };
          if (b.itemId === 'open-hall' || b.itemId === 'outdoor-hall') return { ...b, itemId: 'sun-hall', itemName: 'Sun Hall' };
          if (b.itemId === 'mini-hall' || b.itemId === 'indoor-hall') return { ...b, itemId: 'moon-hall', itemName: 'Moon Hall' };
          return b;
        });
      lsSave('dk_bookings', updated);
    }
    lsSave('dk_inventory_version', CURRENT_INVENTORY_VERSION);
  }
};

// Run sync immediately on module load
syncInventoryIfNeeded();

// ─── ROOMS ────────────────────────────────────────────────────────────────────

export const getDBRooms = async () => {
  if (supabase) {
    const { data, error } = await supabase.from('rooms').select('*').order('id');
    if (!error && data?.length) {
      // Ensure price_weekday / price_weekend fallback from local seed if columns don't exist in DB yet
      return data.map(r => {
        const seed = INITIAL_ROOMS.find(s => s.id === r.id);
        return {
          ...r,
          price_weekday: r.price_weekday ?? seed?.price_weekday ?? r.price,
          price_weekend: r.price_weekend ?? seed?.price_weekend ?? r.price,
          isSunHallPackage: r.id === 9,
        };
      });
    }
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
      id:            room.id,
      name:          room.name,
      type:          room.type,
      price:         room.price_weekday ?? room.price,
      capacity:      room.capacity,
      description:   room.description,
      image:         room.image,
      amenities:     room.amenities,
      price_weekday: room.price_weekday,
      price_weekend: room.price_weekend,
    }, { onConflict: 'id' });
  }
};

export const updateDBRoom = async (roomId, fields) => {
  if (supabase) {
    // If updating weekday price, also sync the main `price` column
    const updateFields = { ...fields };
    if (fields.price_weekday !== undefined) updateFields.price = fields.price_weekday;
    const { error } = await supabase.from('rooms').update(updateFields).eq('id', roomId);
    if (error) console.error('[Supabase] updateDBRoom:', error.message);
  }
  const cached = ls('dk_rooms') || INITIAL_ROOMS;
  const updated = cached.map(r => r.id === Number(roomId) ? { ...r, ...fields } : r);
  lsSave('dk_rooms', updated);
};

// ─── HALLS ────────────────────────────────────────────────────────────────────

export const getDBHalls = async () => {
  if (supabase) {
    const { data, error } = await supabase.from('halls').select('*');
    if (!error && data?.length) {
      return data.map(h => {
        const seed = INITIAL_HALLS.find(s => s.id === h.id);
        return {
          ...h,
          price_weekday: h.price_weekday ?? seed?.price_weekday ?? h.price,
          price_weekend: h.price_weekend ?? seed?.price_weekend ?? h.price,
        };
      });
    }
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
      id:            hall.id,
      name:          hall.name,
      type:          hall.type,
      price:         hall.price_weekday ?? hall.price,
      capacity:      hall.capacity,
      description:   hall.description,
      image:         hall.image,
      amenities:     hall.amenities,
      price_weekday: hall.price_weekday,
      price_weekend: hall.price_weekend,
    }, { onConflict: 'id' });
  }
};

export const updateDBHall = async (hallId, fields) => {
  if (supabase) {
    const updateFields = { ...fields };
    if (fields.price_weekday !== undefined) updateFields.price = fields.price_weekday;
    const { error } = await supabase.from('halls').update(updateFields).eq('id', hallId);
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

// ─── GUEST FEEDBACKS ───────────────────────────────────────────────────────────

export const getDBFeedbacks = async () => {
  if (supabase) {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data?.length) return data;
  }
  return ls('dk_feedbacks') || [];
};

export const saveDBFeedback = async (feedbackData) => {
  const newFeedback = {
    ...feedbackData,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from('feedbacks').insert(newFeedback);
    if (error) {
      console.warn('[Supabase] feedbacks insert failed, falling back to localStorage:', error.message);
    }
  }

  // Fallback to localStorage
  const cached = ls('dk_feedbacks') || [];
  cached.unshift(newFeedback);
  lsSave('dk_feedbacks', cached);
  
  return newFeedback;
};
