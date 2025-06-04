import {
  removeElement,
  replaceElement,
  insertElement,
  alterElement,
} from "./domManipulator.js";

function executeAction(action) {
  console.log("Çalıştırılacak action:", action);
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
      return replaceElement(action.selector, action.newElementHTML);
    case "insert":
      return insertElement(
        action.target,
        action.newElementHTML,
        action.position
      );
    case "alter":
      return alterElement(action.selector, action.property, action.value);

    default:
      return {
        success: false,
        error: `Desteklenmeyen action type: ${action.type}`,
      };
  }
}

function executeActions(actions) {
  console.log("Çalıştırılacak action listesi:", actions);
  if (!Array.isArray(actions)) {
    return {
      success: false,
      error: "Actions bir array olmalı",
      received: typeof actions,
    };
  }
  if (actions.length === 0) {
    return {
      success: true,
      message: "Çalıştırılacak action yok",
      total: 0,
    };
  }
  const results = [];
  let successCount = 0;
  let errorCount = 0;
  console.log(`Toplam ${actions.length} action çalıştırılacak`);

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    console.log(`\n--- Action ${i + 1}/${actions.length} ---`);
    console.log("İşlenen action:", action);
    const result = executeAction(action);
    console.log("Action sonucu:", result);
    results.push({
      index: i + 1,
      action: action,
      result: result,
    });

    if (result.success) {
      successCount++;
      console.log(`✅ Action ${i + 1} başarılı`);
    } else {
      errorCount++;
      console.log(`❌ Action ${i + 1} başarısız:`, result.error);
    }
  }
  console.log(`\n=== ÖZET RAPOR ===`);
  console.log(`Toplam: ${actions.length}`);
  console.log(`Başarılı: ${successCount}`);
  console.log(`Başarısız: ${errorCount}`);

  return {
    success: errorCount === 0,
    total: actions.length,
    successCount: successCount,
    errorCount: errorCount,
    summary: `${successCount}/${actions.length} action başarılı`,
    results: results,
  };
}
export { executeAction, executeActions };
