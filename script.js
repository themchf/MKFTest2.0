window.onload = function() {

  // --- Firebase config ---
  const firebaseConfig = {
    apiKey: "AIzaSyC1J31TAWAxZ_c7hpZFiQzTw2LVINcH20k",
    authDomain: "mkftest-e1eb2.firebaseapp.com",
    projectId: "mkftest-e1eb2",
    storageBucket: "mkftest-e1eb2.app",
    messagingSenderId: "669042820068",
    appId: "1:669042820068:web:9e1954c9b8da2d02793df1",
    measurementId: "G-X93NSQPN1M"
  };

  // --- Init Firebase ---
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  const db = firebase.firestore();
  firebase.auth().signInAnonymously().catch(console.error);

  // --- Symptoms ---
  const allSymptoms = ["تا","کۆکە","بەڵغەمی زەرد","sore throat","white patches","headache","sensitivity to light","stiff neck","body aches","runny nose","frequent urination","excessive thirst","weight loss","chest pain","shortness of breath","sweating","diarrhea","vomiting","itching","rash","abdominal pain","joint pain","fatigue","nausea","back pain","sneezing","cold","painful urination","burning urine","bloody stool","itchy scalp","yellow eyes","red eyes","night sweats"];

  const conditions = [
    {keywords:["تا","کۆکە","بەڵغەمی زەرد"],diagnosis:"Bacterial Respiratory Infection",medicine:"Amoxicillin",dosage:"500 mg",frequency:"Three times daily",duration:"7 days",warning:"Avoid if allergic to penicillin."},
    {keywords:["fever","sore throat","white patches"],diagnosis:"Streptococcal Pharyngitis",medicine:"Amoxicillin",dosage:"500 mg",frequency:"Every 12 hours",duration:"10 days",warning:"Confirm no penicillin allergy."},
    {keywords:["runny nose","sneezing","sore throat","cold"],diagnosis:"Common Cold",medicine:"Paracetamol 500 mg",dosage:"1–2 tablets",frequency:"Every 6 hours as needed",duration:"Up to 5 days",warning:"Seek medical care if symptoms persist."}
  ];

  // --- Populate symptom buttons ---
  const grid = document.getElementById("symptomGrid");
  allSymptoms.forEach(sym => {
    const btn = document.createElement("div");
    btn.className = "symptom";
    btn.textContent = sym;
    btn.onclick = () => btn.classList.toggle("selected");
    grid.appendChild(btn);
  });

  // --- Analyze function ---
  document.getElementById("analyzeBtn").onclick = async () => {
    const selected = [...document.querySelectorAll(".symptom.selected")].map(el => el.textContent.toLowerCase());
    if (selected.length === 0) {
      document.getElementById("output").innerHTML = "<p class='small-muted'>Select at least one symptom</p>";
      return;
    }

    let result = {diagnosis:"Unknown", medicine:"N/A", dosage:"N/A", frequency:"N/A", duration:"N/A", warning:"Consult a doctor"};
    for (let cond of conditions) {
      const matches = cond.keywords.filter(k => selected.includes(k.toLowerCase()));
      if (matches.length >= 2) { result = cond; break; }
    }

    document.getElementById("output").innerHTML = `
      <div class="result">
        <h3>Diagnosis: ${result.diagnosis}</h3>
        <p><strong>Medicine:</strong> ${result.medicine}</p>
        <p><strong>Dosage:</strong> ${result.dosage}</p>
        <p><strong>Frequency:</strong> ${result.frequency}</p>
        <p><strong>Duration:</strong> ${result.duration}</p>
        <p class="warning">⚠️ ${result.warning}</p>
      </div>`;

    // --- Save to Firestore ---
    try {
      await db.collection("prescriptionResults").add({
        userSymptoms: selected,
        diagnosis: result.diagnosis,
        medicine: result.medicine,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Saved to Firebase successfully!");
    } catch(e) {
      console.error(e);
      alert("Failed to save!");
    }
  }
}
