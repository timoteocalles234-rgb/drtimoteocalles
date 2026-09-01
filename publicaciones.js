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
   contenedor.querySelectorAll(".publicacion").forEach((card) => {

    card.addEventListener("click", function () {

        const id = this.dataset.id;

        console.log("CLICK PUBLICACIÓN:", id);
        console.log("PUBLICACIONES:", publicaciones);

        const publicacion = publicaciones.find(
            (p) => String(p.id) === String(id)
        );

        if (!publicacion) {
            alert("No se encontró esta publicación.");
            return;
        }

        const modal = document.createElement("div");

        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 999999;
            background: rgba(0,0,0,0.92);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
            overflow-y: auto;
        `;

        modal.innerHTML = `
            <div style="
                position:relative;
                width:100%;
                max-width:900px;
                max-height:90vh;
                overflow-y:auto;
                background:#0d1214;
                border:1px solid #d9b86c;
                padding:40px;
                box-sizing:border-box;
            ">

                <button id="cerrar-publicacion" style="
                    position:absolute;
                    top:10px;
                    right:15px;
                    background:none;
                    border:none;
                    color:white;
                    font-size:32px;
                    cursor:pointer;
                ">×</button>

                ${
                    publicacion.imagen
                        ? `
                            <img
                                src="${publicacion.imagen}"
                                alt="${publicacion.titulo || ""}"
                                style="
                                    width:100%;
                                    max-height:500px;
                                    object-fit:cover;
                                    margin-bottom:30px;
                                    display:block;
                                "
                            >
                        `
                        : ""
                }

                <small style="
                    color:#d9b86c;
                    text-transform:uppercase;
                    letter-spacing:2px;
                ">
                    ${publicacion.categoria || area}
                </small>

                <h2 style="
                    color:white;
                    font-size:40px;
                    font-weight:400;
                    line-height:1.2;
                    margin:15px 0 25px;
                ">
                    ${publicacion.titulo || ""}
                </h2>

                <p style="
                    color:#c8ced0;
                    font-size:18px;
                    line-height:1.9;
                    white-space:pre-wrap;
                ">
                    ${publicacion.contenido || ""}
                </p>

            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector("#cerrar-publicacion")
            .addEventListener("click", () => {
                modal.remove();
            });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
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