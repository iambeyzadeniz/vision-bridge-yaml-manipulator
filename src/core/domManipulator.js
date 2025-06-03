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
