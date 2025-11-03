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
   const LANG = {
  en: {
    title: "MKF Prescriptions",
    subtitle: "Select your symptoms to get recommended medicine",
    analyze: "Analyze & Save",
    disclaimer: "Property of MKF Innovations®",
    symptoms: [
      "Fever", "Cough", "Runny Nose", "Sore Throat", "Body Ache", "Headache", "Fatigue", 
      "Nausea", "Vomiting", "Diarrhea", "Rash", "Itching", "Shortness of Breath", 
      "Chest Pain", "Burning Urine", "Frequent Urination", "Yellow Eyes", "Red Eyes", 
      "Night Sweats", "Cold", "Sneezing", "Abdominal Pain", "Joint Pain", "Back Pain",
      "Sensitivity to Light", "Stiff Neck", "Weight Loss", "Excessive Thirst", 
      "Chest Tightness", "Palpitations", "Dizziness"
    ],
    conditions: [
      {
        keywords: ["fever","cough","sore throat","body ache"],
        diagnosis: "Influenza (Flu)",
        medicine: "Paracetamol 500 mg",
        dosage: "1 tablet",
        frequency: "Every 6 hours",
        duration: "5 days",
        warning: "Stay hydrated and rest. Seek medical care if high fever persists."
      },
      {
        keywords: ["runny nose","sneezing","cold","sore throat"],
        diagnosis: "Common Cold",
        medicine: "Paracetamol 500 mg",
        dosage: "1-2 tablets",
        frequency: "Every 6 hours as needed",
        duration: "3-5 days",
        warning: "Symptoms usually resolve naturally. Consult doctor if persistent."
      },
      {
        keywords: ["burning urine","frequent urination","abdominal pain"],
        diagnosis: "Urinary Tract Infection (UTI)",
        medicine: "Ciprofloxacin 500 mg",
        dosage: "1 tablet",
        frequency: "Twice daily",
        duration: "7 days",
        warning: "Complete the full course. Consult doctor if symptoms worsen."
      },
      {
        keywords: ["headache","sensitivity to light","stiff neck","fever","vomiting"],
        diagnosis: "Meningitis (Suspected)",
        medicine: "Immediate medical attention required",
        dosage: "N/A",
        frequency: "N/A",
        duration: "N/A",
        warning: "Seek emergency care immediately."
      },
      {
        keywords: ["chest pain","shortness of breath","palpitations","dizziness","sweating"],
        diagnosis: "Possible Heart Issue",
        medicine: "Immediate medical attention required",
        dosage: "N/A",
        frequency: "N/A",
        duration: "N/A",
        warning: "Seek emergency care immediately."
      },
      {
        keywords: ["yellow eyes","fatigue","nausea","abdominal pain"],
        diagnosis: "Hepatitis",
        medicine: "Consult doctor for antiviral treatment",
        dosage: "N/A",
        frequency: "N/A",
        duration: "Depends on type",
        warning: "Do not self-medicate. Follow doctor's advice."
      }
    ]
  },

  ck: {
    title: "MKF پەسکریپشنەکان",
    subtitle: "نیشانی نەخۆشیەکان هەڵبژێرە بۆ وەسڵکردنی دەرمان",
    analyze: "هەڵسەنگاندن و خەزنکردن",
    disclaimer: "سەرمایەی MKF Innovations®",
    symptoms: [
      "تا","کۆکە","بەڵغەمی زەرد","تاقیکردن","دەردی بەرز","سردرد","خستەوە","نووسین","قەدەغەکردن","هێڵ","ڕەش","خراپ","خستن","تەنفەس کەمبوون","دەردی سێنە","هێڵی تیشک","دووبارەی هێڵ","چاوە زەرد","چاوە سور","ئاشتی شەو","ساردی","سێنەکەوتن","دەردی ناوڕووی","دەردی گوڵ","دەردی پشت","هێشەی چاوی ڕوو","گرینەی سەر","وەزن کەمبوون","تۆڕێکی سیرابی زیاد","قەدەغەکردنی سێنە","لرزش"
    ],
    conditions: [
      {
        keywords: ["تا","کۆکە","سردرد","دەردی بەرز"],
        diagnosis: "فلو (Influenza)",
        medicine: "پەرەسیتامۆل 500 mg",
        dosage: "1 تابلێت",
        frequency: "هەر 6 کاتژمێر",
        duration: "5 ڕۆژ",
        warning: "خواردن و استراحت بکە. ئەگەر تا گەرمی بەرز هەیە پزیشک ببینە."
      },
      {
        keywords: ["بەڵغەمی زەرد","سێنەکەوتن","ساردی","تاقیکردن"],
        diagnosis: "ساردی گشتی",
        medicine: "پەرەسیتامۆل 500 mg",
        dosage: "1-2 تابلێت",
        frequency: "هەر 6 کاتژمێر",
        duration: "3-5 ڕۆژ",
        warning: "نیشانەکان خۆکارانە چارەسەر دەبن. ئەگەر بەرەوپێش بڕوانە، پزیشک ببینە."
      },
      {
        keywords: ["هێڵی تیشک","دووبارەی هێڵ","دەردی ناوڕووی"],
        diagnosis: "UTI",
        medicine: "سێپروفلوکساسین 500 mg",
        dosage: "1 تابلێت",
        frequency: "دوو جار لە ڕۆژ",
        duration: "7 ڕۆژ",
        warning: "کۆرسەکە تەواو بکە. ئەگەر نەخۆشی زیادبوو پزیشک ببینە."
      },
      {
        keywords: ["سردرد","هێشەی چاوی ڕوو","گرینەی سەر","تا","نووسین"],
        diagnosis: "مینینجایت (Meningitis)",
        medicine: "پزیشکی فۆڕسەیەکی کاتێکی فوری",
        dosage: "N/A",
        frequency: "N/A",
        duration: "N/A",
        warning: "فۆڕسەیەکی پزیشکی خێرا بۆوە."
      },
      {
        keywords: ["دەردی سێنە","تەنفەس کەمبوون","لرزش","قەدەغەکردنی سێنە","ئاشتی شەو"],
        diagnosis: "کێشەی دڵ",
        medicine: "پزیشکی فۆڕسەیەکی کاتێکی فوری",
        dosage: "N/A",
        frequency: "N/A",
        duration: "N/A",
        warning: "فۆڕسەیەکی پزیشکی خێرا بۆوە."
      },
      {
        keywords: ["چاوە زەرد","خستەوە","دەردی ناوڕووی","دەردی گوڵ"],
        diagnosis: "هێپاتیت",
        medicine: "پزیشکی فەرمی بۆ دارو",
        dosage: "N/A",
        frequency: "N/A",
        duration: "بە پەیوەندیدا بە جۆر",
        warning: "خۆت دارو نەکەرەوە. ڕێنمایی پزیشک بەڕێوەبە."
      }
    ]
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


