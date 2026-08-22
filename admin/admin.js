document.addEventListener("DOMContentLoaded", () => {

  const botones = document.querySelectorAll(".action-card");
  const botonCrear = document.querySelector(".primary-button");
  const centro = document.querySelector(".welcome-card");

  // NUEVA PUBLICACIÓN
  botones[0].addEventListener("click", () => {
    mostrarEditor();
  });

  // BORRADORES
  botones[1].addEventListener("click", () => {
    mostrarLista("borradores");
  });

  // PUBLICADAS
  botones[2].addEventListener("click", () => {
    mostrarLista("publicadas");
  });

  // BOTÓN CREAR PUBLICACIÓN
  botonCrear.addEventListener("click", () => {
    mostrarEditor();
  });

  function mostrarEditor() {

    centro.innerHTML = `
      <span class="section-label">NUEVA PUBLICACIÓN</span>

      <h2>Crear contenido</h2>

      <div class="editor-form">

        <label>Título</label>
        <input id="titulo" type="text" placeholder="Escribí el título">

        <label>Contenido</label>
        <textarea id="contenido" rows="8"
          placeholder="Escribí tu reflexión o contenido..."></textarea>

        <label>Área pública</label>
<select id="area">
    <option value="Tiempo de Vida">Tiempo de Vida</option>
    <option value="Salud Renal">Salud Renal</option>
</select>

<label>Categoría interna</label>
<select id="categoria">
    <option value="Despertar">Despertar</option>
    <option value="Conciencia">Conciencia</option>
    <option value="Dosis">Dosis</option>
    <option value="Filosofía de vida">Filosofía de vida</option>
    <option value="Hábitos">Hábitos</option>
    <option value="Prevención renal">Prevención renal</option>
    <option value="Educación renal">Educación renal</option>
    <option value="Cuidados renales">Cuidados renales</option>
</select>

        <label>Imagen</label>
<input id="imagen" type="file" accept="image/*">

<div id="preview-imagen"></div>

<label>Video</label>
<input id="video" type="file" accept="video/*">

<div id="preview-video"></div>

        <div class="editor-buttons">

          <button id="guardar" class="primary-button">
            Guardar borrador
          </button>

          <button id="publicar" class="primary-button">
            Publicar
          </button>

        </div>

      </div>
    `;

    document.getElementById("guardar").addEventListener("click", () => {
      guardarPublicacion("borrador");
    });


    document.getElementById("publicar").addEventListener("click", () => {
      guardarPublicacion("publicada");
    });
  
  document.getElementById("imagen").addEventListener("change", function () {
  const preview = document.getElementById("preview-imagen");
  preview.innerHTML = "";

  const archivo = this.files[0];

  if (archivo) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(archivo);
    img.style.maxWidth = "100%";
    img.style.maxHeight = "400px";
    img.style.marginTop = "15px";
    preview.appendChild(img);
  }
});

document.getElementById("video").addEventListener("change", function () {
  const preview = document.getElementById("preview-video");
  preview.innerHTML = "";

  const archivo = this.files[0];

  if (archivo) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(archivo);
    video.controls = true;
    video.style.maxWidth = "100%";
    video.style.maxHeight = "400px";
    video.style.marginTop = "15px";
    preview.appendChild(video);
  }
});
}
function archivoADataURL(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();

        lector.onload = () => resolve(lector.result);
        lector.onerror = () => reject(lector.error);

        lector.readAsDataURL(archivo);
    });
}
function guardarArchivoIndexedDB(id, archivo) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("TiempoDeVidaDB", 1);

        request.onupgradeneeded = function () {
            const db = request.result;

            if (!db.objectStoreNames.contains("archivos")) {
                db.createObjectStore("archivos");
            }
        };

        request.onsuccess = function () {
            const db = request.result;

            const transaction = db.transaction("archivos", "readwrite");
            const store = transaction.objectStore("archivos");

            store.put(archivo, id);

            transaction.oncomplete = function () {
                resolve();
            };

            transaction.onerror = function () {
                reject(transaction.error);
            };
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}
  async function guardarPublicacion(estado) {

    const titulo = document.getElementById("titulo").value.trim();
    const contenido = document.getElementById("contenido").value.trim();
    const area = document.getElementById("area").value;
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").files[0];
const video = document.getElementById("video").files[0];

    if (!titulo || !contenido) {
      alert("Completá el título y el contenido.");
      return;
    }

    const publicaciones =
      JSON.parse(localStorage.getItem("tiempoDeVida")) || [];

    
    const imagenId = imagen ? `imagen-${Date.now()}` : "";
const videoId = video ? `video-${Date.now()}` : "";
      publicaciones.push({
      id: Date.now(),
      titulo: titulo,
      contenido: contenido,
      categoria: categoria,
imagen: imagenId,
area: area,
video: videoId,
      estado: estado,
      fecha: new Date().toLocaleString("es-AR")
    });

    localStorage.setItem(
      "tiempoDeVida",
      JSON.stringify(publicaciones)
    );
if (imagen) {
    await guardarArchivoIndexedDB(imagenId, imagen);
}

if (video) {
    await guardarArchivoIndexedDB(videoId, video);
}
    alert(
      estado === "publicada"
        ? "Publicación realizada correctamente."
        : "Borrador guardado correctamente."
    );

    mostrarLista(
      estado === "publicada"
        ? "publicadas"
        : "borradores"
    );
  }

  function obtenerArchivoIndexedDB(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("TiempoDeVidaDB", 1);

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction("archivos", "readonly");
            const store = transaction.objectStore("archivos");

            const archivoRequest = store.get(id);

            archivoRequest.onsuccess = function () {
                resolve(archivoRequest.result || null);
            };

            archivoRequest.onerror = function () {
                reject(archivoRequest.error);
            };
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}

  async function mostrarLista(tipo) {

    const publicaciones =
      JSON.parse(localStorage.getItem("tiempoDeVida")) || [];

    const estado =
      tipo === "publicadas"
        ? "publicada"
        : "borrador";

    const lista =
      publicaciones.filter(p => p.estado === estado);

    let contenido = `
      <span class="section-label">
        ${tipo === "publicadas" ? "PUBLICADAS" : "BORRADORES"}
      </span>

      <h2>
        ${tipo === "publicadas"
          ? "Contenido publicado"
          : "Contenido guardado"}
      </h2>
    `;

    if (lista.length === 0) {

      contenido += `
        <p>
          Todavía no hay contenido en esta sección.
        </p>

        <button class="primary-button" id="volverCrear">
          ＋ Crear publicación
        </button>
      `;

    } else {

      lista.reverse().forEach(p => {

        contenido += `
          <article class="publication-item">

            <span class="section-label">
              ${p.categoria}
            </span>
<span class="section-label">
    ${p.area}
</span>
            <h3>${p.titulo}</h3>

            <p>${p.contenido}</p>
            <div id="media-${p.id}"></div>

            <small>${p.fecha}</small>

          </article>
        `;
      });

      contenido += `
        <button class="primary-button" id="volverCrear">
          ＋ Nueva publicación
        </button>
      `;
    }

    centro.innerHTML = contenido;
    for (const p of lista) {
    const media = document.getElementById(`media-${p.id}`);

    if (p.imagen) {
        const archivoImagen = await obtenerArchivoIndexedDB(p.imagen);

        if (archivoImagen) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(archivoImagen);
            img.style.maxWidth = "100%";
            img.style.maxHeight = "400px";
            img.style.marginTop = "15px";
            media.appendChild(img);
        }
    }

    if (p.video) {
        const archivoVideo = await obtenerArchivoIndexedDB(p.video);

        if (archivoVideo) {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(archivoVideo);
            video.controls = true;
            video.style.maxWidth = "100%";
            video.style.maxHeight = "400px";
            video.style.marginTop = "15px";
            media.appendChild(video);
        }
    }
}

    document
      .getElementById("volverCrear")
      .addEventListener("click", mostrarEditor);
  }

});