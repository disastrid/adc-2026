# ADC 2026: You Need A Design System

At ADC 2026 I did a talk called You Need A Design System. Here's the sample design system I made (using Claude) and the Figma file that provides the data.

## What's in here

| | |
|---|---|
| `echoChamber_designSystemDemo.fig` | The Figma file: variables (colour, type, spacing), components and their states |
| `echo-chamber-storybook/` | A small Storybook that builds the same components in code from the Figma variables |

The two stay in sync through one JSON file: the variables exported from Figma.

## Run the Storybook

You need [Node.js](https://nodejs.org) 20.19 or newer.

```sh
cd echo-chamber-storybook
npm install
npm run storybook
```

Storybook opens at http://localhost:6006. Use the **Product** (Ember / Tide / Bloom) and **Theme** (Dark / Light) menus in the toolbar to switch modes, just like the variable modes in Figma.

## Set up Figma

1. In Figma, import `echoChamber_designSystemDemo.fig` (drag it into the Figma file browser, or **Import** from the menu).
2. Install the free **Variables to JSON** plugin from the Figma Community (search for it under **Plugins** in Figma).

## Update Storybook from Figma

1. Change any variable in the Figma file (a colour, a spacing value, a font size…).
2. Run the **Variables to JSON** plugin and copy the JSON it exports.
3. Open `echo-chamber-storybook/tokens/figma-variables.json`, select everything, paste the export over it and save.
4. Storybook updates automatically. No restart needed.

## Good to know

- **New modes:** if you add a mode in Figma (a new product or theme), add its name to `echo-chamber-storybook/tokens.config.json` so it shows up in the Storybook toolbar.
- **Aliases:** the plugin exports component variables as plain values rather than links (e.g. `#ff7a3d` instead of `color/primary`). Storybook reconnects them to the right Tier 2 variable by matching values, so product and theme switching still works. When two variables share a value and the match is ambiguous, the correct link is set in `relink.pins` in `tokens.config.json`.
