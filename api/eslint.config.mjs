import globals from "globals";
import eslintPluginNode from 'eslint-plugin-node';

export default [
  {
    // Ignores node_modules and any other directories you want
    ignores: ['node_modules/**'],
    // Apply to all JS files in the project
    files: ['**/*.js'],
    languageOptions: { globals: globals.node },
    plugins: {
      node: eslintPluginNode,  // Use Node.js plugin
    },
    rules: {
      'no-console': 'off',  // Allow console logs in Node.js
      'indent': ['error', 2],  // Enforce 2-space indentation
      'quotes': ['error', 'single'],  // Use single quotes
      'semi': ['error', 'always'],  // Enforce semicolons
      'node/no-unsupported-features/es-syntax': 'off',  // Allows ES module syntax
      'node/no-missing-import': 'off',  // Disable if you use ES modules (import/export)
    },
  },
];
