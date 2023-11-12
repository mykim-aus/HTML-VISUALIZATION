let depthCount = 0;
let depthSettings = [];

function createDepthUI(depthIndex, defaultColor, defaultStyle, defaultWidth) {
  const container = document.getElementById("depthSettings");

  const depthDiv = document.createElement("div");
  depthDiv.id = "depth" + depthIndex;
  container.appendChild(depthDiv);

  // Select color
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.id = "color" + depthIndex;
  colorInput.value = defaultColor;
  depthDiv.appendChild(colorInput);

  // Selct line style
  const styleSelect = document.createElement("select");
  styleSelect.id = "style" + depthIndex;
  ["solid", "dotted", "dashed"].forEach((style) => {
    const option = document.createElement("option");
    option.value = style;
    option.textContent = style;
    if (style === defaultStyle) {
      option.selected = true;
    }
    styleSelect.appendChild(option);
  });
  depthDiv.appendChild(styleSelect);

  // select line width size
  const widthInput = document.createElement("input");
  widthInput.type = "number";
  widthInput.id = "width" + depthIndex;
  widthInput.min = 1;
  widthInput.max = 10;
  widthInput.value = defaultWidth;
  depthDiv.appendChild(widthInput);

  colorInput.addEventListener("input", applyChanges);
  styleSelect.addEventListener("change", applyChanges);
  widthInput.addEventListener("input", applyChanges);
}

function addDepthSetting(
  defaultColor = "#FF0000",
  defaultStyle = "solid",
  defaultWidth = 3
) {
  createDepthUI(depthCount, defaultColor, defaultStyle, defaultWidth);
  depthSettings.push({
    color: defaultColor,
    style: defaultStyle,
    width: defaultWidth,
  });
  depthCount++;
  applyChanges();
}

function saveSettings() {
  chrome.storage.sync.set({ depthSettings: depthSettings }, function () {
    console.log("Settings saved");
  });
}

function loadSettings() {
  chrome.storage.sync.get(["depthSettings"], function (result) {
    if (result.depthSettings && result.depthSettings.length > 0) {
      result.depthSettings.forEach((setting) => {
        addDepthSetting(setting.color, setting.style, parseInt(setting.width));
      });
    }
  });
}

function applyChanges() {
  depthSettings = [];
  for (let i = 0; i < depthCount; i++) {
    const colorElem = document.getElementById("color" + i);
    const styleElem = document.getElementById("style" + i);
    const widthElem = document.getElementById("width" + i);

    if (colorElem && styleElem && widthElem) {
      depthSettings.push({
        color: colorElem.value,
        style: styleElem.value,
        width: widthElem.value,
      });
    }
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { depthSettings: depthSettings });
  });

  saveSettings();
}

function generateRandomHexColor() {
  const red = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const green = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const blue = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  return `#${red}${green}${blue}`;
}

document.getElementById("addDepth").addEventListener("click", function () {
  const randomColor = generateRandomHexColor();
  addDepthSetting(randomColor);
});

function resetDepthSettings() {
  for (let i = 0; i < depthCount; i++) {
    const depthDiv = document.getElementById("depth" + i);
    if (depthDiv) {
      depthDiv.parentNode.removeChild(depthDiv);
    }
  }

  depthSettings = [];
  depthCount = 0;
}

document.getElementById("initDepth").addEventListener("click", function () {
  resetDepthSettings();
  applyChanges();
});

function initializeAndApplySettings() {
  loadSettings();
}

window.onload = initializeAndApplySettings;
