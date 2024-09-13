import globals from 'globals';
import pluginReact from 'eslint-plugin-react';


export default [
  {files: ['**/*.{js,mjs,cjs,jsx}']},
  {languageOptions: { globals: globals.browser }},
  {rules: {
    'no-console': 'warn',  // Warns on console.log usage
    'indent': ['error', 2],  // Enforce 2-space indentation
    'quotes': ['error', 'single'],  // Enforce single quotes
    'semi': ['error', 'always'],  // Enforce semicolons
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/prop-types': 'off',  // Disable prop-types validation for React components
  }},
  pluginReact.configs.flat.recommended,
];
