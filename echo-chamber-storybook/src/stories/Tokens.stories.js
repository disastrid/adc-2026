// Reads the live CSS variables, so this page always shows what Figma exported.
export default { title: 'Foundations/Tokens', parameters: { layout: 'padded' } };

const read = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
const product = ['primary', 'primary-shade', 'secondary', 'secondary-shade', 'accent', 'accent-shade'];
const theme = ['bg-canvas', 'bg-surface', 'bg-raised', 'border-default', 'border-strong', 'text-primary', 'text-secondary'];
const swatch = (n) => `<div style="display:flex;flex-direction:column;gap:var(--spacing-one)">
  <div style="width:112px;height:72px;border-radius:var(--radius-default);background:var(--color-${n});box-shadow:inset 0 0 0 1px var(--color-border-default)"></div>
  <span class="label" style="color:var(--color-text-secondary)">${n}</span></div>`;
const row = (items) => `<div style="display:flex;flex-wrap:wrap;align-items:flex-end;gap:var(--spacing-two)">${items}</div>`;
const title = (t) => `<h2 class="display" style="font-size:var(--typography-font-size-xl)">${t}</h2>`;

export const Colour = { render: () => `<div style="display:flex;flex-direction:column;gap:var(--spacing-three)">
  ${title('Colour')}
  <span class="caption">Tier 2 · Product</span>${row(product.map(swatch).join(''))}
  <span class="caption">Tier 2 · Theme</span>${row(theme.map(swatch).join(''))}</div>` };

export const Type = { render: () => {
  const sizes = ['xl', 'lg', 'md', 'default', 'sm', 'xs'];
  return `<div style="display:flex;flex-direction:column;gap:var(--spacing-two)">
  ${title('Type')}
  <span class="caption">display ${read('typography-font-family-display')} · body ${read('typography-font-family-body')} · mono ${read('typography-font-family-mono')}</span>
  ${sizes.map((s) => `<div style="display:flex;align-items:baseline;gap:var(--spacing-three)">
    <span class="label" style="width:200px;color:var(--color-text-secondary)">font-size/${s} · ${read('typography-font-size-' + s)}</span>
    <span class="${['xl', 'lg'].includes(s) ? 'display' : ''}" style="font-size:var(--typography-font-size-${s})">Delay, but warmer</span></div>`).join('')}</div>`;
} };

export const Proportion = { render: () => {
  const space = ['quarter', 'half', 'one', 'one-five', 'two', 'two-five', 'three', 'four', 'four-five', 'five'];
  return `<div style="display:flex;flex-direction:column;gap:var(--spacing-three)">
  ${title('Proportion')}
  ${row(space.map((s) => `<div style="display:flex;flex-direction:column;align-items:center;gap:var(--spacing-one)">
    <div style="width:var(--spacing-${s});height:var(--spacing-${s});background:var(--color-primary);border-radius:2px"></div>
    <span class="label" style="color:var(--color-text-secondary)">${s} · ${read('spacing-' + s)}</span></div>`).join(''))}
  ${row(['sm', 'default', 'med', 'lg', 'round'].map((r) => `<div style="display:flex;flex-direction:column;align-items:center;gap:var(--spacing-one)">
    <div style="width:64px;height:64px;background:var(--color-bg-raised);border:1px solid var(--color-border-strong);border-radius:var(--radius-${r})"></div>
    <span class="label" style="color:var(--color-text-secondary)">radius/${r}</span></div>`).join(''))}</div>`;
} };
