import { IconButton, Icon, iconNames } from '../components/components.js';

export default {
  title: 'Components/Icon Button',
  render: (args) => IconButton(args),
  argTypes: {
    icon: { control: 'select', options: iconNames },
    style: { control: 'inline-radio', options: ['filled', 'ghost'] },
  },
  args: { icon: 'play', style: 'filled', active: false, disabled: false },
};

export const Filled = {};
export const Active = { args: { icon: 'power', active: true } };
export const Ghost = { args: { icon: 'sliders', style: 'ghost' } };
export const IconSet = {
  render: () => `<div style="display:grid;grid-template-columns:repeat(6,48px);gap:var(--spacing-two);color:var(--color-text-primary)">
    ${iconNames.map((n) => `<div title="${n}" style="display:grid;place-items:center;height:48px">${Icon(n, 24)}</div>`).join('')}</div>`,
};
