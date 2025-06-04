import {
  removeElement,
  replaceElement,
  insertElement,
  alterElement,
} from "./domManipulator.js";

function executeAction(action) {
  const validTypes = ["remove", "replace", "insert", "alter"];
  if (!validTypes.includes(action.type)) {
    return {
      success: false,
      error: `Geçersiz action type: ${action.type}`,
    };
  }

  switch (action.type) {
    case "remove":
      return removeElement(action.selector);
    case "replace":
      return replaceElement(action.selector, action.newElement);
    case "insert":
      return insertElement(action.target, action.element, action.position);
    case "alter":
      return alterElement(action.oldValue, action.newValue);

    default:
      return {
        success: false,
        error: `Desteklenmeyen action type: ${action.type}`,
      };
  }
}

function executeActions(htmlContent, actions) {
  if (!htmlContent || typeof htmlContent !== "string") {
    return {
      success: false,
      error: "HTML içeriği gerekli",
      html: htmlContent,
    };
  }

  if (!Array.isArray(actions)) {
    return {
      success: false,
      error: "Actions bir array olmalı",
      received: typeof actions,
      html: htmlContent,
    };
  }

  if (actions.length === 0) {
    return {
      success: true,
      message: "Çalıştırılacak action yok",
      total: 0,
      html: htmlContent,
      appliedCount: 0,
    };
  }

  const iframe = document.getElementById("htmlPreview");
  if (!iframe) {
    return {
      success: false,
      error: "htmlPreview iframe'i bulunamadı",
      html: htmlContent,
    };
  }

  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();
  } catch (error) {
    return {
      success: false,
      error: `iframe'e HTML yüklenirken hata: ${error.message}`,
      html: htmlContent,
    };
  }

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    const result = executeAction(action);

    results.push({
      index: i + 1,
      action: action,
      result: result,
    });

    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  let modifiedHtml = htmlContent;
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    modifiedHtml = doc.documentElement.outerHTML;
  } catch (error) {
    console.error("❌ iframe'den HTML alınırken hata:", error);
  }

  return {
    success: errorCount === 0,
    html: modifiedHtml,
    total: actions.length,
    appliedCount: successCount,
    successCount: successCount,
    errorCount: errorCount,
    summary: `${successCount}/${actions.length} action başarılı`,
    results: results,
  };
}

export { executeAction, executeActions };
