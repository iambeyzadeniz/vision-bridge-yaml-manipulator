function getIframeDocument() {
  const iframe = document.getElementById("htmlPreview");
  if (!iframe) {
    console.error("❌ htmlPreview iframe'i bulunamadı");
    return null;
  }

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  if (!iframeDoc) {
    console.error("❌ iframe document'ine erişilemiyor");
    return null;
  }

  return iframeDoc;
}

function removeElement(selector) {
  const iframeDoc = getIframeDocument();
  if (!iframeDoc) {
    return {
      success: false,
      error: "iframe document'ine erişilemiyor",
    };
  }
  const element = iframeDoc.querySelector(selector);
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
  const iframeDoc = getIframeDocument();
  if (!iframeDoc) {
    return {
      success: false,
      error: "iframe document'ine erişilemiyor",
    };
  }
  const element = iframeDoc.querySelector(selector);
  if (!element) {
    return {
      success: false,
      error: `Element bulunamadı: ${selector}`,
    };
  }
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newElement;
  const parsedElement = tempDiv.firstElementChild;
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
  const iframeDoc = getIframeDocument();
  if (!iframeDoc) {
    return {
      success: false,
      error: "iframe document'ine erişilemiyor",
    };
  }
  const targetElement = iframeDoc.querySelector(target);
  if (!targetElement) {
    return {
      success: false,
      error: `Target element bulunamadı: ${target}`,
    };
  }
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = element;
  const parsedElement = tempDiv.firstElementChild;
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
  const iframeDoc = getIframeDocument();
  if (!iframeDoc) {
    return {
      success: false,
      error: "iframe document'ine erişilemiyor",
    };
  }

  const walker = iframeDoc.createTreeWalker(
    iframeDoc.body || iframeDoc.documentElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        return node.textContent.trim().length > 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    },
    false
  );
  const matchingNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.includes(oldValue)) {
      matchingNodes.push(node);
    }
  }

  if (matchingNodes.length === 0) {
    return {
      success: false,
      error: `"${oldValue}" metni sayfada bulunamadı`,
    };
  }
  let changedCount = 0;

  matchingNodes.forEach((textNode, index) => {
    const originalText = textNode.textContent;

    const newText = originalText.replaceAll(oldValue, newValue);

    if (originalText !== newText) {
      textNode.textContent = newText;
      changedCount++;
    }
  });

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
export { removeElement, replaceElement, insertElement, alterElement };
