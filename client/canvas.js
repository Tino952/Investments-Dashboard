const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

window.onresize = () => {

  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;
}

// creating an object to hold the parameters of the two sin waves

const wave = {
  y: {
    start: canvas.height /  3,
  },
  length: {
    line_1: 0.008,
    line_2: 0.012
  },
  amplitude: {
    line_1: 20,
    line_2: 30
  },
  frequency: {
    line_1: 0.003,
    line_2: 0.008
  }
}

let increment_1 = wave.frequency.line_1;

let increment_2 = wave.frequency.line_2;

function animate() {

  // c.fillStyle = "rgba(0,13,60,0.4)";

  c.clearRect(0, 0, canvas.width, canvas.height);

  c.moveTo(0, canvas.height / 2);

  c.beginPath();

  c.strokeStyle = "rgba(255,255,255,0.5)";

  c.lineWidth = 6;

  // start drawing line at y.start in wave object. Making wave longer by multiplying
  // the i with an adjustment factor. Making the wave move by multiplying this with
  // an increment. Making the wave movement dynamic by multiplying an additional
  // amplitude factor with the sin of the increment

  for (let i = 0; i < canvas.width; i++) {
    c.lineTo(i, wave.y.start + Math.sin(i * wave.length.line_1 + increment_1) * wave.amplitude.line_1 * Math.sin(increment_1));
  }

  c.stroke();

  c.moveTo(0, canvas.height / 2);

  c.beginPath();

  c.strokeStyle = "rgba(117,24,247,0.5)";

  c.lineWidth = 3;

  for (let i = 0; i < canvas.width; i++) {
    c.lineTo(i, wave.y.start + Math.sin(i * wave.length.line_2 + increment_2) * wave.amplitude.line_2 * Math.sin(increment_2));
  }

  c.stroke();

  // increasing increment by the frequency parameter

  increment_1 += wave.frequency.line_1;

  increment_2 += wave.frequency.line_2;

  requestAnimationFrame(animate);
}

animate();
