/* exported setup, draw */
let seed = 10943;

const grassColor = "#e1ac4a";
const OCEAN_COLOR = "#fd5e53";

const treeColor = "#b6eef0";

let iceCurves = Array(4);
let iceParallax = Array(4);
let bedFunc;
let bedSteps;
let lightZCurve;

function preload() {
    // runs before setup 
    // use if you want to load any large files and want to make sure they load before setup()
}

function setup() {
  createCanvas(800, 400);
  createButton("reroll").mousePressed(() =>{
                              
                                      newSeed();
                                    });
  LIGHT_COLOR = color("#FFFFFF");
  ICE_COLORS = [color("#d0f2ff"), color("#bee8ff"), color("#98cfff"), color("#8ac0ff")];
  generateAllIce();
  bedFunc = generateGround();
  bedSteps = round(random(30, 150));
  generateTorches();
}


function newSeed(){
  seed++;
  generateAllIce(); 
  bedFunc = generateGround();
  bedSteps = round(random(30, 150));
  generateTorches();
}


const GCOEFF_RANGES = {2: [30, 40], 4:[20, 40], 6:[180, 200]};
function generateAllIce(){
  for (let i = 0; i < iceCurves.length; i++){
    let yoffset = (i != iceCurves.length-1) ? (iceCurves.length-i)*height/32 : height/16;
    iceCurves[i] = generateIce(yoffset);
  }
}

function generateIce(yoffset=0){
  const TOTAL_INTCP = random([4,6]);
  
  const IVLS = 16;
  
  let s = IVLS + 2;
  let gcoeff = random(...GCOEFF_RANGES[TOTAL_INTCP]) * 10**(2*TOTAL_INTCP - 2)

  let intcp = Array.from(Array(TOTAL_INTCP), (_, i) => ((i*s/TOTAL_INTCP)-1)*width/IVLS);
  
  // randomly generate curves
  for (let i = 0; i < intcp.length; i++){
    intcp[i] += random()*(s/TOTAL_INTCP)*width/IVLS;
  }
  return genNPowerPoly(intcp, gcoeff * random([-1, 1]), yoffset);
}

function generateGround(){
  const TOTAL_INTCP = 2;
  
  const IVLS = 8;
  
  let s = IVLS + 2;
  let gcoeff = random(...GCOEFF_RANGES[TOTAL_INTCP]) * 10**(2*TOTAL_INTCP - 2)

  let intcp = Array.from(Array(TOTAL_INTCP), (_, i) => ((i*s/TOTAL_INTCP)-1)*width/IVLS);
  
  // randomly generate curves
  for (let i = 0; i < intcp.length; i++){
    intcp[i] += random()*(s/TOTAL_INTCP)*width/IVLS;
  }
  return genNPowerPoly(intcp, gcoeff*random([-1, 1]), 300);
}

function genNPowerPoly(xintcp, gcoeff = 1, yoffset = 0) {
  let terms = [];
  for (i = 0; i < xintcp.length; i++){
    let b = xintcp[i];
    //let c = lcoeff[i];
    binomial = x => (x - b);
    terms.push(binomial);
  }

  ret = (x) => {
    let y = 1;
    for (let t of terms) {
      y *= t(x);
    }
    return y / gcoeff + yoffset;
  };

  return ret;
}

function drawAllIce(){
  for (i = 0; i < iceCurves.length; i++){
    drawIce(iceCurves[i], ICE_COLORS[i], noise(seed+i)*150, iceParallax[i])
  }
}

function drawIce(iceFunc, iceColor, steps, xOffset){
  fill(iceColor);
  noStroke();

  beginShape();

  
  const PAD_STEPS = 40;
  //fill("#000000");
  let x1 = (width * -PAD_STEPS) / steps;
  let y1 =  iceFunc(x1) + noise(x1)*height/2;
  vertex(x1+xOffset, 0);  
  vertex(x1+xOffset, y1);

  let x2,y2;
  for (let i = -PAD_STEPS; i <= steps + PAD_STEPS; i+= 1) {
    x2 = (width * i) / steps;
    y2 =  iceFunc(x2) + noise(x2)*height/2;


    vertex(x2+xOffset, y2);
    x1 = x2;
    y1 = y2;

  }
  vertex(xOffset+x2, 0); 
  endShape(CLOSE);  
}


function drawGround(polyFunc, groundColor, steps){
  fill(groundColor);
  noStroke();

  beginShape();

  vertex(0, height);  
  
  //fill("#000000");
  let x1 = 0;
  let y1 =  polyFunc(x1) + noise(x1)*height/25;
  vertex(x1, y1);

  let x2,y2;
  for (let i = 0; i < steps + 1; i+= 1) {
    x2 = (width * i) / steps;
    y2 =  polyFunc(x2) + noise(x2)*height/25;


    vertex(x2, y2);
    // let m = (y2-y1)/(x2-x1);
    // for (let j = x1; j < x2; j+=1){
    //   let y = m*(j - x1)+y1;
    
    //   gradientLine(j, 0, j, y, "#FFFFFF", "#000000");
    // }

    // Draw th gradient

    //   let co = lerpColor( LIGHT_COLOR, iceColor,  j/width);
    //   //console.log(abs(mouseX-j)/width)
    //   stroke(co);
    //   line(j, 0, j, y);

    
    x1 = x2;
    y1 = y2;

  }
  //fill(iceColor);
  vertex(width, height); 
  endShape(CLOSE);  
}

 // From https://github.com/processing/p5.js/issues/364
 function gradientLine(x1, y1, x2, y2, color1, color2) {
  // linear gradient from start to end of line
  var grad = this.drawingContext.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);

  this.drawingContext.strokeStyle = grad;

  line(x1, y1, x2, y2);
}

let LIGHT_RADIUS = 75; // Half
function drawCursorLight(){
  let lcolor = color(LIGHT_COLOR);
  lcolor.setAlpha(64);
  
  fill(lcolor);

  circle(mouseX, mouseY, 80)

  noStroke();
}

let torches;
function generateTorches(){
  let t = random([1, 2, 3]);
  torches = [];
  let s;
  let isGoodX;

  for (let i =0; i < t; i++){
    isGoodX = false;
    //Choose a random x;
    while (!isGoodX){
      isGoodX = true;
      s = random(50, width-50);
      for (let j = 0; j < torches.length; j++)
        isGoodX &= abs(torches[j].x - s) > 100;
    }

    let t = random(bedFunc(s)+40, height);
    let d = map(t, height, 300, 3, 0.5)
    //console.log(d);
    torches.push({x: s, y: t, scale: d});
    isGoodX = false;
  }
}

const TORCH_WIDTH = 3;
const TORCH_HEIGHT = 50;

const FIRE_COLOR = ["#cb2004", "#fb7604", "#fca204"];
const TORCH_COLOR = "#111111";
const BASE_COLOR = "#bee8ff";
function drawTorch(x, y, scale = 1){
  fill("#FFFFFF");
  noStroke();

  let w = TORCH_WIDTH * scale;
  let h = TORCH_HEIGHT* scale;
  
  let c = 10 * scale;
  let d = c*1.5;
  let e = c*0.5;

  fill(TORCH_COLOR);
  rect(x-w/2, y-h, w, h);

  fill(BASE_COLOR);
  ellipse(x, y, c, e);

  let lcolor = color(LIGHT_COLOR);
  lcolor.setAlpha(64);
  
  fill(lcolor);
  circle(x, y-h, c*3);

  for (let i = 0; i < FIRE_COLOR.length; i++){
    fill(FIRE_COLOR[i]);
    let m = -0.25*i +1;
    ellipse(x, y-h, c*m, d*m);
  }

}

function drawBackground(){ 
    let begin = height/3;
    let end = height;
    let steps = end -begin;
    for (let j = begin; j < height; j+=0.1){
      stroke(lerpColor(color(OCEAN_COLOR), color("#000000"), 1- (j-begin)/(steps)))
      line(0,j, width,j);
    } 
}

function draw() {
  background("#000000");
  drawBackground();
  noiseSeed(seed);

  for (let i = 0; i < iceParallax.length; i++){
    iceParallax[i] = map(mouseX, 0, width, -25*(i+1), 25*(i+1));
  }

  //draw ground
  drawGround(bedFunc, treeColor, bedSteps);

  // draw torches
  for (let t of torches)
    drawTorch(t.x, t.y, t.scale);

  // draw caverns
  drawAllIce();

  // draw cursor 
  drawCursorLight();
}