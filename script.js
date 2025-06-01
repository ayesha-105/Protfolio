function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

function openModal(src) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImage");
  modal.style.display = "block";
  modalImg.src = src;
}

function closeModal() {
  document.getElementById("imgModal").style.display = "none";
}

// Optional: Close modal on Esc key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// 3D Background
let scene, camera, renderer, analyticsMesh;
const objects = [];

function createBarChart(width, height, depth) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.7,
    emissive: 0x00ff88,
    emissiveIntensity: 0.2,
  });
  const bar = new THREE.Mesh(geometry, material);
  return bar;
}

function createDataPoint() {
  const geometry = new THREE.SphereGeometry(0.05, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0x4fc3dc,
    transparent: true,
    opacity: 0.8,
    emissive: 0x4fc3dc,
    emissiveIntensity: 0.2,
  });
  return new THREE.Mesh(geometry, material);
}

function createPieChart() {
  const group = new THREE.Group();
  const segments = 5;
  const radius = 0.5;

  for (let i = 0; i < segments; i++) {
    const geometry = new THREE.CircleGeometry(
      radius,
      32,
      (i * 2 * Math.PI) / segments,
      (2 * Math.PI) / segments
    );
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(i / segments, 0.8, 0.5),
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      emissive: new THREE.Color().setHSL(i / segments, 0.8, 0.5),
      emissiveIntensity: 0.2,
    });
    const segment = new THREE.Mesh(geometry, material);
    group.add(segment);
  }
  return group;
}

function createLineGraph() {
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector3((i - 5) * 0.2, Math.sin(i * 0.5) * 0.3, 0));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0xff3366,
    linewidth: 2,
  });
  return new THREE.Line(geometry, material);
}

function createDonutChart() {
  const group = new THREE.Group();
  const segments = 4;
  const outerRadius = 0.5;
  const innerRadius = 0.3;

  for (let i = 0; i < segments; i++) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.arc(
      0,
      0,
      outerRadius,
      (i * 2 * Math.PI) / segments,
      ((i + 1) * 2 * Math.PI) / segments,
      false
    );
    shape.lineTo(0, 0);

    const hole = new THREE.Path();
    hole.arc(0, 0, innerRadius, 0, 2 * Math.PI, true);
    shape.holes.push(hole);

    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(i / segments, 0.9, 0.6),
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      emissive: new THREE.Color().setHSL(i / segments, 0.9, 0.6),
      emissiveIntensity: 0.2,
    });
    const segment = new THREE.Mesh(geometry, material);
    group.add(segment);
  }
  return group;
}

function createAreaChart() {
  const group = new THREE.Group();
  const points = [];
  const areaPoints = [];

  // Create curve points
  for (let i = 0; i < 10; i++) {
    const x = (i - 5) * 0.2;
    const y = Math.sin(i * 0.5) * 0.3 + 0.3;
    points.push(new THREE.Vector3(x, y, 0));
    areaPoints.push(new THREE.Vector3(x, y, 0));
  }

  // Add bottom points for area
  for (let i = 9; i >= 0; i--) {
    areaPoints.push(new THREE.Vector3((i - 5) * 0.2, 0, 0));
  }

  // Create line
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffaa });
  const line = new THREE.Line(lineGeometry, lineMaterial);

  // Create area
  const areaGeometry = new THREE.BufferGeometry().setFromPoints(areaPoints);
  const areaMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffaa,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  });
  const area = new THREE.Mesh(areaGeometry, areaMaterial);

  group.add(line);
  group.add(area);
  return group;
}

function initBackground() {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("background-canvas").appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Create analytics elements
  for (let i = 0; i < 4; i++) {
    // Add bar charts
    const bars = new THREE.Group();
    for (let j = 0; j < 5; j++) {
      const height = 0.2 + Math.random() * 0.8;
      const bar = createBarChart(0.1, height, 0.1);
      bar.position.x = (j - 2) * 0.15;
      bars.add(bar);
    }
    bars.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    );
    bars.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    objects.push(bars);
    scene.add(bars);

    // Add pie charts
    const pie = createPieChart();
    pie.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    );
    pie.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    objects.push(pie);
    scene.add(pie);

    // Add line graphs
    const graph = createLineGraph();
    graph.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    );
    graph.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    objects.push(graph);
    scene.add(graph);

    // Add donut charts
    const donut = createDonutChart();
    donut.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    );
    donut.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    objects.push(donut);
    scene.add(donut);

    // Add area charts
    const area = createAreaChart();
    area.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    );
    area.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    objects.push(area);
    scene.add(area);
  }

  // Add scattered data points
  for (let i = 0; i < 150; i++) {
    const point = createDataPoint();
    point.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    );
    objects.push(point);
    scene.add(point);
  }

  camera.position.z = 6;
}

function animateBackground() {
  requestAnimationFrame(animateBackground);

  // Rotate and animate objects
  objects.forEach((obj, index) => {
    obj.rotation.x += 0.0008;
    obj.rotation.y += 0.0015;

    // Add floating animation
    obj.position.y += Math.sin(Date.now() * 0.0008 + index * 0.5) * 0.0008;

    // Mouse interaction
    if (mouseX && mouseY) {
      obj.rotation.x += mouseY * 0.000008;
      obj.rotation.y += mouseX * 0.000008;
    }
  });

  renderer.render(scene, camera);
}

// Mouse movement tracking
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX - window.innerWidth / 2;
  mouseY = event.clientY - window.innerHeight / 2;
});

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize background on load
window.addEventListener("load", () => {
  initBackground();
  animateBackground();
});

// Optional: Close modal on Esc key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

document.querySelectorAll(".memorial-carousel").forEach((carousel) => {
  const swiper = new Swiper(carousel, {
    effect: "fade",
    fadeEffect: { crossFade: true },
    loop: true,
    autoplay: false,
  });

  // Click image to go to next slide
  carousel.addEventListener("click", () => {
    swiper.slideNext();
  });
});
