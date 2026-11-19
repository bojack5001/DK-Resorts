/**
 * YouPI Payment Gateway Configuration for DK STAR RESORTS
 * 
 * Configures the merchant identity, banking settlement endpoints,
 * and UPI intent generators according to the YouPI-PG standard.
 * 
 * Note: When the user provides official bank details and UPI ID,
 * they can be easily plugged in below or configured via .env variables:
 * - VITE_YOUPI_MERCHANT_UPI
 * - VITE_YOUPI_PAYEE_NAME
 * - VITE_YOUPI_BANK_NAME
 * - VITE_YOUPI_BANK_ACCOUNT
 * - VITE_YOUPI_BANK_IFSC
 */

export const YOUPI_CONFIG = {
  // Brand & Merchant Identity
  merchant: {
    id: import.meta.env.VITE_YOUPI_MERCHANT_ID || 'DK_STAR_RESORTS',
    name: import.meta.env.VITE_YOUPI_PAYEE_NAME || 'DK STAR RESORTS',
    tagline: 'Royal Luxury Collection',
    code: 'DKSTAR01',
    // Merchant UPI Receiving Address (Default placeholder; will update with user details)
    upiId: import.meta.env.VITE_YOUPI_MERCHANT_UPI || 'dkstarresorts@upi',
    
    // Bank Account Settlement Details (Awaiting user's input)
    bankDetails: {
      accountHolder: import.meta.env.VITE_YOUPI_BANK_HOLDER || 'DK STAR RESORTS',
      bankName: import.meta.env.VITE_YOUPI_BANK_NAME || 'Pending Bank Details',
      accountNumber: import.meta.env.VITE_YOUPI_BANK_ACCOUNT || 'Pending Account Number',
      ifscCode: import.meta.env.VITE_YOUPI_BANK_IFSC || 'Pending IFSC Code',
      branch: import.meta.env.VITE_YOUPI_BANK_BRANCH || 'Vellore Main Branch',
      accountType: 'Current Account',
    },

    // Support Contacts
    supportPhone: '+91 94894 55977',
    supportEmail: 'dkstarresorts@gmail.com',
    address: 'No 202/2, PONNIYAMMAN Kovil St, Vanjur, Vellore - 632006, Tamil Nadu',
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
    { id: 'UPI', label: 'UPI QR & Apps', description: 'Google Pay, PhonePe, Paytm, CRED, BHIM' },
    { id: 'CASH_COUNTER', label: 'Cash at Counter', description: 'Pay physical cash at resort reception desk' },
    { id: 'CARD_COUNTER', label: 'Card at POS', description: 'Tap or swipe Credit / Debit card at desk' },
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
