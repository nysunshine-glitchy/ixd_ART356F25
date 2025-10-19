let circles = [];
let imgs = [];
let links = [];
let categories = new Set(); //unique category names
let activeCategories = new Set(); //ccurrently selectced categories


function preload() {
  //array of imgs for each plant type
  imgs = [
    loadImage("assets/pothos golden.PNG"), //https://mountaincrestgardens.com/pothos-golden/
    loadImage("assets/snake plant zeylanica.PNG"), //https://mountaincrestgardens.com/snake-plant-zeylanica/
    loadImage("assets/parlor palm.PNG"), //https://mountaincrestgardens.com/parlor-palm-chamaedorea-elegans/
    loadImage("assets/anthurium red.PNG"), //https://mountaincrestgardens.com/anthurium-red/
    loadImage("assets/alocasia regal shield.PNG"), //https://mountaincrestgardens.com/alocasia-regal-shields/
    loadImage("assets/fern lemonn buttonn.PNG"), //https://mountaincrestgardens.com/fern-lemon-button/
    loadImage("assets/ficus ruby pink.PNG"), //https://mountaincrestgardens.com/ficus-elastica-ruby-pink/
    loadImage("assets/pliodendron cordatum heartleaf.PNG"), //https://mountaincrestgardens.com/philodendron-cordatum-heartleaf/
  ];
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  textAlign(CENTER, CENTER); // center text horizontally & vertically

//array of links, must go in the same order as the plants/circles being pushed
  links = [
    "https://mountaincrestgardens.com/pothos-golden/",
    "https://mountaincrestgardens.com/snake-plant-zeylanica/",
    "https://mountaincrestgardens.com/parlor-palm-chamaedorea-elegans/",
    "https://mountaincrestgardens.com/anthurium-red/",
    "https://mountaincrestgardens.com/alocasia-regal-shields/",
    "https://mountaincrestgardens.com/fern-lemon-button/",
    "https://mountaincrestgardens.com/ficus-elastica-ruby-pink/",
    "https://mountaincrestgardens.com/philodendron-cordatum-heartleaf/",
  ];

  // Create some labeled circles
  const positions = [
    {
      x: 80,
      y: 70,
      label: "golden pothos",
    },
    {
      x: 300,
      y: 90,
      label: "snake plant\n'zeylanica'",
    },
    {
      x: 100,
      y: 300,
      label: "parlor\npalm",
    },
    {
      x: 300,
      y: 300,
      label: "red\nanthurium",
    },
    {
      x: 200,
      y: 180,
      label: "alocasia\n'regal shields'",
    },
    {
      x: 490,
      y: 60,
      label: "lemon button\nfern",
    },
    {
      x: 420,
      y: 190,
      label: "ruby pink\nficus elastica",
    },
    {
      x: 530,
      y: 300,
      label: "heartleaf\nphilodendron",
    },
  ];

  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    circles.push({
      x: p.x,
      y: p.y,
      label: p.label,
      baseSize: 90, //can do a random array but i don't think that's neccesary rn
      growSize: 140,
      currentSize: 90,
      img: imgs[i % imgs.length],
      link: links[i],
    });
  }
}

function draw() {
  background(220, 213, 184); //light brownish color

  //if (imgs[0]) image(imgs[0], width/2, height/2); // should show image to test if they're loading properly

  for (let c of circles) {
    // check hover
    const d = dist(mouseX, mouseY, c.x, c.y);
    c.currentSize = lerp(
      c.currentSize,
      d < c.baseSize / 2 ? c.growSize : c.baseSize,
      0.12
    );

    // draw circular clipped image
    push();
    translate(c.x, c.y);

    // Create circular clipping region
    const ctx = drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, c.currentSize / 2, 0, TWO_PI);
    ctx.clip();

    // Fit image to circle (“cover” style)
    if (c.img && c.img.width > 0 && c.img.height > 0) {
      const diameter = c.currentSize;
      const scale = max(diameter / c.img.width, diameter / c.img.height); //"cover"
      image(c.img, 0, 0, c.img.width * scale, c.img.height * scale);
    } else {
      // fallback fill while image loads
      noStroke();
      fill(200);
      circle(0, 0, c.currentSize);
    }

    ctx.restore();
    pop();

    // Optional: draw a subtle border ring
    noFill();
    stroke(255);
    strokeWeight(3);
    circle(c.x, c.y, c.currentSize);

    // optional ring + label
    noFill();
    stroke(255);
    strokeWeight(3);
    circle(c.x, c.y, c.currentSize);
    noStroke();
    fill(0, 150);
    textSize(c.currentSize / 6);
    fill(190, 219, 146);
    stroke(255);
    text(c.label, c.x, c.y + 65);
  }
}

function mousePressed() {
  for (let c of circles) {
    const d = dist(mouseX, mouseY, c.x, c.y);
    if (d < c.currentSize / 2) {
      window.open(c.link, "_blank"); //open in new tab
      break; // stop showing after first click
    }
  }
}
