# Aperture — Premium Image Gallery

A premium, fully responsive image gallery built with plain HTML, CSS, and JavaScript.
No frameworks, no build step, no dependencies — just a handful of files and a folder of assets.

## Design

A restrained, high-contrast palette of **royal blue, white, grey, and black**:

| Token                       | Value      | Used for                                  |
|-----------------------------|------------|--------------------------------------------|
| `--color-royal-blue`        | `#2A46E8`  | Primary accent, active states, hover glow   |
| `--color-royal-blue-dark`   | `#16244F`  | Header gradient, "Architecture" accent      |
| `--color-black`              | `#0B0D12`  | Header gradient, lightbox overlay           |
| `--color-grey-900/600/300/100` | greyscale ramp | Body text, muted text, borders, surfaces |
| `--color-white`              | `#FFFFFF`  | Cards, page background, lightbox text       |

All tokens live at the top of `css/styles.css`, so the whole look can be re-themed by editing
a handful of CSS custom properties.

## Features

- **Responsive, mobile-first grid** — 1 column on phones, 2 on tablets (600px+), 3 on desktop (960px+)
- **Category filtering** — filter by *Nature*, *Architecture*, or *People* via `#filterButtons`
- **Lightbox modal** — click any photo to view it enlarged, with:
  - Previous / next navigation (buttons, arrow keys, or swipe on touch devices)
  - Escape key and backdrop click to close
  - Image counter (e.g. `03 / 12`) and category-colored border
- **Premium micro-interactions** — staggered grid entrance, card lift + royal-blue glow on hover, sliding caption plates, lightbox fade/zoom transitions
- **Accessible by default** — keyboard-operable gallery cards, visible focus states, `aria-*` attributes on the modal, and `prefers-reduced-motion` support
- **Custom favicon** — a royal-blue monogram icon at `assets/favicon.svg`
- **Meaningful class/ID names** — `.gallery`, `.gallery-item`, `.gallery-image`, `.lightbox`, `#filterButtons`, etc., so the code is easy to navigate and extend

## File structure

```
image-gallery/
├── index.html            # Page structure and markup
├── css/
│   └── styles.css        # Design tokens, layout, components, animations
├── js/
│   └── script.js          # Image data, rendering, filtering, lightbox logic
├── assets/
│   └── favicon.svg        # Royal-blue monogram favicon / shortcut icon
└── README.md               # This file
```

## Browser support

Built with standard, widely supported CSS and JavaScript (CSS Grid, `aspect-ratio`, ES6+).
Works in all current versions of Chrome, Firefox, Safari, and Edge.
