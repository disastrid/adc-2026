# Echo Chamber: Figma → Storybook

## Want to see the slides from the talk? [Find them here on Google Slides](https://docs.google.com/presentation/d/1BQqQI81YHht2PtZOxro0g8B9dtoddr9uQYgAL7owFdQ/edit?usp=sharing)

This is the documentation from my talk at audio.dev 2026, You Need A Design System.

This is a tiny baby design system, and demonstrates a possible bridge between Figma variables and code. There's minimal token pipeline, and no build step: Storybook reads the JSON exported from Figma and turns it into CSS variables, and the components only ever use those variables.

## Storybook setup (do this once)

Go into the cloned repo, do this:

```sh
npm install
npm run storybook        # opens on http://localhost:6006
```

## Figma

Get the Figma file from the repo and open it in Figma.

Go to `Plugins > Manange plugins ...` at the top. Search Variables to JSON and install it. You can now launch this plugin from the plugins icon in the bottom toolbar (looks like a grid of four shapes).

1. In Figma, change a variable. A good way to see how this works is to go into Tier 2 - Products which has the three product modes. Click on a colour and change it.
2. Click on the plugins icon, select Variables to JSON. Click copy. 
3. In a code editor, paste everything into `tokens/figma-variables.json` and save. This replaces the contents and updates the design system to your latest version of the variables. 
4. Storybook updates by itself. No restart, no reload.

## See it in action

Go to `http://localhost:6006` to see Storybook and explore all the components.

1. To see different product colourways: Go to the product switcher at the very top. The default is Ember, and you can switch with this dropdown.

2. To see light and dark modes select the Mode switch at the very top. 

3. To see accessibility assessments, open the add-on panel (third icon from the right at the top - I know, it's not ideal). This opens the bottom panel where you can do things like change the text in your components, and there's an accessibility tab that will take you to any feature that it flags as problematic.

## How it works

| File | What it does |
|---|---|
| `tokens/*.json` | The Figma export, unchanged |
| `tokens.config.json` | Which names are modes (`Ember`, `Dark`…) and which are just collection names to drop |
| `src/tokens.js` | ~90 lines: JSON → `--css-variables`, with modes as `[data-product]` / `[data-theme]` selectors |
| `src/components/` | Button, Icon Button, Toggle, Knob: plain HTML and CSS, using variables only |
| `npm run tokens` | Optional: writes the same CSS to `dist/tokens.css` for use outside Storybook |

Naming rule: a Figma variable `color/bg/surface` becomes `var(--color-bg-surface)`. Each variable shows this name under **Code syntax** in Figma.

## Robot do!

This whole pipeline has become significantly less painful with the age of agents. If you run into problems point your agent at this repo (and connect it to Figma via MCP, though I believe you need a paid account for that) and let the robot do the boring stuff.

Happy designing!