# Icônes Stream Deck FishDex

## Format et conventions

- **Taille** : 144×144px (résolution native Stream Deck MK.2 / XL)
- **Format source** : SVG (vectoriel, éditable)
- **Fond** : `#0a0f14` (noir abyssal FishDex)
- **Couleurs par page** :
  - Page 1 (Dev Daily) : `#22d3ee` (cyan)
  - Page 2 (Git & Deploy) : `#34d399` (émeraude)
  - Page 3 (Claude / IA) : `#a855f7` (violet)

## Convertir SVG → PNG pour Stream Deck

### Option 1 — Inkscape (recommandé, gratuit)
```bash
# Convertir un seul fichier
inkscape --export-type=png --export-width=144 --export-height=144 launch.svg

# Convertir tous les SVG du dossier
for file in *.svg; do inkscape --export-type=png --export-width=144 --export-height=144 "$file"; done
```

### Option 2 — rsvg-convert (ligne de commande)
```bash
# Installer : choco install librsvg (Windows avec Chocolatey)
rsvg-convert -w 144 -h 144 launch.svg -o launch.png
```

### Option 3 — Figma (online, sans installation)
1. Ouvre figma.com → nouveau fichier
2. Importe le SVG (File → Place Image)
3. Redimensionne à 144×144
4. Exporte en PNG (clic droit → Export → PNG)

### Option 4 — ImageMagick
```bash
# Installer : choco install imagemagick
magick convert -background none -size 144x144 launch.svg launch.png
```

## Nommage des fichiers

| Fichier SVG | Fichier PNG à créer | Bouton Stream Deck |
|---|---|---|
| `launch.svg` | `launch.png` | 01 — LAUNCH |
| `typecheck.svg` | `typecheck.png` | 02 — TYPECHECK |
| `mobile.svg` | `mobile.png` | 03 — MOBILE |
| `docs.svg` | `docs.png` | 04 — DOCS |
| `restart.svg` | `restart.png` | 05 — RESTART |
| `clean.svg` | `clean.png` | 06 — CLEAN |
| `supabase.svg` | `supabase.png` | 07 — SUPABASE |
| `git-status.svg` | `git-status.png` | 11 — GIT STATUS |
| `smart-commit.svg` | `smart-commit.png` | 12 — COMMIT |
| `push-vercel.svg` | `push-vercel.png` | 13 — PUSH |
| `claude.svg` | `claude.png` | 21 — CLAUDE CODE |
| `paste-prompt.svg` | `paste-prompt.png` | 22 — PROMPTS |
| `debug.svg` | `debug.png` | 25 — DEBUG |

## Créer de nouvelles icônes

Le template SVG de base :
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 144">
  <rect width="144" height="144" fill="#0a0f14" rx="18"/>
  <!-- Ton icône ici (style Lucide, stroke uniquement) -->
  <!-- Couleur Page 1: #22d3ee | Page 2: #34d399 | Page 3: #a855f7 -->
  <text x="72" y="120" text-anchor="middle" fill="#22d3ee"
        font-family="monospace" font-size="12" font-weight="600" letter-spacing="1">
    LABEL
  </text>
</svg>
```
