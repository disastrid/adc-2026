import { Knob } from '../components/components.js';

// Drag up/down to turn (hold Shift for fine control), use the arrow keys,
// or double-click to reset.
export default {
  title: 'Components/Knob',
  render: (args) => Knob(args),
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    colour: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary'] },
  },
  args: { label: 'Mix', value: 0.65, size: 'large', colour: 'primary', disabled: false },
};

export const Large = {};
export const Small = { args: { size: 'small' } };
export const Disabled = { args: { disabled: true } };
export const Colours = {
  render: () => `<div style="display:flex;gap:var(--spacing-four)">
    ${['primary', 'secondary', 'tertiary'].map((colour) => Knob({ colour, label: colour })).join('')}</div>`,
};
export const Units = {
  render: () => `<div style="display:flex;gap:var(--spacing-four)">
    ${Knob({ label: 'Time', value: 0.4, steps: ['1/32', '1/16', '1/8', '1/4', '1/2', '1/1'] })}
    ${Knob({ label: 'Tone', value: 0.61, min: 200, max: 12000, unit: 'Hz', colour: 'secondary' })}
    ${Knob({ label: 'Mix', value: 0.35, colour: 'tertiary' })}</div>`,
};
