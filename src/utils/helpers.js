function formatTimestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
function validateSelector(selector) {
  try {
    document.querySelector(selector);
    return true;
  } catch (error) {
    return false;
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFileExtension(fileName) {
  return fileName.split(".").pop().toLowerCase();
}

// Metni kısaltmak (uzunsa ...)
function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    formatTimestamp,
    generateId,
    validateSelector,
    formatFileSize,
    escapeHtml,
    getFileExtension,
    truncateText,
  };
} else {
  window.VisionBridge = window.VisionBridge || {};
  window.VisionBridge.helpers = {
    formatTimestamp,
    generateId,
    validateSelector,
    formatFileSize,
    escapeHtml,
    getFileExtension,
    truncateText,
  };
}
export {
  formatTimestamp,
  generateId,
  validateSelector,
  formatFileSize,
  escapeHtml,
  getFileExtension,
  truncateText,
};
