console.log("🔥 ESTOY EJECUTANDO EL APP.JS NUEVO");
/* ==========================================================================
   TIEMPO DE VIDA - INTERACCIONES & CONTROLADOR DE UX (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. CONTROL DEL SITE HEADER (Cambio de opacidad y tamaño en scroll)
    const header = document.getElementById('site-header');
if (!header) return;
    
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScrollHeader, { passive: true });
    handleScrollHeader(); // Ejecutar en carga inicial por si se recarga abajo


    // 2. MENÚ MÓVIL INTERACTIVO (Estilo Minimalista)
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Animación refinada de las barras del botón hamburguesa
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'translateY(6px) rotate(45deg)';
                bars[1].style.transform = 'translateY(-6px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });

        // Cerrar menú al hacer clic en un enlace de navegación
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            });
        });
    }


    // 3. CINEMATIC SCROLL REVEAL (IntersectionObserver con transiciones lentas)
    const animateOnScroll = () => {
        const revealElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-right');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Se activa cuando entra el 10% del elemento
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Dejar de observar para optimizar rendimiento
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            observer.observe(el);
        });
    };

    if ('IntersectionObserver' in window) {
        animateOnScroll();
    } else {
        // Fallback para navegadores antiguos sin soporte
        const revealElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-right');
        revealElements.forEach(el => el.classList.add('visible'));
    }





    // 4.5 INTERACTIVIDAD DE TARJETAS DE RECUPERACIÓN (PILARES HUMANOS)
    const recoveryCards = document.querySelectorAll('.recovery-card');

    recoveryCards.forEach(card => {
        card.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            
            // Cerrar todas las demás tarjetas
            recoveryCards.forEach(otherCard => {
                otherCard.classList.remove('active');
                const content = otherCard.querySelector('.recovery-card-content');
                if (content) {
                    content.style.maxHeight = null;
                }
            });

            // Si no estaba activa, activarla y expandir su contenido
            if (!isActive) {
                card.classList.add('active');
                const content = card.querySelector('.recovery-card-content');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // Asegurar que el contenido del pilar activo por defecto (Card 1) tenga el max-height adecuado al cargar la página
    const activeDefaultCard = document.querySelector('.recovery-card.active');
    if (activeDefaultCard) {
        const defaultContent = activeDefaultCard.querySelector('.recovery-card-content');
        if (defaultContent) {
            defaultContent.style.maxHeight = defaultContent.scrollHeight + 'px';
        }
    }


    // 5. MICROINTERACCIONES DE LUJO (Quiet Luxury effects)
    // Efecto sutil de paralaje / escala lenta al hacer hover sobre las tarjetas del ecosistema
    const ecoCards = document.querySelectorAll('.eco-card');
    ecoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const badge = card.querySelector('.eco-badge');
            if (badge) {
                badge.style.transform = 'scale(1.05)';
                badge.style.transition = 'transform 0.4s ease';
            }
        });
        card.addEventListener('mouseleave', () => {
            const badge = card.querySelector('.eco-badge');
            if (badge) {
                badge.style.transform = 'none';
            }
        });
    });

    // Desplazamiento suave para la navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {

    if (targetId === '#tiempo-de-vida') {
        targetElement.hidden = false;
    }
                const headerOffset = 90; // header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
// ============================================
// TIEMPO DE VIDA - PUBLICACIONES
// ============================================

document.addEventListener("DOMContentLoaded", async () => {

    const contenedor = document.getElementById("publicaciones-tiempo-de-vida");
console.log("CONTENEDOR:", contenedor);
    if (!contenedor) return;

    const respuesta = await fetch(
    'https://rfpufrojyobydeahqtrb.supabase.co/rest/v1/publicaciones?select=*',
    {
        headers: {
            'apikey': 'sb_publishable_NeRm9OB6S_HD-ooxgDnxHw_zphN9aF4',
            'Authorization': 'Bearer sb_publishable_NeRm9OB6S_HD-ooxgDnxHw_zphN9aF4'
        }
    }
);

const publicaciones = await respuesta.json();
console.log("RESPUESTA SUPABASE:", publicaciones);
    if (publicaciones.length === 0) {
        contenedor.innerHTML = "<p>No hay publicaciones todavía.</p>";
        return;
    }

    contenedor.innerHTML = publicaciones
        .filter(p => p.estado === "publicada")
        .map(p => `
            <article class="publicacion">
                <small>${p.categoria || "TIEMPO DE VIDA"}</small>
                <h3>${p.titulo || ""}</h3>
                <p>${p.contenido || ""}</p>
            </article>
        `)
        .join("");

});
