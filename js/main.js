/**
 * Return The Princess — main.js
 * ─────────────────────────────
 * Game logic: audio (BGM/SFX), typewriter text, screen shake,
 * dramatic navigation delays, and riddle mechanics.
 *
 * Convention: each HTML <body> declares data-page="portada|sala1|sala2|sala3|acertijo|muerte|victoria"
 * Interactive links use data-delay, data-sfx, data-shake attributes.
 * Typewriter targets use data-typewriter="speed".
 */

// ── State ──
let bgm = null;

// ══════════════════════════════════════
//  AUDIO ENGINE
// ══════════════════════════════════════

/**
 * Reproduce música de fondo en loop.
 * Reemplaza cualquier BGM anterior.
 * Si autoplay está bloqueado, se desbloquea al primer clic del usuario.
 */
function playBGM(src) {
    if (bgm) bgm.pause();
    bgm = new Audio(src);
    bgm.loop = true;
    bgm.volume = 0.4;
    bgm.play().catch(() => {
        // ponytail: autoplay bloqueado — se desbloquea con la primera interacción
        document.addEventListener('click', () => bgm.play(), { once: true });
    });
}

/**
 * Reproduce un efecto de sonido de un solo uso (one-shot).
 */
function playSFX(src) {
    const sfx = new Audio(src);
    sfx.volume = 0.6;
    sfx.play().catch(() => {});
}

// ══════════════════════════════════════
//  TYPEWRITER EFFECT
// ══════════════════════════════════════

/**
 * Anima texto carácter por carácter en el elemento dado.
 * El elemento debe tener su texto final como textContent.
 * Retorna una Promise que resuelve al terminar.
 *
 * @param {HTMLElement} el   — Elemento con el texto a animar
 * @param {number}      speed — Milisegundos entre cada carácter
 */
function typewriter(el, speed = 50) {
    const text = el.textContent;
    el.textContent = '';
    el.style.visibility = 'visible';
    let i = 0;
    return new Promise(resolve => {
        const timer = setInterval(() => {
            el.textContent += text[i++];
            if (i >= text.length) {
                clearInterval(timer);
                resolve();
            }
        }, speed);
    });
}

/**
 * Auto-inicializa typewriter en todos los elementos con data-typewriter.
 * Uso: <p data-typewriter="40">Texto que aparece letra a letra...</p>
 */
function initTypewriters() {
    document.querySelectorAll('[data-typewriter]').forEach(el => {
        typewriter(el, parseInt(el.dataset.typewriter) || 50);
    });
}

// ══════════════════════════════════════
//  SCREEN SHAKE
// ══════════════════════════════════════

/**
 * Agrega la clase .shake al body durante `ms` milisegundos.
 * La animación real se define en CSS (keyframes).
 */
function screenShake(ms = 500) {
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), ms);
}

// ══════════════════════════════════════
//  DRAMATIC NAVIGATION (DELAYED LINKS)
// ══════════════════════════════════════

/**
 * Intercepta clics en enlaces con data-delay para crear pausas dramáticas.
 *
 * Atributos soportados en el <a>:
 *   data-delay="1500"              — ms de espera antes de navegar
 *   data-sfx="audio/sfx_door.mp3"  — SFX al hacer clic
 *   data-shake                     — activa screen shake al hacer clic
 *
 * Ejemplo HTML:
 *   <a href="muerte_lava.html" data-delay="1500" data-sfx="audio/sfx_door.mp3" data-shake>
 *     Puerta 1
 *   </a>
 */
function initDramaticLinks() {
    document.querySelectorAll('a[data-delay]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const delay = parseInt(link.dataset.delay) || 1500;

            if (link.dataset.sfx) playSFX(link.dataset.sfx);
            if ('shake' in link.dataset) screenShake();

            link.classList.add('chosen');

            setTimeout(() => {
                window.location.href = link.href;
            }, delay);
        });
    });
}

// ══════════════════════════════════════
//  RIDDLE HANDLER (acertijo.html)
// ══════════════════════════════════════

/**
 * Maneja el formulario del acertijo.
 * Espera un <form id="acertijo-form"> con radio inputs name="respuesta".
 * La opción correcta tiene value="correcta".
 *
 * - Respuesta correcta → sala3.html (con SFX de puerta)
 * - Respuesta incorrecta → muerte_veneno.html (con SFX de muerte + shake)
 */
function initAcertijo() {
    const form = document.getElementById('acertijo-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const pick = form.querySelector('input[name="respuesta"]:checked');
        if (!pick) return;

        if (pick.value === 'correcta') {
            playSFX('audio/sfx_door.mp3');
            setTimeout(() => { window.location.href = 'sala3.html'; }, 1000);
        } else {
            playSFX('audio/sfx_dead.mp3');
            screenShake(500);
            setTimeout(() => { window.location.href = 'muerte_veneno.html'; }, 1500);
        }
    });
}

// ══════════════════════════════════════
//  PAGE BOOTSTRAP
// ══════════════════════════════════════

/**
 * Punto de entrada principal.
 * Lee data-page del <body> y ejecuta la lógica específica de cada página.
 *
 * Páginas reconocidas:
 *   portada  — index.html      (botón de inicio, activa audio global)
 *   sala1    — sala1.html       (BGM castillo, 3 puertas)
 *   sala2    — sala2.html       (BGM castillo, 3 puertas)
 *   sala3    — sala3.html       (BGM castillo, 3 champiñones)
 *   acertijo — acertijo.html    (BGM castillo, formulario)
 *   muerte   — muerte_*.html    (SFX muerte, screen shake)
 *   victoria — victoria.html    (BGM victoria, SFX win)
 */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;

    // Inits globales — aplican en todas las páginas
    initDramaticLinks();
    initTypewriters();

    // Lógica por página
    switch (page) {
        case 'portada': {
            const btn = document.getElementById('btn-start');
            if (btn) {
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    playBGM('audio/bg_peach_castle.mp3');
                    playSFX('audio/sfx_door.mp3');
                    btn.classList.add('chosen');
                    setTimeout(() => {
                        window.location.href = 'sala1.html';
                    }, 1500);
                });
            }
            break;
        }

        case 'sala1':
        case 'sala2':
        case 'sala3':
            playBGM('audio/bg_bowser_castle.mp3');
            break;

        case 'acertijo':
            playBGM('audio/bg_bowser_castle.mp3');
            initAcertijo();
            break;

        case 'muerte':
            playSFX('audio/sfx_dead.mp3');
            screenShake(600);
            break;

        case 'victoria':
            playBGM('audio/bg_peach_castle.mp3');
            playSFX('audio/sfx_win.mp3');
            break;
    }
});
