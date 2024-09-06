// This file is the equivalent of functions.php in WordPress.
// It's where you can define utility functions that can be used throughout your app.

const formatPrice = (price: number) => {
  // Format the price as a currency string
  price = price / 100; // Convert cents to dollars
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(price);
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString();
};

const darkenColor = (hex: string, percent: number = 10): string => {
  // Remove the # if it exists
  hex = hex.replace(/^#/, "");

  // Parse the hex string into RGB values
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  // Calculate the amount to darken
  const darkenAmount = 1 - percent / 100;

  // Darken each channel
  r = Math.floor(r * darkenAmount);
  g = Math.floor(g * darkenAmount);
  b = Math.floor(b * darkenAmount);

  // Ensure the values don't go below 0
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);

  // Convert back to hex
  const darkenedHex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");

  return `#${darkenedHex}`;
};

export { formatPrice, formatDate, darkenColor };
