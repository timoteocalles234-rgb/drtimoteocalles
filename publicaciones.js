document.addEventListener("DOMContentLoaded", () => {

    cargarPublicaciones("Tiempo de Vida", "publicaciones-tiempo-de-vida");

  

    cargarPublicaciones("Salud Renal", "publicaciones-salud-renal");

});


async function cargarPublicaciones(area, contenedorId) {

    const contenedor = document.getElementById(contenedorId);

    if (!contenedor) return;

    const publicaciones =
        JSON.parse(localStorage.getItem("tiempoDeVida")) || [];

    const lista = publicaciones
    .filter(p =>
        p.estado === "publicada" &&
        String(p.area || "").trim().toLowerCase() ===
        String(area || "").trim().toLowerCase()
    )
    .reverse();

    contenedor.innerHTML = "";

    if (lista.length === 0) {

        contenedor.innerHTML =
            "<p>No hay publicaciones todavía.</p>";

        return;
    }

    for (const p of lista) {

        const article = document.createElement("article");
        article.className = "publicacion";

        const categoria = document.createElement("small");
        categoria.textContent = p.categoria || area;

        const titulo = document.createElement("h3");
        titulo.textContent = p.titulo;

        const texto = document.createElement("p");
        texto.textContent = p.contenido;

        article.appendChild(categoria);
        article.appendChild(titulo);
        article.appendChild(texto);

        const media = document.createElement("div");
        media.className = "publicacion-media";

        if (p.imagen) {

            const archivoImagen =
                await obtenerArchivoIndexedDB(p.imagen);

            if (archivoImagen) {

                const img = document.createElement("img");

                img.src =
                    URL.createObjectURL(archivoImagen);

                img.alt = p.titulo;

                media.appendChild(img);
            }
        }

        if (p.video) {

            const archivoVideo =
                await obtenerArchivoIndexedDB(p.video);

            if (archivoVideo) {

                const video = document.createElement("video");

                video.src =
                    URL.createObjectURL(archivoVideo);

                video.controls = true;
                video.playsInline = true;

                media.appendChild(video);
            }
        }

        article.appendChild(media);

        const fecha = document.createElement("small");
        fecha.textContent = p.fecha || "";

        article.appendChild(fecha);

        contenedor.appendChild(article);
    }
}


function obtenerArchivoIndexedDB(id) {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open("TiempoDeVidaDB", 1);

        request.onsuccess = function () {

            const db = request.result;

            if (!db.objectStoreNames.contains("archivos")) {
                resolve(null);
                return;
            }

            const transaction =
                db.transaction("archivos", "readonly");

            const store =
                transaction.objectStore("archivos");

            const archivoRequest =
                store.get(id);

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


