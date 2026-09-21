const prestadores = [
  { id: 1, nombre: "Lucía Méndez", rubro: "Gas / estufas", zona: "Centro", rating: 4.8, trabajos: 126, telefono: "2901-555001", bio: "Gasista matriculada. Estufas y calefactores.", tags: ["estufa", "gas", "calefactor", "reparación"] },
  { id: 2, nombre: "Martín Quilaqueo", rubro: "Electricidad", zona: "Kaupen", rating: 4.6, trabajos: 89, telefono: "2901-555002", bio: "Tableros, luminarias, certificados.", tags: ["electricidad", "luz", "tablero", "reparación"] },
  { id: 3, nombre: "Sofía Rivas", rubro: "Pintura", zona: "Héroes de Malvinas", rating: 4.9, trabajos: 210, telefono: "2901-555003", bio: "Interior/exterior, humedad.", tags: ["pintura", "pintar", "reparación", "construcción"] },
  { id: 4, nombre: "Diego Álvarez", rubro: "Plomería", zona: "Centro", rating: 4.2, trabajos: 54, telefono: "2901-555004", bio: "Pérdidas, sanitarios, baños.", tags: ["plomería", "baño", "canilla", "reparación", "construcción"] },
  { id: 5, nombre: "Equipo Norte Sur", rubro: "Albañilería", zona: "Toda la ciudad", rating: 4.5, trabajos: 67, telefono: "2901-555005", bio: "Refacciones y obra nueva chica.", tags: ["albañilería", "pared", "construcción", "reparación"] },
];

const opcionesReparacion = ["Estufa / calefacción", "Electricidad", "Plomería / canillas", "Pintura", "Baño", "Otro"];
const opcionesConstruccion = ["Baño de cero", "Ampliación", "Paredes / revoque", "Instalación eléctrica nueva", "Otro"];

const state = {
  role: null,
  name: "",
  phone: "",
  tipo: null, // reparacion | construccion
  detalle: "",
  profesionalId: null,
};

const $ = (id) => document.getElementById(id);
const views = ["login", "home", "detalle", "catalogo", "presupuesto", "pro"];

function show(view) {
  views.forEach((v) => {
    const el = $("view-" + v);
    if (el) el.classList.toggle("hidden", v !== view);
  });
}

function stars(n) {
  const full = Math.round(n);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function updateChip() {
  const chip = $("userChip");
  const btn = $("btnAuth");
  if (state.name && state.role) {
    chip.textContent = `${state.name} · ${state.role}`;
    chip.classList.remove("hidden");
    btn.textContent = "Salir";
  } else {
    chip.classList.add("hidden");
    btn.textContent = "Entrar";
  }
}

function renderDetalle() {
  $("detalleTitle").textContent =
    state.tipo === "construccion" ? "¿Qué querés construir?" : "¿Qué querés reparar?";
  const opts = state.tipo === "construccion" ? opcionesConstruccion : opcionesReparacion;
  $("detalleOptions").innerHTML = opts
    .map((o) => `<button type="button" class="chip-btn" data-opt="${o}">${o}</button>`)
    .join("");
  $("detalleLibre").value = "";
  state.detalle = "";
}

function matchProfesionales() {
  const q = (state.detalle || "").toLowerCase();
  return prestadores.filter((p) => {
    if (!q) return true;
    const blob = [p.rubro, p.bio, ...(p.tags || [])].join(" ").toLowerCase();
    return q.split(/\s+/).some((w) => w.length > 2 && blob.includes(w)) || blob.includes(q);
  });
}

function renderCatalogo() {
  const list = matchProfesionales();
  $("catalogoTitle").textContent = list.length
    ? `Quién puede ayudarte`
    : "Sin coincidencias exactas";
  $("catalogoSub").textContent = state.detalle
    ? `Pedido: ${state.detalle} · ${state.tipo === "construccion" ? "Construcción" : "Reparación"}`
    : "";
  $("grid").innerHTML = (list.length ? list : prestadores)
    .map(
      (p) => `
    <article class="card">
      <div class="card-top">
        <div class="avatar">${p.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
        <div class="meta">
          <h3>${p.nombre}</h3>
          <p>${p.rubro} · ${p.zona}</p>
        </div>
      </div>
      <div class="stars">${stars(p.rating)} <span class="muted">${p.rating} · ${p.trabajos} trabajos</span></div>
      <p class="muted">${p.bio}</p>
      <p><a class="phone" href="tel:${p.telefono}">📞 ${p.telefono}</a></p>
      <div class="row">
        <button class="btn ghost" data-perfil="${p.id}">Ver perfil</button>
        <button class="btn primary" data-presu="${p.id}">Pedir presupuesto</button>
      </div>
    </article>`
    )
    .join("");
}

function calcPresu() {
  const mano = Number($("presuMano").value) || 0;
  const insumos = Number($("presuInsumos").value) || 0;
  const sub = mano + insumos;
  const comision = Math.round(sub * 0.1);
  $("presuSub").textContent = `$${sub.toLocaleString("es-AR")}`;
  $("presuComision").textContent = `$${comision.toLocaleString("es-AR")} (del profesional)`;
  $("presuTotal").textContent = `$${sub.toLocaleString("es-AR")}`;
}

function openPerfil(id) {
  const p = prestadores.find((x) => x.id === id);
  if (!p) return;
  $("modalBody").innerHTML = `
    <h2>${p.nombre}</h2>
    <p class="muted">${p.rubro} · ${p.zona}</p>
    <p class="stars">${stars(p.rating)} ${p.rating}</p>
    <p>${p.bio}</p>
    <p><a class="phone" href="tel:${p.telefono}">${p.telefono}</a></p>
    <p class="muted">Reseñas ida y vuelta (próximo paso con datos reales).</p>`;
  $("modal").showModal();
}

function goPresupuesto(id) {
  const p = prestadores.find((x) => x.id === id);
  state.profesionalId = id;
  $("presuPro").textContent = `Con ${p.nombre} · ${p.rubro}`;
  $("presuDesc").value = state.detalle
    ? `${state.tipo === "construccion" ? "Construcción" : "Reparación"}: ${state.detalle}`
    : "";
  calcPresu();
  show("presupuesto");
}

// Auth
let pendingRole = null;
$("btnAuth").addEventListener("click", () => {
  if (state.role) {
    state.role = null;
    state.name = "";
    updateChip();
    show("home");
    return;
  }
  show("login");
});

document.querySelectorAll(".role-card[data-role]").forEach((btn) => {
  btn.addEventListener("click", () => {
    pendingRole = btn.dataset.role;
    $("loginForm").classList.remove("hidden");
  });
});

$("btnLoginGo").addEventListener("click", () => {
  const name = $("loginName").value.trim();
  const phone = $("loginPhone").value.trim();
  if (!pendingRole || !name) {
    alert("Elegí rol y escribí tu nombre.");
    return;
  }
  state.role = pendingRole;
  state.name = name;
  state.phone = phone;
  updateChip();
  show(pendingRole === "profesional" ? "pro" : "home");
});

$("btnReparacion").addEventListener("click", () => {
  state.tipo = "reparacion";
  renderDetalle();
  show("detalle");
});
$("btnConstruccion").addEventListener("click", () => {
  state.tipo = "construccion";
  renderDetalle();
  show("detalle");
});

$("detalleOptions").addEventListener("click", (e) => {
  const b = e.target.closest("[data-opt]");
  if (!b) return;
  state.detalle = b.dataset.opt;
  $("detalleLibre").value = b.dataset.opt;
  document.querySelectorAll(".chip-btn").forEach((x) => x.classList.remove("on"));
  b.classList.add("on");
});

$("btnVerProfesionales").addEventListener("click", () => {
  state.detalle = $("detalleLibre").value.trim() || state.detalle;
  if (!state.detalle) {
    alert("Contanos qué querés reparar o construir.");
    return;
  }
  if (!state.role) {
    // permitir mirar catálogo, pero sugerir login
  }
  renderCatalogo();
  show("catalogo");
});

$("grid").addEventListener("click", (e) => {
  const perfil = e.target.closest("[data-perfil]");
  const presu = e.target.closest("[data-presu]");
  if (perfil) openPerfil(Number(perfil.dataset.perfil));
  if (presu) {
    if (state.role !== "cliente") {
      alert("Entrá como cliente para pedir presupuesto (demo: igual te dejo seguir).");
    }
    goPresupuesto(Number(presu.dataset.presu));
  }
});

["presuMano", "presuInsumos"].forEach((id) => {
  $(id).addEventListener("input", calcPresu);
});

$("btnContratar").addEventListener("click", () => {
  const p = prestadores.find((x) => x.id === state.profesionalId);
  const sub =
    (Number($("presuMano").value) || 0) + (Number($("presuInsumos").value) || 0);
  const comision = Math.round(sub * 0.1);
  alert(
    `Solicitud enviada a ${p.nombre}.\nTotal cliente: $${sub.toLocaleString("es-AR")} (sin comisión extra).\nAl cerrar el laburo, el profesional aporta ~$${comision.toLocaleString("es-AR")} (10%) a Obras Ya.`
  );
});

$("btnVerComoCliente").addEventListener("click", () => show("home"));

document.querySelectorAll("[data-back]").forEach((b) => {
  b.addEventListener("click", () => show(b.dataset.back));
});

updateChip();
show("home");
