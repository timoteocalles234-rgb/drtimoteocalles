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
                    "apikey": "sb_publishable_NeRm90B6S_HD-ooxgDnxHw_zphN9aF4",
                    "Authorization": "Bearer sb_publishable_NeRm90B6S_HD-ooxgDnxHw_zphN9aF4"
                }
            }
        );

        if (!respuesta.ok) {
            throw new Error("Error Supabase: " + respuesta.status);
        }

        const publicaciones = await respuesta.json();

        console.log("PUBLICACIONES RECIBIDAS:", publicaciones);
        console.log("ÁREA BUSCADA:", area);

        const lista = publicaciones.filter(p =>
            p.estado === "publicada" &&
            p.area === area
        );

        console.log("PUBLICACIONES PARA MOSTRAR:", lista);

        if (lista.length === 0) {
            contenedor.innerHTML = "<p>No hay publicaciones todavía.</p>";
            return;
        }

        contenedor.innerHTML = lista
            .reverse()
            .map(p => `
                <article class="publicacion">

                    <small>${p.categoria || area}</small>

                    <h3>${p.titulo || ""}</h3>

                    <p>${p.contenido || ""}</p>

                </article>
            `)
            .join("");

    } catch (error) {

        console.error("ERROR CARGANDO PUBLICACIONES:", error);

        contenedor.innerHTML =
            "<p>No se pudieron cargar las publicaciones.</p>";
    }
}