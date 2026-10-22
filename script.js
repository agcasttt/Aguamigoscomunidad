/* -------------------------------------------------------------
   1. DATOS MUNDIALES SOBRE EL AGUA Y GOTITA INTERACTIVA EN HERO
------------------------------------------------------------- */
const datosAguaMundo = [
  "🌐 <b>Solo el 2.5%</b> del agua del planeta es dulce, y más del 68% está congelada en glaciares.",
  "🚰 <b>2,200 millones</b> de personas en el mundo carecen de acceso a agua potable gestionada de forma segura (ONU Agua).",
  "🌍 <b>ODS 6:</b> Busca garantizar la disponibilidad y la gestión sostenible del agua y el saneamiento para todos hacia el 2030.",
  "🏞️ Se estima que para <b>2050</b>, más de 5,000 millones de personas sufrirán escasez de agua debido al cambio climático y la sobreexplotación.",
  "🛁 Un grifo goteando puede desperdiciar más de <b>11,000 litros de agua</b> al año.",
  "🌊 El <b>80% de las aguas residuales</b> del mundo retornan al medio ambiente sin ser tratadas adecuadamente.",
  "🌾 La agricultura representa cerca del <b>70% del consumo mundial</b> de agua dulce."
];

let indiceDatoActual = 0;
const gotitaHero = document.getElementById('gotita-hero');
const gotitaBubble = document.getElementById('gotitaBubble');

function mostrarDatoMundial() {
  const dato = datosAguaMundo[indiceDatoActual];
  gotitaBubble.innerHTML = `💧 <b>¿Sabías que?</b><br>${dato}`;
  gotitaBubble.classList.add('active');

  // Incrementar índice para la siguiente interacción
  indiceDatoActual = (indiceDatoActual + 1) % datosAguaMundo.length;

  // Lanza partículas en las coordenadas de la gotita
  const rect = gotitaHero.getBoundingClientRect();
  spawnWaterParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

gotitaHero.addEventListener('click', mostrarDatoMundial);

// Desplegar primer dato automáticamente tras 1.5 segundos
setTimeout(() => {
  gotitaBubble.classList.add('active');
}, 1500);


/* -------------------------------------------------------------
   2. SISTEMA GLOBAL DE PARTICULAS AL HACER CLIC EN "AGUA"
------------------------------------------------------------- */
const pCanvas = document.getElementById('particles-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticlesCanvas() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeParticlesCanvas);
resizeParticlesCanvas();

class WaterParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 6 + 3;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 1.5;
    this.gravity = 0.12;
    this.alpha = 1;
    this.color = Math.random() > 0.3 ? '#00b4d8' : '#90e0ef';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.alpha -= 0.02;
  }
  draw() {
    pCtx.save();
    pCtx.globalAlpha = Math.max(0, this.alpha);
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    pCtx.fillStyle = this.color;
    pCtx.fill();
    
    pCtx.beginPath();
    pCtx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
    pCtx.fillStyle = '#ffffff';
    pCtx.fill();
    pCtx.restore();
  }
}

function spawnWaterParticles(x, y) {
  for (let i = 0; i < 28; i++) {
    particles.push(new WaterParticle(x, y));
  }
}

function animateParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('click', (e) => {
  const target = e.target;
  const textContent = target.textContent || target.innerText || "";
  const isWaterWord = target.classList.contains('water-trigger') || /agua|aguamigos/i.test(textContent);

  if (isWaterWord) {
    spawnWaterParticles(e.clientX, e.clientY);
  }
});


/* -------------------------------------------------------------
   3. CONEXIÓN DE ORGANIZACIONES MEDIANTE LÍNEAS SVG Y VALIDACIÓN
------------------------------------------------------------- */
const plataformas = [
  {
    id: "water-reporter",
    nombre: "Water Reporter",
    desc: "Plataforma diseñada para que comunidades, voluntariados y organizaciones ambientales puedan monitorear, documentar y proteger cuerpos de agua locales."
  },
  {
    id: "crowdwater",
    nombre: "CrowdWater",
    desc: "Desarrollado por la Universidad de Zúrich que recolecta datos hidrológicos globalmente mediante una app móvil, registrando los niveles de agua, contaminación y secado de ríos."
  },
  {
    id: "eyeonwater",
    nombre: "EyeOnWater",
    desc: "Iniciativa europea donde los voluntariados miden y registran el color y la claridad del agua de ríos, lagos y mares."
  }
];

let selectedEmpresa = null;
let selectedInfo = null;
let conexionesHechas = [];

function iniciarJuegoConexion() {
  const colEmpresas = document.getElementById("colEmpresas");
  const colInfo = document.getElementById("colInfo");
  colEmpresas.innerHTML = "";
  colInfo.innerHTML = "";
  conexionesHechas = [];
  limpiarLineasSVG();

  const infoShuffled = [...plataformas].sort(() => Math.random() - 0.5);

  plataformas.forEach(item => {
    const card = document.createElement("div");
    card.className = "match-card";
    card.dataset.id = item.id;
    card.innerHTML = `<h3 style="margin:0; color:var(--azul-profundo);">${item.nombre}</h3>`;
    card.addEventListener("click", () => seleccionarEmpresa(card, item.id));
    colEmpresas.appendChild(card);
  });

  infoShuffled.forEach(item => {
    const card = document.createElement("div");
    card.className = "match-card";
    card.dataset.id = item.id;
    card.innerHTML = `<p style="margin:0; font-size:0.92rem; line-height:1.5;">${item.desc}</p>`;
    card.addEventListener("click", () => seleccionarInfo(card, item.id));
    colInfo.appendChild(card);
  });
}

function seleccionarEmpresa(card, id) {
  if (card.classList.contains("matched-correct")) return;
  document.querySelectorAll("#colEmpresas .match-card").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");
  selectedEmpresa = { card, id };
  verificarConexion();
}

function seleccionarInfo(card, id) {
  if (card.classList.contains("matched-correct")) return;
  document.querySelectorAll("#colInfo .match-card").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");
  selectedInfo = { card, id };
  verificarConexion();
}

function verificarConexion() {
  if (selectedEmpresa && selectedInfo) {
    const toast = document.getElementById("feedbackToast");
    
    if (selectedEmpresa.id === selectedInfo.id) {
      // Correcto
      selectedEmpresa.card.classList.remove("selected");
      selectedInfo.card.classList.remove("selected");
      selectedEmpresa.card.classList.add("matched-correct");
      selectedInfo.card.classList.add("matched-correct");

      // Trazar línea permanente en verde
      dibujarLineaSVG(selectedEmpresa.card, selectedInfo.card, "var(--verde-exito)");

      // Feedback
      toast.className = "feedback-toast success";
      toast.textContent = "¡Correcto! Has conectado " + selectedEmpresa.id.replace('-', ' ') + " adecuadamente.";

      const rect = selectedInfo.card.getBoundingClientRect();
      spawnWaterParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

      conexionesHechas.push(selectedEmpresa.id);
      if (conexionesHechas.length === plataformas.length) {
        toast.textContent = "🎉 ¡Felicidades! Has conectado todas las iniciativas correctamente.";
      }
    } else {
      // Incorrecto
      const eCard = selectedEmpresa.card;
      const iCard = selectedInfo.card;
      eCard.classList.add("wrong");
      iCard.classList.add("wrong");

      // Dibujar línea roja temporal
      const tempLine = dibujarLineaSVG(eCard, iCard, "var(--rojo-error)");

      toast.className = "feedback-toast error";
      toast.textContent = "❌ Incorrecto, intenta de nuevo conectar el título con su información correspondiente.";

      setTimeout(() => {
        eCard.classList.remove("wrong", "selected");
        iCard.classList.remove("wrong", "selected");
        if (tempLine) tempLine.remove();
      }, 800);
    }
    selectedEmpresa = null;
    selectedInfo = null;
  }
}

function dibujarLineaSVG(el1, el2, color) {
  const svg = document.getElementById("lines-svg");
  const wrapperRect = document.querySelector(".match-wrapper").getBoundingClientRect();
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();

  const x1 = r1.right - wrapperRect.left;
  const y1 = r1.top + r1.height / 2 - wrapperRect.top;
  const x2 = r2.left - wrapperRect.left;
  const y2 = r2.top + r2.height / 2 - wrapperRect.top;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const cx1 = x1 + (x2 - x1) / 2;
  const d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx1} ${y2}, ${x2} ${y2}`;

  path.setAttribute("d", d);
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", "4");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-linecap", "round");

  svg.appendChild(path);
  return path;
}

function limpiarLineasSVG() {
  document.getElementById("lines-svg").innerHTML = "";
}

window.addEventListener("resize", () => {
  limpiarLineasSVG();
  document.querySelectorAll("#colEmpresas .matched-correct").forEach(eCard => {
    const id = eCard.dataset.id;
    const iCard = document.querySelector(`#colInfo .matched-correct[data-id="${id}"]`);
    if (iCard) dibujarLineaSVG(eCard, iCard, "var(--verde-exito)");
  });
});

iniciarJuegoConexion();


/* -------------------------------------------------------------
   4. NACIMIENTOS DE AGUA EN MÉXICO
------------------------------------------------------------- */
const datosNacimientos = {
  "Puebla": [
    {
      nombre: "Almoloya (Ojo de Agua)",
      ubicacion: "Chignahuapan, Puebla",
      coordenadas: "19.843017, -98.020331",
      descripcion: "Manantial natural de agua dulce subterránea que alimenta la laguna local y abastece a zonas circundantes.",
      recomendaciones: [
        "Evitar tirar basuras o desechos orgánicos en las riberas.",
        "No utilizar jabones ni bloqueadores no biodegradables.",
        "Respetar la vegetación acuática nativa."
      ]
    },
    {
      nombre: "Manantiales de San Baltazar Tetela",
      ubicacion: "Cuautinchán / Presa Valsequillo, Puebla",
      coordenadas: "18.904745,-98.176961",
      descripcion: "Afloramientos subterráneos que nutren la cuenca central del estado de Puebla.",
      recomendaciones: [
        "Mantener el área libre de vertidos químicos agropecuarios.",
        "Promover la reforestación para favorecer la infiltración de lluvia."
      ]
    }
  ],
  "Veracruz": [
    {
      nombre: "Nacimiento del Río Filobobos",
      ubicacion: "Tlapacoyan / Atzalan, Veracruz",
      coordenadas: "19.982238, -97.174235",
      descripcion: "Manantial de alta montaña que da origen a un río de gran biodiversidad.",
      recomendaciones: [
        "Prevenir la deforestación de las laderas circundantes.",
        "Recoger todos los residuos generados durante visitas recreativas."
      ]
    },
    {
      nombre: "Ojo de Agua de Nogales",
      ubicacion: "Nogales, Veracruz",
      coordenadas: "18.820093, -97.165485",
      descripcion: "Nacimiento natural proveniente del deshielo y filtraciones subterráneas del Pico de Orizaba.",
      recomendaciones: [
        "Proteger la vegetación de galería (ahuehuetes ancestrales).",
        "Evitar la sobreexplotación turística e industrial sin regulación."
      ]
    }
  ],
  "Michoacan": [
    {
      nombre: "Manantial de Camécuaro",
      ubicacion: "Tangancícuaro, Michoacán",
      coordenadas: "19.696034, -101.232757",
      descripcion: "Nacimiento cristalino rodeado de ahuehuetes centenarios, alimentado por acuíferos profundos.",
      recomendaciones: [
        "Prohibir vehículos de motor contaminantes.",
        "Cuidar las raíces expuestas para prevenir la erosión del suelo."
      ]
    },
    {
      nombre: "Nacimiento de la Ciénaga de Zacapu",
      ubicacion: "Zacapu, Michoacán",
      coordenadas: "19.826718, -101.789599",
      descripcion: "Ojo de agua origen de ríos locales e hábitat del hacho (Ambystoma dumerilii).",
      recomendaciones: [
        "Proteger las especies endémicas evitando la introducción de peces exóticos.",
        "Evitar descargas de aguas residuales urbanas."
      ]
    }
  ],
  "Chiapas": [
    {
      nombre: "Nacimiento del Río San Vicente (El Chiflón)",
      ubicacion: "Tzimol, Chiapas",
      coordenadas: "16.1481, -92.2982",
      descripcion: "Origen de potentes corrientes de aguas turquesas enriquecidas con minerales cársticos.",
      recomendaciones: [
        "Mantener senderos delimitados para no erosionar el suelo.",
        "No depositar químicos, repelentes o cremas en la corriente."
      ]
    }
  ],
  "Oaxaca": [
    {
      nombre: "Manantial de Hierve el Agua",
      ubicacion: "San Lorenzo Albarradas, Oaxaca",
      coordenadas: "16.865550, -96.276178",
      descripcion: "Manantiales naturales de agua carbonatada que han formado cascadas petrificadas a lo largo de milenios.",
      recomendaciones: [
        "Respetar las áreas de pozas naturales y la carga turística regulada.",
        "No alterar la composición mineral extrayendo formaciones calcáreas."
      ]
    }
  ],
  "San Luis Potosi": [
    {
      nombre: "Nacimiento del Río Huasteco (Media Luna)",
      ubicacion: "Rioverde, San Luis Potosí",
      coordenadas: "21.861239, -100.028052",
      descripcion: "Manantial subacuático térmico de extraordinaria claridad con seis aberturas de surgencia.",
      recomendaciones: [
        "Ingresar únicamente con equipos limpios para no contaminar la cuenca.",
        "Protección estricta de la flora acuática sumergida."
      ]
    }
  ],
  "Estado de Mexico": [
    {
      nombre: "Laguna de San Miguel Almaya",
      ubicacion: "Ocoyoacac, Estado de México",
      coordenadas: "19.217626, -99.438022",
      descripcion: "Nacimiento natural alimentado por el bosque de agua del Parque Nacional La Marquesa.",
      recomendaciones: [
        "Preservar la cobertura forestal para garantizar la recarga del acuífero.",
        "Controlar el turismo masivo y el uso de cuatrimotos cercanas."
      ]
    }
  ],
  "Morelos": [
    {
      nombre: "Las Estacas (Nacimiento del Río Yautepec)",
      ubicacion: "Tlaltizapán, Morelos",
      coordenadas: "18.731958, -99.112949",
      descripcion: "Borbollón natural que brota a más de 7,000 litros por segundo formando un cristalino río natural.",
      recomendaciones: [
        "Uso exclusivo de bloqueadores solares 100% biodegradables.",
        "Evitar la alteración física del fondo de la fuente principal."
      ]
    }
  ],
  "Yucatan": [
    {
      nombre: "Cenote Abierto / Ojo de Agua Xlacah",
      ubicacion: "Dzibilchaltún, Yucatán",
      coordenadas: "21.0908, -89.5978",
      descripcion: "Afloramiento directo del manto freático del sistema kárstico de la península.",
      recomendaciones: [
        "Ducharse obligatoriamente antes de entrar para eliminar grasas corporales.",
        "Prohibido tocar o alterar la fauna acuática y formaciones rocosas."
      ]
    }
  ],
  "Quintana Roo": [
    {
      nombre: "Nacimiento Yalahau (Ojo de Agua)",
      ubicacion: "Holbox, Quintana Roo",
      coordenadas: "21.4678, -87.2889",
      descripcion: "Manantial natural de agua dulce rodeado de manglares que emerge muy cerca del mar.",
      recomendaciones: [
        "Conservar el ecosistema de manglar circundante.",
        "No dejar residuos plásticos que puedan llegar a la fauna marina."
      ]
    }
  ],
  "Jalisco": [
    {
      nombre: "Manantiales de Las Estacas / Los Camachos",
      ubicacion: "Zapopan / Ixtlahuacán del Río, Jalisco",
      coordenadas: "20.8522, -103.3283",
      descripcion: "Surgencias de agua termal y dulce en la cuenca del Río Santiago.",
      recomendaciones: [
        "Evitar la contaminación por basura de los visitantes.",
        "Proteger la vegetación de la barranca para evitar deslaves."
      ]
    }
  ]
};

function mostrarNacimientos(){
  const estado = document.getElementById("select-estado").value;
  const cont = document.getElementById("nacimientos-contenedor");
  cont.innerHTML = "";

  if(!estado || !datosNacimientos[estado]){
    cont.innerHTML = '<div class="card" style="grid-column: 1/-1;"><p>Selecciona un estado para ver la información.</p></div>';
    return;
  }

  datosNacimientos[estado].forEach(item => {
    const card = document.createElement("article");
    card.className = "nacimiento-card";
    
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.coordenadas || item.nombre + ' ' + item.ubicacion)}`;

    let recomendacionesHTML = "";
    item.recomendaciones.forEach(rec => {
      recomendacionesHTML += `<li>${escapeHTML(rec)}</li>`;
    });

    card.innerHTML = `
      <h3>🌱 ${escapeHTML(item.nombre)}</h3>
      <span class="ubicacion-tag">📍 ${escapeHTML(item.ubicacion)}</span>
      <p>${escapeHTML(item.descripcion)}</p>
      
      <div class="recomendaciones-list">
        <strong>🛡️ Cuidado y Protección:</strong>
        <ul>${recomendacionesHTML}</ul>
      </div>

      <a href="${mapsUrl}" target="_blank" rel="noopener" class="btn-link primary" style="width:100%">🗺️ Ver en Google Maps</a>
    `;
    cont.appendChild(card);
  });
}


/* -------------------------------------------------------------
   5. SISTEMA DE REPORTES
------------------------------------------------------------- */
let imagenData = "";
let reportes = JSON.parse(localStorage.getItem("aquaforma_reportes") || "[]");

const foto = document.getElementById("foto");
const preview = document.getElementById("preview");

foto.addEventListener("change", e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    imagenData = reader.result;
    preview.src = imagenData;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
});

function crearReporte(){
  const titulo = document.getElementById("titulo").value.trim();
  const categoria = document.getElementById("categoria").value;
  const ubicacion = document.getElementById("ubicacion").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  if(!titulo || !ubicacion || !descripcion){
    alert("Por favor completa el título, la ubicación y la descripción.");
    return;
  }

  const reporte = {
    titulo, categoria, ubicacion, descripcion,
    imagen: imagenData,
    fecha: new Date().toLocaleString("es-MX")
  };

  reportes.unshift(reporte);
  localStorage.setItem("aquaforma_reportes", JSON.stringify(reportes));
  renderReportes();
  actualizarContadores();
  limpiarFormulario(false);
  location.hash = "galeria";
}

function renderReportes(){
  const cont = document.getElementById("reports");
  cont.innerHTML = "";

  if(reportes.length === 0){
    cont.innerHTML = '<div class="card"><p>El archivo visual está vacío. Registra una observación o crea un arte en el laboratorio.</p></div>';
    return;
  }

  reportes.forEach((r, i) => {
    const article = document.createElement("article");
    article.className = "report";
    
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.ubicacion)}`;

    article.innerHTML = `
      ${r.imagen ? `<img src="${r.imagen}" alt="Reporte">` : `<div style="background:#0077b6;width:100%;height:100px;border-radius:6px"></div>`}
      <div>
        <div class="status">${escapeHTML(r.categoria)} · ${escapeHTML(r.fecha)}</div>
        <h3>${escapeHTML(r.titulo)}</h3>
        <p style="margin:6px 0; font-size:0.9rem;"><b>📍 Ubicación:</b> ${escapeHTML(r.ubicacion)}</p>
        <p style="margin:6px 0; font-size:0.95rem;">${escapeHTML(r.descripcion)}</p>
        <div class="report-actions">
          <a href="${mapsUrl}" target="_blank" rel="noopener" class="btn-link primary">🗺️ Ver Mapa</a>
          <button class="secondary" onclick="eliminarReporte(${i})">Eliminar</button>
        </div>
      </div>`;
    cont.appendChild(article);
  });
}

function eliminarReporte(i){
  reportes.splice(i,1);
  localStorage.setItem("aquaforma_reportes", JSON.stringify(reportes));
  renderReportes();
  actualizarContadores();
}

function actualizarContadores(){
  document.getElementById("contador").textContent = reportes.length;
  document.getElementById("barra").style.width = Math.min(reportes.length * 10, 100) + "%";
}

function limpiarFormulario(resetImagen=true){
  ["titulo","ubicacion","descripcion"].forEach(id => document.getElementById(id).value = "");
  if(resetImagen){
    foto.value = "";
    imagenData = "";
    preview.style.display = "none";
  }
}

function escapeHTML(text){
  return text.replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function usarUbicacionActual(){
  if(!navigator.geolocation){
    alert("Tu navegador no soporta geolocalización.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    posicion => {
      const lat = posicion.coords.latitude.toFixed(5);
      const lng = posicion.coords.longitude.toFixed(5);
      document.getElementById("ubicacion").value = `${lat}, ${lng}`;
    },
    () => alert("No se pudo acceder a la ubicación actual.")
  );
}


/* -------------------------------------------------------------
   6. LABORATORIO CREATIVO - CANVAS
------------------------------------------------------------- */
const canvas = document.getElementById("canvas");
const canvasContainer = document.getElementById("canvas-container");
const ctx = canvas.getContext("2d");

let dibujando = false;
let modoActual = "linea";
let ultimo = null;
let t = 0;

function resizeCanvas() {
  const rect = canvasContainer.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = rect.width;
    canvas.height = rect.height;

    fondoCanvas();
    ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
  }
}

function fondoCanvas(){
  ctx.fillStyle = "#02111b"; 
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
  ctx.strokeStyle = "rgba(0, 180, 216, 0.08)";
  ctx.lineWidth = 1;
  for(let x=0; x<canvas.width; x+=30){
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke();
  }
  for(let y=0; y<canvas.height; y+=30){
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke();
  }
}

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  let clientX = e.clientX;
  let clientY = e.clientY;

  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }

  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

function iniciarTrazo(e) {
  dibujando = true;
  ultimo = getCanvasPos(e);
}

function moverTrazo(e) {
  if (!dibujando) return;
  if (e.cancelable) e.preventDefault();

  const p = getCanvasPos(e);
  const dx = p.x - ultimo.x, dy = p.y - ultimo.y;
  const distancia = Math.hypot(dx,dy);
  
  const color = document.getElementById("pincel-color").value;
  const grosor = document.getElementById("pincel-grosor").value;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = grosor;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (modoActual === "linea") {
    ctx.beginPath();
    ctx.moveTo(ultimo.x, ultimo.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  } else if (modoActual === "onda") {
    ctx.beginPath();
    ctx.moveTo(ultimo.x, ultimo.y);
    const cx = (ultimo.x + p.x)/2;
    const cy = (ultimo.y + p.y)/2 + Math.sin(ultimo.x * 0.05 + t) * 15;
    ctx.quadraticCurveTo(cx, cy, p.x, p.y);
    ctx.stroke();
  } else if (modoActual === "gota") {
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.random() * (grosor * 1.5) + 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.random() * (grosor * 3) + grosor, 0, Math.PI * 2);
    ctx.lineWidth = 0.5;
    ctx.stroke();
  } else if (modoActual === "spray") {
    for (let i = 0; i < 10; i++) {
      const offsetX = (Math.random() - 0.5) * (grosor * 3);
      const offsetY = (Math.random() - 0.5) * (grosor * 3);
      ctx.fillRect(p.x + offsetX, p.y + offsetY, 2, 2);
    }
  } else if (modoActual === "trama" && distancia > 3) {
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(ultimo.x + i*4, ultimo.y - i*4);
      ctx.lineTo(p.x + i*4, p.y - i*4);
      ctx.stroke();
    }
  }

  ultimo = p;
}

function finalizarTrazo() {
  dibujando = false;
}

canvas.addEventListener("pointerdown", (e) => {
  canvas.setPointerCapture(e.pointerId);
  iniciarTrazo(e);
});
canvas.addEventListener("pointermove", moverTrazo);
canvas.addEventListener("pointerup", (e) => {
  try { canvas.releasePointerCapture(e.pointerId); } catch(_){}
  finalizarTrazo();
});
canvas.addEventListener("pointercancel", finalizarTrazo);

function setModo(m){
  modoActual = m;
  document.querySelectorAll('.tools-group button').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`btn-${m}`);
  if(btn) btn.classList.add('active');
}

function limpiarCanvas(){ fondoCanvas(); }

function descargarCanvas(){
  const link = document.createElement('a');
  link.download = 'arte-agua-aguamigos.png';
  link.href = canvas.toDataURL();
  link.click();
}

function abrirModalArte(){
  document.getElementById("modalArte").style.display = "flex";
}

function cerrarModalArte(){
  document.getElementById("modalArte").style.display = "none";
}

function publicarArteLienzo(){
  const titulo = document.getElementById("arte-titulo").value.trim();
  const categoria = document.getElementById("arte-categoria").value;
  const descripcion = document.getElementById("arte-descripcion").value.trim();

  if(!titulo || !descripcion){
    alert("Por favor ingresa un título y una pequeña descripción de tu obra.");
    return;
  }

  const reporteArte = {
    titulo: `🎨 ${titulo}`,
    categoria,
    ubicacion: "Laboratorio Creativo",
    descripcion,
    imagen: canvas.toDataURL(),
    fecha: new Date().toLocaleString("es-MX")
  };

  reportes.unshift(reporteArte);
  localStorage.setItem("aquaforma_reportes", JSON.stringify(reportes));
  renderReportes();
  actualizarContadores();
  
  cerrarModalArte();
  document.getElementById("arte-titulo").value = "";
  document.getElementById("arte-descripcion").value = "";
  location.hash = "galeria";
}

function animarCanvas(){
  t += 0.03;
  requestAnimationFrame(animarCanvas);
}

window.addEventListener("load", () => {
  resizeCanvas();
  renderReportes();
  actualizarContadores();
  animarCanvas();
});

window.addEventListener("resize", () => {
  resizeCanvas();
});