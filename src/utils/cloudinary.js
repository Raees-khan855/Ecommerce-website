/**
 * Optimizes Cloudinary image URL
 * @param {string} url - original Cloudinary URL
 * @param {number} width - desired width (optional)
 * @returns {string} optimized URL
 */
export function optimizeCloudinary(url, width = 500) {
  if (!url) return "";

  // Only modify Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
