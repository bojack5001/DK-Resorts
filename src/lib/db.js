import { supabase } from './supabaseClient';

const INITIAL_ROOMS = [
  {
    id: 101,
    name: "Cozy Standard",
    type: "Standard Room",
    price: 4500,
    capacity: 2,
    description: "A snug and functional room featuring a plush double bed, working desk, and modern amenities ideal for short stays.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "TV"]
  },
  {
    id: 102,
    name: "Classic Double",
    type: "Standard Room",
    price: 6000,
    capacity: 2,
    description: "Spacious classic design equipped with a queen bed, warm lighting, and a refreshing garden view from the window.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "Mini Fridge"]
  },
  {
    id: 103,
    name: "Forest View Deluxe",
    type: "Deluxe Room",
    price: 8500,
    capacity: 2,
    description: "Experience the tranquility of nature in our forest view rooms, designed with earthy tones and premium amenities.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "Private Balcony", "Tea Maker"]
  },
  {
    id: 104,
    name: "Garden View Executive",
    type: "Executive Room",
    price: 10500,
    capacity: 2,
    description: "Elegantly styled executive room overlooking our manicured botanical gardens, offering a workstation and lounge chair.",
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "Smart TV", "Safe Deposit"]
  },
  {
    id: 105,
    name: "Poolside Cabin",
    type: "Cabin",
    price: 12500,
    capacity: 2,
    description: "Charming cabin situated steps away from our infinity pool, featuring direct deck access and a private outdoor seating space.",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "Pool Access", "Mini Bar"]
  },
  {
    id: 106,
    name: "Luxury Stag Suite",
    type: "Premium Suite",
    price: 15000,
    capacity: 2,
    description: "Our flagship suite offering panoramic views of the forest, featuring a private balcony and a mahogany soaking tub.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "Soaking Tub", "In-room Dining"]
  },
  {
    id: 107,
    name: "Canopy Treehouse",
    type: "Chalet",
    price: 18000,
    capacity: 2,
    description: "Elevated high amongst the trees, this luxury wood chalet offers absolute seclusion, glass walls, and stargazing skylights.",
    image: "https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "Skylight", "Hammock"]
  },
  {
    id: 108,
    name: "Family Heritage Villa",
    type: "Family Villa",
    price: 22000,
    capacity: 4,
    description: "Perfect for families, this spacious villa includes two bedrooms, a private living area, and direct garden access.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "Kitchenette", "Garden Area"]
  },
  {
    id: 109,
    name: "Vintage Royal Suite",
    type: "Premium Suite",
    price: 26000,
    capacity: 2,
    description: "Adorned with colonial-era antiques and royal drapes, this suite features a four-poster bed, private study, and butler service.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "Butler Service", "Espresso Machine"]
  },
  {
    id: 110,
    name: "Presidential Penthouse",
    type: "Penthouse",
    price: 38000,
    capacity: 4,
    description: "The crown jewel of DK Resorts. Spanning the entire top floor, it hosts a private hot tub, wrap-around terrace, and dining hall.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Wifi", "AC", "Hot Tub", "Private Terrace", "Sound System"]
  }
];

const INITIAL_HALLS = [
  {
    id: "open-hall",
    name: "Grand Lawn & Pavilion",
    type: "Open Function Hall",
    price: 75000,
    capacity: 1000,
    description: "An expansive lush green lawn bordered by scenic woods, featuring a central covered wooden pavilion, ideal for dream weddings and massive corporate events.",
    image: "/exquisite_venues_bg.jpg",
    amenities: ["Outdoor Seating", "Catering Stall setup", "Surround Sound", "Bridal Suites", "Valet Parking"]
  },
  {
    id: "mini-hall",
    name: "The Oak Room",
    type: "Mini Function Hall",
    price: 25000,
    capacity: 150,
    description: "An elegant, air-conditioned indoor banquet hall panelled with oak wood, designed for birthdays, small gatherings, conferences, and intimate celebrations.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["Central AC", "Projector & Screen", "Banquet Chairs", "Stage Setup", "Attached Dining Hall"]
  }
];

const INITIAL_BOOKINGS = [
  {
    id: "BK-1001",
    itemId: 106,
    itemName: "Luxury Stag Suite",
    itemType: "room",
    guestName: "Rahul Sharma",
    guestEmail: "rahul@gmail.com",
    guestPhone: "+91 98765 43210",
    checkIn: "2026-06-10",
    checkOut: "2026-06-13",
    guests: 2,
    status: "Confirmed",
    amount: 45000,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "BK-1002",
    itemId: 103,
    itemName: "Forest View Deluxe",
    itemType: "room",
    guestName: "Priya Patel",
    guestEmail: "priya@yahoo.com",
    guestPhone: "+91 87654 32109",
    checkIn: "2026-06-04",
    checkOut: "2026-06-06",
    guests: 2,
    status: "Checked-in",
    amount: 17000,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "BK-1003",
    itemId: 108,
    itemName: "Family Heritage Villa",
    itemType: "room",
    guestName: "Amit Verma",
    guestEmail: "amit@hotmail.com",
    guestPhone: "+91 76543 21098",
    checkIn: "2026-06-01",
    checkOut: "2026-06-03",
    guests: 4,
    status: "Checked-out",
    amount: 44000,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "BK-1004",
    itemId: "open-hall",
    itemName: "Grand Lawn & Pavilion",
    itemType: "hall",
    guestName: "Siddharth Malhotra",
    guestEmail: "sid@malhotra.com",
    guestPhone: "+91 99988 77766",
    checkIn: "2026-06-15",
    checkOut: "2026-06-16",
    guests: 600,
    status: "Pending",
    amount: 75000,
    created_at: new Date().toISOString()
  }
];

// Room states for occupancy grid (reception)
// ID maps to room ID / hall ID
// Status can be: 'available', 'occupied', 'dirty'
// Note: Booked state is inferred if there's an active booking for today but guest has not checked-in yet.
const INITIAL_ROOM_STATES = {
  101: { status: "available" },
  102: { status: "available" },
  103: { status: "occupied", bookingId: "BK-1002" }, // Priya checked in
  104: { status: "available" },
  105: { status: "dirty" }, // Cleaning needed
  106: { status: "available" }, // Confirmed booking in future, but available today
  107: { status: "available" },
  108: { status: "dirty" }, // Amit checked out, dirty now
  109: { status: "available" },
  110: { status: "available" },
  "open-hall": { status: "available" },
  "mini-hall": { status: "available" }
};

const INITIAL_GALLERY = [
  { id: 1, url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
  { id: 2, url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80" },
  { id: 3, url: "/exquisite_venues_bg.jpg" },
  { id: 4, url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80" },
  { id: 5, url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80" },
  { id: 6, url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80" }
];

export const initializeDB = () => {
  if (!localStorage.getItem("dk_rooms")) {
    localStorage.setItem("dk_rooms", JSON.stringify(INITIAL_ROOMS));
  }
  if (!localStorage.getItem("dk_halls")) {
    localStorage.setItem("dk_halls", JSON.stringify(INITIAL_HALLS));
  }
  if (!localStorage.getItem("dk_bookings")) {
    localStorage.setItem("dk_bookings", JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem("dk_room_states")) {
    localStorage.setItem("dk_room_states", JSON.stringify(INITIAL_ROOM_STATES));
  }
  if (!localStorage.getItem("dk_gallery")) {
    localStorage.setItem("dk_gallery", JSON.stringify(INITIAL_GALLERY));
  }
};

export const getDBRooms = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem("dk_rooms"));
};

export const getDBHalls = () => {
  initializeDB();
  let halls = JSON.parse(localStorage.getItem("dk_halls"));
  let changed = false;
  halls = halls.map(h => {
    if (h.id === "open-hall" && h.image !== "/exquisite_venues_bg.jpg") {
      h.image = "/exquisite_venues_bg.jpg";
      changed = true;
    }
    if (h.id === "mini-hall" && h.image === "/exquisite_venues_bg.jpg") {
      h.image = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      changed = true;
    }
    return h;
  });
  if (changed) {
    saveDBHalls(halls);
  }
  return halls;
};

export const getDBBookings = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem("dk_bookings"));
};

export const getDBRoomStates = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem("dk_room_states"));
};

export const saveDBRooms = (rooms) => {
  localStorage.setItem("dk_rooms", JSON.stringify(rooms));
};

export const saveDBHalls = (halls) => {
  localStorage.setItem("dk_halls", JSON.stringify(halls));
};

export const saveDBBookings = (bookings) => {
  localStorage.setItem("dk_bookings", JSON.stringify(bookings));
};

export const saveDBRoomStates = (roomStates) => {
  localStorage.setItem("dk_room_states", JSON.stringify(roomStates));
};

export const getDBGallery = () => {
  initializeDB();
  let gallery = JSON.parse(localStorage.getItem("dk_gallery"));
  let changed = false;
  gallery = gallery.map(item => {
    if (item.url.includes("photo-1519167758481-83f550bb49b3")) {
      item.url = "/exquisite_venues_bg.jpg";
      changed = true;
    }
    return item;
  });
  if (changed) {
    saveDBGallery(gallery);
  }
  return gallery;
};

export const saveDBGallery = (gallery) => {
  localStorage.setItem("dk_gallery", JSON.stringify(gallery));
};
