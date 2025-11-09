# 🎮 BurstYearly - Mi Biblioteca Personal de Videojuegos

**BurstYearly** es mi aplicación web de catálogo personal de videojuegos donde llevo un registro detallado de todos los juegos que he jugado desde 2022 hasta 2025. Es mi diario gamer personal que me permite:

- 📊 Rastrear estadísticas (horas jugadas, logros obtenidos)
- 📅 Organizar juegos por año
- 🎯 Monitorear progreso (completado, jugando, pausado, abandonado)
- 🖼️ Visualizar portadas y tráilers
- 📈 Ver dashboards con mis estadísticas

---

## 🛠️ Tecnologías Utilizadas

### Stack Principal:
1. **Astro 5.2.3** - Framework moderno de generación de sitios estáticos
2. **Tailwind CSS 4.0.3** - Framework CSS utility-first para estilos
3. **TypeScript** - Para configuración type-safe
4. **Markdown + Frontmatter** - Para las entradas de cada juego

### APIs Externas:
- **IGDB API** (Internet Game Database) - Para obtener portadas de juegos
- **YouTube API** - Para embeber tráilers

---

## 📁 Estructura del Proyecto

```
BurstYearly/
├── public/                  # Assets estáticos y banners
├── src/
│   ├── components/          # 7 componentes reutilizables
│   │   ├── NavHeader.astro
│   │   ├── CardDashboard.astro
│   │   ├── Cardsboard.astro
│   │   ├── ListCardsView.astro
│   │   ├── ImagenGames.astro
│   │   └── VideoTrailer.astro
│   ├── icons/              # 17 iconos SVG personalizados
│   ├── content/
│   │   ├── config.ts       # Schema de validación con Zod
│   │   └── games/          # 50+ archivos markdown de juegos
│   ├── layouts/
│   │   └── Layout.astro    # Layout base HTML
│   └── pages/              # Rutas de la aplicación
│       ├── index.astro     # Dashboard principal
│       ├── game/[id].astro # Páginas detalladas de juegos
│       ├── Games/          # Listas por año (2022-2025)
│       ├── Series/         # Placeholder futuro
│       └── Movies/         # Placeholder futuro
├── astro.config.mjs        # Configuración de Astro + Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── package.json            # Dependencias y scripts
```

---

## ✨ Funcionalidades Principales

### 1. Dashboard Interactivo
Mi dashboard principal muestra:
- Total de juegos en mi biblioteca
- Horas totales jugadas
- Logros totales obtenidos
- Contadores por estado (Jugando, Pausado, Completado, Abandonado)
- Grid visual de juegos que estoy jugando actualmente

### 2. Filtrado por Año
Tengo páginas separadas para cada año (2022-2025) que muestran:
- Estadísticas del año específico
- Lista filtrada de juegos que jugué ese año
- Ordenamiento por fecha de inicio
- Colores según estado del juego

### 3. Páginas Detalladas de Juegos
Cada juego tiene su propia página con:
- Portada grande (obtenida vía IGDB)
- Metadata completa (desarrolladora, plataforma, género)
- Fechas de inicio y finalización
- Barra de progreso de logros
- Descripción personalizada
- Tráiler de YouTube embebido
- UI con colores dinámicos según estado

### 4. Sistema de Estados con Colores
- 🔵 **Azul (#2973B2)** - Completado
- 🔴 **Rojo (#D84040)** - Abandonado
- 🟢 **Verde (#16C47F)** - Jugando
- 🟡 **Amarillo (#FFD65A)** - Pausado

### 5. Content Collections
Sistema de validación automática con Zod. Cada juego contiene:

```yaml
---
title: Nombre del juego
released: Fecha de lanzamiento
companie: Desarrolladora/Publisher
poster: ID de imagen IGDB
trailer: ID de video YouTube (opcional)
genre: Género(s)
estado: Completado/Jugando/Pausado/Abandonado
horas: Horas jugadas
logros_obt: Logros conseguidos
logros_total: Logros totales
console_pc: Plataforma (Steam, etc.)
igdbId: ID en base de datos IGDB
dates_played:
  y2025:
    fecha_inicio: "DD/MM/YYYY"
    fecha_final: "DD/MM/YYYY"
  y2024:
    fecha_inicio: DD/MM/YYYY
    fecha_final: DD/MM/YYYY
years_played:
  y2025: true
  y2024: true
---
Descripción personalizada del juego...
```

---

## 🎯 Características Técnicas

### Ventajas de mi Arquitectura:

1. **Type Safety**: Validación automática con Zod para todos los datos
2. **Generación Estática**: Todo pre-renderizado en build time (súper rápido)
3. **Componentes Modulares**: Fácil mantenimiento y reutilización
4. **Content-Driven**: Añadir juegos es tan simple como crear un archivo markdown
5. **Responsive**: Diseño adaptativo desde mobile hasta desktop (grid de 2-8 columnas)
6. **View Transitions**: Navegación fluida entre páginas
7. **Soporte para Re-jugadas**: Puedo trackear juegos jugados en múltiples años

### Componentes Clave:

- **NavHeader.astro** - Navegación principal con menús dropdown
- **ListCardsView.astro** - Grid de tarjetas de juegos
- **ImagenGames.astro** - Integración con IGDB API para portadas
- **VideoTrailer.astro** - Embeds de tráilers de YouTube
- **CardDashboard.astro** - Tarjetas de estadísticas del dashboard

---

## 📊 Estado Actual

Actualmente mi biblioteca contiene:
- **50+ juegos** catalogados
- Tracking desde **2022 hasta 2025**
- Soporte para re-jugadas (juegos jugados en múltiples años)
- Páginas placeholder para **Series** y **Películas** (expansión futura)

---

## 🚀 Expansión Futura

Planeo expandir BurstYearly para incluir:
- 📺 Tracking de series de TV
- 🎬 Tracking de películas
- 📚 Posiblemente libros y otros medios

---

## 👀 Más Información

- [Documentación de Astro](https://docs.astro.build)
- [IGDB API Documentation](https://api-docs.igdb.com/)

---

## 📝 Notas

Este proyecto es mi forma personal de llevar un registro detallado de mi viaje como jugador, permitiéndome ver mi progreso, recordar mis experiencias y mantener organizada mi biblioteca de videojuegos a lo largo de los años.
