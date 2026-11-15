import { buildCss } from '../src/tokens.js';
import config from '../tokens.config.json';
import '../src/components/components.css';

// Every JSON file in /tokens is read live. Paste a new Figma export in, save,
// and Vite hot-reloads the stories with the new values.
const files = import.meta.glob('../tokens/*.json', { eager: true, import: 'default' });

let style = document.getElementById('figma-tokens');
if (!style) {
  style = document.createElement('style');
  style.id = 'figma-tokens';
  document.head.appendChild(style);
}
style.textContent = buildCss(files, config);

const fonts = document.createElement('link');
fonts.rel = 'stylesheet';
fonts.href =
  'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@300..700&family=Geist+Mono:wght@300..700&family=Tiny5&display=swap';
document.head.appendChild(fonts);

const options = (axis) => config.modes[axis].map((m) => ({ value: m.toLowerCase(), title: m }));

export default {
  globalTypes: {
    product: {
      description: 'Product mode (Figma: Product collection)',
      toolbar: { title: 'Product', icon: 'paintbrush', items: options('product'), dynamicTitle: true },
    },
    theme: {
      description: 'Theme mode (Figma: Theme collection)',
      toolbar: { title: 'Theme', icon: 'mirror', items: options('theme'), dynamicTitle: true },
    },
  },
  initialGlobals: { product: 'ember', theme: 'dark' },
  decorators: [
    (story, { globals }) => {
      const root = document.documentElement;
      root.dataset.product = globals.product;
      root.dataset.theme = globals.theme;
      return story();
    },
  ],
  parameters: { layout: 'centered', backgrounds: { disable: true } },
};
