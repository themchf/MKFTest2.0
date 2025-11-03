const fileInput = document.getElementById("file-input");
const analyzeBtn = document.getElementById("analyze-btn");
const resultsDiv = document.getElementById("results");

let labReference = {};
let diseaseRules = {};

// Load JSON data
fetch("data/lab_reference.json").then(r => r.json()).then(data => labReference = data);
fetch("data/disease_rules.json").then(r => r.json()).then(data => diseaseRules = data);

analyzeBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Please upload a PDF or image!");

  resultsDiv.innerHTML = "<p>Analyzing...</p>";

  let extractedText = "";
  if (file.type === "application/pdf") {
    extractedText = await extractTextFromPDF(file);
  } else {
    extractedText = await extractTextFromImage(file);
  }

  const parsedResults = parseLabResults(extractedText);
  const conditions = predictCondition(parsedResults);
  renderResults(parsedResults, conditions);
});

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + " ";
  }
  return text;
}

async function extractTextFromImage(file) {
  const img = await createImageBitmap(file);
  const { data: { text } } = await Tesseract.recognize(img, "eng");
  return text;
}

function parseLabResults(text) {
  const results = {};
  const lines = text.split(/\r?\n|\s+/);
  for (const panel in labReference) {
    results[panel] = {};
    for (const test in labReference[panel]) {
      const regex = new RegExp(`${test}\\s*[:\\-]?\\s*(\\d+\\.?\\d*)`, "i");
      const match = text.match(regex);
      if (match) {
        const value = parseFloat(match[1]);
        const range = labReference[panel][test];
        results[panel][test] = {
          value,
          unit: range.unit,
          abnormal: value < range.min || value > range.max
        };
      }
    }
  }
  return results;
}

function predictCondition(parsedResults) {
  const detected = [];
  for (const condition in diseaseRules) {
    const criteria = diseaseRules[condition].criteria;
    let allMatch = true;
    for (const c of criteria) {
      let found = false;
      for (const panel in parsedResults) {
        if (parsedResults[panel][c.test]) {
          const val = parsedResults[panel][c.test].value;
          if (
            (c.operator === "<" && val < c.value) ||
            (c.operator === ">" && val > c.value)
          ) {
            found = true;
          }
        }
      }
      if (!found) allMatch = false;
    }
    if (allMatch) detected.push(condition);
  }
  return detected;
}

function renderResults(parsedResults, conditions) {
  resultsDiv.innerHTML = "";

  for (const panel in parsedResults) {
    const panelDiv = document.createElement("div");
    panelDiv.classList.add("test-panel");
    panelDiv.innerHTML = `<h3>${panel}</h3>`;
    for (const test in parsedResults[panel]) {
      const res = parsedResults[panel][test];
      const testDiv = document.createElement("div");
      testDiv.classList.add("test-result");
      if (res.abnormal) testDiv.classList.add("abnormal");
      testDiv.innerHTML = `${test}: ${res.value} ${res.unit} (ref: ${labReference[panel][test].min}-${labReference[panel][test].max})`;
      panelDiv.appendChild(testDiv);
    }
    resultsDiv.appendChild(panelDiv);
  }

  const condDiv = document.createElement("div");
  condDiv.classList.add("predicted-condition");
  condDiv.innerHTML = "Predicted Condition: " + (conditions.length ? conditions.join(", ") : "Normal");
  resultsDiv.appendChild(condDiv);
}
