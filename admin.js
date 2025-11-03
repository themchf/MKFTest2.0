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

const loginBtn = document.getElementById("loginBtn");
const pwdInput = document.getElementById("password");
const loginWrap = document.getElementById("loginWrap");
const dashboard = document.getElementById("dashboard");
const recordsDiv = document.getElementById("records");

loginBtn.onclick = ()=>{
  if(pwdInput.value==="1122aaddaa"){
    loginWrap.style.display="none";
    dashboard.style.display="block";
    loadRecords();
  } else alert("Incorrect password");
}

function loadRecords(){
  db.collection("prescriptions").orderBy("createdAt","desc").limit(50).onSnapshot(snapshot=>{
    recordsDiv.innerHTML="";
    snapshot.forEach(doc=>{
      const d = doc.data();
      const div = document.createElement("div");
      div.className="result";
      div.innerHTML=`<strong>Symptoms:</strong> ${d.selectedSymptoms.join(", ")}<br><strong>Diagnosis:</strong> ${d.result.diagnosis}<br><strong>Medicine:</strong> ${d.result.medicine}<hr>`;
      recordsDiv.appendChild(div);
    });
  });
}
