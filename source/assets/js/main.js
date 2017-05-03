import { $, $$ } from './bling';

const cssVars = window.getComputedStyle(document.documentElement);

const canvas = $('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth + 1000;
canvas.height = window.innerHeight + 1000;
canvas.style.width = `${canvas.width}px`;
canvas.style.height = `${canvas.height}px`;
ctx.translate(0.5, 0.5);
ctx.strokeStyle = cssVars.getPropertyValue('--black');
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 5;
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function pickColor() {
  const selectedColor = this.classList[1];
  $('.active').classList.remove('erase');
  $('.active').style.backgroundColor = cssVars.getPropertyValue(`--${selectedColor}`);
  $('.active .border').style.borderColor = cssVars.getPropertyValue(`--${selectedColor}`);
  ctx.strokeStyle = cssVars.getPropertyValue(`--${selectedColor}`);
  console.log(selectedColor);
  if (selectedColor === 'erase') {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 20;
  } else {
    ctx.strokeStyle = cssVars.getPropertyValue(`--${selectedColor}`);
    ctx.lineWidth = 5;
  }
}

$$('.color:not(.active)').forEach((color) => {
  color.addEventListener('click', pickColor);
});

function toggleColorList() {
  $('#colors').classList.toggle('open');
}

$('.color.active').addEventListener('click', toggleColorList);


let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(`${lastX}.5`, `${lastY}.5`);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function downloadSVG() {
  const data = canvas.toDataURL('image/jpeg');
  $('#download').href = data;
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  console.log(ctx.strokeStyle);
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => { isDrawing = false; downloadSVG(); });
canvas.addEventListener('mouseout', () => { isDrawing = false; downloadSVG(); });
