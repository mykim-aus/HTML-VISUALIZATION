chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.depthSettings) {
    applyDepthStyles(request.depthSettings);
  }
});

function applyDepthStyles(settings) {
  document.querySelectorAll("*").forEach((element) => {
    const depth = getElementDepth(element);
    const setting = settings[depth];
    if (setting) {
      element.style.border = `${setting.width}px ${setting.style} ${setting.color}`;
    } else {
      element.style.border = "";
    }
  });
}

function getElementDepth(element) {
  let depth = 0;
  while (element.parentElement) {
    depth++;
    element = element.parentElement;
  }
  return depth;
}
