let circles = [];
let imgs = [];

function preload(){
  //array of imgs for each plant type
imgs[0] = loadImage("assets/pothos golden.PNG"); //https://mountaincrestgardens.com/pothos-golden/
imgs[1] = loadImage("assets/snake plant zeylanica.PNG"); //https://mountaincrestgardens.com/snake-plant-zeylanica/
imgs[2] = loadImage("assets/anthurium red.PNG"); //https://mountaincrestgardens.com/anthurium-red/ 
imgs[3] = loadImage("assets/alocasia regal shield.PNG"); //https://mountaincrestgardens.com/alocasia-regal-shields/
imgs[4] = loadImage("assets/parlor palm.PNG"); //https://mountaincrestgardens.com/parlor-palm-chamaedorea-elegans/



}


function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  textAlign(CENTER, CENTER); // center text horizontally & vertically
  

  // Create some labeled circles
  circles = [
    { x: 80, y: 70, label: "golden\npothos", baseSize: 80, growSize: 140, currentSize: 40, color: color(255, 150, 100) },
    { x: 300, y: 90, label: "snake plant\n'zeylanica", baseSize: 70, growSize: 120, currentSize: 40, color: color(100, 200, 255) },
    { x: 100, y: 300, label: "alocasia\nregal shields ", baseSize: 90, growSize: 160, currentSize: 40, color: color(150, 255, 150) },
    { x: 300, y: 300, label: "parlor\npalm", baseSize: 70, growSize: 100, currentSize: 40, color: color(255, 255, 120) },
{ x: 200, y: 180, label: "red\nanthurium", baseSize: 70, growSize: 120, currentSize: 40, color: color(255, 255, 120) }



  ];
}

function draw() {
  background(245, 245, 220); //light beige color

  for (let c of circles) {
    // check hover
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d < c.baseSize / 2) c.currentSize = lerp(c.currentSize, c.growSize, 0.1); 
    else c.currentSize = lerp(c.currentSize, c.baseSize, 0.1);

    // draw circle
    fill(c.color);
    noStroke();
    ellipse(c.x, c.y, c.currentSize);



    // draw text on hover
    fill(116, 181, 96); // green text color
    stroke(255); //white text stroke
    strokeWeight(2)
;    textSize(c.currentSize/5); //adjust for bigger or smaller text
    text(c.label, c.x, c.y + 50);
  }
}
