const canvas = document.getElementById("MyCanvas");
const ctx = canvas.getContext("2d");

// ======= วาดฉากพื้นหลัง (ครั้งเดียว) =======

// ท้องฟ้า
let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
grad.addColorStop(0, "#87CEEB");
grad.addColorStop(1, "#1E90FF");
ctx.fillStyle = grad;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// ดวงอาทิตย์
const cx = 100, cy = 100, radius = 45;
let sunGradient = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.5);
sunGradient.addColorStop(0, "rgba(255,255,0,0.9)");
sunGradient.addColorStop(1, "rgba(255,255,0,0)");
ctx.fillStyle = sunGradient;
ctx.beginPath();
ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = "yellow";
ctx.beginPath();
ctx.arc(cx, cy, radius, 0, Math.PI * 2);
ctx.fill();

// แสงรอบดวงอาทิตย์
ctx.strokeStyle = "rgba(255,255,150,0.6)";
ctx.lineWidth = 3;
for (let i = 0; i < 12; i++) {
  let angle = (Math.PI * 2 / 12) * i;
  let xStart = cx + Math.cos(angle) * radius * 0.9;
  let yStart = cy + Math.sin(angle) * radius * 0.9;
  let xEnd = cx + Math.cos(angle) * radius * 1.4;
  let yEnd = cy + Math.sin(angle) * radius * 1.4;
  ctx.beginPath();
  ctx.moveTo(xStart, yStart);
  ctx.lineTo(xEnd, yEnd);
  ctx.stroke();
}

// ภูเขา
ctx.beginPath();
ctx.moveTo(400, 320);
ctx.quadraticCurveTo(500, 80, 600, 320);
ctx.quadraticCurveTo(670, 140, 740, 320);
ctx.quadraticCurveTo(800, 100, 880, 320);
ctx.lineTo(880, 550);
ctx.lineTo(400, 550);
ctx.closePath();

let mountainGrad = ctx.createLinearGradient(400, 80, 880, 320);
mountainGrad.addColorStop(0, "#2F4F4F");
mountainGrad.addColorStop(1, "#556B2F");
ctx.fillStyle = mountainGrad;
ctx.fill();

// พื้นดิน
ctx.fillStyle = "#2E8B57";
ctx.fillRect(0, 320, canvas.width, canvas.height - 320);
ctx.strokeStyle = "#006400";
ctx.lineWidth = 1;
for (let i = 0; i < 1000; i++) {
  let x = Math.random() * canvas.width;
  let y = 320 + Math.random() * (canvas.height - 320);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 7 - Math.random() * 5);
  ctx.stroke();
}

// ต้นไม้
ctx.fillStyle = "#654321";
ctx.fillRect(50, 400, 25, 100);
ctx.beginPath();
ctx.fillStyle = "#27e227ff";
ctx.arc(43, 380, 40, 0, Math.PI * 2);
ctx.arc(90, 400, 35, 0, Math.PI * 2);
ctx.arc(50, 420, 35, 0, Math.PI * 2);
ctx.fill();

// ท้องนา
ctx.fillStyle = "#7CFC00";
ctx.fillRect(500, 320, 400, 200);
ctx.strokeStyle = "#6B8E23";
ctx.lineWidth = 0.5;
for (let y = 320; y < 500; y += 15) {
  ctx.beginPath();
  ctx.moveTo(500, y);
  ctx.lineTo(800, y);
  ctx.stroke();
}
for (let x = 510; x < 800; x += 15) {
  ctx.beginPath();
  ctx.moveTo(x, 320);
  ctx.lineTo(x, 500);
  ctx.stroke();
}

// บ้าน
ctx.fillStyle = "#C19A6B";
ctx.fillRect(330, 340, 130, 110);
ctx.fillStyle = "#4B3B1B";
ctx.fillRect(390, 400, 40, 50);
ctx.fillStyle = "#FFFACD";
ctx.fillRect(350, 370, 30, 30);
ctx.fillRect(430, 370, 30, 30);
ctx.beginPath();
ctx.moveTo(300, 340);
ctx.lineTo(395, 280);
ctx.lineTo(460, 320);
ctx.lineTo(490, 340);
ctx.closePath();
let roofGrad = ctx.createLinearGradient(310, 280, 460, 340);
roofGrad.addColorStop(0, "#8B4513");
roofGrad.addColorStop(1, "#5C3317");
ctx.fillStyle = roofGrad;
ctx.fill();
ctx.beginPath();
ctx.moveTo(300, 340);
ctx.lineTo(350, 340);
ctx.lineTo(395, 280);
ctx.closePath();
ctx.fillStyle = "rgba(0,0,0,0.2)";
ctx.fill();

// แม่น้ำ
ctx.beginPath();
ctx.moveTo(80, 320);
ctx.bezierCurveTo(120, 360, 140, 400, 150, 460);
ctx.bezierCurveTo(160, 500, 220, 510, 250, 550);
ctx.lineTo(300, 550);
ctx.lineTo(300, 320);
ctx.closePath();
let riverGrad = ctx.createLinearGradient(80, 320, 300, 550);
riverGrad.addColorStop(0, "#00BFFF");
riverGrad.addColorStop(1, "#1E90FF");
ctx.fillStyle = riverGrad;
ctx.fill();

// ======= เก็บฉากไว้ก่อนเริ่ม animate =======
let backgroundImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

// ======= เมฆและฝน (วาดเอง) =======

let clouds = [
  { x: 100, y: 80, scale: 1, speed: 0.1 },
  { x: 300, y: 60, scale: 0.8, speed: 0.07 },
  { x: 600, y: 90, scale: 1.2, speed: 0.05 }
];


let raindrops = [];
for (let i = 0; i < 300; i++) {
  raindrops.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: 10 + Math.random() * 10,
    speed: 2 + Math.random() * 3
  });
}

function drawCloud(x, y, scale = 1) {
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 25 * scale, y - 15 * scale, 25 * scale, 0, Math.PI * 2);
  ctx.arc(x + 55 * scale, y, 22 * scale, 0, Math.PI * 2);
  ctx.arc(x + 35 * scale, y + 12 * scale, 18 * scale, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function updateClouds() {
  for (let cloud of clouds) {
    cloud.x += cloud.speed;
    if (cloud.x > canvas.width + 100) {
      cloud.x = -100;
    }
    drawCloud(cloud.x, cloud.y, cloud.scale);
  }
}

function drawRain() {
  ctx.strokeStyle = "rgba(173,216,230,0.6)";
  ctx.lineWidth = 1;

  for (let drop of raindrops) {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();

    // เคลื่อนหยดฝนลง
    drop.y += drop.speed;

    // ถ้าหยดฝนถึงล่าง canvas → วนกลับไปข้างบน
    if (drop.y > canvas.height) {
      drop.y = -drop.length;
      drop.x = Math.random() * canvas.width;
    }
  }
}

function animate() {
  // วาดพื้นหลังที่บันทึกไว้
  ctx.putImageData(backgroundImage, 0, 0);

  // วาดเมฆเคลื่อนที่
  updateClouds();

  // วาดฝนตก
  drawRain();

  requestAnimationFrame(animate);
}

animate(); // เริ่มอนิเมชัน
