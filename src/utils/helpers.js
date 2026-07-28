// 1. Check Restaurant Status (Real-time Opening Hours)
export const getRestaurantStatus = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday

  // Assuming Cafe Bloom is open 10:00 AM to 11:00 PM
  const isOpen = hour >= 10 && hour < 23;
  
  if (day === 1) return { status: "Closed", color: "text-red-500", message: "Closed for Maintenance (Monday)" };
  return isOpen 
    ? { status: "Open Now", color: "text-green-500", message: "Visit us until 11:00 PM" }
    : { status: "Closed", color: "text-red-500", message: "Opens at 10:00 AM" };
};

// 2. Format Currency (INR for Cafe Bloom)
// NOTE: uses fraction digits, not significant digits — `maximumSignificantDigits: 3`
// silently rounded cart totals (a ₹12,345 total displayed as ₹12,300).
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
};

// 3. Dynamic "Today's Special" based on the day
export const getTodaysSpecial = () => {
  const specials = [
    { day: "Sunday", item: "Royal Truffle Pasta", discount: "20%" },
    { day: "Monday", item: "Artisan Brew Coffee", discount: "Buy 1 Get 1" },
    { day: "Tuesday", item: "Spicy Avocado Toast", discount: "15%" },
    { day: "Wednesday", item: "Signature Steak", discount: "10%" },
    { day: "Thursday", item: "Golden Glaze Donuts", discount: "Free with any Coffee" },
    { day: "Friday", item: "Seafood Platter", discount: "25%" },
    { day: "Saturday", item: "Cafe Bloom Grand Brunch", discount: "Fixed Price" },
  ];
  
  const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  return specials.find(s => s.day === currentDay);
};

// 4. Smooth Scroll Utility
// Delegates to Lenis. Native scrollIntoView({behavior:'smooth'}) does nothing
// useful while Lenis is running — Lenis sets scroll-behavior:auto and drives
// the scroll position itself.
export { scrollToElement as scrollToSection } from './smoothScroll';