import { $, $$ } from './bling';

const cssVars = window.getComputedStyle(document.documentElement);

let activeColor = 'black';
const canvas = $('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = activeColor;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 5;
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function pickColor() {
  const selectedColor = this.classList[1];
  if (selectedColor === 'erase') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 20;
    $('.active').classList.add('erase');
    $('.active').style.backgroundColor = '';
    $('.active .border').style.borderColor = cssVars.getPropertyValue('--gray');
  } else {
    $('.active').classList.remove('erase');
    $('.active').style.backgroundColor = cssVars.getPropertyValue(`--${selectedColor}`);
    $('.active .border').style.borderColor = cssVars.getPropertyValue(`--${selectedColor}`);
    activeColor = $('.active').style.backgroundColor;
    ctx.lineWidth = 5;
    ctx.strokeStyle = activeColor;
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
  // console.log(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  console.log(activeColor);
});

function downloadSVG() {
  const data = canvas.toDataURL('image/jpeg');
  $('#download').href = data;
}


canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => { isDrawing = false; downloadSVG(); });
canvas.addEventListener('mouseout', () => { isDrawing = false; downloadSVG(); });
