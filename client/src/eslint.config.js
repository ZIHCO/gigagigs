import globals from 'globals';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules, // Apply recommended React rules
    },
  },
];
