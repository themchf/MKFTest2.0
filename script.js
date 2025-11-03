// Wait for DOM
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
  const db = firebase.firestore();
  firebase.auth().signInAnonymously().catch(console.error);

  // --- Symptoms ---
  const symptoms = ["Fever","Cough","Runny Nose","Sore Throat","Body Ache","Headache","Fatigue","Nausea","Rash","Sneezing","Cold","Burning Urine","Yellow Eyes"];
  
  const conditions = [
    {keywords:["fever","cough","sore throat"],diagnosis:"Flu",medicine:"Paracetamol",dosage:"500mg",frequency:"Every 6 hours",duration:"5 days",warning:"Rest and hydrate."},
    {keywords:["runny nose","sneezing","cold"],diagnosis:"Common Cold",medicine:"Paracetamol",dosage:"500mg",frequency:"Every 6 hours",duration:"3 days",warning:"Consult if persists."},
    {keywords:["burning urine","frequent urination"],diagnosis:"UTI",medicine:"Ciprofloxacin",dosage:"500mg",frequency:"Twice daily",duration:"7 days",warning:"Take full course."}
  ];

  // --- Build symptom buttons ---
  const grid = document.getElementById("symptomGrid");
  symptoms.forEach(sym => {
    const btn = document.createElement("div");
    btn.className="symptom";
    btn.textContent=sym;
    btn.onclick=()=>btn.classList.toggle("selected");
    grid.appendChild(btn);
  });

  // --- Analyze Button ---
  document.getElementById("analyzeBtn").onclick = async ()=>{
    const selected = [...document.querySelectorAll(".symptom.selected")].map(el=>el.textContent.toLowerCase());
    if(selected.length===0){document.getElementById("output").innerHTML="<p class='muted'>Select at least one symptom</p>"; return;}
    
    let result = {diagnosis:"Unknown",medicine:"N/A",dosage:"N/A",frequency:"N/A",duration:"N/A",warning:"Consult a doctor"};
    for(let c of conditions){
      const matches = c.keywords.filter(k=>selected.includes(k));
      if(matches.length >= 2){ result = c; break; }
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

    try{
      await db.collection("prescriptions").add({
        selectedSymptoms:selected,
        result:result,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Saved to Firebase successfully!");
    }catch(e){
      console.error(e);
      alert("Failed to save!");
    }
  };
};
