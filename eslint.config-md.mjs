import markdown from 'eslint-plugin-markdown';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['.history/*']
  },
  ...markdown.configs.recommended,
  {
    plugins: {
      react
    },
    languageOptions: {
      parser: tseslint.parser
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'eol-last': 'error',
      'spaced-comment': 'error',
      'no-unused-vars': 'off',
      'no-this-before-super': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unknown-property': 'error',
      'react/jsx-no-undef': 'error'
    }
  }
];
