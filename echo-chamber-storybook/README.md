# Echo Chamber: Figma → Storybook

The smallest possible bridge between Figma variables and code. No token pipeline, no build step: Storybook reads the JSON exported from Figma and turns it into CSS variables, and the components only ever use those variables.

## Setup (once)

```sh
npm install
npm run storybook        # opens on http://localhost:6006
```

## The demo

1. In Figma, change a variable (for example `orange/hue` in **Primitives**, or the Ember mode of `color/primary`).
2. Export the variables to JSON.
3. Paste the export into `tokens/figma-variables.json` and save, replacing the contents. You can also drop in several files, such as one per collection or mode.
4. Storybook updates by itself. No restart, no reload.

Use the **Product** (Ember / Tide / Bloom) and **Theme** (Dark / Light) menus in the Storybook toolbar to switch modes. They match the modes of the Product and Theme collections in Figma.

## How it works

| File | What it does |
|---|---|
| `tokens/*.json` | The Figma export, unchanged |
| `tokens.config.json` | Which names are modes (`Ember`, `Dark`…) and which are just collection names to drop |
| `src/tokens.js` | ~90 lines: JSON → `--css-variables`, with modes as `[data-product]` / `[data-theme]` selectors |
| `src/components/` | Button, Icon Button, Toggle, Knob: plain HTML and CSS, using variables only |
| `npm run tokens` | Optional: writes the same CSS to `dist/tokens.css` for use outside Storybook |

Naming rule: a Figma variable `color/bg/surface` becomes `var(--color-bg-surface)`. Each variable shows this name under **Code syntax** in Figma.

## Knobs

The knobs really turn: drag up or down (hold Shift for fine control), use the arrow keys when focused, or double-click to reset. The hover and active looks match the Knob `State` variants in Figma. Hz knobs use a log scale, like real filter controls.

If you add a new mode in Figma, add its name to `tokens.config.json`.
