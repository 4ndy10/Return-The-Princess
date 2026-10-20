# 🏰 Return The Princess

> Juego web interactivo de laberinto tipo "Point-and-Click", basado en decisiones lógicas de vida o muerte. Estética retro pixel-art inspirada en el universo de Mario Bros.

## 🎮 Descripción

El jugador debe atravesar el castillo de Bowser para rescatar a la princesa. A lo largo de 3 niveles, debe elegir la puerta (o champiñón) correcta entre varias opciones. Una elección equivocada significa la muerte instantánea; solo el camino correcto avanza al siguiente nivel.

### Flujo del juego

```
[Portada] → [Sala 1: 3 Puertas] → [Sala 2: 3 Puertas] → [Sala 3: 3 Champiñones] → [Victoria]
                 ↓                       ↓ ↓                    ↓ ↓
            Muerte Lava           Dry Bones  Planta       Acertijo  Veneno
                                  Piraña                     ↓ ↓
                                                        Sala 3  Veneno
```

Todas las pantallas de muerte incluyen un botón de "Volver a comenzar" que reinicia el juego desde la portada.

## 🛠️ Pila Tecnológica

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura de cada pantalla |
| **CSS3** | Estética retro pixel-art (Press Start 2P, borders pixelados) |
| **JavaScript (Vanilla)** | Audio, typewriter, screen shake, navegación dramática |
| **Three.js** | Fondos 3D, partículas y niebla ambiental (futuro) |

**Sin frameworks.** Sin backend. Solo HTML + CSS + JS vanilla desplegado como sitio estático.

## 📁 Estructura del Proyecto

```
/ (raíz)
├── index.html              # Portada — botón "Comenzar aventura"
├── sala1.html              # Nivel 1 — 3 puertas (P2 correcta)
├── sala2.html              # Nivel 2 — 3 puertas (P2 correcta)
├── sala3.html              # Nivel 3 — 3 champiñones (M3 correcta)
├── acertijo.html           # Acertijo — trivia Mario Bros
├── muerte_lava.html        # Muerte por lava
├── muerte_huesitos.html    # Muerte por Dry Bones
├── muerte_planta.html      # Muerte por Planta Piraña
├── muerte_veneno.html      # Muerte por champiñón venenoso
├── victoria.html           # Pantalla de victoria
├── css/
│   └── styles.css          # Estilos globales retro pixel-art
├── js/
│   └── main.js             # Lógica del juego
├── img/                    # Sprites y fondos (JPG)
│   ├── Main_Page.jpg
│   ├── Mushroom_Quest.jpg
│   ├── Win_End.jpg
│   ├── Death_Lava.jpg
│   ├── Death_Drybones.jpg
│   ├── Death_PiranhaPlant.jpg
│   └── Death_Poison.jpg
└── audio/                  # Música y efectos de sonido (MP3)
    ├── bg_bowser_castle.mp3
    ├── bg_peach_castle.mp3
    ├── sfx_dead.mp3
    ├── sfx_door.mp3
    └── sfx_win.mp3
```

## 🔊 Sistema de Audio

| Archivo | Tipo | Uso |
|---|---|---|
| `bg_peach_castle.mp3` | BGM | Portada y victoria (duración máxima forzosa: 5 segundos) |
| `bg_bowser_castle.mp3` | BGM | Salas 1-3 y acertijo |
| `sfx_door.mp3` | SFX | Al elegir puerta/champiñón |
| `sfx_dead.mp3` | SFX | Pantallas de muerte |
| `sfx_win.mp3` | SFX | Pantalla de victoria |

El audio del castillo de la princesa Peach (`bg_peach_castle.mp3`) tiene una duración forzada de un máximo de 5 segundos tanto en portada como en victoria. Además, el audio se desbloquea con la primera interacción del usuario para cumplir con las políticas de autoplay de los navegadores.

## 🚀 Despliegue

El proyecto se despliega como sitio estático en **Vercel**, conectado directamente al repositorio de GitHub. Cada `push` a la rama principal dispara un nuevo deploy automático.

## 👥 Equipo

Proyecto académico — 7mo Semestre, Desarrollo Web.
