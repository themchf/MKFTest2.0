// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.12.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy, deleteDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/11.12.0/firebase-firestore.js";

// Same Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1J31TAWAxZ_c7hpZFiQzTw2LVINcH20k",
  authDomain: "mkftest-e1eb2.firebaseapp.com",
  projectId: "mkftest-e1eb2",
  storageBucket: "mkftest-e1eb2.firebasestorage.app",
  messagingSenderId: "669042820068",
  appId: "1:669042820068:web:9e1954c9b8da2d02793df1",
  measurementId: "G-X93NSQPN1M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const LOGIN_HASH = "f2a8b6f3d5a8a5b0f9d2fcb3b8a9d3b6a2c4f9b5e0a1d2c3e4b5f6a7b8c9d0e"; 
// Placeholder — will compute below; (we'll actually compute and compare)

const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginWrap = document.getElementById("loginWrap");
const dashWrap = document.getElementById("dashWrap");
const listEl = document.getElementById("list");
const searchInput = document.getElementById("searchInput");
const countBadge = document.getElementById("countBadge");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentSnapshotUnsub = null;
let latestDocs = [];

/* ============================
   Admin password (client-side)
   You provided: 1122aaddaa
   We'll compute its SHA-256 and compare
   ============================ */
const PLAIN_PASSWORD = "1122aaddaa";

// Compute SHA-256 and return hex
async function sha256Hex(msg) {
  const enc = new TextEncoder();
  const data = enc.encode(msg);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
}

let expectedHash = null;
(async ()=>{
  expectedHash = await sha256Hex(PLAIN_PASSWORD);
})();

// Login flow
loginBtn.addEventListener("click", async () => {
  const val = passwordInput.value || "";
  const h = await sha256Hex(val);
  if (!expectedHash) {
    showToast("Initializing..."); return;
  }
  if (h === expectedHash) {
    // success
    loginWrap.style.display = "none";
    dashWrap.style.display = "block";
    attachRealtime();
    showToast("Unlocked admin panel ✅", "#28a745");
  } else {
    showToast("Wrong password", "#dc3545");
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  if (currentSnapshotUnsub) currentSnapshotUnsub();
  loginWrap.style.display = "";
  dashWrap.style.display = "none";
  passwordInput.value = "";
  listEl.innerHTML = "";
  latestDocs = [];
  showToast("Logged out");
});

// Refresh (manual)
refreshBtn.addEventListener("click", async () => {
  if (currentSnapshotUnsub) currentSnapshotUnsub();
  attachRealtime();
});

// Search filter (client-side)
searchInput.addEventListener("input", () => renderList(filterDocs(searchInput.value)));

/* ============================
   Real-time listener
   ============================ */
function attachRealtime(){
  const q = query(collection(db, "prescriptionResults"), orderBy("createdAt", "desc"));
  currentSnapshotUnsub = onSnapshot(q, snap => {
    latestDocs = [];
    snap.forEach(d => {
      latestDocs.push({ id: d.id, ...d.data() });
    });
    renderList(latestDocs);
  }, err => {
    console.error("Snapshot error:", err);
    showToast("Failed to attach listener", "#dc3545");
  });
}

/* ============================
   Render list
   ============================ */
function filterDocs(term){
  if (!term) return latestDocs;
  term = term.toLowerCase();
  return latestDocs.filter(d => {
    const s = (d.selectedSymptoms || []).join(" ").toLowerCase();
    return s.includes(term) ||
      (d.diagnosis || "").toLowerCase().includes(term) ||
      (d.medicine || "").toLowerCase().includes(term) ||
      (d.userId || "").toLowerCase().includes(term);
  });
}

function renderList(items){
  countBadge.textContent = `${items.length} records`;
  listEl.innerHTML = "";
  if (!items.length) {
    listEl.innerHTML = `<div class="small-muted">No records found.</div>`;
    return;
  }

  for (let item of items){
    const wrap = document.createElement("div");
    wrap.className = "list-item";

    const top = document.createElement("div");
    top.className = "row";
    top.innerHTML = `
      <div>
        <div style="font-weight:800">${escapeHtml(item.diagnosis || "Unknown")}</div>
        <div class="meta">${escapeHtml((item.selectedSymptoms||[]).join(", "))}</div>
      </div>
      <div style="text-align:right">
        <div class="meta">User: ${escapeHtml(item.userId||"anon")}</div>
        <div class="meta">${item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : ""}</div>
      </div>
    `;

    const mid = document.createElement("div");
    mid.className = "row";
    mid.innerHTML = `
      <div class="meta">Medicine: ${escapeHtml(item.medicine || "N/A")} • ${escapeHtml(item.dosage || "")} • ${escapeHtml(item.frequency || "")}</div>
      <div>
        <button class="small-btn" data-id="${item.id}">Copy</button>
        <button class="small-btn danger" data-del="${item.id}">Delete</button>
      </div>
    `;

    wrap.appendChild(top);
    wrap.appendChild(mid);
    listEl.appendChild(wrap);

    // Copy button
    wrap.querySelector('[data-id]')?.addEventListener('click', () => {
      const text = `Diagnosis: ${item.diagnosis}\nMedicine: ${item.medicine}\nDosage: ${item.dosage}\nSymptoms: ${(item.selectedSymptoms||[]).join(", ")}`;
      navigator.clipboard?.writeText(text).then(()=>showToast("Copied to clipboard"));
    });

    // Delete button
    wrap.querySelector('[data-del]')?.addEventListener('click', async () => {
      const id = wrap.querySelector('[data-del]').getAttribute('data-del');
      if (!confirm("Delete this record?")) return;
      try {
        await deleteDoc(doc(db, "prescriptionResults", id));
        showToast("Deleted", "#ff6b6b");
      } catch (err) {
        console.error("Delete error:", err);
        showToast("Delete failed", "#dc3545");
      }
    });
  }
}

/* ===== Utility functions ===== */
function escapeHtml(s){
  return String(s||"")
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

function showToast(msg, color="#007bff"){
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.style.background = color;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 3000);
}
