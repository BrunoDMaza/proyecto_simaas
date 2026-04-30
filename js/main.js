(function() {
    'use strict';

    // ---------- ACCESIBILIDAD ----------
    var toggleModoOscuro = document.getElementById('toggleModoOscuro');
    var toggleDislexia = document.getElementById('toggleDislexia');
    var aumentarFuente = document.getElementById('aumentarFuente');
    var disminuirFuente = document.getElementById('disminuirFuente');
    var restablecerBtn = document.getElementById('restablecerAccesibilidad');
    var avisoAria = document.getElementById('aviso-aria');

    var modoOscuro = localStorage.getItem('modoOscuro') === 'true';
    var fuenteDislexia = localStorage.getItem('fuenteDislexia') === 'true';
    var tamanoFuente = parseInt(localStorage.getItem('tamanoFuente')) || 100;

    function establecerModoOscuro(activar) {
        document.body.classList.toggle('modo-oscuro', activar);
        toggleModoOscuro.innerHTML = activar ? '&#9788;' : '&#9789;';
        toggleModoOscuro.setAttribute('aria-label', activar ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        localStorage.setItem('modoOscuro', activar);
        modoOscuro = activar;
    }

    function establecerFuenteDislexia(activar) {
        document.body.classList.toggle('fuente-dislexia', activar);
        toggleDislexia.textContent = 'Aa';
        toggleDislexia.setAttribute('aria-label', activar ? 'Desactivar tipografía para dislexia' : 'Activar tipografía para dislexia');
        localStorage.setItem('fuenteDislexia', activar);
        fuenteDislexia = activar;
    }

    function actualizarBotonesFuente() {
        aumentarFuente.disabled = tamanoFuente >= 150;
        disminuirFuente.disabled = tamanoFuente <= 80;
    }

    function establecerTamanoFuente(tamano) {
        tamanoFuente = Math.min(150, Math.max(80, tamano));
        document.body.style.fontSize = tamanoFuente + '%';
        localStorage.setItem('tamanoFuente', tamanoFuente);
        actualizarBotonesFuente();
    }

    function anunciar(mensaje) {
        if (avisoAria) {
            avisoAria.textContent = '';
            avisoAria.textContent = mensaje;
        }
    }

    toggleModoOscuro.addEventListener('click', function() { establecerModoOscuro(!modoOscuro); });
    toggleDislexia.addEventListener('click', function() { establecerFuenteDislexia(!fuenteDislexia); });
    aumentarFuente.addEventListener('click', function() { establecerTamanoFuente(tamanoFuente + 10); });
    disminuirFuente.addEventListener('click', function() { establecerTamanoFuente(tamanoFuente - 10); });

    restablecerBtn.addEventListener('click', function() {
        establecerModoOscuro(false);
        establecerFuenteDislexia(false);
        establecerTamanoFuente(100);
        anunciar('Configuración de accesibilidad restablecida');
    });

    establecerModoOscuro(modoOscuro);
    establecerFuenteDislexia(fuenteDislexia);
    establecerTamanoFuente(tamanoFuente);

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('modoOscuro')) {
        establecerModoOscuro(true);
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var elementosFade = document.querySelectorAll('.aparecer-arriba');
        for (var i = 0; i < elementosFade.length; i++) {
            elementosFade[i].classList.add('visible');
        }
        var contenidosAcordeon = document.querySelectorAll('.contenido-acordeon');
        for (var j = 0; j < contenidosAcordeon.length; j++) {
            contenidosAcordeon[j].style.transition = 'none';
        }
    }

    // ---------- INDICADOR DE SCROLL ----------
    var indicadorScroll = document.querySelector('.indicador-scroll');
    if (indicadorScroll) {
        indicadorScroll.addEventListener('click', function() {
            var nav = document.querySelector('nav');
            if (nav) nav.scrollIntoView({ behavior: 'smooth' });
        });
        indicadorScroll.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                var nav = document.querySelector('nav');
                if (nav) nav.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ---------- MENU HAMBURGUESA ----------
    var hamburguesa = document.getElementById('hamburguesa');
    var menuNavegacion = document.getElementById('menu-navegacion');
    hamburguesa.addEventListener('click', function() {
        var expandido = hamburguesa.getAttribute('aria-expanded') === 'true';
        hamburguesa.setAttribute('aria-expanded', !expandido);
        hamburguesa.classList.toggle('abierto');
        menuNavegacion.classList.toggle('abierto');
    });
    var enlacesNav = menuNavegacion.querySelectorAll('a');
    for (var k = 0; k < enlacesNav.length; k++) {
        enlacesNav[k].addEventListener('click', function() {
            hamburguesa.setAttribute('aria-expanded', 'false');
            hamburguesa.classList.remove('abierto');
            menuNavegacion.classList.remove('abierto');
        });
    }

    // ---------- SCROLL SUAVE Y NAVEGACIÓN ACTIVA ----------
    var secciones = document.querySelectorAll('section[id]');
    var enlacesNavegacion = document.querySelectorAll('nav a[href^="#"]');

    for (var l = 0; l < enlacesNavegacion.length; l++) {
        enlacesNavegacion[l].addEventListener('click', function(e) {
            e.preventDefault();
            var destino = document.querySelector(this.getAttribute('href'));
            if (destino) {
                destino.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    }

    var observadorNav = new IntersectionObserver(function(entradas) {
        for (var m = 0; m < entradas.length; m++) {
            if (entradas[m].isIntersecting) {
                var id = entradas[m].target.getAttribute('id');
                for (var n = 0; n < enlacesNavegacion.length; n++) {
                    var href = enlacesNavegacion[n].getAttribute('href');
                    if (href === '#' + id) {
                        enlacesNavegacion[n].classList.add('activo');
                        enlacesNavegacion[n].setAttribute('aria-current', 'page');
                    } else {
                        enlacesNavegacion[n].classList.remove('activo');
                        enlacesNavegacion[n].removeAttribute('aria-current');
                    }
                }
            }
        }
    }, { threshold: 0.5 });

    for (var o = 0; o < secciones.length; o++) {
        observadorNav.observe(secciones[o]);
    }

    // ---------- ANIMACIONES DE APARICIÓN ----------
    var elementosAparecer = document.querySelectorAll('.aparecer-arriba');
    var observadorFade = new IntersectionObserver(function(entradas) {
        for (var p = 0; p < entradas.length; p++) {
            if (entradas[p].isIntersecting) {
                entradas[p].target.classList.add('visible');
                observadorFade.unobserve(entradas[p].target);
            }
        }
    }, { threshold: 0.3 });

    for (var q = 0; q < elementosAparecer.length; q++) {
        observadorFade.observe(elementosAparecer[q]);
    }

    // ---------- ACORDEONES ----------
    function alternarAcordeon(boton) {
        var contenido = document.getElementById(boton.getAttribute('aria-controls'));
        var icono = boton.querySelector('.icono-acordeon');
        var expandido = boton.getAttribute('aria-expanded') === 'true';

        if (expandido) {
            var alturaActual = contenido.scrollHeight;
            contenido.style.maxHeight = alturaActual + 'px';
            contenido.offsetHeight;
            contenido.style.maxHeight = '0';
            boton.setAttribute('aria-expanded', 'false');
            contenido.setAttribute('aria-hidden', 'true');
            if (icono) icono.style.transform = 'rotate(0deg)';
        } else {
            contenido.style.maxHeight = contenido.scrollHeight + 'px';
            boton.setAttribute('aria-expanded', 'true');
            contenido.setAttribute('aria-hidden', 'false');
            if (icono) icono.style.transform = 'rotate(180deg)';
        }
    }

    var encabezadosAcordeon = document.querySelectorAll('.encabezado-acordeon');
    for (var r = 0; r < encabezadosAcordeon.length; r++) {
        encabezadosAcordeon[r].addEventListener('click', function() {
            alternarAcordeon(this);
        });
    }

    var contenidosAcordeonInicio = document.querySelectorAll('.contenido-acordeon');
    for (var s = 0; s < contenidosAcordeonInicio.length; s++) {
        if (contenidosAcordeonInicio[s].getAttribute('aria-hidden') === 'true') {
            contenidosAcordeonInicio[s].style.maxHeight = '0';
        }
    }

    // ---------- MODAL ----------
    var modal = document.getElementById('modal');
    var botonCerrarModal = modal ? modal.querySelector('.cerrar-modal') : null;

    function abrirModal() {
        if (modal) {
            modal.classList.add('activo');
            var contenidoModal = modal.querySelector('.contenido-modal');
            if (contenidoModal) {
                contenidoModal.focus();
            }
            document.body.style.overflow = 'hidden';
        }
    }

    function cerrarModal() {
        if (modal) {
            modal.classList.remove('activo');
            document.body.style.overflow = '';
        }
    }

    if (botonCerrarModal) {
        botonCerrarModal.addEventListener('click', cerrarModal);
    }

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('activo')) {
            cerrarModal();
        }
    });

    var botonRepositorio = document.getElementById('boton-repositorio');
    if (botonRepositorio) {
        botonRepositorio.addEventListener('click', function(e) {
            e.preventDefault();
            abrirModal();
        });
    }

    console.log('SIMAAS - Cargado correctamente');
})();