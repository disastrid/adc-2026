/** @type { import('@storybook/html-vite').StorybookConfig } */
export default {
  stories: ['../src/stories/*.stories.js'],
  framework: { name: '@storybook/html-vite', options: {} },
  core: { disableTelemetry: true },
  addons: ['@storybook/addon-a11y']
};
