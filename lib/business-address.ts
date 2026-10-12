export const businessAddress = {
  street: "Shop No 1, 1st Floor, 10/1, 10th Cross, LR Bande C L Ramaiah Layout, RT Nagar Post",
  city: "Bengaluru",
  region: "Karnataka",
  postalCode: "560032",
  country: "IN",
  full: "Shop No 1, 1st Floor, 10/1, 10th Cross, LR Bande C L Ramaiah Layout, RT Nagar Post, Bengaluru, Karnataka 560032",
};

export const businessPostalAddress = {
  "@type": "PostalAddress",
  streetAddress: businessAddress.street,
  addressLocality: businessAddress.city,
  addressRegion: businessAddress.region,
  postalCode: businessAddress.postalCode,
  addressCountry: businessAddress.country,
};
