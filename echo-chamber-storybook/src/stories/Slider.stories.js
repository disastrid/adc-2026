import { Slider } from '../components/components.js';

// Click or drag along the track (Active state while dragging), or use the arrow keys.
// Width matches the Figma component (250px); the slider itself fills its container.
const wrap = (html) => `<div style="width:250px">${html}</div>`;

export default {
  title: 'Components/Slider',
  render: (args) => wrap(Slider(args)),
  argTypes: {
    type: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary'] },
    value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  },
  args: { type: 'primary', value: 0, disabled: false, label: 'Slider' },
};

export const Primary = {};
export const Secondary = { args: { type: 'secondary' } };
export const Tertiary = { args: { type: 'tertiary' } };
export const Disabled = { args: { disabled: true, value: 0.4 } };
export const AllTypes = {
  render: () => `<div style="width:250px;display:flex;flex-direction:column;gap:var(--spacing-three)">
    ${['primary', 'secondary', 'tertiary'].map((type) => Slider({ type, value: 0.5, label: type })).join('')}</div>`,
};