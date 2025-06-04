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

function replaceElement(selector, newElement) {
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
  tempDiv.innerHTML = newElement;
  const parsedElement = tempDiv.firstElementChild;
  console.log("Yeni element HTML:", newElement);
  console.log("Çevrilen element:", parsedElement);
  if (!parsedElement) {
    return {
      success: false,
      error: `Geçersiz HTML: ${newElement}`,
    };
  }
  element.replaceWith(parsedElement);
  return {
    success: true,
    message: `Element değiştirildi: ${selector}`,
  };
}

function insertElement(target, element, position = "append") {
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
  tempDiv.innerHTML = element;
  const parsedElement = tempDiv.firstElementChild;
  console.log("Insert - Yeni element HTML:", element);
  console.log("Insert - Çevrilen element:", parsedElement);
  if (!parsedElement) {
    return {
      success: false,
      error: `Geçersiz HTML: ${element}`,
    };
  }

  switch (position) {
    case "prepend":
      targetElement.prepend(parsedElement);
      break;
    case "append":
      targetElement.append(parsedElement);
      break;
    case "before":
      targetElement.before(parsedElement);
      break;
    case "after":
      targetElement.after(parsedElement);
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

function alterElement(oldValue, newValue) {
  console.log("🔍 Alter işlemi başlatıldı");
  console.log("Alter - Eski Değer:", oldValue);
  console.log("Alter - Yeni Değer:", newValue);

  if (!oldValue || !newValue) {
    return {
      success: false,
      error: "oldValue ve newValue boş olamaz",
    };
  }
  if (typeof oldValue !== "string" || typeof newValue !== "string") {
    return {
      success: false,
      error: "oldValue ve newValue string olmalı",
    };
  }
  console.log("✅ Parametreler geçerli");
  console.log("🔍 DOM'da metin taranıyor...");

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  const matchingNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.includes(oldValue)) {
      matchingNodes.push(node);
      console.log(`📝 Bulundu: "${node.textContent.trim()}"`);
    }
  }
  console.log(`📊 Toplam ${matchingNodes.length} yerde "${oldValue}" bulundu`);
  if (matchingNodes.length === 0) {
    return {
      success: false,
      error: `"${oldValue}" metni sayfada bulunamadı`,
    };
  }
  let changedCount = 0;

  matchingNodes.forEach((textNode, index) => {
    const originalText = textNode.textContent;

    // replaceAll: Tüm eşleşmeleri değiştir (replace sadece ilkini değiştirir)
    const newText = originalText.replaceAll(oldValue, newValue);

    // Gerçekten değişti mi kontrol et
    if (originalText !== newText) {
      textNode.textContent = newText;
      changedCount++;

      console.log(`🔄 ${index + 1}. değişim:`);
      console.log(`   Eski: "${originalText.trim()}"`);
      console.log(`   Yeni: "${newText.trim()}"`);
    }
  });
  console.log(`✅ Alter işlemi tamamlandı: ${changedCount} değişiklik yapıldı`);

  return {
    success: true,
    message: `${changedCount} yerde "${oldValue}" → "${newValue}" değiştirildi`,
    details: {
      searched: oldValue,
      replacement: newValue,
      nodesFound: matchingNodes.length,
      changesApplied: changedCount,
    },
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
