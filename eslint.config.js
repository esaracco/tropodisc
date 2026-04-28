const globals = require('globals');
const reactPlugin = require('eslint-plugin-react');
const googleConfig = require('eslint-config-google');

const googleRules = { ...googleConfig.rules };
// These rules were removed in ESLint v9+
delete googleRules['valid-jsdoc'];
delete googleRules['require-jsdoc'];

module.exports = [
  reactPlugin.configs.flat.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: '19.2.0',
      },
    },
    rules: {
      ...googleRules,
      'max-len': 'off',
    },
  },
];
