/* exported setup, draw */
let seed = 10943;

const grassColor = "#e1ac4a";
const OCEAN_COLOR = "#0AB7B2";

const treeColor = "#3d1803";
const leaveColor = "#233610";
const sunColor = [254,254,254,80]; // with opacity

let iceCurves = Array(4);
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
  ICE_COLORS = [color("#33B7D9"), color("#4CD3BB"), color("#29E3F9"), color("#A1EBFB")];
  generateAllIce();
  bedFunc = generateGround();

}


function newSeed(){
  seed++;
  generateAllIce(); 
  bedFunc = generateGround();
  console.log(bedFunc(100))
  bedSteps = round(random(30, 150));
}


const GCOEFF_RANGES = {2: [10, 20], 4:[30, 60], 6:[200, 250]};
function generateAllIce(){
  //console.log(iceCurves.length)
  for (let i = 0; i < iceCurves.length; i++){
    let yoffset = (i != iceCurves.length-1) ? (iceCurves.length-i)*height/8 : height/3;
    iceCurves[i] = generateIce(yoffset);
  }
}

function generateIce(yoffset=0){
  const TOTAL_INTCP = random([4,6]);
  
  const IVLS = 16;
  const MINCOEFF = 0.5;
  const MAXCOEFF = 1.5; 
  
  let s = IVLS + 2;
  let gcoeff = random(...GCOEFF_RANGES[TOTAL_INTCP]) * 10**(2*TOTAL_INTCP - 2)

  let intcp = Array.from(Array(TOTAL_INTCP), (_, i) => ((i*s/TOTAL_INTCP)-1)*width/IVLS);
  
  // randomly generate curves
  for (let i = 0; i < intcp.length; i++){
    intcp[i] += random()*(s/TOTAL_INTCP)*width/IVLS;
  }
  return genNPowerPoly(intcp, gcoeff * random([-1, 1]), yoffset);
}

function generateLight(){

}

function generateGround(){
  const TOTAL_INTCP = 2;
  
  const IVLS = 16;
  
  let s = IVLS + 2;
  let gcoeff = random(...GCOEFF_RANGES[TOTAL_INTCP]) * 10**(2*TOTAL_INTCP - 2)

  let intcp = Array.from(Array(TOTAL_INTCP), (_, i) => ((i*s/TOTAL_INTCP)-1)*width/IVLS);
  
  // randomly generate curves
  for (let i = 0; i < intcp.length; i++){
    intcp[i] += random()*(s/TOTAL_INTCP)*width/IVLS;
  }
  return genNPowerPoly(intcp, gcoeff, -100);
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
    drawIce(iceCurves[i], ICE_COLORS[i], noise(seed+i)*150)
  }
}

function drawIce(iceFunc, iceColor, steps){
  fill(iceColor);
  noStroke();

  beginShape();

  vertex(0, 0);  
  
  //fill("#000000");
  let x1 = 0;
  let y1 =  iceFunc(x1) + noise(x1)*height/25;
  vertex(x1, y1);

  let x2,y2;
  for (let i = 0; i < steps + 1; i+= 1) {
    x2 = (width * i) / steps;
    y2 =  iceFunc(x2) + noise(x2)*height/25;


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
  vertex(width, 0); 
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
    stroke(lcolor);
    line(mouseX, 0, mouseX, height);
    
    for (let i =1; i < LIGHT_RADIUS; i++){
      lcolor.setAlpha(64*(1-i/LIGHT_RADIUS));
      stroke(lcolor);
      line(mouseX + i, 0, mouseX+i, height);  
      line(mouseX - i, 0, mouseX-i, height);
      
    }
    noStroke();
}

function drawBackground(){ 

    let begin = height/3;
    let end = height;
    let steps = end -begin;
    for (let j = begin; j < height; j+=0.1){
      stroke(lerpColor(color("#000000"), color(OCEAN_COLOR), 1- (j-begin)/(steps)))
      line(0,j, width,j);
    } 
}

function draw() {
  background(OCEAN_COLOR);
  drawBackground();
  noiseSeed(seed);
  
  // x = noise(xoff)*width;
  // y = noise(yoff)*height;
  // circle(x, y, 20);
  // xoff += 0.01;
  // yoff += 0.03;

  //draw ground
  drawIce(bedFunc, treeColor, bedSteps);
  drawAllIce();
  drawCursorLight();
  //circle(20, 20, 30);
  
    //randomSeed(seed); //Fidure out the control flow
    //circle(20, 200, 100);
    
    
    // //noiseSeed(seed);

    // //background(100);
  
    // noStroke();
  
    // // fill(skyColor);
    // // rect(0, 0, width, height / 2);
  
    // // An example of making something respond to the mouse
    // // fill(...sunColor);
    // // ellipse(mouseX,0,30,30);
    // // ellipse(mouseX,0,50,50);
    // // ellipse(mouseX,0,100,100);
    // // ellipse(mouseX,0,200,200);
  
    // // fill(grassColor);
    // // rect(0, height / 2, width, height / 2);
  
    // // An example of drawing an irregular polygon
    
}