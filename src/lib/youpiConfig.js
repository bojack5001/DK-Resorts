/**
 * YouPI Payment Gateway Configuration for DK STAR RESORTS
 * 
 * Configures the verified merchant identity, Canara Bank settlement account,
 * and UPI intent generators according to the YouPI-PG standard.
 */

export const YOUPI_CONFIG = {
  // Brand & Merchant Identity
  merchant: {
    id: import.meta.env.VITE_YOUPI_MERCHANT_ID || 'DK_STAR_RESORTS',
    name: 'D K STAR RESORTS',
    tagline: 'Royal Luxury Collection',
    code: 'DKSTAR01',
    // Verified Merchant UPI ID (Canara Bank VPA)
    upiId: '338553589802770@cnrb',
    
    // Official Canara Bank Settlement Account Details
    bankDetails: {
      accountHolder: 'D K STAR RESORTS',
      bankName: 'Canara Bank',
      accountNumber: '120039802770',
      ifscCode: 'CNRB0006806',
      micrCode: '632015014',
      customerId: '338553589',
      branch: 'Vellore Gandhi Nagar West',
      branchAddress: '92 First Floor, 6th Cross Road, Gandhi Nagar West, Vellore, Tamil Nadu - 632006',
      accountType: 'Current Account - General',
      swiftCode: 'CNRBINBBBFD',
      qrImage: '/canara-qr.jpg',
      phonepeQrImage: '/phonepe-qr.jpg',
    },

    // Support Contacts
    supportPhone: '+91 94894 55977',
    supportEmail: 'dkstarresorts@gmail.com',
    address: 'No 2 202, Ponniyamman Koil Street, Vanjur Kollaimedu VP Mahal Opp, Katpadi, Vellore - 632006, Tamil Nadu',
    gstin: '33AAXFDK1234H1Z5',
  },

  // Gateway Service Endpoints
  gateway: {
    apiUrl: import.meta.env.VITE_YOUPI_API_URL || 'http://localhost:6100',
    portalUrl: import.meta.env.VITE_YOUPI_PORTAL_URL || 'http://localhost:7000',
    currency: 'INR',
    sessionTimeoutSeconds: 300, // 5 minutes standard YouPI window
    version: '2.0.0-PROD',
  },

  // Supported Payment Methods
  modalities: [
    { id: 'UPI', label: 'UPI QR & Apps', description: 'Canara Bank UPI, Google Pay, PhonePe, Paytm, CRED, BHIM' },
    { id: 'CASH_COUNTER', label: 'Cash at Counter', description: 'Pay physical cash at resort reception desk' },
    { id: 'CARD_COUNTER', label: 'Card at POS', description: 'Tap or swipe Credit / Debit card at desk' },
    { id: 'BANK_TRANSFER', label: 'Direct Bank Wire', description: 'IMPS / NEFT / RTGS to Canara Bank Account' },
  ],
};

/**
 * Constructs a compliant standard NPCI UPI Payment URI string
 * Format: upi://pay?pa={upiId}&pn={name}&am={amount}&cu=INR&tn={transactionNote}
 */
export function buildUpiUri({ amount, orderId, note }) {
  const upiId = YOUPI_CONFIG.merchant.upiId;
  const name = encodeURIComponent(YOUPI_CONFIG.merchant.name);
  const formattedAmount = Number(amount || 0).toFixed(2);
  const transactionNote = encodeURIComponent(note || `DK Star Resorts Booking #${orderId || 'RESORT'}`);

  return `upi://pay?pa=${upiId}&pn=${name}&am=${formattedAmount}&cu=INR&tn=${transactionNote}`;
}

/**
 * Builds direct app-switch intent deep-links for installed UPI applications
 */
export function buildUpiIntentLinks({ amount, orderId, note }) {
  const upiId = YOUPI_CONFIG.merchant.upiId;
  const name = encodeURIComponent(YOUPI_CONFIG.merchant.name);
  const am = Number(amount || 0).toFixed(2);
  const tn = encodeURIComponent(note || `Booking #${orderId || 'DKS'}`);
  const baseParams = `pa=${upiId}&pn=${name}&am=${am}&cu=INR&tn=${tn}`;

  return {
    universal: `upi://pay?${baseParams}`,
    gpay: `gpay://upi/pay?${baseParams}`,
    phonepe: `phonepe://pay?${baseParams}`,
    paytm: `paytmmp://pay?${baseParams}`,
    cred: `credpay://upi/pay?${baseParams}`,
    bhim: `bhim://pay?${baseParams}`,
  };
}

/**
 * Validates 12-digit Indian Bank UPI UTR / Transaction Reference Number
 */
export function validateUtr(utr) {
  if (!utr) return false;
  const cleaned = String(utr).trim();
  // Standard UTR is exactly 12 numeric digits
  return /^\d{12}$/.test(cleaned);
}

/**
 * Generates an internal unique YouPI Order Reference ID
 */
export function generateYoupiOrderId(prefix = 'DKS') {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}

/**
 * Currency Formatter
 */
export function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}
