const SUPPORTED_ACTIONS = ["remove", "replace", "insert", "alter"];

async function parseYamlContent(yamlContent) {
  try {
    const data = jsyaml.load(yamlContent);
    console.log(data);

    if (!data || typeof data !== "object") {
      throw new Error("Geçersiz YAML formatı");
    }
    if (!data.actions || !Array.isArray(data.actions)) {
      throw new Error('YAML dosyasında "actions" array\'i bulunamadı');
    }
    if (data.actions.length === 0) {
      throw new Error("En az bir action tanımlanmalı");
    }
    //Her action kontrol edildi.
    for (let i = 0; i < data.actions.length; i++) {
      validateAction(data.actions[i], i + 1);
    }
    return {
      success: true,
      data: data,
      actionCount: data.actions.length,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

function validateAction(action, actionIndex) {
  if (!action || typeof action !== "object") {
    throw new Error(`${actionIndex}. action geçersiz format`);
  }
  if (!action.type || !SUPPORTED_ACTIONS.includes(action.type)) {
    throw new Error(
      `${actionIndex}. action: Geçersiz type "${
        action.type
      }". Desteklenen: ${SUPPORTED_ACTIONS.join(", ")}`
    );
  }
  if (!action.selector && action.type !== "insert") {
    throw new Error(`${actionIndex}. action: selector gerekli`);
  }
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    parseYamlContent,
    validateAction,
    SUPPORTED_ACTIONS,
  };
} else {
  window.VisionBridge = window.VisionBridge || {};
  window.VisionBridge.yamlParser = {
    parseYamlContent,
    validateAction,
    SUPPORTED_ACTIONS,
  };
}
