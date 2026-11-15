import { Button, iconNames } from '../components/components.js';

export default {
  title: 'Components/Button',
  render: (args) => Button(args),
  argTypes: {
    style: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'inline-radio', options: ['large', 'medium'] },
    icon: { control: 'select', options: [null, ...iconNames] },
  },
  args: { label: 'Save preset', style: 'primary', size: 'large', slim: false, icon: null, disabled: false },
};

export const Primary = {};
export const Secondary = { args: { style: 'secondary', label: 'Reset' } };
export const Tertiary = { args: { style: 'tertiary', label: 'Preset: Tape Room', icon: 'chevron-down' } };
export const AllVariants = {
  render: () => ['primary', 'secondary', 'tertiary'].map((style) =>
    `<div style="display:flex;align-items:center;gap:var(--spacing-two);margin-bottom:var(--spacing-two)">
      ${Button({ style, size: 'large', label: 'Large' })}
      ${Button({ style, size: 'large', slim: true, label: 'Large slim' })}
      ${Button({ style, size: 'medium', label: 'Medium' })}
      ${Button({ style, size: 'medium', slim: true, label: 'Medium slim' })}
      ${Button({ style, label: 'Disabled', disabled: true })}</div>`).join(''),
};
