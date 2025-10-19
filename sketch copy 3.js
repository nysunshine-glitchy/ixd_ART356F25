let circles = [];
let imgs = {};
//let links = [];
let activeFilter = "All"; // "All" | "Indoor" | "Outdoor"

// UI
let btnAll, btnIndoor, btnOutdoor;

function preload() {
  //array of imgs for each plant type
 
    imgs.pothos = loadImage("assets/pothos golden.PNG"); //https://mountaincrestgardens.com/pothos-golden/
    imgs.snakeplant = loadImage("assets/snake plant zeylanica.PNG"); //https://mountaincrestgardens.com/snake-plant-zeylanica/
    imgs.parlorpalm = loadImage("assets/parlor palm.PNG"); //https://mountaincrestgardens.com/parlor-palm-chamaedorea-elegans/
    imgs.anthurium = loadImage("assets/anthurium red.PNG"); //https://mountaincrestgardens.com/anthurium-red/
    imgs.alocasia = loadImage("assets/alocasia regal shield.PNG"); //https://mountaincrestgardens.com/alocasia-regal-shields/
    imgs.fern = loadImage("assets/fern lemonn buttonn.PNG"); //https://mountaincrestgardens.com/fern-lemon-button/
    imgs.ficus = loadImage("assets/ficus ruby pink.PNG"); //https://mountaincrestgardens.com/ficus-elastica-ruby-pink/
    imgs.philo = loadImage("assets/pliodendron cordatum heartleaf.PNG"); //https://mountaincrestgardens.com/philodendron-cordatum-heartleaf/
  
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  textAlign(CENTER, CENTER); // center text horizontally & vertically

  // data: label, image, link, category
  const data = [
    {
      label: "golden pothos",
      img: imgs.pothos,
      link: "https://mountaincrestgardens.com/pothos-golden/",
      category: "Indoor",
    },
    {
      label: "snake plant\n'zeylanica'",
      img: imgs.snakeplant,
      link: "https://mountaincrestgardens.com/snake-plant-zeylanica/",
      category: "Outdoor", //test
    },
  ];

  // make circles
  for (const d of data) {
    circles.push({
      x: random(80, width - 80),
      y: random(80, height - 80),
      tx: 0,
      ty: 0, // target positions for layout animation
      baseSize: 90,
      growSize: 140,
      currentSize: 90,
      label: d.label,
      img: d.img,
      link: d.link,
      category: d.category,
      alpha: 255, // for fade in/out
    });
    
  }
  // UI buttons
  makeFilterUI();

  // Initial layout
  relayout();
}

function draw() {
  background(220, 213, 184); //light brownish color

  for (const c of circles) {
    const visible = activeFilter === "All" || c.category === activeFilter;

    // Fade & move toward target layout
    const targetAlpha = visible ? 255 : 0;
    c.alpha = lerp(c.alpha, targetAlpha, 0.2);
    //c.x = lerp(c.x, c.tx, 0.12);
    //c.y = lerp(c.y, c.ty, 0.12);

    // Hover growth only if visible
    const d = dist(mouseX, mouseY, c.x, c.y);
    const targetSize = visible && d < c.baseSize / 2 ? c.growSize : c.baseSize;
    c.currentSize = lerp(c.currentSize, targetSize, 0.12);

    // Skip drawing when fully hidden 
    if (c.alpha < 2) continue;

    // Circular clipped image
    push();
    translate(c.x, c.y);
    const ctx = drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, c.currentSize / 2, 0, TWO_PI);
    ctx.clip();

    if (c.img && c.img.width > 0) {
      const diameter = c.currentSize;
      const scale = max(diameter / c.img.width, diameter / c.img.height); // cover
      tint(255, c.alpha);
      image(c.img, 0, 0, c.img.width * scale, c.img.height * scale);
      noTint();
    } else {
      noStroke();
      fill(210, c.alpha);
      circle(0, 0, c.currentSize);
    }
    ctx.restore();
    pop();

    // Ring + label
    noFill();
    stroke(255, c.alpha);
    strokeWeight(3);
    circle(c.x, c.y, c.currentSize);

    noStroke();
    fill(0, 150 * (c.alpha / 255));
    textSize(c.currentSize / 6);
    text(c.label, c.x, c.y + 200);
  }

  // pointer only when hovering a visible circle
  const over = circles.some((c) => {
    const vis = activeFilter === "All" || c.category === activeFilter;
    return (
      vis && c.alpha > 200 && dist(mouseX, mouseY, c.x, c.y) < c.currentSize / 2
    );
  });
  cursor(over ? "pointer" : "default");
}

function mousePressed() {
  for (const c of circles) {
    const vis = activeFilter === "All" || c.category === activeFilter;
    if (vis && dist(mouseX, mouseY, c.x, c.y) < c.currentSize / 2) {
      window.open(c.link, "_blank");
      break;
    }
  }
}

/* ---------- UI + Layout ---------- */
function makeFilterUI() {
  const panel = createDiv()
    .style("position", "absolute")
    .style("top", "10px")
    .style("left", "10px")
    .style("padding", "8px")
    .style("background", "rgba(255,255,255,0.95)")
    .style("border-radius", "12px")
    .style("box-shadow", "0 4px 16px rgba(0,0,0,0.12)")
    .style("font-family", "system-ui, sans-serif");

  createSpan("Filter: ").parent(panel);

  btnAll = makeSegButton(panel, "All", () => setFilter("All"));
  btnIndoor = makeSegButton(panel, "Indoor", () => setFilter("Indoor"));
  btnOutdoor = makeSegButton(panel, "Outdoor", () => setFilter("Outdoor"));

  highlightActive();
}

function makeSegButton(parent, label, onClick) {
  const b = createButton(label)
    .parent(parent)
    .style("margin-right", "4px")
    .style("border", "1px solid #ccc")
    .style("padding", "6px 10px")
    .style("border-radius", "8px")
    .style("background", "#fff");
  b.mousePressed(onClick);
  return b;
}

function setFilter(f) {
  activeFilter = f;
  highlightActive();
  relayout();
}

function highlightActive() {
  const btns = [btnAll, btnIndoor, btnOutdoor];
  for (const b of btns) {
    const isActive = b && b.elt.innerText === activeFilter;
    b?.style("background", isActive ? "#111" : "#fff").style(
      "color",
      isActive ? "#fff" : "#111"
    );
  }
}

// Compute grid targets for only the active set
function relayout() {
  // Grab the circles to show
  const visible = circles.filter(
    (c) => activeFilter === "All" || c.category === activeFilter
  );

  const margin = 80; // canvas padding
  const spacing = 150; // center spacing
  const cols = max(1, floor((width - margin * 2) / spacing));
  let col = 0,
    row = 0;

  // Assign targets to visible ones
  for (const c of visible) {
    c.tx = margin + col * spacing;
    c.ty = margin + row * spacing;
    col++;
    if (col >= cols) {
      col = 0;
      row++;
    }
  }

  // Park hidden ones off-canvas (so they lerp away)
  for (const c of circles) {
    if (visible.includes(c)) continue;
    c.tx = -200; // off to the left; you can change this to keep last position instead
    c.ty = height + 200;
  }
}
