import { escapeHtml, formatTimestamp, generateId } from "../utils/helpers.js";

function createLogger(containerId = "logArea") {
  const container = document.getElementById(containerId);
  const logs = [];
  const logTypes = {
    info: { color: "#00ff00", icon: "ℹ️" },
    success: { color: "#00ff00", icon: "✅" },
    warning: { color: "#ffff00", icon: "⚠️" },
    error: { color: "#ff0000", icon: "❌" },
  };
  function log(message, type = "info") {
    if (!logTypes[type]) {
      type = "info";
    }
    const timestamp = formatTimestamp();
    const logEntry = {
      timestamp,
      message,
      type,
      id: generateId(),
    };
    logs.push(logEntry);
    if (container) {
      displayLog(logEntry);
      scrollToBottom();
    }
  }
  function displayLog(logEntry) {
    const logElement = document.createElement("div");
    logElement.className = "log-entry";
    logElement.id = logEntry.id;

    const typeInfo = logTypes[logEntry.type];
    logElement.style.color = typeInfo.color;
    logElement.style.fontFamily = "monospace";
    logElement.style.fontSize = "14px";
    logElement.style.padding = "2px 0";

    logElement.innerHTML = `[${logEntry.timestamp}] ${
      typeInfo.icon
    } ${escapeHtml(logEntry.message)}`;

    container.appendChild(logElement);
  }
  function scrollToBottom() {
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
  function info(message) {
    log(message, "info");
  }
  function success(message) {
    log(message, "success");
  }
  function warning(message) {
    log(message, "warning");
  }
  function error(message) {
    log(message, "error");
  }

  function clear() {
    logs.length = 0;
    if (container) {
      container.innerHTML = "";
    }
  }

  return {
    log,
    info,
    success,
    warning,
    error,
    clear,
    getLogs: () => [...logs],
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { createLogger };
  } else {
    window.VisionBridge = window.VisionBridge || {};
    window.VisionBridge.createLogger = createLogger;
  }
}
export { createLogger };
