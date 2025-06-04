import { parseYamlContent } from "./core/yamlParser.js";
import { executeActions } from "./core/actionHandler.js";
import { createLogger } from "./ui/logger.js";
let logger;
let currentHtml = "";
let yamlConfigs = [];

function initializeApp() {
  logger = createLogger("logArea");
  logger.success("🌉 Vision Bridge başlatılıyor...");
  setupEventListeners();

  logger.success("✅ Sistem hazır!");
}

function setupEventListeners() {
  //html dosyasını yükleme butonu
  const htmlFileInput = document.getElementById("htmlFile");
  if (htmlFileInput) {
    htmlFileInput.addEventListener("change", handleHtmlUpload);
  }

  const applyButton = document.getElementById("applyYamlConfigs");
  if (applyButton) {
    applyButton.addEventListener("click", applyYamlConfigurations);
  }
  const yamlFilesInput = document.getElementById("yamlFiles");
  if (yamlFilesInput) {
    yamlFilesInput.addEventListener("change", handleYamlUpload);
  }

  const loadSampleHTMLBtn = document.getElementById("loadSampleHtml");
  if (loadSampleHTMLBtn) {
    loadSampleHTMLBtn.addEventListener("click", handleLoadSampleHtml);
  }
  const addSampleYamlBtn = document.getElementById("addSampleYaml");
  if (addSampleYamlBtn) {
    addSampleYamlBtn.addEventListener("click", handleAddSampleYaml);
  }
  const clearYamlsBtn = document.getElementById("clearYamls");
  if (clearYamlsBtn) {
    clearYamlsBtn.addEventListener("click", handleClearYamls);
  }
  const clearLogsBtn = document.getElementById("clearLogs");
  if (clearLogsBtn) {
    clearLogsBtn.addEventListener("click", handleClearLogs);
  }
}
