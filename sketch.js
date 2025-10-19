let dataJSON;                 // loaded JSON
let imageCache = new Map();   // path -> p5.Image
let circles = [];             // rendered items
let categories = [];          // ["Indoor","Outdoor",...]
let activeFilter = "All";

// UI refs
let btnPanel, filterButtons = [];


function preload() {
  // 1) Load JSON first
  dataJSON = loadJSON("plants.json",
    () => console.log("✅ JSON loaded"),
    (err) => console.error("❌ JSON failed to load", err)
  );
}

function setup() {
  createCanvas(750, 500);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);

  // 2) Once JSON exists, preload all images it references
  const plants = (dataJSON && dataJSON.plants) ? dataJSON.plants : [];
  // Collect categories (unique)
  categories = [...new Set(plants.map(p => p.category))];

  
  plants.forEach(p => {
    if (!imageCache.has(p.image)) {
      const img = loadImage(
        p.image,
        (im) => console.log(`✅ Loaded: ${p.image} (${im.width}x${im.height})`),
        (err) => console.error(`❌ FAILED: ${p.image}`, err)
      );
      imageCache.set(p.image, img);
    }
  });

  // 3) Build circle objects
  for (const p of plants) {
    circles.push({
      x: random(80, width - 80),  // use JSON value if present
    y: random(80, height - 80), //tthese are weird, working wonky with the code
      tx: 0, ty: 0,
      baseSize: 90,
      growSize: 140,
      currentSize: 90,
      label: p.label,
      category: p.category,
      link: p.link,
      imgPath: p.image,             // we’ll read the actual image from imageCache each frame
      alpha: 255
    });
  }

  // 4) Build filter UI (All + per-category)
  buildFilterUI();

  // 5) Initial layout
  relayout();
}

function draw() {
  background(242);

  for (const c of circles) {
    const visible = activeFilter === "All" || c.category === activeFilter;

    // fade/move
    const targetAlpha = visible ? 255 : 0;
    c.alpha = lerp(c.alpha, targetAlpha, 0.2);
    c.x = lerp(c.x, c.tx, 0.12); //can toggle these two on and off for a fade out effect instead, but will need to set x and y pos  manually
    c.y = lerp(c.y, c.ty, 0.12);

    // hover growth
    const d = dist(mouseX, mouseY, c.x, c.y);
    const targetSize = (visible && d < c.baseSize / 2) ? c.growSize : c.baseSize;
    c.currentSize = lerp(c.currentSize, targetSize, 0.12);

    if (c.alpha < 2) continue;

    // get (maybe still loading) image
    const img = imageCache.get(c.imgPath);

    // clip to circle & draw image (cover fit)
    push();
    translate(c.x, c.y);
    const ctx = drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, c.currentSize / 2, 0, TWO_PI);
    ctx.clip();

    if (img && img.width > 0) {
      const diameter = c.currentSize;
      const scale = max(diameter / img.width, diameter / img.height);
      tint(255, c.alpha);
      image(img, 0, 0, img.width * scale, img.height * scale);
      noTint();
    } else {
      // placeholder while image loads or if failed
      noStroke(); fill(220, 80, 80, c.alpha);
      circle(0, 0, c.currentSize);
      fill(255); textSize(12); text("loading…", 0, 0);
    }
    ctx.restore();
    pop();

    // ring + label
    noFill(); stroke(116, 181, 96, c.alpha); strokeWeight(3);
    circle(c.x, c.y, c.currentSize);

    fill(255); // green text color
    stroke(116, 181, 96); //white text stroke
    strokeWeight(3);
    //fill(0, 150 * (c.alpha / 255));
    textSize(c.currentSize / 6);
    text(c.label, c.x, c.y + 50);
  }

  // pointer cursor only over visible circles
  const over = circles.some(c => {
    const vis = activeFilter === "All" || c.category === activeFilter;
    return vis && c.alpha > 200 && dist(mouseX, mouseY, c.x, c.y) < c.currentSize / 2;
  });
  cursor(over ? "pointer" : "default"); //change cursor to a pointer finger
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

/* ------------- UI + Layout ------------- */
function buildFilterUI() {
  btnPanel = createDiv()
    .style("position", "absolute")
    .style("top", "10px")
    .style("left", "10px")
    .style("padding", "8px")
    .style("background", "rgba(255,255,255,0.95)")
    .style("border-radius", "12px")
    .style("box-shadow", "0 4px 16px rgba(0,0,0,0.12)")
    .style("font-family", "system-ui, sans-serif");

  createSpan("Filter: ").parent(btnPanel);

  // All button
  makeButton("All", () => setFilter("All"));

  // One button per category discovered from JSON
  categories.forEach(cat => {
    makeButton(cat, () => setFilter(cat));
  });

  highlightActive();
}

function makeButton(label, onClick) {
  const b = createButton(label).parent(btnPanel)
    .style("margin-right", "4px")
    .style("border", "1px solid #ccc")
    .style("padding", "6px 10px")
    .style("border-radius", "8px")
    .style("background", "#fff");
  b.mousePressed(onClick);
  filterButtons.push(b);
}

function setFilter(f) {
  activeFilter = f;
  highlightActive();
  relayout();
}

function highlightActive() {
  filterButtons.forEach(b => {
    const isActive = b.elt.innerText === activeFilter;
    b.style("background", isActive ? "#111" : "#fff")
     .style("color", isActive ? "#fff" : "#111");
  });
}

//handles positioning of circles
function relayout() {
  const visible = circles.filter(c => activeFilter === "All" || c.category === activeFilter);
  const margin = 80; //makes it look even and centered to me
  const spacing = 150;
  const cols = 5; 
  let col = 0, row = 0;

  for (const c of visible) {
    c.tx = margin + col * spacing;
    c.ty = margin + row * spacing;
    col++;
    if (col >= cols) { col = 0; row++; }
  }
  // park hidden ones off-canvas
  for (const c of circles) {
    if (visible.includes(c)) continue;
    c.tx = -200; c.ty = height + 200;
  }
}
