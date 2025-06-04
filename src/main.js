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

  const resetHtmlButton = document.getElementById("resetHtml");
  if (resetHtmlButton) {
    resetHtmlButton.addEventListener("click", handleResetHtml);
    logger.info("✅ Reset HTML listener bağlandı");
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
  const refreshPreviewBtn = document.getElementById("refreshPreview");
  if (refreshPreviewBtn) {
    refreshPreviewBtn.addEventListener("click", handleRefreshPreview);
    logger.info("✅ Refresh Preview listener bağlandı");
  }

  const openInNewTabBtn = document.getElementById("openInNewTab");
  if (openInNewTabBtn) {
    openInNewTabBtn.addEventListener("click", handleOpenInNewTab);
    logger.info("✅ Open In New Tab listener bağlandı");
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
    event.target.value = "";
    return;
  }
  logger.info(`📄 Dosya: ${file.name} (${formatFileSize(file.size)})`);
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      currentHtml = e.target.result;

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
  displayHtmlPreview(htmlContent);
}
function displayHtmlPreview(htmlContent) {
  const iframe = document.getElementById("htmlPreview");

  if (!iframe) {
    logger.warning("⚠️ HTML preview iframe'i bulunamadı");
    return;
  }

  if (!htmlContent || htmlContent.trim() === "") {
    logger.warning("⚠️ Preview için HTML içeriği boş");
    return;
  }

  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    logger.success("👁️ HTML önizlemesi güncellendi");
  } catch (error) {
    logger.error(`❌ Preview güncellenirken hata: ${error.message}`);
  }
}
function handleRefreshPreview() {
  debugger;
  logger.info("🔄 HTML önizlemesi yenileniyor...");

  if (!currentHtml || currentHtml.trim() === "") {
    logger.warning("⚠️ Gösterilecek HTML yok! Önce HTML yükleyin.");
    return;
  }

  displayHtmlPreview(currentHtml);
}

function handleOpenInNewTab() {
  logger.info("🔗 HTML yeni sekmede açılıyor...");

  if (!currentHtml || currentHtml.trim() === "") {
    logger.warning("⚠️ Açılacak HTML yok! Önce HTML yükleyin.");
    return;
  }

  try {
    const blob = new Blob([currentHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    logger.success("✅ HTML yeni sekmede açıldı");

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    logger.error(`❌ HTML açılırken hata: ${error.message}`);
  }
}
async function applyYamlConfigurations() {
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
      const parsedConfig = await parseYamlContent(yamlContent);

      if (parsedConfig && parsedConfig.data.actions) {
        parsedConfigs.push(parsedConfig);
        logger.success(
          `✅ YAML ${i + 1} başarıyla parse edildi (${
            parsedConfig.data.actions.length
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
      logger.info(`📋 "${config.data.name}" konfigürasyonu uygulanıyor...`);

      const result = executeActions(modifiedHtml, config.data.actions);

      if (result.success) {
        modifiedHtml = result.html;
        totalActionsApplied += result.appliedCount;
        logger.success(
          `✅ "${config.data.name}" başarıyla uygulandı (${result.appliedCount} aksiyon)`
        );
      } else {
        const errorDetails = generateErrorReport(result);

        logger.error(
          `❌ "${config.data.name}" kısmi başarı: ${result.summary}`
        );
        logger.warning(
          `📊 Başarılı: ${result.successCount}, Başarısız: ${result.errorCount}`
        );

        if (result.results && result.results.length > 0) {
          result.results.forEach((actionResult) => {
            if (!actionResult.result.success) {
              const action = actionResult.action;
              const actionDesc = getActionDescription(action);
              logger.error(`   💥 Action ${actionResult.index}: ${actionDesc}`);
              logger.error(`      ➤ Hata: ${actionResult.result.error}`);
            }
          });
        }

        if (result.successCount > 0) {
          logger.info(
            `💡 ${result.successCount} aksiyon başarıyla uygulandı, HTML güncellendi`
          );
          modifiedHtml = result.html;
          totalActionsApplied += result.appliedCount;
        }
      }
    } catch (error) {
      logger.error(
        `❌ "${config.data.name}" beklenmeyen hata: ${error.message}`
      );
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

  displayHtmlInEditor(modifiedHtml);
  logger.success("✅ İşlem tamamlandı! HTML editörde güncellendi.");
}
function getActionDescription(action) {
  switch (action.type) {
    case "remove":
      return `Element sil: "${action.selector}"`;
    case "replace":
      return `Element değiştir: "${action.selector}"`;
    case "insert":
      return `Element ekle: "${action.target}" (${action.position})`;
    case "alter":
      return `Metin değiştir: "${action.oldValue}" → "${action.newValue}"`;
    case "style":
      return `Stil uygula: "${action.selector}" (${action.property}: ${action.value})`;
    case "content":
      return `İçerik değiştir: "${action.selector}"`;
    case "attribute":
      return `Attribute değiştir: "${action.selector}" (${action.attribute})`;
    default:
      return `${action.type} işlemi`;
  }
}

function generateErrorReport(result) {
  const errors = result.results
    .filter((r) => !r.result.success)
    .map((r) => ({
      action: r.index,
      type: r.action.type,
      error: r.result.error,
    }));

  return {
    totalErrors: errors.length,
    errorTypes: [...new Set(errors.map((e) => e.type))],
    errors: errors,
  };
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
  updateYamlFilesList();
  const yamlEditor = document.getElementById("yamlEditor");
  if (yamlEditor && newYamlConfigs.length > 0) {
    if (newYamlConfigs.length === 1) {
      yamlEditor.value = newYamlConfigs[0];
      logger.info("📝 YAML editörde gösterildi");
    } else {
      const combinedYaml = newYamlConfigs.join("\n\n---\n\n");
      yamlEditor.value = combinedYaml;
      logger.info(
        `📝 ${newYamlConfigs.length} YAML birleştirilip editörde gösterildi`
      );
    }
  }

  logger.success(
    `✅ ${newYamlConfigs.length} YAML dosyası başarıyla yüklendi!`
  );
  logger.info(`📊 Toplam YAML sayısı: ${yamlConfigs.length}`);

  logger.success("🎉 YAML dosyaları hazır! Artık HTML'e uygulayabilirsiniz.");
}
function updateYamlFilesList() {
  const yamlFilesList = document.getElementById("yamlFilesList");

  if (!yamlFilesList) {
    logger.warning("⚠️ yamlFilesList elementi bulunamadı");
    return;
  }

  if (!yamlConfigs || yamlConfigs.length === 0) {
    yamlFilesList.innerHTML = "Henüz YAML dosyası eklenmedi";
    yamlFilesList.style.color = "#666";
    return;
  }

  let html = `<div style="margin: 10px 0;">
      <strong>📋 Yüklü YAML Dosyaları (${yamlConfigs.length})</strong>
    </div>`;

  yamlConfigs.forEach((yamlContent, index) => {
    let yamlName = `YAML ${index + 1}`;
    try {
      const data = jsyaml.load(yamlContent);
      if (data && data.name) {
        yamlName = data.name;
      }
    } catch (error) {}

    const yamlPreview =
      yamlContent.substring(0, 50) + (yamlContent.length > 50 ? "..." : "");

    html += `
        <div style="border: 1px solid #ddd; margin: 5px 0; padding: 8px; border-radius: 4px; background: #f9f9f9;">
          <div style="font-weight: bold; color: #333;">📄 ${yamlName}</div>
          <div style="font-size: 12px; color: #666; font-family: monospace;">${yamlPreview}</div>
          <div style="font-size: 11px; color: #999;">${yamlContent.length} karakter</div>
        </div>
      `;
  });

  yamlFilesList.innerHTML = html;
  yamlFilesList.style.color = "#333";
}
function handleClearLogs() {
  logger.info("🧹 Loglar temizleniyor...");
  logger.clear();
  logger.success("✅ Tüm loglar temizlendi!");
}
function handleClearYamls() {
  logger.info("🗑️ YAML konfigürasyonları temizleniyor...");
  yamlConfigs = [];
  const yamlFilesInput = document.getElementById("yamlFiles");
  if (yamlFilesInput) {
    yamlFilesInput.value = "";
  }
  const yamlEditor = document.getElementById("yamlEditor");
  if (yamlEditor) {
    yamlEditor.value = "";
  }

  updateYamlFilesList();

  logger.success(
    `✅ Tüm YAML konfigürasyonları temizlendi! (${yamlConfigs.length} dosya kaldı)`
  );
  logger.info("💡 Artık yeni YAML dosyaları yükleyebilirsiniz");
}
function handleResetHtml() {
  logger.info("🔄 HTML resetleniyor...");

  currentHtml = "";

  const htmlEditor = document.getElementById("htmlEditor");
  if (htmlEditor) {
    htmlEditor.value = "";
  }

  const htmlFileInput = document.getElementById("htmlFile");
  if (htmlFileInput) {
    htmlFileInput.value = "";
  }

  const htmlPreview = document.getElementById("htmlPreview");
  if (htmlPreview) {
    const doc =
      htmlPreview.contentDocument || htmlPreview.contentWindow.document;
    doc.open();
    doc.write("");
    doc.close();
    logger.info("🧹 HTML önizlemesi temizlendi");
  }

  logger.success("✅ HTML başarıyla resetlendi!");
  logger.info(
    "💡 Artık yeni HTML dosyası yükleyebilir veya örnek HTML yükleyebilirsiniz"
  );
}

function handleLoadSampleHtml() {
  logger.info("📄 Örnek HTML yükleniyor...");
  const sampleHtml = `<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vision Bridge Test Sayfası</title>
    <style>
      .ad-banner {
        background: red;
        padding: 10px;
        color: white;
        text-align: center;
      }
      #header {
        background: lightblue;
        padding: 20px;
      }
      main {
        padding: 20px;
        background: lightgray;
      }
    </style>
  </head>
  <body>
    <div class="ad-banner">🎯 Bu reklam banner'ı KALDIRILACAK!</div>

    <div id="header">
      <h1>Eski Başlık</h1>
      <p>Bu başlık değiştirilecek</p>
    </div>

    <main>
      <h2>Ana İçerik</h2>
      <p>Machine Learning teknolojisi harika!</p>
      <p>Machine Learning ile çok şey yapabilirsiniz.</p>
    </main>
  </body>
</html>
`;
  currentHtml = sampleHtml;
  displayHtmlInEditor(sampleHtml);

  logger.success("✅ Örnek HTML başarıyla yüklendi!");
  logger.info(`📊 HTML uzunluğu: ${sampleHtml.length} karakter`);
  logger.info(
    "💡 Artık 'Örnek YAML Ekle' butonuna tıklayarak test edebilirsiniz!"
  );
}

function handleAddSampleYaml() {
  logger.info("📋 Örnek YAML konfigürasyonu ekleniyor...");

  const sampleYaml = `
  name: "Test Konfigürasyonu"
  description: "HTML manipülasyon testi"
  actions:
    - type: remove
      selector: ".ad-banner"
  
    - type: replace
      selector: "#header h1"
      newElement: "<h1>🌟 Yeni Başlık</h1>"
  
    - type: insert
      position: "after"
      target: "main"
      element: "<footer>Vision Bridge ile oluşturuldu</footer>"
  
    - type: alter
      oldValue: "Machine Learning"
      newValue: "Yapay Zeka"
      `;

  yamlConfigs.push(sampleYaml);

  updateYamlFilesList();

  document.getElementById("yamlEditor").value = sampleYaml;

  logger.success("✅ Örnek YAML eklendi!");
  logger.info(`📊 Toplam YAML sayısı: ${yamlConfigs.length}`);
}

export { initializeApp };
