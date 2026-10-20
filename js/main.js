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
let bgmTimer = null;

// ══════════════════════════════════════
//  AUDIO ENGINE
// ══════════════════════════════════════

/**
 * Reproduce música de fondo.
 * Reemplaza cualquier BGM anterior.
 * Si autoplay está bloqueado, se desbloquea al primer clic del usuario.
 * 
 * Regla de negocio: El audio del castillo de Peach (bg_peach_castle.mp3)
 * tiene un seteo forzoso de duración MÁXIMA de 5 segundos.
 *
 * @param {string}      src            — Ruta del archivo de audio
 * @param {number|null} maxDurationSec — Duración máxima opcional en segundos
 */
function playBGM(src, maxDurationSec = null) {
    if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
    }
    if (bgmTimer) {
        clearTimeout(bgmTimer);
        bgmTimer = null;
    }

    bgm = new Audio(src);
    bgm.volume = 0.4;

    // Seteo forzoso: Peach Castle tiene límite estricto de 5s
    const maxLimit = maxDurationSec ?? (src.includes('bg_peach_castle') ? 5 : null);
    bgm.loop = !maxLimit;

    if (maxLimit) {
        const stopAudio = () => {
            if (bgm) {
                bgm.pause();
                bgm.currentTime = 0;
            }
            if (bgmTimer) {
                clearTimeout(bgmTimer);
                bgmTimer = null;
            }
        };

        // Detener al alcanzar los segundos máximos de reproducción
        bgm.addEventListener('timeupdate', () => {
            if (bgm.currentTime >= maxLimit) {
                stopAudio();
            }
        });

        // Temporizador de seguridad al comenzar la reproducción efectiva
        bgm.addEventListener('play', () => {
            if (bgmTimer) clearTimeout(bgmTimer);
            bgmTimer = setTimeout(stopAudio, maxLimit * 1000);
        });
    }

    bgm.play().catch(() => {
        // ponytail: autoplay bloqueado — se desbloquea con la primera interacción
        document.addEventListener('click', () => {
            if (bgm) bgm.play();
        }, { once: true });
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
 * Maneja el acertijo con tarjetas de imagen clicables.
 * Espera un contenedor #acertijo-opciones con .champiñon-card hijos.
 * Cada tarjeta tiene data-respuesta="correcta" o "incorrecta".
 *
 * - Respuesta correcta → sala3.html (con SFX de puerta)
 * - Respuesta incorrecta → muerte_veneno.html (con SFX de muerte + shake)
 */
function initAcertijo() {
    const container = document.getElementById('acertijo-opciones');
    if (!container) return;

    container.querySelectorAll('.champiñon-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('chosen');

            if (card.dataset.respuesta === 'correcta') {
                playSFX('audio/sfx_door.mp3');
                setTimeout(() => { window.location.href = 'sala3.html'; }, 1000);
            } else {
                playSFX('audio/sfx_dead.mp3');
                screenShake(500);
                setTimeout(() => { window.location.href = 'muerte_veneno.html'; }, 1500);
            }
        });
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
            playBGM('audio/bg_peach_castle.mp3');
            const btn = document.getElementById('btn-start');
            if (btn) {
                btn.addEventListener('click', e => {
                    e.preventDefault();
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
