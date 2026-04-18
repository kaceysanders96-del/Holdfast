# Remnant Earth

> *A live, authored open world. Post-apocalyptic Earth, reclaimed by nature, inhabited by humans, alien remnants, and one very lonely AI.*

---

## What This Is

Remnant Earth is a browser-based open world game built with [Phaser 3](https://phaser.io/) and [Vite](https://vitejs.dev/). It runs in any modern browser and is designed to be deployed to a standard web server.

The world is **live-authored** — meaning it evolves over time as the creator adds new story content, events, and mysteries. Think of it less like a shipped game and more like a novel being written in public, where readers can walk around inside it.

---

## Project Structure

```
remnant-earth/
├── index.html                  # Entry point
├── src/
│   ├── main.js                 # Phaser game config + scene registration
│   ├── scenes/
│   │   ├── HutInterior.js      # Opening scene — player's hut at dawn
│   │   └── Village.js          # Starting village
│   ├── systems/
│   │   ├── DialogueSystem.js   # Dialogue loading, display, hooks
│   │   ├── QuestSystem.js      # Quest/task state tracking
│   │   ├── MoralitySystem.js   # Invisible 5-dimension morality tracker
│   │   ├── PlayerController.js # Movement, interaction, depth sorting
│   │   └── AmbientSystem.js    # Environmental storytelling + ambient lines
│   ├── dialogue/
│   │   ├── hut.json            # All hut interior dialogue
│   │   └── village.json        # All village dialogue
│   └── assets/
│       ├── sprites/            # Character + environment sprites (coming)
│       ├── audio/              # Ambient sounds, music (coming)
│       └── fonts/              # Web fonts if self-hosting
├── public/                     # Static assets served as-is
├── docs/                       # Design documents, lore bible (private)
├── vite.config.js
├── package.json
├── .eslintrc.json
└── .prettierrc
```

---

## Setup — Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/remnant-earth.git
cd remnant-earth

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The game will open automatically at `http://localhost:3000`

---

## Setup — Production Deployment (Jay's Web Server)

### Build the project

```bash
npm run build
```

This creates a `dist/` folder with all compiled, optimized files.

### Deploy to server

Copy the entire contents of `dist/` to your web server's public root:

```bash
# Example using rsync
rsync -avz dist/ user@yourserver.com:/var/www/html/remnant-earth/

# Or using scp
scp -r dist/* user@yourserver.com:/var/www/html/remnant-earth/
```

### Server configuration

**Apache** — add to `.htaccess` in the deploy directory:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

**Nginx** — add to your server block:
```nginx
location / {
  root /var/www/html/remnant-earth;
  try_files $uri $uri/ /index.html;
}
```

**Node (Express)** — serve the dist folder statically:
```js
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));
```

---

## Development Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check code for errors |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Auto-format all code with Prettier |

---

## Adding New Content

### New dialogue
Edit the JSON files in `src/dialogue/`. Each entry follows this shape:

```json
{
  "id": "unique_id",
  "lines": [
    { "speaker": "NPC Name", "text": "What they say." },
    { "speaker": "", "text": "Narration has no speaker." }
  ],
  "onComplete": {
    "quest": "quest_id_or_null",
    "morality": {
      "dimension": "memory",
      "delta": 5,
      "event": "Human-readable description of what the player did"
    }
  }
}
```

Morality dimensions: `restraint`, `trust`, `preservation`, `inclusion`, `memory`

### New scenes
Create a new file in `src/scenes/`, extend `Phaser.Scene`, and register it in `src/main.js`.

### New ambient lines
Add strings to the `AMBIENT_LINES` array at the top of any scene file.

---

## The Morality System

Players are never shown a morality score. Instead their choices across five dimensions shape how the world responds to them:

| Dimension | What it tracks |
|---|---|
| `restraint` | Taking only what's needed vs extracting everything |
| `trust` | Sharing information vs hoarding it |
| `preservation` | Protecting old things vs pragmatic use |
| `inclusion` | How the player treats outsiders and the strange |
| `memory` | Honoring the past vs discarding it |

The AI — when eventually found — will reference specific actions from the player's history. The morality system logs every meaningful choice with a human-readable description for this purpose.

---

## The Live World Philosophy

This game is designed to evolve. The creator authors new story content, seasonal events, and mysteries over time. Players experience a world that feels alive and ongoing.

Key principles:
- **Work ahead** — always be seasons ahead of what players are experiencing
- **The iceberg rule** — players see ~20% of what exists. Depth they sense but can't reach keeps them invested
- **Irreversibility** — some world events are permanent. Collective memory is how mythology forms
- **The AI** — found through obscure means, named by the first player who reaches it. Its discovery is the central mystery of the game's first arc

---

## Tech Stack

- **Phaser 3** — game framework
- **Vite** — build tool + dev server
- **ESLint + Prettier** — code quality
- **Vanilla JS (ES modules)** — no framework overhead

---

*Built with care for the people who got left behind.*
