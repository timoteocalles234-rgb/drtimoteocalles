const SUPABASE_URL = "https://rfpufrojyobydeahqtrb.supabase.co";
const SUPABASE_KEY = "sb_publishable_NeRm9OB6S_HD-ooxgDnxHw_zphN9aF4";

let supabaseClient = null;
let accessToken = null;

async function iniciarAutenticacion() {

    const modulo = await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );

    supabaseClient = modulo.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    const panel = document.querySelector(".admin-container");

    if (!panel) return false;

    panel.style.display = "none";

    const { data: { session } } =
        await supabaseClient.auth.getSession();

    if (session) {

        accessToken = session.access_token;
        panel.style.display = "";

        return true;
    }

    const login = document.createElement("div");

    login.id = "login-admin";

    login.innerHTML = `
        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#05090a;
            padding:30px;
            box-sizing:border-box;
        ">

            <form id="form-login-admin" style="
                width:100%;
                max-width:420px;
                background:#0d1214;
                padding:40px;
                border:1px solid rgba(217,184,108,.4);
                box-sizing:border-box;
            ">

                <div style="
                    color:#d9b86c;
                    font-size:12px;
                    letter-spacing:3px;
                    text-transform:uppercase;
                    margin-bottom:15px;
                ">
                    TIEMPO DE VIDA
                </div>

                <h1 style="
                    color:white;
                    font-weight:400;
                    margin:0 0 10px;
                ">
                    Acceso de administrador
                </h1>

                <p style="
                    color:#aeb5b8;
                    margin-bottom:30px;
                ">
                    Ingresá para administrar las publicaciones.
                </p>

                <label style="color:white;display:block;margin-bottom:8px;">
                    Email
                </label>

                <input
                    id="login-email"
                    type="email"
                    value="timoteo@tiempodevida.ar"
                    autocomplete="username"
                    required
                    style="
                        width:100%;
                        padding:13px;
                        margin-bottom:18px;
                        box-sizing:border-box;
                    "
                >

                <label style="color:white;display:block;margin-bottom:8px;">
                    Contraseña
                </label>

                <input
                    id="login-password"
                    type="password"
                    autocomplete="current-password"
                    required
                    style="
                        width:100%;
                        padding:13px;
                        margin-bottom:20px;
                        box-sizing:border-box;
                    "
                >

                <button
                    type="submit"
                    style="
                        width:100%;
                        padding:14px;
                        background:#d9b86c;
                        border:0;
                        cursor:pointer;
                        font-weight:600;
                    "
                >
                    INGRESAR
                </button>

                <p
                    id="login-error"
                    style="
                        color:#e88;
                        margin-top:15px;
                        display:none;
                    "
                ></p>

            </form>
        </div>
    `;

    document.body.insertBefore(login, document.body.firstChild);

    const formulario =
        document.getElementById("form-login-admin");

    formulario.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const email =
            document.getElementById("login-email").value.trim();

        const password =
            document.getElementById("login-password").value;

        const error =
            document.getElementById("login-error");

        error.style.display = "none";

        const { data, error: loginError } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (loginError) {

            error.textContent =
                "Email o contraseña incorrectos.";

            error.style.display = "block";

            return;
        }

        accessToken = data.session.access_token;

        login.remove();

        panel.style.display = "";
    });

    return false;
}

document.addEventListener("DOMContentLoaded", async () => {

    if (!document.querySelector(".admin-container")) return;

    const autenticado = await iniciarAutenticacion();

    if (!autenticado) return;
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

    if (!titulo || !contenido) {
        alert("Completá el título y el contenido.");
        return;
    }

    const SUPABASE_URL = "https://rfpufrojyobydeahqtrb.supabase.co";
    const SUPABASE_KEY = "sb_publishable_NeRm9OB6S_HD-ooxgDnxHw_zphN9aF4";

    try {

        let imagenURL = "";

        // ==========================================
        // SUBIR IMAGEN A SUPABASE STORAGE
        // ==========================================

        const archivoInput = document.getElementById("imagen");
        const archivo = archivoInput?.files?.[0];

        if (archivo) {

            const nombreArchivo =
                Date.now() + "-" +
                archivo.name.replace(/[^a-zA-Z0-9._-]/g, "-");

            const respuestaImagen = await fetch(
                `${SUPABASE_URL}/storage/v1/object/publicaciones/${nombreArchivo}`,
                {
                    method: "POST",
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`,
                        "Content-Type": archivo.type || "application/octet-stream"
                    },
                    body: archivo
                }
            );

            if (!respuestaImagen.ok) {
                const errorImagen = await respuestaImagen.text();

                console.error(
                    "ERROR SUBIENDO IMAGEN:",
                    errorImagen
                );

                alert(
                    "ERROR AL SUBIR LA IMAGEN:\n" +
                    errorImagen
                );

                return;
            }

            imagenURL =
                `${SUPABASE_URL}/storage/v1/object/publicaciones/${nombreArchivo}`;

            console.log("IMAGEN SUBIDA:", imagenURL);
        }

        // ==========================================
        // GUARDAR PUBLICACIÓN
        // ==========================================

        const respuesta = await fetch(
            `${SUPABASE_URL}/rest/v1/publicaciones`,
            {
                method: "POST",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },

                body: JSON.stringify({
                    titulo: titulo,
                    contenido: contenido,
                    area: area,
                    categoria: categoria,
                    estado: estado,
                    imagen: imagenURL,
                    video: ""
                })
            }
        );

        console.log(
            "POST PUBLICACION STATUS:",
            respuesta.status
        );

        if (!respuesta.ok) {

            const error = await respuesta.text();

            console.error(
                "ERROR SUPABASE:",
                error
            );

            alert(
                "ERROR SUPABASE:\n" +
                error
            );

            return;
        }

        alert(
            estado === "publicada"
                ? "PUBLICACIÓN REALIZADA CORRECTAMENTE."
                : "BORRADOR GUARDADO CORRECTAMENTE."
        );

        mostrarLista(
            estado === "publicada"
                ? "publicadas"
                : "borradores"
        );

    } catch (error) {

        console.error(
            "ERROR:",
            error
        );

        alert(
            "ERROR DE CONEXIÓN CON SUPABASE."
        );
    }
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

  async function mostrarLista(tipo, area = null) {

    const publicaciones =
      JSON.parse(localStorage.getItem("tiempoDeVida")) || [];

    const estado =
      tipo === "publicadas"
        ? "publicada"
        : "borrador";

    const lista =
    publicaciones.filter(p =>
        p.estado === estado &&
        (!area || p.area === area)
    );

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