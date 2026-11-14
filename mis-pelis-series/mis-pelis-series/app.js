// =====================================================
// Mis Pelis y Series — CRUD con HTML, CSS, JavaScript y localStorage
// =====================================================

const CLAVE_STORAGE = 'mis-pelis-series';

const ESTADOS = {
  'por-ver': 'Por ver',
  'viendo': 'Viendo',
  'vista': 'Vista'
};

const TIPOS = {
  'pelicula': '🎥 Película',
  'serie': '📺 Serie'
};

// Referencias a los elementos del HTML
const formulario = document.getElementById('formulario');
const campoId = document.getElementById('item-id');
const campoTitulo = document.getElementById('titulo');
const campoTipo = document.getElementById('tipo');
const campoAnio = document.getElementById('anio');
const campoGenero = document.getElementById('genero');
const campoPlataforma = document.getElementById('plataforma');
const campoEstado = document.getElementById('estado');
const campoCalificacion = document.getElementById('calificacion');
const campoResena = document.getElementById('resena');
const contadorResena = document.getElementById('contador-resena');
const tituloFormulario = document.getElementById('titulo-formulario');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');
const mensajeError = document.getElementById('mensaje-error');
const lista = document.getElementById('lista');
const listaVacia = document.getElementById('lista-vacia');
const contador = document.getElementById('contador');
const estadisticas = document.getElementById('estadisticas');
const buscador = document.getElementById('buscador');
const filtroTipo = document.getElementById('filtro-tipo');
const filtroEstado = document.getElementById('filtro-estado');
const selectorOrden = document.getElementById('orden');
const aviso = document.getElementById('aviso');
const botonTema = document.getElementById('boton-tema');

// -----------------------------------------------------
// Persistencia: leer y guardar en localStorage
// -----------------------------------------------------
function cargarItems() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
  } catch {
    return [];
  }
}

function guardarItems(items) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
}

let items = cargarItems();

// -----------------------------------------------------
// CREATE: agregar una película o serie nueva
// -----------------------------------------------------
function crearItem(datos) {
  const nuevo = {
    id: Date.now().toString(),
    ...datos,
    creadoEn: new Date().toISOString()
  };
  items.push(nuevo);
  guardarItems(items);
  mostrarAviso('Agregado a tu lista ✅');
}

// -----------------------------------------------------
// READ: mostrar la lista (con búsqueda, filtros y orden)
// -----------------------------------------------------
function renderizarItems() {
  const texto = buscador.value.trim().toLowerCase();
  const tipo = filtroTipo.value;
  const estado = filtroEstado.value;

  const visibles = items.filter(item => {
    const coincideTexto = item.titulo.toLowerCase().includes(texto);
    const coincideTipo = tipo === 'todos' || item.tipo === tipo;
    const coincideEstado = estado === 'todos' || item.estado === estado;
    return coincideTexto && coincideTipo && coincideEstado;
  });

  ordenarItems(visibles, selectorOrden.value);

  contador.textContent = items.length;
  renderizarEstadisticas();
  lista.innerHTML = '';

  if (visibles.length === 0) {
    listaVacia.style.display = 'block';
    listaVacia.textContent = items.length === 0
      ? 'Tu lista está vacía. ¡Agrega tu primera peli o serie!'
      : 'Nada coincide con la búsqueda.';
    return;
  }
  listaVacia.style.display = 'none';

  visibles.forEach(item => {
    const elemento = document.createElement('li');
    elemento.className = `item tipo-${item.tipo}`;

    // El botón rápido solo aparece si todavía no está marcada como vista
    const botonVista = item.estado !== 'vista'
      ? `<button class="boton pequeno exito" data-accion="marcar-vista" data-id="${item.id}" title="Marcar como vista">✓ Vista</button>`
      : '';

    elemento.innerHTML = `
      <div class="item-principal">
      <div class="poster" style="background: ${colorPoster(item.titulo)}">${escaparHTML(iniciales(item.titulo))}</div>
      <div class="item-info">
        <h3>${escaparHTML(item.titulo)}</h3>
        <p class="detalle">${TIPOS[item.tipo]}${item.anio ? ' · ' + item.anio : ''} · ${escaparHTML(item.plataforma)}</p>
        <div class="etiquetas">
          <span class="etiqueta">${escaparHTML(item.genero)}</span>
          <span class="etiqueta estado-${item.estado}">${ESTADOS[item.estado]}</span>
          <span class="estrellas" title="${item.calificacion} de 5">${pintarEstrellas(item.calificacion)}</span>
        </div>
        ${item.resena ? `<p class="resena">“${escaparHTML(item.resena)}”</p>` : ''}
      </div>
      </div>
      <div class="item-acciones">
        ${botonVista}
        <button class="boton pequeno" data-accion="editar" data-id="${item.id}">Editar</button>
        <button class="boton pequeno peligro" data-accion="eliminar" data-id="${item.id}">Eliminar</button>
      </div>
    `;
    lista.appendChild(elemento);
  });
}

// Ordena el arreglo según la opción elegida en el select "orden"
function ordenarItems(arreglo, criterio) {
  if (criterio === 'recientes') arreglo.sort((a, b) => b.id - a.id);
  if (criterio === 'antiguos') arreglo.sort((a, b) => a.id - b.id);
  if (criterio === 'calificacion') arreglo.sort((a, b) => b.calificacion - a.calificacion);
  if (criterio === 'titulo') arreglo.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
}

// Resumen de la lista: se recalcula cada vez que se dibuja
function renderizarEstadisticas() {
  const peliculas = items.filter(i => i.tipo === 'pelicula').length;
  const series = items.filter(i => i.tipo === 'serie').length;
  const vistas = items.filter(i => i.estado === 'vista').length;
  const calificadas = items.filter(i => i.calificacion > 0);
  const promedio = calificadas.length
    ? (calificadas.reduce((suma, i) => suma + i.calificacion, 0) / calificadas.length).toFixed(1)
    : '–';

  estadisticas.innerHTML = `
    <div class="stat"><strong>${peliculas}</strong><span>Películas</span></div>
    <div class="stat"><strong>${series}</strong><span>Series</span></div>
    <div class="stat"><strong>${vistas}</strong><span>Vistas</span></div>
    <div class="stat"><strong>${items.length - vistas}</strong><span>Pendientes</span></div>
    <div class="stat"><strong>${promedio} ★</strong><span>Promedio</span></div>
  `;
}

// -----------------------------------------------------
// UPDATE: cargar el registro en el formulario y guardar cambios
// -----------------------------------------------------
function empezarEdicion(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  campoId.value = item.id;
  campoTitulo.value = item.titulo;
  campoTipo.value = item.tipo;
  campoAnio.value = item.anio || '';
  campoGenero.value = item.genero;
  campoPlataforma.value = item.plataforma;
  campoEstado.value = item.estado;
  campoCalificacion.value = item.calificacion;
  campoResena.value = item.resena || '';
  actualizarContadorResena();

  tituloFormulario.textContent = 'Editar título';
  botonGuardar.textContent = 'Guardar cambios';
  botonCancelar.classList.remove('oculto');
  campoTitulo.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function actualizarItem(id, datos) {
  items = items.map(item => (item.id === id ? { ...item, ...datos } : item));
  guardarItems(items);
}

// Atajo de UPDATE: cambia solo el estado a "Vista" sin abrir el formulario
function marcarComoVista(id) {
  actualizarItem(id, { estado: 'vista' });
  if (campoId.value === id) campoEstado.value = 'vista';
  renderizarItems();
  mostrarAviso('Marcada como vista 👀');
}

// -----------------------------------------------------
// DELETE: eliminar un registro (con confirmación)
// -----------------------------------------------------
function eliminarItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  if (!confirm(`¿Seguro que quieres eliminar "${item.titulo}"?`)) return;

  items = items.filter(i => i.id !== id);
  guardarItems(items);
  if (campoId.value === id) reiniciarFormulario();
  renderizarItems();
  mostrarAviso('Eliminado de tu lista 🗑️');
}

// -----------------------------------------------------
// Utilidades
// -----------------------------------------------------
function leerFormulario() {
  return {
    titulo: campoTitulo.value.trim(),
    tipo: campoTipo.value,
    anio: campoAnio.value ? Number(campoAnio.value) : null,
    genero: campoGenero.value,
    plataforma: campoPlataforma.value,
    estado: campoEstado.value,
    calificacion: Number(campoCalificacion.value),
    resena: campoResena.value.trim()
  };
}

function validar(datos) {
  if (!datos.titulo) return 'El título es obligatorio.';
  const anioActual = new Date().getFullYear();
  if (datos.anio !== null && (datos.anio < 1888 || datos.anio > anioActual + 2)) {
    return `El año debe estar entre 1888 y ${anioActual + 2}.`;
  }
  return '';
}

function reiniciarFormulario() {
  formulario.reset();
  campoId.value = '';
  mensajeError.textContent = '';
  actualizarContadorResena();
  tituloFormulario.textContent = 'Agregar título';
  botonGuardar.textContent = 'Agregar';
  botonCancelar.classList.add('oculto');
}

function actualizarContadorResena() {
  contadorResena.textContent = `${campoResena.value.length}/300`;
}

// Mini póster: hasta dos iniciales del título (ej: "Breaking Bad" → "BB")
function iniciales(titulo) {
  return titulo
    .split(/\s+/)
    .filter(palabra => /[\p{L}\p{N}]/u.test(palabra))
    .slice(0, 2)
    .map(palabra => palabra.match(/[\p{L}\p{N}]/u)[0].toUpperCase())
    .join('') || '?';
}

// El color del póster sale del título: el mismo título siempre da el mismo color
function colorPoster(titulo) {
  let suma = 0;
  for (const letra of titulo) suma = (suma * 31 + letra.charCodeAt(0)) >>> 0;
  const tono = Math.round((suma * 137.508) % 360); // reparte mejor los colores
  return `linear-gradient(135deg, hsl(${tono}, 65%, 52%), hsl(${(tono + 40) % 360}, 70%, 38%))`;
}

function pintarEstrellas(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

// Evita que el texto escrito por el usuario se interprete como HTML
function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

let temporizadorAviso;
function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add('visible');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove('visible'), 2200);
}

// -----------------------------------------------------
// Modo claro / oscuro (la preferencia se guarda en localStorage)
// -----------------------------------------------------
const CLAVE_TEMA = 'mis-pelis-series-tema';

function aplicarTema(tema) {
  document.body.classList.toggle('claro', tema === 'claro');
  botonTema.textContent = tema === 'claro' ? '🌙 Modo oscuro' : '☀️ Modo claro';
}

function cambiarTema() {
  const nuevo = document.body.classList.contains('claro') ? 'oscuro' : 'claro';
  aplicarTema(nuevo);
  try { localStorage.setItem(CLAVE_TEMA, nuevo); } catch { /* sin almacenamiento: solo dura esta visita */ }
}

function cargarTema() {
  try { aplicarTema(localStorage.getItem(CLAVE_TEMA) || 'oscuro'); } catch { aplicarTema('oscuro'); }
}

// -----------------------------------------------------
// Eventos
// -----------------------------------------------------
formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  const datos = leerFormulario();
  const error = validar(datos);
  if (error) {
    mensajeError.textContent = error;
    return;
  }

  if (campoId.value) {
    actualizarItem(campoId.value, datos); // UPDATE
    mostrarAviso('Cambios guardados ✏️');
  } else {
    crearItem(datos); // CREATE
  }
  reiniciarFormulario();
  renderizarItems();
});

botonCancelar.addEventListener('click', reiniciarFormulario);
campoResena.addEventListener('input', actualizarContadorResena);

// Un solo listener para los botones de todas las tarjetas
lista.addEventListener('click', evento => {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) return;
  const { accion, id } = boton.dataset;
  if (accion === 'editar') empezarEdicion(id);
  if (accion === 'eliminar') eliminarItem(id);
  if (accion === 'marcar-vista') marcarComoVista(id);
});

buscador.addEventListener('input', renderizarItems);
filtroTipo.addEventListener('change', renderizarItems);
filtroEstado.addEventListener('change', renderizarItems);
selectorOrden.addEventListener('change', renderizarItems);
botonTema.addEventListener('click', cambiarTema);

// Primera carga
cargarTema();
renderizarItems();
