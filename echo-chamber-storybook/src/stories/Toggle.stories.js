import { Toggle } from '../components/components.js';

export default {
  title: 'Components/Toggle',
  render: (args) => Toggle(args),
  args: { label: 'Tempo sync', on: true, disabled: false },
};

export const On = {};
export const Off = { args: { on: false, label: 'Ping-pong' } };
export const Disabled = { args: { disabled: true } };
