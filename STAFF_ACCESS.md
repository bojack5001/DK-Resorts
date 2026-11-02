# 🔐 Staff Portal Access Guide
## DK STAR RESORTS — Internal Reference

> ⚠️ **CONFIDENTIAL** — Do not share this file with guests or publish it publicly.

---

## Staff Portal URLs

These pages are **not linked** anywhere on the public website. Access them directly by typing the URL in the browser.

---

### 🛡️ Admin Panel (Management Office)

**URL:** `http://localhost:5173/admin`
_(or your live domain: `https://yoursite.com/admin`)_

| Admin User | Username | Password |
|-----------|----------|---------|
| Deena | `deena@admin` | `deena@123` |
| Jagan | `jagan@admin` | `deena@123` |

**Admin Capabilities:**
- 📊 Dashboard — live statistics, revenue graph, occupancy ratio
- 📋 Bookings Ledger — approve / reject / edit / delete reservations
- 🛏️ Rooms & Halls Manager — update names, pricing, capacity, descriptions
- 📥 Export Ledger — download all bookings as Excel report (.xlsx)

---

### 🖥️ Reception / Front Desk Terminal

**URL:** `http://localhost:5173/reception`
_(or your live domain: `https://yoursite.com/reception`)_

| Staff Member | Username | Password |
|-------------|----------|---------|
| Deena | `deena@staff` | `deena@123` |
| Jagan | `jagan@staff` | `deena@123` |

**Reception Capabilities:**
- 🟩 Live Room Grid — color-coded occupancy status for all 8 rooms + 2 party halls (Indoor & Outdoor)
  - 🟢 **Green** = Available
  - 🟠 **Orange** = Booked (check-in today)
  - 🔵 **Blue** = Occupied (guest checked in)
  - 🔴 **Red** = Dirty / Needs cleaning
- ✅ Check-In — confirm arrival for confirmed bookings
- 🚪 Check-Out — process departure + auto-generate invoice
- 🧹 Mark Cleaned — return room to available status
- 🚶 Walk-in Booking — instantly register a new guest at the front desk
- 🔍 Guest Directory — search all bookings by name, email, or booking ID

---

## 🏨 Resort Inventory Summary

### Rooms (01–09) — 9 Solar System Guest Rooms

| Room No. | Name | Category | Weekday Rate | Weekend Rate | Key Details |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **01** | Mercury | Standard Room | ₹2,499 | ₹2,999 | 1 bed, attached bathroom |
| **02** | Venus | Family Double Bedroom | ₹3,999 | ₹3,499 | 2 bedrooms, 2 beds, 1 bath, inside room |
| **03** | Jupiter | Master Family Suite | ₹3,499 | ₹3,999 | Master bedroom + attached bedroom, 2 beds |
| **04** | Earth | Balcony View Room | ₹2,999 | ₹3,499 | Private balcony view, 1 bedroom |
| **05** | Mars | Standard Room | ₹2,499 | ₹2,999 | 1 bed, attached bathroom |
| **06** | Saturn | Standard Room | ₹2,499 | ₹2,999 | 1 bed, attached bathroom |
| **07** | Uranus | Standard Room | ₹2,499 | ₹2,999 | 1 bed, attached bathroom |
| **08** | Neptune | Standard Room | ₹2,499 | ₹2,999 | 1 bed, attached bathroom |
| **09** | Pluto | Hall Attached Room | *Included in Sun Hall* | *Included in Sun Hall* | Attached private room with Sun Hall |

### Party Halls (2 Venues)

| Hall | Type | Capacity | Weekday Rate | Weekend Rate | Special Features |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Sun Hall** | Outdoor Party Hall | 200 guests | ₹20,000 | ₹23,000 | Open-air lawn, grand stage under stars, **Pluto Room Included** |
| **Moon Hall** | Indoor Party Hall | 100 guests | ₹15,000 | ₹18,000 | Central AC, acoustic paneling, stage & AV projector |

---

## Notes

- All pricing and room details can be updated live from the **Admin Panel → Rooms & Halls** tab.
- All bookings are stored in the browser's `localStorage` and persist across page refreshes.
- If you need to reset all data, clear `localStorage` keys: `dk_rooms`, `dk_halls`, `dk_bookings`, `dk_room_states`.
