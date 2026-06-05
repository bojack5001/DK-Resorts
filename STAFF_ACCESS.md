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
- 🟩 Live Room Grid — color-coded occupancy status for all 10 rooms + 2 halls
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

### Rooms (101–110)

| Room No. | Name | Type | Rate/Night |
|----------|------|------|-----------|
| 101 | Cozy Standard | Standard | ₹4,500 |
| 102 | Classic Double | Standard | ₹6,000 |
| 103 | Forest View Deluxe | Deluxe | ₹8,500 |
| 104 | Garden View Executive | Executive | ₹10,500 |
| 105 | Poolside Cabin | Cabin | ₹12,500 |
| 106 | Luxury Stag Suite | Premium Suite | ₹15,000 |
| 107 | Canopy Treehouse | Chalet | ₹18,000 |
| 108 | Family Heritage Villa | Family Villa | ₹22,000 |
| 109 | Vintage Royal Suite | Premium Suite | ₹26,000 |
| 110 | Presidential Penthouse | Penthouse | ₹38,000 |

### Function Halls

| Hall | Type | Capacity | Rate/Day |
|------|------|----------|---------|
| Grand Lawn & Pavilion | Open Function Hall | 1,000 guests | ₹75,000 |
| The Oak Room | Mini Function Hall | 150 guests | ₹25,000 |

---

## Notes

- All pricing and room details can be updated live from the **Admin Panel → Rooms & Halls** tab.
- All bookings are stored in the browser's `localStorage` and persist across page refreshes.
- If you need to reset all data, clear `localStorage` keys: `dk_rooms`, `dk_halls`, `dk_bookings`, `dk_room_states`.
