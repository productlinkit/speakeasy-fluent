// BOOST plans and features, as listed on speakeasy-cro / speakeasy.mobi (IDR).

export const PLANS = [
  { id: "annual", label: "Annual", months: 12, price: 159000, badge: "Best value" },
  { id: "sixMonth", label: "6-Month", months: 6, price: 105000, badge: null },
  { id: "monthly", label: "Monthly", months: 1, price: 25000, badge: null },
];

export const FEATURES = [
  "Your full speaking report, unlocked",
  "No limits on AI Tutor (chat and video call)",
  "Review your mistakes",
  "Ad-free experience",
  "Exclusive badge in the community forum",
];

export const PROMO = { code: "NEWUSER50", percent: 50 };

export function formatIDR(amount) {
  return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

export function discounted(price, promo) {
  return promo ? Math.round(price * (1 - promo.percent / 100)) : price;
}
