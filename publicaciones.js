console.log("🔥 PUBLICACIONES.JS SE CARGÓ");
document.addEventListener("DOMContentLoaded", () => {
    cargarPublicaciones("Tiempo de Vida", "publicaciones-tiempo-de-vida");
 cargarPublicaciones("Salud Renal", "publicaciones-salud-renal");
});

async function cargarPublicaciones(area, contenedorId) {
    const contenedor = document.getElementById(contenedorId);

    if (!contenedor) return;

    try {
        const respuesta = await fetch(
            "https://rfpufrojyobydeahqtrb.supabase.co/rest/v1/publicaciones?select=*",
            {
                headers: {
                    "apikey": "sb_publishable_NeRm9OB6S_HD-ooxgDnxHw_zphN9aF4"
                }
            }
        );

        if (!respuesta.ok) {
            throw new Error("Error Supabase: " + respuesta.status);
        }

        const publicaciones = await respuesta.json();

        console.log("PUBLICACIONES RECIBIDAS:", publicaciones);
        console.log("ÁREA BUSCADA:", area);

        const lista = publicaciones.filter(p => {
            return (
                p.area?.trim().toLowerCase() === area.trim().toLowerCase() ||
                p.categoria?.trim().toLowerCase() === area.trim().toLowerCase()
            );
        });

        console.log("PUBLICACIONES PARA MOSTRAR:", lista);

        if (lista.length === 0) {
            contenedor.innerHTML = "<p>No hay publicaciones todavía.</p>";
            return;
        }

        contenedor.innerHTML = lista
    .slice()
    .reverse()
    .map(p =>
        '<article class="publicacion" style="cursor:pointer;" data-id="' + p.id + '">' +

        (p.imagen
            ? '<img src="' + p.imagen + '" alt="' +
              (p.titulo || "Imagen de la publicación") +
              '" style="width:100%; max-height:420px; object-fit:cover; margin-bottom:24px;">'
            : '') +

        '<small>' + (p.categoria || area) + '</small>' +

        '<h3>' + (p.titulo || "") + '</h3>' +

        '<p>' + (p.contenido || "") + '</p>' +

        '</article>'
    )
    .join("");
    contenedor.querySelectorAll(".publicacion").forEach(card => {

    card.addEventListener("click", () => {

        const id = card.dataset.id;

        const publicacion = publicaciones.find(
            p => String(p.id) === String(id)
        );

        if (!publicacion) return;

        const modal = document.createElement("div");

        modal.style.position = "fixed";
        modal.style.inset = "0";
        modal.style.background = "rgba(0,0,0,0.88)";
        modal.style.zIndex = "99999";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.style.padding = "30px";
        modal.style.overflowY = "auto";

        modal.innerHTML = `
            <div style="
                width:100%;
                max-width:900px;
                background:#0d1214;
                border:1px solid rgba(217,184,108,.45);
                padding:40px;
                position:relative;
                box-sizing:border-box;
            ">

                <button id="cerrar-publicacion" style="
                    position:absolute;
                    top:15px;
                    right:18px;
                    background:none;
                    border:none;
                    color:#fff;
                    font-size:30px;
                    cursor:pointer;
                ">×</button>

                ${
                    publicacion.imagen
                    ? `
                        <img
                            src="${publicacion.imagen}"
                            alt="${publicacion.titulo || "Publicación"}"
                            style="
                                width:100%;
                                max-height:520px;
                                object-fit:cover;
                                margin-bottom:30px;
                            "
                        >
                    `
                    : ""
                }

                <small style="
                    color:#d9b86c;
                    text-transform:uppercase;
                    letter-spacing:2px;
                    font-size:11px;
                ">
                    ${publicacion.categoria || area}
                </small>

                <h2 style="
                    color:#fff;
                    font-size:38px;
                    font-weight:400;
                    margin:15px 0 25px;
                    line-height:1.2;
                ">
                    ${publicacion.titulo || ""}
                </h2>

                <div style="
                    color:#c8ced0;
                    font-size:18px;
                    line-height:1.9;
                    white-space:pre-wrap;
                ">
                    ${publicacion.contenido || ""}
                </div>

            </div>
        `;

        document.body.appendChild(modal);

        document
            .getElementById("cerrar-publicacion")
            .addEventListener("click", () => {
                modal.remove();
            });

        modal.addEventListener("click", event => {
            if (event.target === modal) {
                modal.remove();
            }
        });

    });

});
    } catch (error) {
        console.error("ERROR CARGANDO PUBLICACIONES:", error);
        contenedor.innerHTML =
            "<p>No se pudieron cargar las publicaciones.</p>";
    }
}