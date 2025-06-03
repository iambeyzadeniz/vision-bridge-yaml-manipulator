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
