// script.js
// ES module — runs in modern browsers

// Import Firebase modular SDK (v11)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.12.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.12.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.12.0/firebase-analytics.js";

/* ===========================
   Your Firebase configuration
   (You provided this earlier)
   =========================== */
const firebaseConfig = {
  apiKey: "AIzaSyC1J31TAWAxZ_c7hpZFiQzTw2LVINcH20k",
  authDomain: "mkftest-e1eb2.firebaseapp.com",
  projectId: "mkftest-e1eb2",
  storageBucket: "mkftest-e1eb2.firebasestorage.app",
  messagingSenderId: "669042820068",
  appId: "1:669042820068:web:9e1954c9b8da2d02793df1",
  measurementId: "G-X93NSQPN1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

let userId = null;
signInAnonymously(auth).catch(err => console.warn("Auth error", err));
onAuthStateChanged(auth, user => { if (user) userId = user.uid; });

/* ===========================
   Conditions database (your rules)
   Add/extend this as needed
   =========================== */
const conditions = [
  {
    keywords: ["تا", "کۆکە", "بەڵغەمی زەرد"],
    diagnosis: "Bacterial Respiratory Infection",
    medicine: "Amoxicillin",
    dosage: "500 mg",
    frequency: "Three times daily",
    duration: "7 days",
    warning: "Avoid if allergic to penicillin."
  },
  {
    keywords: ["fever", "sore throat", "white patches"],
    diagnosis: "Streptococcal Pharyngitis",
    medicine: "Amoxicillin",
    dosage: "500 mg",
    frequency: "Every 12 hours",
    duration: "10 days",
    warning: "Confirm no penicillin allergy."
  },
  {
    keywords: ["runny nose", "sneezing", "sore throat", "cold"],
    diagnosis: "Common Cold",
    medicine: "Paracetamol 500 mg",
    dosage: "1–2 tablets",
    frequency: "Every 6 hours as needed",
    duration: "Up to 5 days",
    warning: "Seek medical care if symptoms persist."
  }
];

/* ===========================
   Symptom list
   =========================== */
const allSymptoms = [
  "تا","کۆکە","بەڵغەمی زەرد","sore throat","white patches",
  "headache","sensitivity to light","stiff neck","body aches",
  "runny nose","frequent urination","excessive thirst","weight loss",
  "chest pain","shortness of breath","sweating","diarrhea","vomiting",
  "itching","rash","abdominal pain","joint pain","fatigue","nausea",
  "back pain","sneezing","cold","painful urination","burning urine",
  "bloody stool","itchy scalp","yellow eyes","red eyes","night sweats"
];

/* ================
   Build UI
   ================ */
const grid = document.getElementById("symptomGrid");
allSymptoms.forEach(sym => {
  const btn = document.createElement("div");
  btn.className = "symptom";
  btn.textContent = sym;
  btn.onclick = () => btn.classList.toggle("selected");
  grid.appendChild(btn);
});

const analyzeBtn = document.getElementById("analyzeBtn");
analyzeBtn.addEventListener("click", analyze);

function showToast(msg, color = "#007bff") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.style.background = color;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ================
   Analyze & Save
   ================ */
async function analyze() {
  const selected = [...document.querySelectorAll(".symptom.selected")]
    .map(el => el.textContent.toLowerCase());

  if (selected.length === 0) {
    document.getElementById("output").innerHTML = "<p class='small-muted'>Please select at least one symptom.</p>";
    return;
  }

  // Pick best match (2 or more keyword matches) or fallback
  let resultData = {
    diagnosis: "Unknown Condition",
    medicine: "N/A",
    dosage: "N/A",
    frequency: "N/A",
    duration: "N/A",
    warning: "Consult a doctor for evaluation."
  };

  for (let cond of conditions) {
    const matches = cond.keywords.filter(k => selected.includes(k.toLowerCase()));
    if (matches.length >= 2) {
      resultData = cond;
      break;
    }
  }

  document.getElementById("output").innerHTML = `
    <div class="result">
      <h3>Diagnosis: ${escapeHtml(resultData.diagnosis)}</h3>
      <p><strong>Medicine:</strong> ${escapeHtml(resultData.medicine)}</p>
      <p><strong>Dosage:</strong> ${escapeHtml(resultData.dosage)}</p>
      <p><strong>Frequency:</strong> ${escapeHtml(resultData.frequency)}</p>
      <p><strong>Duration:</strong> ${escapeHtml(resultData.duration)}</p>
      <p class="warning">⚠️ ${escapeHtml(resultData.warning)}</p>
    </div>
  `;

  // Save to Firestore
  try {
    await addDoc(collection(db, "prescriptionResults"), {
      userId: userId || null,
      selectedSymptoms: selected,
      diagnosis: resultData.diagnosis,
      medicine: resultData.medicine,
      createdAt: serverTimestamp()
    });
    showToast("Saved to cloud successfully!", "#28a745");
  } catch (err) {
    console.error("Firestore save error:", err);
    showToast("Failed to save result", "#dc3545");
  }
}

/* ===== Helper: simple HTML escaper to avoid injection issues ===== */
function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}
