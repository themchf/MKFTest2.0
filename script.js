window.onload = function(){

  // --- Firebase setup ---
  const firebaseConfig = {
    apiKey: "AIzaSyC1J31TAWAxZ_c7hpZFiQzTw2LVINcH20k",
    authDomain: "mkftest-e1eb2.firebaseapp.com",
    projectId: "mkftest-e1eb2",
    storageBucket: "mkftest-e1eb2.app",
    messagingSenderId: "669042820068",
    appId: "1:669042820068:web:9e1954c9b8da2d02793df1",
    measurementId: "G-X93NSQPN1M"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  firebase.auth().signInAnonymously().catch(console.error);

  // --- Multi-language content ---
  const LANG = {
    en: {
      title: "MKF Prescriptions",
      subtitle: "Select your symptoms to get recommended medicine",
      analyze: "Analyze & Save",
      disclaimer: "Property of MKF Innovations®",
      symptoms: ["Fever","Cough","Runny Nose","Sore Throat","Body Ache","Headache","Fatigue","Nausea","Rash","Sneezing","Cold","Burning Urine","Yellow Eyes"],
      conditions: [
        {keywords:["fever","cough","sore throat"],diagnosis:"Flu",medicine:"Paracetamol",dosage:"500mg",frequency:"Every 6 hours",duration:"5 days",warning:"Rest and hydrate."},
        {keywords:["runny nose","sneezing","cold"],diagnosis:"Common Cold",medicine:"Paracetamol",dosage:"500mg",frequency:"Every 6 hours",duration:"3 days",warning:"Consult if persists."},
        {keywords:["burning urine","frequent urination"],diagnosis:"UTI",medicine:"Ciprofloxacin",dosage:"500mg",frequency:"Twice daily",duration:"7 days",warning:"Take full course."}
      ]
    },
    ck: {
      title: "MKF پەسکریپشنەکان",
      subtitle: "نیشانی نەخۆشیەکان هەڵبژێرە بۆ وەسڵکردنی دەرمان",
      analyze: "هەڵسەنگاندن و خەزنکردن",
      disclaimer: "سەرمایەی MKF Innovations®",
      symptoms: ["تا","کۆکە","بەڵغەمی زەرد","ناوڕووی دەنگ","تاقیکردن","دەردی بەرز","سردرد","خستەوە","ڕەش","سێنەکەوتن","ساردی","هێڵی تیشک","چاوە زەرد"],
      conditions: [
        {keywords:["تا","کۆکە","بەڵغەمی زەرد"],diagnosis:"فلو",medicine:"پەرەسیتامۆل",dosage:"500mg",frequency:"هەر 6 کاتژمێر",duration:"5 ڕۆژ",warning:"ئاستن و خواردنی خۆراک."},
        {keywords:["ناوڕووی دەنگ","سێنەکەوتن","ساردی"],diagnosis:"ساردی گشتی",medicine:"پەرەسیتامۆل",dosage:"500mg",frequency:"هەر 6 کاتژمێر",duration:"3 ڕۆژ",warning:"ئەگەر بەردەوام بوو پزیشک ببینە."},
        {keywords:["هێڵی تیشک","خستەوە"],diagnosis:"UTI",medicine:"سێپروفلوکساسین",dosage:"500mg",frequency:"دوو جار لە ڕۆژ",duration:"7 ڕۆژ",warning:"فڕۆشتنی تەواو بەجێبهێنرە."}
      ]
    }
  };

  let currentLang = "en";

  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const grid = document.getElementById("symptomGrid");

  // --- Build symptoms ---
  function buildSymptoms(){
    grid.innerHTML="";
    LANG[currentLang].symptoms.forEach(sym=>{
      const btn = document.createElement("div");
      btn.className="symptom";
      btn.textContent=sym;
      btn.onclick=()=>btn.classList.toggle("selected");
      grid.appendChild(btn);
    });
  }

  // --- Initialize ---
  function updateLang(){
    titleEl.textContent = LANG[currentLang].title;
    subtitleEl.textContent = LANG[currentLang].subtitle;
    analyzeBtn.textContent = LANG[currentLang].analyze;
    buildSymptoms();
  }

  updateLang();

  // --- Language switch ---
  document.getElementById("langSelect").onchange = (e)=>{
    currentLang = e.target.value;
    updateLang();
    document.getElementById("output").innerHTML="";
  }

  // --- Analyze ---
  analyzeBtn.onclick = async ()=>{
    const selected = [...document.querySelectorAll(".symptom.selected")].map(el=>el.textContent.toLowerCase());
    if(selected.length===0){document.getElementById("output").innerHTML="<p class='muted'>Select at least one symptom</p>"; return;}
    
    let result = {diagnosis:"Unknown",medicine:"N/A",dosage:"N/A",frequency:"N/A",duration:"N/A",warning:"Consult a doctor"};
    const conditions = LANG[currentLang].conditions;
    for(let c of conditions){
      const matches = c.keywords.filter(k=>selected.includes(k));
      if(matches.length >= 2){ result = c; break; }
    }

    document.getElementById("output").innerHTML = `
      <div class="result">
        <h3>${currentLang==="en"?"Diagnosis":"دەخوازراو"}: ${result.diagnosis}</h3>
        <p><strong>${currentLang==="en"?"Medicine":"دەرمان"}:</strong> ${result.medicine}</p>
        <p><strong>${currentLang==="en"?"Dosage":"ڕێژە"}:</strong> ${result.dosage}</p>
        <p><strong>${currentLang==="en"?"Frequency":"دووبارەکردن"}:</strong> ${result.frequency}</p>
        <p><strong>${currentLang==="en"?"Duration":"ماوە"}:</strong> ${result.duration}</p>
        <p class="warning">⚠️ ${result.warning}</p>
      </div>`;

    try{
      await db.collection("prescriptions").add({
        selectedSymptoms:selected,
        result:result,
        lang:currentLang,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
      alert(currentLang==="en"?"Saved successfully!":"سەرکەوتووانە خەزنکرا!");
    }catch(e){
      console.error(e);
      alert(currentLang==="en"?"Failed to save!":"ناتوانرایەوە خەزن بکات!");
    }
  };

};
