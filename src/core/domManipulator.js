function removeElement(selector) {
  const element = document.querySelector(selector);
  console.log("Aranan element:", selector);
  console.log("Bulunan element:", element);
  if (!element) {
    return {
      success: false,
      error: `Element bulunamadı: ${selector}`,
    };
  }
  element.remove();
  return {
    success: true,
    message: `Element silindi: ${selector}`,
  };
}

function replaceElement(selector, newElementHTML) {
  const element = document.querySelector(selector);
  console.log("Replace - Aranan element:", selector);
  console.log("Replace - Bulunan element:", element);
  if (!element) {
    return {
      success: false,
      error: `Element bulunamadı: ${selector}`,
    };
  }
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newElementHTML;
  const newElement = tempDiv.firstElementChild;
  console.log("Yeni element HTML:", newElementHTML);
  console.log("Çevrilen element:", newElement);
  if (!newElement) {
    return {
      success: false,
      error: `Geçersiz HTML: ${newElementHTML}`,
    };
  }
  element.replaceWith(newElement);
  return {
    success: true,
    message: `Element değiştirildi: ${selector}`,
  };
}

function insertElement(target, newElementHTML, position = "append") {
  const targetElement = document.querySelector(target);
  console.log("Insert - Target element:", target);
  console.log("Insert - Bulunan target:", targetElement);
  if (!targetElement) {
    return {
      success: false,
      error: `Target element bulunamadı: ${target}`,
    };
  }
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newElementHTML;
  const newElement = tempDiv.firstElementChild;
  console.log("Insert - Yeni element HTML:", newElementHTML);
  console.log("Insert - Çevrilen element:", newElement);
  if (!newElement) {
    return {
      success: false,
      error: `Geçersiz HTML: ${newElementHTML}`,
    };
  }

  switch (position) {
    case "prepend":
      targetElement.prepend(newElement);
      break;
    case "append":
      targetElement.append(newElement);
      break;
    case "before":
      targetElement.before(newElement);
      break;
    case "after":
      targetElement.after(newElement);
      break;
    default:
      return {
        success: false,
        error: `Geçersiz position: ${position}. Kullanılabilir: prepend, append, before, after`,
      };
  }
  return {
    success: true,
    message: `Element eklendi (${position}): ${target}`,
  };
}

function alterElement(selector, property, value) {
  const element = document.querySelector(selector);
  console.log("Alter - Aranan element:", selector);
  console.log("Alter - Bulunan element:", element);
  if (!element) {
    return {
      success: false,
      error: `Element bulunamadı: ${selector}`,
    };
  }
  try {
    if (property.includes(".")) {
      const [obj, prop] = property.split(".");
      element[obj][prop] = value;
    } else {
      element[property] = value;
    }
  } catch (error) {
    return {
      success: false,
      error: `Özellik değiştirilemedi: ${property} - ${error.message}`,
    };
  }

  return {
    success: true,
    message: `Element özelliği değiştirildi: ${selector}.${property} = ${value}`,
  };
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    removeElement,
    replaceElement,
    insertElement,
    alterElement,
  };
}
