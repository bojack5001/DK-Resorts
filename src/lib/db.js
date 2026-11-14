/**
 * db.js — DK Star Resorts data layer
 * Royal Luxury Collection — 9 Prestige Rooms (Elite to Nakshatra) + Nakshatra Hall + Moon Hall
 * Supports weekday / weekend dual pricing.
 * Uses Supabase when connected, falls back to localStorage for offline dev.
 */
import { supabase } from './supabaseClient';

// ─── Seed data (used for localStorage fallback & initial DB seeding) ──────────

const INITIAL_ROOMS = [
  {
    id: 1, name: 'Elite', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. A refined standard room offering quiet sophistication, bespoke comfort, and plush amenities.',
    image: '/mercury1.webp',
    images: ['/mercury1.webp', '/mercury2.webp', '/mercury3.webp', '/mercury4.webp'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom', 'Free Pool Access']
  },
  {
    id: 2, name: 'Signature', type: 'Family Room',
    price: 3999, price_weekday: 3999, price_weekend: 3499, capacity: 4,
    description: 'Two bedrooms, two beds, one bathroom, and an additional inside room. Specially crafted for distinguished family retreats.',
    image: '/venus1.webp',
    images: ['/venus1.webp', '/venus2.webp', '/venus3.webp', '/venus4.webp', '/venus5.webp'],
    amenities: ['WiFi', 'AC', 'TV', 'Two Bedrooms', 'Extra Room', 'Free Pool Access']
  },
  {
    id: 3, name: 'Crown', type: 'Master Family Suite',
    price: 3499, price_weekday: 3499, price_weekend: 3999, capacity: 4,
    description: 'Master bedroom with attached additional bedroom and two beds. An opulent suite designed for unforgettable family stays.',
    image: '/jupiter1.webp',
    images: ['/jupiter1.webp', '/jupiter2.webp', '/jupiter3.webp', '/jupiter4.webp', '/jupiter5.webp'],
    amenities: ['WiFi', 'AC', 'Smart TV', 'Master Suite', 'Two Beds', 'Free Pool Access']
  },
  {
    id: 4, name: 'Legacy', type: 'Balcony View Room',
    price: 2999, price_weekday: 2999, price_weekend: 3499, capacity: 2,
    description: 'One bedroom with private balcony view. Panoramic scenic perspectives paired with royal tranquility.',
    image: '/earth1.webp',
    images: ['/earth1.webp', '/earth2.webp', '/earth3.webp', '/earth4.webp'],
    amenities: ['WiFi', 'AC', 'TV', 'Private Balcony', 'Scenic View', 'Free Pool Access']
  },
  {
    id: 5, name: 'Majestic', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. Beautifully proportioned with bespoke woodwork and serene ambiance.',
    image: '/mars1.webp',
    images: ['/mars1.webp', '/mars2.webp', '/mars3.webp'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom', 'Free Pool Access']
  },
  {
    id: 6, name: 'Grande', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. Modern luxury appointments delivering an exceptional restful stay.',
    image: '/saturn1.webp',
    images: ['/saturn1.webp', '/saturn2.webp', '/saturn3.webp'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom', 'Free Pool Access']
  },
  {
    id: 7, name: 'Imperial', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. Serene, tasteful decor offering peaceful seclusion and refined luxury.',
    image: '/uranus1.webp',
    images: ['/uranus1.webp', '/uranus2.webp'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom', 'Free Pool Access']
  },
  {
    id: 8, name: 'Supreme', type: 'Standard Room',
    price: 2499, price_weekday: 2499, price_weekend: 2999, capacity: 2,
    description: 'One bed, one attached bathroom. Distinctive character, elegant craftsmanship, and complete comfort.',
    image: '/neptune1.webp',
    images: ['/neptune1.webp', '/neptune2.webp', '/neptune3.webp'],
    amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom', 'Free Pool Access']
  },
  {
    id: 9, name: 'Nakshatra', type: 'Hall Attached Room',
    price: 0, price_weekday: 0, price_weekend: 0, capacity: 2,
    description: 'Attached private dressing suite included with the Nakshatra Hall 2 package. Not charged separately when Nakshatra Hall 2 is booked.',
    image: '/nakshatra1.webp',
    images: ['/nakshatra1.webp', '/nakshatra2.webp'],
    amenities: ['WiFi', 'AC', 'Included with Nakshatra Hall 2 Package', 'Free Pool Access'],
    isSunHallPackage: true,
    isNakshatraPackage: true
  },
];

const INITIAL_HALLS = [
  {
    id: 'moon-hall',
    name: 'Nakshatra Hall 1',
    type: 'Indoor Party Hall',
    price: 20000,
    price_weekday: 20000,
    price_weekend: 23000,
    capacity: 100,
    hasSeparateRoom: false,
    description: 'Climate-controlled indoor banquet hall with acoustic panelling, royal chandeliers, and AV system for celebrations, birthdays, engagements, and corporate meetings.',
    image: '/indoor1.webp',
    images: ['/indoor1.webp', '/indoor2.webp', '/indoor3.webp', '/indoor4.webp', '/indoor5.webp'],
    amenities: [
      'Central AC',
      'Free Pool Access',
      'Acoustic Audio & DJ System',
      'AV Projector & Screen',
      'Banquet Seating',
      'Private Restrooms'
    ]
  },
  {
    id: 'sun-hall',
    name: 'Nakshatra Hall 2',
    type: 'Outdoor Party Hall',
    price: 25000,
    price_weekday: 25000,
    price_weekend: 27000,
    capacity: 200,
    hasSeparateRoom: true,
    separateRoomNote: 'Includes Nakshatra Attached Room (Room 09)',
    description: 'Expansive open-air royal celebration lawn for grand weddings, receptions, and birthday galas. Includes the Nakshatra attached dressing suite (Room 09).',
    image: '/outdoor1.webp',
    images: ['/outdoor1.webp', '/outdoor2.webp', '/outdoor3.webp', '/outdoor4.webp'],
    amenities: [
      'Outdoor Celebration Lawn',
      'Free Pool Access',
      'Nakshatra Suite Included',
      'Grand Stage Setup',
      'Catering Setup',
      'Surround Sound & DJ Ready',
      'Royal Event Lighting',
      'Valet Parking'
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
  { id: 3, url: '/outdoor1.png' },
  { id: 4, url: '/pool4.png' },
  { id: 5, url: '/dining1.png' },
  { id: 6, url: '/indoor1.png' },
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
const CURRENT_INVENTORY_VERSION = 'v8_free_pool_access';

const syncInventoryIfNeeded = () => {
  const version = ls('dk_inventory_version');
  const cachedRooms = ls('dk_rooms');
  if (version !== CURRENT_INVENTORY_VERSION || !cachedRooms || cachedRooms.length !== 9 || cachedRooms[0]?.name !== 'Elite') {
    lsSave('dk_rooms', INITIAL_ROOMS);
    lsSave('dk_halls', INITIAL_HALLS);
    lsSave('dk_room_states', INITIAL_ROOM_STATES);

    // Remap any existing bookings with old IDs or names
    const bookings = ls('dk_bookings');
    if (bookings && Array.isArray(bookings)) {
      const roomNames = { 1: 'Elite', 2: 'Signature', 3: 'Crown', 4: 'Legacy', 5: 'Majestic', 6: 'Grande', 7: 'Imperial', 8: 'Supreme', 9: 'Nakshatra' };
      const updated = bookings
        .filter(b => b.itemId !== 109 && b.itemId !== 110)
        .map(b => {
          if (roomNames[b.itemId]) return { ...b, itemName: roomNames[b.itemId] };
          if (b.itemId === 'open-hall' || b.itemId === 'outdoor-hall' || b.itemId === 'sun-hall') {
            return { ...b, itemId: 'sun-hall', itemName: 'Nakshatra Hall' };
          }
          if (b.itemId === 'mini-hall' || b.itemId === 'indoor-hall' || b.itemId === 'moon-hall') {
            return { ...b, itemId: 'moon-hall', itemName: 'Moon Hall' };
          }
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
      return data.map(r => {
        const seed = INITIAL_ROOMS.find(s => s.id === r.id);
        return {
          ...r,
          price_weekday: r.price_weekday ?? seed?.price_weekday ?? r.price,
          price_weekend: r.price_weekend ?? seed?.price_weekend ?? r.price,
          isSunHallPackage: r.id === 9,
          isNakshatraPackage: r.id === 9,
        };
      });
    }
  }
  // localStorage fallback
  const cached = ls('dk_rooms');
  if (cached && cached[0]?.name === 'Elite') return cached;
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
      const hallsList = data.map(h => {
        const seed = INITIAL_HALLS.find(s => s.id === h.id);
        return {
          ...h,
          name: seed?.name || h.name,
          type: seed?.type || h.type,
          price: seed?.price || h.price,
          price_weekday: h.price_weekday ?? seed?.price_weekday ?? h.price,
          price_weekend: h.price_weekend ?? seed?.price_weekend ?? h.price,
          hasSeparateRoom: seed?.hasSeparateRoom ?? h.hasSeparateRoom,
          separateRoomNote: seed?.separateRoomNote ?? h.separateRoomNote,
        };
      });
      // Nakshatra Hall 1 (Indoor) first, then Nakshatra Hall 2 (Outdoor)
      return hallsList.sort((a, b) => (a.id === 'moon-hall' ? -1 : 1));
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
