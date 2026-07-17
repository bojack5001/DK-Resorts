-- ============================================================
-- DK Star Resorts — Supabase SQL Schema
-- Run this entire block in Supabase SQL Editor
-- Project: DKStarResorts (octgytjcnjlxynwfjcwo)
-- ============================================================

-- 1. ROOMS
CREATE TABLE IF NOT EXISTS public.rooms (
  id          INTEGER PRIMARY KEY,
  name        TEXT        NOT NULL,
  type        TEXT        NOT NULL,
  price       NUMERIC     NOT NULL DEFAULT 0,
  capacity    INTEGER     NOT NULL DEFAULT 2,
  description TEXT,
  image       TEXT,
  amenities   JSONB       DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HALLS
CREATE TABLE IF NOT EXISTS public.halls (
  id          TEXT        PRIMARY KEY,
  name        TEXT        NOT NULL,
  type        TEXT        NOT NULL,
  price       NUMERIC     NOT NULL DEFAULT 0,
  capacity    INTEGER     NOT NULL DEFAULT 100,
  description TEXT,
  image       TEXT,
  amenities   JSONB       DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id           TEXT        PRIMARY KEY,
  item_id      TEXT        NOT NULL,
  item_name    TEXT        NOT NULL,
  item_type    TEXT        NOT NULL CHECK (item_type IN ('room', 'hall')),
  guest_name   TEXT        NOT NULL,
  guest_email  TEXT,
  guest_phone  TEXT,
  check_in     DATE        NOT NULL,
  check_out    DATE        NOT NULL,
  guests       INTEGER     NOT NULL DEFAULT 1,
  status       TEXT        NOT NULL DEFAULT 'Pending'
                            CHECK (status IN ('Pending','Confirmed','Checked-in','Checked-out','Cancelled')),
  amount       NUMERIC     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROOM STATES
CREATE TABLE IF NOT EXISTS public.room_states (
  room_id    TEXT        PRIMARY KEY,
  status     TEXT        NOT NULL DEFAULT 'available'
                          CHECK (status IN ('available','occupied','dirty','maintenance')),
  booking_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
  id         SERIAL      PRIMARY KEY,
  url        TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         SERIAL      PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.rooms            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.halls            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_states      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rooms_select_public" ON public.rooms  FOR SELECT USING (true);
CREATE POLICY "rooms_all_anon"      ON public.rooms  FOR ALL    USING (true) WITH CHECK (true);

CREATE POLICY "halls_select_public" ON public.halls  FOR SELECT USING (true);
CREATE POLICY "halls_all_anon"      ON public.halls  FOR ALL    USING (true) WITH CHECK (true);

CREATE POLICY "bookings_select_all" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "bookings_insert_all" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_update_all" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "bookings_delete_all" ON public.bookings FOR DELETE USING (true);

CREATE POLICY "room_states_all"     ON public.room_states FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "gallery_select_all"  ON public.gallery FOR SELECT USING (true);
CREATE POLICY "gallery_all_anon"    ON public.gallery FOR ALL    USING (true) WITH CHECK (true);

CREATE POLICY "contact_insert_all"  ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_select_all"  ON public.contact_messages FOR SELECT USING (true);

-- ============================================================
-- SEED DATA — Rooms
-- ============================================================
INSERT INTO public.rooms (id, name, type, price, capacity, description, image, amenities) VALUES
(101,'Cozy Standard','Standard Room',4500,2,'A snug and functional room featuring a plush double bed, working desk, and modern amenities ideal for short stays.','https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","TV"]'),
(102,'Classic Double','Standard Room',6000,2,'Spacious classic design equipped with a queen bed, warm lighting, and a refreshing garden view from the window.','https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","Mini Fridge"]'),
(103,'Forest View Deluxe','Deluxe Room',8500,2,'Experience the tranquility of nature in our forest view rooms, designed with earthy tones and premium amenities.','https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","Private Balcony","Tea Maker"]'),
(104,'Garden View Executive','Executive Room',10500,2,'Elegantly styled executive room overlooking our manicured botanical gardens, offering a workstation and lounge chair.','https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","Smart TV","Safe Deposit"]'),
(105,'Poolside Cabin','Cabin',12500,2,'Charming cabin situated steps away from our infinity pool, featuring direct deck access and a private outdoor seating space.','https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","Pool Access","Mini Bar"]'),
(106,'Luxury Stag Suite','Premium Suite',15000,2,'Our flagship suite offering panoramic views of the forest, featuring a private balcony and a mahogany soaking tub.','https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","Soaking Tub","In-room Dining"]'),
(107,'Canopy Treehouse','Chalet',18000,2,'Elevated high amongst the trees, this luxury wood chalet offers absolute seclusion, glass walls, and stargazing skylights.','https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","Skylight","Hammock"]'),
(108,'Family Heritage Villa','Family Villa',22000,4,'Perfect for families, this spacious villa includes two bedrooms, a private living area, and direct garden access.','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","Kitchenette","Garden Area"]'),
(109,'Vintage Royal Suite','Premium Suite',26000,2,'Adorned with colonial-era antiques and royal drapes, this suite features a four-poster bed, private study, and butler service.','https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","Butler Service","Espresso Machine"]'),
(110,'Presidential Penthouse','Penthouse',38000,4,'The crown jewel of DK Resorts. Spanning the entire top floor, it hosts a private hot tub, wrap-around terrace, and dining hall.','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','["Wifi","AC","Hot Tub","Private Terrace","Sound System"]')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA — Halls
-- ============================================================
INSERT INTO public.halls (id, name, type, price, capacity, description, image, amenities) VALUES
('open-hall','Grand Lawn & Pavilion','Open Function Hall',75000,1000,'An expansive lush green lawn bordered by scenic woods, featuring a central covered wooden pavilion, ideal for dream weddings and massive corporate events.','/exquisite_venues_bg.jpg','["Outdoor Seating","Catering Stall setup","Surround Sound","Bridal Suites","Valet Parking"]'),
('mini-hall','The Oak Room','Mini Function Hall',25000,150,'An elegant, air-conditioned indoor banquet hall panelled with oak wood, designed for birthdays, small gatherings, conferences, and intimate celebrations.','https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80','["Central AC","Projector & Screen","Banquet Chairs","Stage Setup","Attached Dining Hall"]')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA — Room States
-- ============================================================
INSERT INTO public.room_states (room_id, status, booking_id) VALUES
('101','available',NULL),('102','available',NULL),('103','occupied','BK-1002'),
('104','available',NULL),('105','dirty',NULL),('106','available',NULL),
('107','available',NULL),('108','dirty',NULL),('109','available',NULL),
('110','available',NULL),('open-hall','available',NULL),('mini-hall','available',NULL)
ON CONFLICT (room_id) DO NOTHING;

-- ============================================================
-- SEED DATA — Gallery
-- ============================================================
INSERT INTO public.gallery (url) VALUES
('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'),
('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'),
('/exquisite_venues_bg.jpg'),
('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80'),
('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'),
('https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80');
-- Add pool_bookings table to Supabase
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.pool_bookings (
  id           TEXT        PRIMARY KEY,   -- e.g. "PL-1234"
  booking_date DATE        NOT NULL,
  slot         TEXT        NOT NULL CHECK (slot IN ('morning','afternoon','evening')),
  guest_name   TEXT        NOT NULL,
  guest_email  TEXT        NOT NULL,
  guest_phone  TEXT,
  guests       INTEGER     NOT NULL DEFAULT 1,
  amount       NUMERIC     NOT NULL DEFAULT 0,
  status       TEXT        NOT NULL DEFAULT 'Confirmed'
                            CHECK (status IN ('Confirmed','Cancelled')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pool_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pool_bookings_select" ON public.pool_bookings FOR SELECT USING (true);
CREATE POLICY "pool_bookings_insert" ON public.pool_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "pool_bookings_update" ON public.pool_bookings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "pool_bookings_delete" ON public.pool_bookings FOR DELETE USING (true);
-- Add feedbacks table to Supabase
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.feedbacks (
  id           TEXT        PRIMARY KEY,   -- e.g. "FB-1234"
  booking_id   TEXT        NOT NULL,
  guest_name   TEXT        NOT NULL,
  guest_email  TEXT        NOT NULL,
  rating       INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedbacks_select" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "feedbacks_insert" ON public.feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "feedbacks_update" ON public.feedbacks FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "feedbacks_delete" ON public.feedbacks FOR DELETE USING (true);
