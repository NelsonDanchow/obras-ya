const prestadores = [
  {
    id: 1,
    nombre: "Lucía Méndez",
    rubro: "Gas / estufas",
    zona: "Centro · Ushuaia",
    rating: 4.8,
    trabajos: 126,
    bio: "Gasista matriculada. Instalación y service de estufas y calefactores.",
    precioDesde: "$45.000 visita",
    reseñas: [
      { de: "Cliente", texto: "Dejó la estufa impecable y explicó todo.", estrellas: 5 },
      { de: "Cliente", texto: "Puntual y prolija.", estrellas: 5 },
    ],
  },
  {
    id: 2,
    nombre: "Martín Quilaqueo",
    rubro: "Electricidad",
    zona: "Kaupen · Ushuaia",
    rating: 4.6,
    trabajos: 89,
    bio: "Tableros, luminarias, certificados. Trabajos en domicilios.",
    precioDesde: "$38.000 visita",
    reseñas: [
      { de: "Cliente", texto: "Buen precio, laburo prolijo.", estrellas: 5 },
      { de: "Cliente", texto: "Tardó un poco en responder.", estrellas: 4 },
    ],
  },
  {
    id: 3,
    nombre: "Sofía Rivas",
    rubro: "Pintura",
    zona: "Héroes de Malvinas · Ushuaia",
    rating: 4.9,
    trabajos: 210,
    bio: "Interior/exterior, enduido, humedad. Presupuesto cerrado.",
    precioDesde: "desde $12.000/m²",
    reseñas: [{ de: "Cliente", texto: "Quedó mejor que lo esperado.", estrellas: 5 }],
  },
  {
    id: 4,
    nombre: "Diego Álvarez",
    rubro: "Plomería",
    zona: "Ushuaia",
    rating: 4.2,
    trabajos: 54,
    bio: "Pérdidas, sanitarios, instalación de baño completo.",
    precioDesde: "$40.000 visita",
    reseñas: [{ de: "Cliente", texto: "Resolvió la pérdida rápido.", estrellas: 4 }],
  },
  {
    id: 5,
    nombre: "Equipo Norte Sur",
    rubro: "Albañilería",
    zona: "Toda la ciudad",
    rating: 4.5,
    trabajos: 67,
    bio: "Refacciones, revoques, ampliaciones chicas.",
    precioDesde: "a convenir",
    reseñas: [{ de: "Cliente", texto: "Cumplieron plazos.", estrellas: 5 }],
  },
];

const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const q = document.getElementById("q");
const rubro = document.getElementById("rubro");

function stars(n) {
  const full = Math.round(n);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function render(list) {
  grid.innerHTML = list
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
      <div class="tags">
        <span class="tag">${p.precioDesde}</span>
        <span class="tag">Reseñas ida y vuelta</span>
      </div>
      <div class="row">
        <button class="btn primary" data-id="${p.id}">Ver perfil</button>
        <button class="btn green" data-pedir="${p.id}">Pedir presupuesto</button>
      </div>
    </article>`
    )
    .join("");
}

function filtrar() {
  const text = q.value.trim().toLowerCase();
  const r = rubro.value;
  const list = prestadores.filter((p) => {
    const okRubro = !r || p.rubro === r;
    const okText =
      !text ||
      [p.nombre, p.rubro, p.bio, p.zona].join(" ").toLowerCase().includes(text);
    return okRubro && okText;
  });
  render(list);
}

function openPerfil(id) {
  const p = prestadores.find((x) => x.id === id);
  if (!p) return;
  modalBody.innerHTML = `
    <h2>${p.nombre}</h2>
    <p class="muted">${p.rubro} · ${p.zona}</p>
    <p class="stars">${stars(p.rating)} ${p.rating} · ${p.trabajos} trabajos</p>
    <p>${p.bio}</p>
    <p><strong>Desde:</strong> ${p.precioDesde}</p>
    <h3>Reseñas</h3>
    <ul class="reviews">
      ${p.reseñas
        .map((r) => `<li><strong>${r.de}</strong> ${stars(r.estrellas)}<br/>${r.texto}</li>`)
        .join("")}
    </ul>
    <p class="muted">Próximo: puntaje del cliente al profesional y del profesional al cliente + pagos.</p>
  `;
  modal.showModal();
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.dataset.id) openPerfil(Number(btn.dataset.id));
  if (btn.dataset.pedir) {
    const p = prestadores.find((x) => x.id === Number(btn.dataset.pedir));
    alert(`Presupuesto (demo): se pediría a ${p.nombre}.\nAcá después va mano de obra + insumos de ferretería.`);
  }
});

document.getElementById("btnBuscar").addEventListener("click", filtrar);
q.addEventListener("keydown", (e) => {
  if (e.key === "Enter") filtrar();
});
rubro.addEventListener("change", filtrar);
document.getElementById("btnLogin").addEventListener("click", () => {
  alert("Login (próximo paso): cliente o profesional.");
});

render(prestadores);
