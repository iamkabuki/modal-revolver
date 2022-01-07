let cx, cy, circlesize, radius;
let midiVal, freq, id, adSetting;
let h, s, b, palette;
let mode, rootNote;

let reverbTime = 0.9;
let noteIndex = 0;

let midiNotes = [];
let attackTimes = [];
let decayTimes = [];
let voices = [];
let osc = [];
let env = [];
let amp = [];
let rev = [];
let hValues = [];
let sValues = [];
let bValues = [];

midiNotes [1] = [0, 2, 4, 7, 11];
midiNotes [2] = [0, 3, 7, 9, 10];
midiNotes [3] = [0, 1, 3, 7, 8];
midiNotes [4] = [0, 4, 6, 7, 11];
midiNotes [5] = [0, 4, 7, 9, 10];
midiNotes [6] = [0, 2, 3, 7, 8];

attackTimes [1] = [0.01, 0.05, 0.01, 0.05, 0.01];
attackTimes [2] = [0.05, 0.1, 0.05, 0.1, 0.05];
attackTimes [3] = [0.05, 0.1, 0.05, 0.1, 0.05];

decayTimes [1] = [0.15, 0.2, 0.3, 0.2, 0.15];
decayTimes [2] = [0.15, 0.2, 0.3, 0.2, 0.15];
decayTimes [3] = [0.2, 0.3, 0.2, 0.3, 0.15];

hValues = [1, 9, 33, 38, 59, 62, 74, 80, 80, 128, 152, 199, 207, 213, 232];
sValues = [77, 213, 238, 131, 171, 23, 234, 133, 69, 165, 248, 162, 246, 92, 143];
bValues = [141, 162, 154, 187, 130, 253, 239, 216, 187, 204, 232, 185, 181, 228, 164];

let oscTypes = ['sine', 'triangle', 'sawtooth', 'square'];
let oscSettings = [0, 0, 0, 0, 0];

let circleDegree = [0, 0, 0, 0, 0];
let circleSpeed = [200, 270, 60, 90, 60];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
      
  colorMode(HSB,255);
  
  createCanvas(windowWidth, windowHeight);

  radius = min(windowWidth, windowHeight) / 2;
  circlesize = min(windowWidth, windowHeight) / 8;
  cx = windowWidth / 2;
  cy = windowHeight / 2;
  
  voiceProperties();  
    
    }

function draw() {

    // draw background
    
    for (let i = 0; i < 7; i++) {
    background(h, (s / 4) * i, (b / 4) * i, 50);
    }

    
    // draw lanes
  
  let colorvar = 1;
  for (let i = 1; i < 7; i++) {
    noStroke();
    fill((h), (s / 4) * i, (b / 4) * i, 100);
    ellipse(cx, cy, radius * 2 - circlesize * i, radius * 2 - circlesize * i);
  }
    
  // calculate dial positions

  for (let i = 0; i < 5; i++) {
    // timer
    if (frameCount % 1 == 0) {
      circleDegree[i]++;
    }
    
    if (circleDegree[i] > circleSpeed[i]) {
      startSound(i);
      circleDegree[i] = 0;
    }
    
    // draw dials

    let multiplier = (i + 2) * 2 - 1;
    let s = map(circleDegree[i], 0, circleSpeed[i], 0, TWO_PI) - HALF_PI;
    let color = map(circleDegree[i], 0, circleSpeed[i], 0, 255);
    fill((h / 255) * color, (s / 255) * color, (b / 255) * color);
    ellipse(
      cx + cos(s) * (radius - (circlesize / 4) * multiplier),
      cy + sin(s) * (radius - (circlesize / 4) * multiplier),
      circlesize / 2,
      circlesize / 2
    );
      
  }
}
  
  function voiceProperties() {
    for (let i = 0; i < 6; i++) {
    osc[i] = new p5.Oscillator(oscTypes[oscSettings[i]]);
    env[i] = new p5.Envelope();
    amp[i] = new p5.Amplitude();
    env[i].setADSR(attackTimes[adSetting] [i], decayTimes[adSetting] [i]);    
    env[i].setRange(0.9, 0);
    osc[i].amp(env[i]);
    osc[i].disconnect();
    rev[i] = new p5.Reverb()
    rev[i].set(reverbTime);
    rev[i].drywet([0.6]);
    osc[i].connect(rev[i]);
    midiVal = (midiNotes[mode] [i]+rootNote);
    freq = midiToFreq(midiVal);
    osc[i].freq(freq);
    osc[i].start();                
    }
  }
  
function mousePressed() {
  userStartAudio();
}

function startSound(id) {
  // see also: userStartAudio();
  env[id].play();
}

   window.addEventListener("DOMContentLoaded", (event) => {
           
       rootNote = Math.floor(fxrand() * 12)+60;
       mode = Math.floor(fxrand() * 7)+1;
       palette = Math.floor(fxrand() * 15);

       h = hValues[palette];
       s = sValues[palette];
       b = bValues[palette];

       adSetting = Math.floor(fxrand() * 3)+1;
       reverbTime = Math.floor(fxrand() * 2)+1;
       
       for (let i = 1; i < 6; i++) {
           circleSpeed[i] = Math.floor(fxrand() * 300)+60;
       };
   
       for (let i = 1; i < 6; i++) {
           oscSettings[i] = Math.floor(fxrand() * 4);
       };
       
      window.$fxhashFeatures = {
          "palette": palette,
          "root note": rootNote,
          "mode": mode,
          "ad setting": adSetting,
          "reverb time": reverbTime,
          "osc 1 speed": circleSpeed[1],
          "osc 2 speed": circleSpeed[2],
          "osc 3 speed": circleSpeed[3],
          "osc 4 speed": circleSpeed[4],
          "osc 5 speed": circleSpeed[5],
          "osc 1 setting": oscSettings[1],
          "osc 2 setting": oscSettings[2],
          "osc 3 setting": oscSettings[3],
          "osc 4 setting": oscSettings[4],
          "osc 5 setting": oscSettings[5],
          
      };
              
    })