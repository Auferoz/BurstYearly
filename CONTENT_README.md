# Games Database Schema

Esta carpeta contiene archivos Markdown con frontmatter YAML que funcionan como base de datos de juegos.

## Estructura del Archivo

Cada archivo `.md` representa un juego y sigue la siguiente estructura:

```yaml
---
title: string                    # Nombre del juego
released: DD/MM/YYYY             # Fecha de lanzamiento
companie: string                 # Compañía desarrolladora
poster: string                   # Nombre del archivo de imagen (ej: co5w3k.webp)
trailer: string                  # ID del video de YouTube
genre: string                    # Género(s) del juego, separados por coma
estado: enum                     # Estado del juego
horas: number                    # Horas jugadas
logros_obt: number               # Logros obtenidos
logros_total: number             # Total de logros disponibles
console_pc: string               # Plataforma donde se jugó
igdbId: number                   # ID de IGDB (Internet Game Database)
first_year_played: number        # Primer año en que se jugó
dates_played:                    # Fechas de juego por año
    y2025:
        fecha_inicio: string     # Fecha inicio (DD/MM/YYYY o vacío)
        fecha_final: string      # Fecha final (DD/MM/YYYY o vacío)
    y2024:
        fecha_inicio: string
        fecha_final: string
    y2023:
        fecha_inicio: string
        fecha_final: string
    y2022:
        fecha_inicio: string
        fecha_final: string
years_played:                    # Booleanos indicando si se jugó en cada año
    y2025: boolean
    y2024: boolean
    y2023: boolean
    y2022: boolean
---

[Descripción del juego en texto libre - puede incluir Markdown]
```

## Campos Detallados

### Campos Principales

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `title` | string | Nombre completo del juego | `"Final Fantasy XVI"` |
| `released` | string | Fecha de lanzamiento (DD/MM/YYYY) | `"17/09/2024"` |
| `companie` | string | Desarrollador/Publisher | `"Square Enix Creative Studio III"` |
| `poster` | string | Archivo de imagen del poster | `"co5w3k.webp"` |
| `trailer` | string | ID de YouTube del trailer | `"vAaJXiew1t0"` |
| `genre` | string | Géneros separados por coma | `"Role-playing (RPG), Adventure"` |
| `estado` | enum | Estado actual del juego | `"Completado"`, `"Abandonado"` |
| `horas` | number | Total de horas jugadas | `103` |
| `logros_obt` | number | Logros desbloqueados | `69` |
| `logros_total` | number | Logros totales del juego | `69` |
| `console_pc` | string | Plataforma | `"Steam"`, `"Xbox PC"`, `"Xbox Series X"`, `"PC Game"` |
| `igdbId` | number | ID en Internet Game Database | `31551` |
| `first_year_played` | number | Año en que se empezó a jugar | `2024` |

### Valores de `estado`

- `Completado` - Juego terminado
- `Abandonado` - Juego dejado sin completar

### Valores de `console_pc`

- `Steam`
- `Xbox PC`
- `Xbox Series X`
- `PC Game`

### Objeto `dates_played`

Contiene las fechas de inicio y fin para cada año (2022-2025):

```yaml
dates_played:
    y2025:
        fecha_inicio: "28/06/2025"   # Puede estar vacío: ""
        fecha_final: "03/07/2025"    # Puede estar vacío: ""
```

### Objeto `years_played`

Booleanos que indican en qué años se jugó el juego:

```yaml
years_played:
    y2025: true
    y2024: true
    y2023: false
    y2022: false
```

## Nomenclatura de Archivos

- Usar guiones bajos `_` para espacios
- Formato: `Nombre_Del_Juego.md`
- Ejemplos:
  - `Final_Fantasy_XVI.md`
  - `Call_of_Duty_4_Modern_Warfare.md`
  - `League_Of_Legends.md`

## Ejemplo Completo

```yaml
---
title: Final Fantasy XVI
released: 17/09/2024
companie: Square Enix Creative Studio III
poster: co5w3k.webp
trailer: vAaJXiew1t0
genre: Role-playing (RPG)
estado: Completado
horas: 103
logros_obt: 69
logros_total: 69
console_pc: Steam
igdbId: 31551
first_year_played: 2024
dates_played:
    y2025:
        fecha_inicio: "28/06/2025"
        fecha_final: "03/07/2025"
    y2024:
        fecha_inicio: 07/09/2024
        fecha_final: 19/10/2024
    y2023:
        fecha_inicio: ""
        fecha_final: ""
    y2022:
        fecha_inicio: ""
        fecha_final: ""
years_played:
    y2025: true
    y2024: true
    y2023: false
    y2022: false
---

Final Fantasy XVI es el primer RPG de acción completo de la serie principal...
```

## Total de Juegos

Actualmente hay **53 juegos** registrados en la base de datos.

---

## Formato JSON

Estructura de un juego en formato JSON:

```json
{
  "title": "Final Fantasy XVI",
  "released": "17/09/2024",
  "companie": "Square Enix Creative Studio III",
  "poster": "co5w3k.webp",
  "trailer": "vAaJXiew1t0",
  "genre": "Role-playing (RPG)",
  "estado": "Completado",
  "horas": 103,
  "logros_obt": 69,
  "logros_total": 69,
  "console_pc": "Steam",
  "igdbId": 31551,
  "first_year_played": 2024,
  "dates_played": {
    "y2025": {
      "fecha_inicio": "28/06/2025",
      "fecha_final": "03/07/2025"
    },
    "y2024": {
      "fecha_inicio": "07/09/2024",
      "fecha_final": "19/10/2024"
    },
    "y2023": {
      "fecha_inicio": "",
      "fecha_final": ""
    },
    "y2022": {
      "fecha_inicio": "",
      "fecha_final": ""
    }
  },
  "years_played": {
    "y2025": true,
    "y2024": true,
    "y2023": false,
    "y2022": false
  },
  "description": "Final Fantasy XVI es el primer RPG de acción completo de la serie principal..."
}
```

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Game",
  "type": "object",
  "required": [
    "title",
    "released",
    "companie",
    "poster",
    "trailer",
    "genre",
    "estado",
    "horas",
    "logros_obt",
    "logros_total",
    "console_pc",
    "igdbId",
    "first_year_played",
    "dates_played",
    "years_played"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "Nombre del juego"
    },
    "released": {
      "type": "string",
      "pattern": "^\\d{2}/\\d{2}/\\d{4}$",
      "description": "Fecha de lanzamiento (DD/MM/YYYY)"
    },
    "companie": {
      "type": "string",
      "description": "Compañía desarrolladora"
    },
    "poster": {
      "type": "string",
      "description": "Nombre del archivo de imagen"
    },
    "trailer": {
      "type": "string",
      "description": "ID del video de YouTube"
    },
    "genre": {
      "type": "string",
      "description": "Géneros separados por coma"
    },
    "estado": {
      "type": "string",
      "enum": ["Completado", "Abandonado"],
      "description": "Estado actual del juego"
    },
    "horas": {
      "type": "integer",
      "minimum": 0,
      "description": "Horas jugadas"
    },
    "logros_obt": {
      "type": "integer",
      "minimum": 0,
      "description": "Logros obtenidos"
    },
    "logros_total": {
      "type": "integer",
      "minimum": 0,
      "description": "Total de logros"
    },
    "console_pc": {
      "type": "string",
      "enum": ["Steam", "Xbox PC", "Xbox Series X", "PC Game"],
      "description": "Plataforma"
    },
    "igdbId": {
      "type": "integer",
      "description": "ID de IGDB"
    },
    "first_year_played": {
      "type": "integer",
      "description": "Primer año jugado"
    },
    "dates_played": {
      "type": "object",
      "properties": {
        "y2025": { "$ref": "#/definitions/date_range" },
        "y2024": { "$ref": "#/definitions/date_range" },
        "y2023": { "$ref": "#/definitions/date_range" },
        "y2022": { "$ref": "#/definitions/date_range" }
      }
    },
    "years_played": {
      "type": "object",
      "properties": {
        "y2025": { "type": "boolean" },
        "y2024": { "type": "boolean" },
        "y2023": { "type": "boolean" },
        "y2022": { "type": "boolean" }
      }
    },
    "description": {
      "type": "string",
      "description": "Descripción del juego"
    }
  },
  "definitions": {
    "date_range": {
      "type": "object",
      "properties": {
        "fecha_inicio": { "type": "string" },
        "fecha_final": { "type": "string" }
      }
    }
  }
}
```

---

## PostgreSQL Schema

### Crear tablas

```sql
-- Crear tipo ENUM para estado
CREATE TYPE game_status AS ENUM ('Completado', 'Abandonado');

-- Crear tipo ENUM para plataforma
CREATE TYPE platform AS ENUM ('Steam', 'Xbox PC', 'Xbox Series X', 'PC Game');

-- Tabla principal de juegos
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    released DATE,
    companie VARCHAR(255),
    poster VARCHAR(255),
    trailer VARCHAR(50),
    genre VARCHAR(255),
    estado game_status DEFAULT 'Completado',
    horas INTEGER DEFAULT 0,
    logros_obt INTEGER DEFAULT 0,
    logros_total INTEGER DEFAULT 0,
    console_pc platform,
    igdb_id INTEGER,
    first_year_played INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para fechas jugadas por año
CREATE TABLE game_dates_played (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    fecha_inicio DATE,
    fecha_final DATE,
    played BOOLEAN DEFAULT FALSE,
    UNIQUE(game_id, year)
);

-- Índices para búsquedas comunes
CREATE INDEX idx_games_title ON games(title);
CREATE INDEX idx_games_estado ON games(estado);
CREATE INDEX idx_games_console_pc ON games(console_pc);
CREATE INDEX idx_games_first_year ON games(first_year_played);
CREATE INDEX idx_dates_year ON game_dates_played(year);
CREATE INDEX idx_dates_played ON game_dates_played(played);
```

### Insertar datos de ejemplo

```sql
-- Insertar juego
INSERT INTO games (
    title, released, companie, poster, trailer, genre,
    estado, horas, logros_obt, logros_total, console_pc,
    igdb_id, first_year_played, description
) VALUES (
    'Final Fantasy XVI',
    '2024-09-17',
    'Square Enix Creative Studio III',
    'co5w3k.webp',
    'vAaJXiew1t0',
    'Role-playing (RPG)',
    'Completado',
    103,
    69,
    69,
    'Steam',
    31551,
    2024,
    'Final Fantasy XVI es el primer RPG de acción completo de la serie principal...'
);

-- Insertar fechas jugadas
INSERT INTO game_dates_played (game_id, year, fecha_inicio, fecha_final, played)
VALUES
    (1, 2025, '2025-06-28', '2025-07-03', TRUE),
    (1, 2024, '2024-09-07', '2024-10-19', TRUE),
    (1, 2023, NULL, NULL, FALSE),
    (1, 2022, NULL, NULL, FALSE);
```

### Consultas útiles

```sql
-- Obtener todos los juegos completados
SELECT * FROM games WHERE estado = 'Completado';

-- Obtener juegos jugados en un año específico
SELECT g.*
FROM games g
JOIN game_dates_played gdp ON g.id = gdp.game_id
WHERE gdp.year = 2024 AND gdp.played = TRUE;

-- Obtener total de horas por plataforma
SELECT console_pc, SUM(horas) as total_horas
FROM games
GROUP BY console_pc
ORDER BY total_horas DESC;

-- Obtener juegos con todos sus logros
SELECT title, logros_obt, logros_total
FROM games
WHERE logros_obt = logros_total AND logros_total > 0;

-- Obtener estadísticas generales
SELECT
    COUNT(*) as total_juegos,
    SUM(horas) as total_horas,
    AVG(horas)::INTEGER as promedio_horas,
    SUM(logros_obt) as total_logros
FROM games;

-- Obtener juego con todas sus fechas
SELECT
    g.title,
    g.estado,
    g.horas,
    json_agg(
        json_build_object(
            'year', gdp.year,
            'fecha_inicio', gdp.fecha_inicio,
            'fecha_final', gdp.fecha_final,
            'played', gdp.played
        )
    ) as dates_played
FROM games g
LEFT JOIN game_dates_played gdp ON g.id = gdp.game_id
GROUP BY g.id;
```

### Vista para formato completo

```sql
-- Vista que replica la estructura original del YAML/JSON
CREATE VIEW games_full AS
SELECT
    g.id,
    g.title,
    TO_CHAR(g.released, 'DD/MM/YYYY') as released,
    g.companie,
    g.poster,
    g.trailer,
    g.genre,
    g.estado::TEXT,
    g.horas,
    g.logros_obt,
    g.logros_total,
    g.console_pc::TEXT,
    g.igdb_id,
    g.first_year_played,
    g.description,
    jsonb_build_object(
        'y2025', (SELECT jsonb_build_object(
            'fecha_inicio', COALESCE(TO_CHAR(fecha_inicio, 'DD/MM/YYYY'), ''),
            'fecha_final', COALESCE(TO_CHAR(fecha_final, 'DD/MM/YYYY'), '')
        ) FROM game_dates_played WHERE game_id = g.id AND year = 2025),
        'y2024', (SELECT jsonb_build_object(
            'fecha_inicio', COALESCE(TO_CHAR(fecha_inicio, 'DD/MM/YYYY'), ''),
            'fecha_final', COALESCE(TO_CHAR(fecha_final, 'DD/MM/YYYY'), '')
        ) FROM game_dates_played WHERE game_id = g.id AND year = 2024),
        'y2023', (SELECT jsonb_build_object(
            'fecha_inicio', COALESCE(TO_CHAR(fecha_inicio, 'DD/MM/YYYY'), ''),
            'fecha_final', COALESCE(TO_CHAR(fecha_final, 'DD/MM/YYYY'), '')
        ) FROM game_dates_played WHERE game_id = g.id AND year = 2023),
        'y2022', (SELECT jsonb_build_object(
            'fecha_inicio', COALESCE(TO_CHAR(fecha_inicio, 'DD/MM/YYYY'), ''),
            'fecha_final', COALESCE(TO_CHAR(fecha_final, 'DD/MM/YYYY'), '')
        ) FROM game_dates_played WHERE game_id = g.id AND year = 2022)
    ) as dates_played,
    jsonb_build_object(
        'y2025', COALESCE((SELECT played FROM game_dates_played WHERE game_id = g.id AND year = 2025), FALSE),
        'y2024', COALESCE((SELECT played FROM game_dates_played WHERE game_id = g.id AND year = 2024), FALSE),
        'y2023', COALESCE((SELECT played FROM game_dates_played WHERE game_id = g.id AND year = 2023), FALSE),
        'y2022', COALESCE((SELECT played FROM game_dates_played WHERE game_id = g.id AND year = 2022), FALSE)
    ) as years_played
FROM games g;
