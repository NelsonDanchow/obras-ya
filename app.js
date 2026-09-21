const prestadores = [
  { id: 1, nombre: "Lucía Méndez", rubro: "Gas / estufas", zona: "Centro", rating: 4.8, trabajos: 126, telefono: "2901-555001", bio: "Gasista matriculada. Estufas y calefactores.", tags: ["estufa", "gas", "calefactor", "reparación"] },
  { id: 2, nombre: "Martín Quilaqueo", rubro: "Electricidad", zona: "Kaupen", rating: 4.6, trabajos: 89, telefono: "2901-555002", bio: "Tableros, luminarias, certificados.", tags: ["electricidad", "luz", "tablero", "reparación"] },
  { id: 3, nombre: "Sofía Rivas", rubro: "Pintura", zona: "Héroes de Malvinas", rating: 4.9, trabajos: 210, telefono: "2901-555003", bio: "Interior/exterior, humedad.", tags: ["pintura", "pintar", "reparación", "construcción"] },
  { id: 4, nombre: "Diego Álvarez", rubro: "Plomería", zona: "Centro", rating: 4.2, trabajos: 54, telefono: "2901-555004", bio: "Pérdidas, sanitarios, baños.", tags: ["plomería", "baño", "canilla", "reparación", "construcción"] },
  { id: 5, nombre: "Equipo Norte Sur", rubro: "Albañilería", zona: "Toda la ciudad", rating: 4.5, trabajos: 67, telefono: "2901-555005", bio: "Refacciones y obra nueva chica.", tags: ["albañilería", "pared", "construcción", "reparación"] },
];


const ferreterias = [
  {
    id: "f1",
    nombre: "Ferretería del Fin del Mundo",
    items: [
      { id: "i1", nombre: "Kit reparación estufa", precio: 28500, stock: 12 },
      { id: "i2", nombre: "Flexible gas 1m", precio: 9200, stock: 40 },
      { id: "i3", nombre: "Pintura látex 4L", precio: 18700, stock: 25 },
      { id: "i4", nombre: "Canilla monocomando", precio: 22100, stock: 8 },
    ],
  },
  {
    id: "f2",
    nombre: "Todo Obra Ushuaia",
    items: [
      { id: "i1", nombre: "Kit reparación estufa", precio: 26900, stock: 6 },
      { id: "i2", nombre: "Flexible gas 1m", precio: 8900, stock: 20 },
      { id: "i3", nombre: "Pintura látex 4L", precio: 19200, stock: 15 },
      { id: "i4", nombre: "Canilla monocomando", precio: 24500, stock: 3 },
    ],
  },
  {
    id: "f3",
    nombre: "Hiper Ferre Ushuaia",
    items: [
      { id: "i1", nombre: "Kit reparación estufa", precio: 30100, stock: 18 },
      { id: "i2", nombre: "Flexible gas 1m", precio: 9500, stock: 50 },
      { id: "i3", nombre: "Pintura látex 4L", precio: 17500, stock: 30 },
      { id: "i4", nombre: "Canilla monocomando", precio: 21000, stock: 11 },
    ],
  },
];
const TRASLADO_REPUESTO = 15000;

const opcionesReparacion = ["Estufa / calefacción", "Electricidad", "Plomería / canillas", "Pintura", "Baño", "Otro"];
const opcionesConstruccion = ["Baño de cero", "Ampliación", "Paredes / revoque", "Instalación eléctrica nueva", "Otro"];

const state = {
  mode: null, // contratar | ofrecer
  name: "",
  phone: "",
  email: "",
  rubro: "",
  tycAt: null,
  tipo: null,
  detalle: "",
  profesionalId: null,
};

const $ = (id) => document.getElementById(id);
const views = ["login", "home", "detalle", "catalogo", "presupuesto", "pro", "ferre"];

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
  const sw = $("btnSwitch");
  if (state.name && state.mode) {
    const modeLabel = state.mode === "ofrecer" ? "ofrecer" : state.mode === "ferreteria" ? "ferretería" : "contratar";
    chip.textContent = `${state.name} · ${modeLabel}`;
    chip.classList.remove("hidden");
    sw.classList.remove("hidden");
    btn.textContent = "Salir";
  } else {
    chip.classList.add("hidden");
    sw.classList.add("hidden");
    btn.textContent = "Crear cuenta / Entrar";
  }
}

function fillLegal() {
  $("legalText").textContent = (window.OBRAS_YA_TYC || "").trim();
}

function selectMode(mode) {
  state.mode = mode;
  const map = { contratar: "cliente", ofrecer: "profesional", ferreteria: "ferreteria" };
  document.querySelectorAll(".role-card[data-role]").forEach((el) => {
    el.classList.toggle("on", el.dataset.role === map[mode]);
  });
  $("proExtra").classList.toggle("hidden", mode !== "ofrecer");
  $("aceptoComisionWrap").classList.toggle("hidden", mode !== "ofrecer");
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
  $("catalogoTitle").textContent = "Quién puede ayudarte";
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
  const traslado = Number($("presuTraslado").value) || 0;
  const sub = mano + insumos + traslado;
  const comision = Math.round(sub * 0.1);
  $("presuSub").textContent = `$${sub.toLocaleString("es-AR")}`;
  $("presuComision").textContent = `$${comision.toLocaleString("es-AR")} → Obras Ya`;
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
    <p><a class="phone" href="tel:${p.telefono}">${p.telefono}</a></p>`;
  $("modal").showModal();
}

function goPresupuesto(id) {
  const p = prestadores.find((x) => x.id === id);
  state.profesionalId = id;
  $("presuPro").textContent = `Con ${p.nombre} · ${p.rubro}`;
  $("presuDesc").value = state.detalle
    ? `${state.tipo === "construccion" ? "Construcción" : "Reparación"}: ${state.detalle}`
    : "";
  fillFerreSelects();
  calcPresu();
  show("presupuesto");
}

function goModeHome() {
  if (state.mode === "ofrecer") {
    $("proRubroLabel").textContent = state.rubro || "—";
    $("proTyCLabel").textContent = state.tycAt || "—";
    show("pro");
  } else if (state.mode === "ferreteria") {
    renderFerrePanel();
    show("ferre");
  } else {
    show("home");
  }
}

function renderFerrePanel() {
  const f = ferreterias[0];
  if ($("ferreNombre") && !$("ferreNombre").value) $("ferreNombre").value = f.nombre;
  $("ferreLista").innerHTML = f.items.map((it) =>
    `<div class="ferre-row"><span>${it.nombre}</span><strong>$${it.precio.toLocaleString("es-AR")}</strong><span class="muted">stock ${it.stock}</span></div>`
  ).join("");
}

function fillFerreSelects() {
  const selF = $("presuFerre");
  const selI = $("presuItem");
  if (!selF) return;
  selF.innerHTML = ferreterias.map((f) => `<option value="${f.id}">${f.nombre}</option>`).join("");
  function fillItems() {
    const f = ferreterias.find((x) => x.id === selF.value) || ferreterias[0];
    selI.innerHTML = f.items.map((it) =>
      `<option value="${it.id}" data-precio="${it.precio}">${it.nombre} — $${it.precio.toLocaleString("es-AR")} (stock ${it.stock})</option>`
    ).join("");
    syncInsumoFromItem();
  }
  selF.onchange = fillItems;
  selI.onchange = syncInsumoFromItem;
  fillItems();
}

function syncInsumoFromItem() {
  const selI = $("presuItem");
  const opt = selI.options[selI.selectedIndex];
  const precio = opt ? Number(opt.dataset.precio || 0) : 0;
  $("presuInsumos").value = precio;
  const trae = document.querySelector('input[name="repuesto"]:checked')?.value === "pro";
  $("presuTraslado").value = trae ? TRASLADO_REPUESTO : 0;
  calcPresu();
}

$("btnAuth").addEventListener("click", () => {
  if (state.name) {
    Object.assign(state, { mode: null, name: "", phone: "",
  email: "", rubro: "", tycAt: null });
    updateChip();
    show("home");
    return;
  }
  fillLegal();
  show("login");
});

$("pickCliente").addEventListener("click", () => selectMode("contratar"));
$("pickPro").addEventListener("click", () => selectMode("ofrecer"));
$("pickFerre").addEventListener("click", () => selectMode("ferreteria"));

$("btnLoginGo").addEventListener("click", () => {
  const name = $("loginName").value.trim();
  const phone = $("loginPhone").value.trim();
  const email = $("loginEmail").value.trim();
  if (!name) return alert("Escribí tu nombre.");
  if (!phone) return alert("Escribí tu celular.");
  if (!email || !email.includes("@")) return alert("Escribí un email válido.");
  if (!state.mode) return alert("Elegí si querés contratar u ofrecer servicios.");
  if (!$("aceptoTyC").checked) return alert("Tenés que aceptar los Términos y Condiciones.");
  if (state.mode === "ofrecer" && !$("aceptoComision").checked) {
    return alert("Como prestador, tenés que aceptar la comisión del 10% a favor de Obras Ya.");
  }
  state.name = name;
  state.phone = phone;
  state.email = email;
  state.rubro = $("loginRubro").value;
  state.tycAt = new Date().toLocaleString("es-AR");
  try {
    localStorage.setItem(
      "obrasya_user",
      JSON.stringify({
        name: state.name,
        phone: state.phone,
        email: state.email,
        mode: state.mode,
        rubro: state.rubro,
        tycAt: state.tycAt,
        comision10: state.mode === "ofrecer",
      })
    );
  } catch (_) {}
  updateChip();
  goModeHome();
});

$("btnSwitch").addEventListener("click", () => {
  if (!state.name) return;
  state.mode = state.mode === "ofrecer" ? "contratar" : "ofrecer";
  if (state.mode === "ofrecer" && !localStorage.getItem("obrasya_user")) {
    /* already registered */
  }
  // If switching to ofrecer without commission accept in this session, re-check stored flag
  try {
    const saved = JSON.parse(localStorage.getItem("obrasya_user") || "{}");
    if (state.mode === "ofrecer" && !saved.comision10) {
      alert("Para ofrecer servicios tenés que reaceptar la comisión del 10%. Te llevo al alta.");
      selectMode("ofrecer");
      fillLegal();
      show("login");
      return;
    }
    saved.mode = state.mode;
    localStorage.setItem("obrasya_user", JSON.stringify(saved));
  } catch (_) {}
  updateChip();
  goModeHome();
});

$("btnNecesitoServicio").addEventListener("click", () => {
  state.mode = "contratar";
  updateChip();
  show("home");
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
  if (!state.detalle) return alert("Contanos qué querés reparar o construir.");
  renderCatalogo();
  show("catalogo");
});

$("grid").addEventListener("click", (e) => {
  const perfil = e.target.closest("[data-perfil]");
  const presu = e.target.closest("[data-presu]");
  if (perfil) openPerfil(Number(perfil.dataset.perfil));
  if (presu) goPresupuesto(Number(presu.dataset.presu));
});

["presuMano", "presuInsumos"].forEach((id) => $(id).addEventListener("input", calcPresu));

$("btnContratar").addEventListener("click", () => {
  const p = prestadores.find((x) => x.id === state.profesionalId);
  const sub = (Number($("presuMano").value) || 0) + (Number($("presuInsumos").value) || 0);
  const comision = Math.round(sub * 0.1);
  alert(
    `Solicitud enviada a ${p.nombre}.\nTotal para quien contrata: $${sub.toLocaleString("es-AR")}.\nComisión de la plataforma Obras Ya (10% a cargo del profesional al cerrar): $${comision.toLocaleString("es-AR")}.`
  );
});

document.querySelectorAll("[data-back]").forEach((b) => {
  b.addEventListener("click", () => show(b.dataset.back));
});

$("btnFerreSave")?.addEventListener("click", () => {
  alert("Lista de precios guardada (demo). En producción queda vinculada al mail de la ferretería.");
});
document.querySelectorAll('input[name="repuesto"]').forEach((r) => {
  r.addEventListener("change", syncInsumoFromItem);
});
$("btnVerTyC").addEventListener("click", () => {
  fillLegal();
  $("modalBody").innerHTML = `<h2>Términos y condiciones</h2><pre class="legal-pre"></pre>`;
  $("modalBody").querySelector("pre").textContent = (window.OBRAS_YA_TYC || "").trim();
  $("modal").showModal();
});


function socialLogin(provider) {
  const name = $("loginName").value.trim() || "Usuario " + provider;
  const email = $("loginEmail").value.trim() || ("demo@" + provider.toLowerCase() + ".com");
  if (!state.mode) {
    alert("Primero elegí si querés contratar u ofrecer.");
    return;
  }
  if (!$("aceptoTyC").checked) return alert("Aceptá los Términos y Condiciones.");
  if (state.mode === "ofrecer" && !$("aceptoComision").checked) {
    return alert("Aceptá la comisión del 10% a favor de Obras Ya.");
  }
  $("loginName").value = name;
  $("loginEmail").value = email;
  if (!$("loginPhone").value.trim()) $("loginPhone").value = "2901-000000";
  alert("Demo: en producción acá abre el login real de " + provider + " para verificar que la persona existe.");
  $("btnLoginGo").click();
}
$("btnGoogle").addEventListener("click", () => socialLogin("Google"));
$("btnApple").addEventListener("click", () => socialLogin("Apple"));

// restore
try {
  const saved = JSON.parse(localStorage.getItem("obrasya_user") || "null");
  if (saved && saved.name) {
    state.name = saved.name;
    state.phone = saved.phone;
    state.email = saved.email || "";
    state.mode = saved.mode || "contratar";
    state.rubro = saved.rubro || "";
    state.tycAt = saved.tycAt || null;
    updateChip();
    goModeHome();
  } else {
    updateChip();
    show("home");
  }
} catch (_) {
  updateChip();
  show("home");
}
