import { parseYaml } from "./core/yamlParser.js";
import { executeActions } from "./core/domManipulator.js";
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

  const applyButton = document.getElementById;
}
