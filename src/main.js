import { parseYamlContent } from "./core/yamlParser.js";
import { executeActions } from "./core/actionHandler.js";
import { createLogger } from "./ui/logger.js";
import { formatFileSize, getFileExtension } from "./utils/helpers.js";
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

function handleHtmlUpload(event) {
  logger.info("📁 HTML dosyası yükleniyor...");
  const file = event.target.files[0];
  if (!file) {
    logger.error("❌ Dosya seçilmedi");
    return;
  }
  const fileExtension = getFileExtension(file.name);
  if (fileExtension !== "html" && fileExtension !== "htm") {
    logger.error("❌ Lütfen .html veya .htm dosyası seçin");
    event.target.value = ""; // Input'u temizle
    return;
  }
  logger.info(`📄 Dosya: ${file.name} (${formatFileSize(file.size)})`);
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      currentHtml = e.target.result; // HTML içeriğini global değişkene kaydet

      logger.success(`✅ HTML dosyası yüklendi: ${file.name}`);
      logger.info(`📊 İçerik uzunluğu: ${currentHtml.length} karakter`);

      displayHtmlInEditor(currentHtml);
    } catch (error) {
      logger.error(`❌ HTML dosyası işlenirken hata: ${error.message}`);
    }
  };
  reader.onerror = function () {
    logger.error("❌ Dosya okuma hatası");
  };

  reader.readAsText(file);
}
function displayHtmlInEditor(htmlContent) {
  const htmlEditor = document.getElementById("htmlEditor");

  if (!htmlEditor) {
    logger.warning("⚠️ HTML editor alanı bulunamadı");
    return;
  }

  htmlEditor.value = htmlContent;
  logger.success("📝 HTML kodu editörde gösterildi");
}
function applyYamlConfigurations() {
  logger.info("🚀 YAML konfigürasyonları uygulanıyor...");
  if (!currentHtml || currentHtml.trim() === "") {
    logger.error("❌ Önce bir HTML dosyası yükleyin!");
    return;
  }
  if (!yamlConfigs || yamlConfigs.length === 0) {
    logger.error("❌ Hiç YAML konfigürasyonu yok! Önce YAML dosyası yükleyin.");
    return;
  }
  logger.info(`📊 ${yamlConfigs.length} YAML konfigürasyonu bulundu`);
  logger.info(`📄 HTML içerik uzunluğu: ${currentHtml.length} karakter`);
  logger.info("🔄 YAML'lar parse ediliyor...");
  const parsedConfigs = [];
  for (let i = 0; i < yamlConfigs.length; i++) {
    const yamlContent = yamlConfigs[i];

    try {
      logger.info(`📋 YAML ${i + 1} parse ediliyor...`);
      const parsedConfig = parseYamlContent(yamlContent);

      if (parsedConfig && parsedConfig.actions) {
        parsedConfigs.push(parsedConfig);
        logger.success(
          `✅ YAML ${i + 1} başarıyla parse edildi (${
            parsedConfig.actions.length
          } aksiyon)`
        );
      } else {
        logger.warning(`⚠️ YAML ${i + 1} geçersiz format - atlandı`);
      }
    } catch (error) {
      logger.error(`❌ YAML ${i + 1} parse hatası: ${error.message}`);
    }
  }
  if (parsedConfigs.length === 0) {
    logger.error("❌ Hiç geçerli YAML konfigürasyonu bulunamadı!");
    return;
  }
  logger.success(`🎯 ${parsedConfigs.length} YAML başarıyla parse edildi`);
  let modifiedHtml = currentHtml;
  let totalActionsApplied = 0;
  for (let i = 0; i < parsedConfigs.length; i++) {
    const config = parsedConfigs[i];

    try {
      logger.info(`📋 "${config.name}" konfigürasyonu uygulanıyor...`);

      const result = executeActions(modifiedHtml, config.actions);

      if (result.success) {
        modifiedHtml = result.html;
        totalActionsApplied += result.appliedCount;
        logger.success(
          `✅ "${config.name}" başarıyla uygulandı (${result.appliedCount} aksiyon)`
        );
      } else {
        logger.error(`❌ "${config.name}" uygulanırken hata: ${result.error}`);
      }
    } catch (error) {
      logger.error(`❌ "${config.name}" beklenmeyen hata: ${error.message}`);
    }
  }
  if (totalActionsApplied === 0) {
    logger.warning("⚠️ Hiçbir aksiyon uygulanamadı!");
    logger.info("💡 Selector'ların HTML'de mevcut olduğunu kontrol edin");
    return;
  }
  logger.success(`🎉 YAML konfigürasyonları başarıyla uygulandı!`);
  logger.info(`📊 Toplam ${totalActionsApplied} aksiyon uygulandı`);
  logger.info(
    `📄 HTML içerik uzunluğu: ${currentHtml.length} → ${modifiedHtml.length} karakter`
  );
  currentHtml = modifiedHtml;
  displayHtmlInEditor(currentHtml);
  logger.success("✅ İşlem tamamlandı! HTML editörde güncellendi.");
}
function handleYamlUpload(event) {
  logger.info("📋 YAML dosyaları yükleniyor...");
  const files = event.target.files;
  if (!files || files.length === 0) {
    logger.error("❌ Hiç dosya seçilmedi");
    return;
  }

  logger.info(`📁 ${files.length} dosya seçildi`);

  const validFiles = [];
  const invalidFiles = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExtension = getFileExtension(file.name);

    if (fileExtension === "yaml" || fileExtension === "yml") {
      validFiles.push(file);
      logger.info(
        `✅ ${file.name} (${formatFileSize(file.size)}) - Geçerli YAML`
      );
    } else {
      invalidFiles.push(file);
      logger.warning(`⚠️ ${file.name} - Geçersiz format (${fileExtension})`);
    }
  }
  if (validFiles.length === 0) {
    logger.error(
      "❌ Hiç geçerli YAML dosyası bulunamadı (.yaml veya .yml uzantılı olmalı)"
    );
    event.target.value = "";
    return;
  }
  if (invalidFiles.length > 0) {
    logger.warning(`⚠️ ${invalidFiles.length} geçersiz dosya atlandı`);
  }
  logger.success(`🎯 ${validFiles.length} geçerli YAML dosyası bulundu`);
  logger.info("📖 YAML dosyaları okunuyor...");
  let filesRead = 0;
  const newYamlConfigs = [];
  validFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const yamlContent = e.target.result;
        newYamlConfigs.push(yamlContent);
        filesRead++;
        logger.success(
          `📄 ${file.name} okundu (${yamlContent.length} karakter)`
        );
        if (filesRead === validFiles.length) {
          // Hepsi okundu
          finishYamlUpload(newYamlConfigs);
        }
      } catch (error) {
        logger.error(`❌ ${file.name} işlenirken hata: ${error.message}`);
        filesRead++;
        if (filesRead === validFiles.length) {
          finishYamlUpload(newYamlConfigs);
        }
      }
    };
    reader.onerror = function () {
      logger.error(`❌ ${file.name} okuma hatası`);
      filesRead++;

      if (filesRead === validFiles.length) {
        finishYamlUpload(newYamlConfigs);
      }
    };
    reader.readAsText(file);
  });
}
function finishYamlUpload(newYamlConfigs) {
  logger.info("🔄 YAML yükleme işlemi tamamlanıyor...");
  if (newYamlConfigs.length === 0) {
    logger.error("❌ Hiçbir YAML dosyası başarıyla okunamadı!");
    return;
  }
  yamlConfigs.push(...newYamlConfigs);
  logger.success(
    `✅ ${newYamlConfigs.length} YAML dosyası başarıyla yüklendi!`
  );
  logger.info(`📊 Toplam YAML sayısı: ${yamlConfigs.length}`);

  logger.success("🎉 YAML dosyaları hazır! Artık HTML'e uygulayabilirsiniz.");
}
