# 🎬 Mis Pelis y Series: CRUD desarrollado con IA

**Seminario:** Gestión de Software Ágil asistido por Inteligencia Artificial
**Autor/a:** David Santiago Sierra Galindo
**Video explicativo:** _[Pega aquí el enlace del video]_

## Descripción

**Mis Pelis y Series** es una aplicación web para llevar el registro de las películas y series que has visto, estás viendo o tienes pendientes. Hace las cuatro operaciones de un CRUD:

| Operación | Qué hace en la app |
|-----------|--------------------|
| **Create** | Agrega una película o serie con título, tipo, año, género, plataforma, estado (por ver, viendo, vista) y calificación de 1 a 5 estrellas. |
| **Read** | Muestra la lista en tarjetas, con buscador por título y filtros por tipo y por estado. |
| **Update** | El botón **Editar** carga el registro en el formulario para modificarlo y guardar los cambios. |
| **Delete** | El botón **Eliminar** borra el registro después de pedir confirmación. |

Los datos se guardan en el **localStorage** del navegador, así que no se pierden al recargar la página.

Otras características:
- Validación del título (obligatorio) y del año.
- Las películas y las series se distinguen por el color del borde (rojo y morado).
- Avisos emergentes cuando se agrega, edita o elimina un registro.
- Protección contra inyección de HTML (el texto del usuario se escapa antes de mostrarse).
- Diseño adaptable a celular.

## Tecnologías utilizadas

- **HTML5**: estructura de la página y formulario.
- **CSS3**: estilos, diseño con Grid y Flexbox, diseño adaptable (media queries).
- **JavaScript (vanilla)**: lógica del CRUD y manejo de eventos.
- **localStorage**: almacenamiento de los datos en el navegador.
- **Herramienta de IA**: claude

No necesita servidor, base de datos ni instalar dependencias.

## Instrucciones para ejecutar

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU-USUARIO/mis-pelis-series.git
   ```
2. Entra a la carpeta y abre `index.html` con doble clic (se abre en el navegador).


## Estructura del proyecto

```
mis-pelis-series/
├── index.html    → Estructura: formulario y listado
├── style.css     → Estilos visuales
├── app.js        → Lógica del CRUD y localStorage
├── capturas/     → Imágenes para este README
└── README.md
```

## Capturas de pantalla

**Pantalla inicial (sin datos)**
![Inicio] ![alt text](<Captura de pantalla 2026-11-14 142041.png>)
**Read: lista de películas y series**
![Listado]![alt text](<Captura de pantalla 2026-11-14 151248.png>)

**Update: editando un registro**
![Editar] ![alt text](<Captura de pantalla 2026-11-14 151444.png>)

**Filtros: 
![Filtro] ![alt text](<Captura de pantalla 2026-11-14 151550.png>)

**Versión para celular**

<img src="capturas/05-movil.png" width="300" alt="Versión móvil">

## Prompts utilizados

Estos son los prompts que usé, en orden, con lo que pedí y para qué.

### Prompt 1: Estructura base
> Quiero hacer una aplicación web CRUD sencilla para registrar películas y series que he visto o quiero ver, usando solo HTML, CSS y JavaScript, sin frameworks. Crea el archivo index.html con un formulario que tenga título, tipo película o serie, año, género, plataforma, estado y calificación y una sección donde se mostrará la lista. Los textos deben estar en español.

**Para qué:** obtener la estructura HTML con el formulario y el espacio para el listado.

### Prompt 2: Create y Read con localStorage
> Ahora crea app.js. Necesito que al enviar el formulario se agregue un registro nuevo con un id único y se guarde en localStorage. También quiero una función que lea los registros guardados y los muestre como tarjetas en la lista. Comenta el código indicando qué parte es CREATE y qué parte es READ.

**Para qué:** implementar las operaciones de crear y leer, y que los datos se guarden aunque se recargue la página.

### Prompt 3: Update y Delete
> Agrega a cada tarjeta un botón Editar y uno Eliminar. Editar debe cargar los datos en el mismo formulario, cambiar el título a "Editar título" y el botón a "Guardar cambios", y mostrar un botón Cancelar. Eliminar debe pedir confirmación antes de borrar. Marca en comentarios la parte UPDATE y la parte DELETE.

**Para qué:** completar el CRUD reutilizando el mismo formulario para crear y editar.

### Prompt 4: Estilos
> Crea style.css con un diseño oscuro tipo plataforma de streaming, con rojo como color principal. Formulario a la izquierda y lista a la derecha usando CSS Grid, y que en celular se pongan uno debajo del otro. Las películas deben tener un borde rojo y las series uno morado, y el estado debe verse con una etiqueta de color diferente para "Por ver", "Viendo" y "Vista".

**Para qué:** darle una apariencia propia, diferenciar visualmente películas y series, y que funcione bien en celular.

### Prompt 5: Validación
> Agrega validación: el título es obligatorio y el año debe ser un año razonable (desde 1888 hasta un par de años después del actual). Muestra el error debajo del formulario en vez de usar alert.

**Para qué:** evitar registros vacíos o con datos incorrectos.

### Prompt 6: Búsqueda y filtros
> Agrega un buscador que filtre por título mientras escribo, un select para ver solo películas o solo series, y otro para filtrar por estado. Los filtros deben poder combinarse. Si no hay resultados, muestra un mensaje.

**Para qué:** facilitar encontrar un título cuando la lista crece.

### Prompt 7: Refactorización y revisión
> Revisa app.js y refactorízalo: separa la lógica en funciones pequeñas (crearItem, renderizarItems, actualizarItem, eliminarItem), usa un solo event listener en la lista en lugar de uno por botón, y dime si hay algún problema de seguridad al insertar el texto del usuario con innerHTML.

**Para qué:** mejorar la organización del código y detectar el riesgo de inyección de HTML (XSS). La IA propuso la función `escaparHTML()` para solucionarlo.

### Prompt 8: Detalles finales
> Agrega un contador con el total de registros junto al título "Mi lista" y un aviso pequeño que aparezca abajo unos segundos cuando se agrega, edita o elimina algo.

**Para qué:** mejorar la experiencia de uso con retroalimentación visual.

## Mis cambios y personalización

-agregué Crunchyroll, Apple TV+ y YouTube, porque son las que más uso y no venían en la versión original.
-agregué Anime, fantasia, Acción, Comedia. Drama, Terror, Ciencia ficción, Animación, Documental, Romance, Suspenso, Anime, Fantasía, Aventura, Misterio, Superhéroes,Histórica, Musical, Familiar, Deportes, K-drama, Reality, Telenovela en la lista de generos.
-cambié el color principal de rojo a blanco para que sobresalga
-agregué el botón modo claro arriba a la derecha, pasé todos los colores fijos a variables y agregué un bloque body.claro, que cambia esas variables por colores claros.
-agregue tres funciones que me permite poner o quitar la clase claro, alternas entre ambos modos al darle click
-agregué los estilos .poster e .item-principal 
-le agregue reseñas y comentarios con un limite de 300 palabras 
-En renderizarItems agregué el póster a cada tarjeta.
-probé cada operación del CRUD (crear, listar, editar y eliminar), los filtros combinados y que los datos se mantuvieran al recargar la página.
## Uso responsable de la IA

La IA me ayudó, pero revisé cada parte, la probé, agregue, quite y cambie algunas cosas de la app, puedo explicar cómo funciona. Las decisiones de diseño, el tema y los ajustes finales son míos.
