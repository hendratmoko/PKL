// =========================
// DATA USER DEMO
// =========================

const users = [
  {
    code:"ABC123",
    nama:"Budi Santoso",
    kelas:"XII RPL",
    perusahaan:"PT Teknologi Indonesia",
    gps:"-7.9786,110.3671",
    mulai:"2026-01-01",
    selesai:"2026-06-30"
  }
];

// =========================
// ELEMENT
// =========================

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");

const singleCode = document.getElementById("singleCode");

const userInfo = document.getElementById("userInfo");

const clock = document.getElementById("clock");
const dateText = document.getElementById("date");
const remainingDays = document.getElementById("remainingDays");

const masukBtn = document.getElementById("masukBtn");
const pulangBtn = document.getElementById("pulangBtn");
const izinBtn = document.getElementById("izinBtn");

const activityInput = document.getElementById("activityInput");
const izinInput = document.getElementById("izinInput");

const historyTable = document.getElementById("historyTable");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photoPreview = document.getElementById("photoPreview");

const takePhotoBtn = document.getElementById("takePhotoBtn");
const gpsBtn = document.getElementById("gpsBtn");
const gpsResult = document.getElementById("gpsResult");

const printBtn = document.getElementById("printBtn");

// =========================
// GLOBAL
// =========================

let currentUser = null;
let currentPhoto = "";
let currentGPS = "";

// =========================
// LOGIN
// =========================

loginBtn.addEventListener("click", () => {

  const code = singleCode.value.toUpperCase();

  const foundUser = users.find(u => u.code === code);

  if(!foundUser){
    alert("Single Code tidak ditemukan!");
    return;
  }

  currentUser = foundUser;

  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");

  userInfo.innerHTML = `
    <b>${currentUser.nama}</b><br>
    ${currentUser.kelas} | ${currentUser.perusahaan}
  `;

  loadHistory();
  startCamera();
});

// =========================
// LOGOUT
// =========================

logoutBtn.addEventListener("click", () => {

  location.reload();

});

// =========================
// CLOCK
// =========================

function updateClock(){

  const now = new Date();

  clock.innerHTML = now.toLocaleTimeString("id-ID");

  dateText.innerHTML = now.toLocaleDateString("id-ID",{
    weekday:"long",
    year:"numeric",
    month:"long",
    day:"numeric"
  });

  if(currentUser){

    const endDate = new Date(currentUser.selesai);

    const diff = endDate - now;

    const days = Math.floor(diff / (1000*60*60*24));

    remainingDays.innerHTML =
    `Sisa masa PKL: ${days} hari`;

  }

}

setInterval(updateClock,1000);

// =========================
// CAMERA
// =========================

async function startCamera(){

  try{

    const stream = await navigator.mediaDevices.getUserMedia({
      video:true
    });

    video.srcObject = stream;

  }catch(err){

    alert("Kamera tidak diizinkan!");

  }

}

// FOTO

takePhotoBtn.addEventListener("click", () => {

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(video,0,0);

  currentPhoto = canvas.toDataURL("image/png");

  photoPreview.src = currentPhoto;

  localStorage.setItem("selfiePhoto",currentPhoto);

});

// =========================
// GPS
// =========================

gpsBtn.addEventListener("click", () => {

  navigator.geolocation.getCurrentPosition(position => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    currentGPS = `${lat}, ${lon}`;

    gpsResult.innerHTML = currentGPS;

  }, () => {

    alert("GPS gagal diakses!");

  });

});

// =========================
// ABSEN MASUK
// =========================

masukBtn.addEventListener("click", () => {

  if(currentPhoto === ""){
    alert("Silahkan ambil foto selfie!");
    return;
  }

  if(currentGPS === ""){
    alert("Silahkan ambil lokasi GPS!");
    return;
  }

  if(activityInput.value === ""){
    alert("Tuliskan kegiatan!");
    return;
  }

  saveAttendance("Masuk", activityInput.value);

  pulangBtn.classList.remove("hidden");

  alert("Absen Masuk berhasil!");

});

// =========================
// ABSEN PULANG
// =========================

pulangBtn.addEventListener("click", () => {

  saveAttendance("Pulang", activityInput.value);

  alert("Absen Pulang berhasil!");

});

// =========================
// IZIN
// =========================

izinBtn.addEventListener("click", () => {

  izinInput.classList.toggle("hidden");

  if(!izinInput.classList.contains("hidden")){

    izinBtn.innerHTML = `
      <i class="fa-solid fa-paper-plane"></i>
      Kirim Izin
    `;

  }else{

    if(izinInput.value !== ""){

      saveAttendance("Izin", izinInput.value);

      alert("Izin berhasil dikirim!");

    }

  }

});

// =========================
// SAVE DATA
// =========================

function saveAttendance(status, activity){

  const data = {

    waktu:new Date().toLocaleString("id-ID"),
    nama:currentUser.nama,
    perusahaan:currentUser.perusahaan,
    status:status,
    photo:currentPhoto,
    gps:currentGPS,
    activity:activity

  };

  let histories =
  JSON.parse(localStorage.getItem("attendanceHistory")) || [];

  histories.push(data);

  localStorage.setItem(
    "attendanceHistory",
    JSON.stringify(histories)
  );

  loadHistory();

  sendToSpreadsheet(data);

}

// =========================
// LOAD TABLE
// =========================

function loadHistory(){

  historyTable.innerHTML = "";

  let histories =
  JSON.parse(localStorage.getItem("attendanceHistory")) || [];

  histories.forEach(item => {

    historyTable.innerHTML += `
      <tr>

        <td>${item.waktu}</td>

        <td>${item.nama}</td>

        <td>${item.perusahaan}</td>

        <td>${item.status}</td>

        <td>
          <img src="${item.photo}">
        </td>

        <td>${item.gps}</td>

        <td>${item.activity}</td>

      </tr>
    `;

  });

}

// =========================
// PRINT PDF
// =========================

printBtn.addEventListener("click", () => {

  const element = document.getElementById("printArea");

  html2pdf().from(element).save("Laporan_PKL.pdf");

});

// =========================
// SPREADSHEET
// =========================

function sendToSpreadsheet(data){

  /*
    GANTI URL WEB APP APPS SCRIPT
  */

  fetch("YOUR_WEB_APP_URL",{

    method:"POST",

    body:JSON.stringify(data)

  })

  .then(response => response.text())

  .then(result => {

    console.log(result);

  })

  .catch(error => {

    console.log(error);

  });

}

// =========================
// ADMIN PANEL
// =========================

const tambahPesertaBtn =
document.getElementById("tambahPesertaBtn");

tambahPesertaBtn.addEventListener("click", () => {

  const randomCode =
  generateCode();

  document.getElementById("singleCodeResult")
  .innerHTML = `

    <div class="card" style="margin-top:20px">

      <h3>Single Login Peserta</h3>

      <h1 style="color:#2563eb">${randomCode}</h1>

      <button onclick="copyCode('${randomCode}')">
        Copy Code
      </button>

    </div>

  `;

});

// =========================
// GENERATE CODE
// =========================

function generateCode(){

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let result = "";

  for(let i=0;i<3;i++){

    result +=
    letters.charAt(
      Math.floor(Math.random()*letters.length)
    );

  }

  for(let i=0;i<3;i++){

    result +=
    numbers.charAt(
      Math.floor(Math.random()*numbers.length)
    );

  }

  return result;

}

// =========================
// COPY CODE
// =========================

function copyCode(code){

  navigator.clipboard.writeText(code);

  alert("Code berhasil dicopy!");

}
