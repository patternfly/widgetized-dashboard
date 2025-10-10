import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      // Javascript builds
      '**/node_modules',
      '**/dist',
      '**/tsc_out',
      '**/.out',
      '**/.changelog',
      '**/.DS_Store',
      '**/coverage',
      '**/.cache',
      '**/.tmp',
      '**/.eslintcache',
      '**/generated',
      // package managers
      '**/yarn-error.log',
      '**/lerna-debug.log',
      // IDEs and editors
      '**/.idea',
      '**/.project',
      '**/.classpath',
      '**/.c9',
      '**/*.launch',
      '**/.settings',
      '**/*.sublime-workspace',
      '**/.history',
      '**/.vscode',
      '**/.yo-rc.json',
      // IDE - VSCode
      '**/.vscode',
      '**/*.swp',
      // public folder
      '**/public'
    ]
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier'
    )
  ),
  {
    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      '@typescript-eslint': fixupPluginRules(typescriptEslint)
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },

      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-require-imports': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_'
        }
      ],

      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-var-requires': 'off',
      'arrow-body-style': 'error',

      camelcase: [
        'error',
        {
          ignoreDestructuring: true
        }
      ],

      'constructor-super': 'error',
      curly: 'error',
      'dot-notation': 'error',
      eqeqeq: ['error', 'smart'],
      'guard-for-in': 'error',
      'max-classes-per-file': ['error', 1],
      'no-nested-ternary': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-cond-assign': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-eval': 'error',
      'no-new-wrappers': 'error',
      'no-undef-init': 'error',
      'no-unsafe-finally': 'error',

      'no-unused-expressions': [
        'error',
        {
          allowTernary: true,
          allowShortCircuit: true
        }
      ],

      'no-unused-labels': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'prefer-const': 'error',
      radix: ['error', 'as-needed'],
      'react/prop-types': 0,
      'react/display-name': 0,
      'react-hooks/exhaustive-deps': 'warn',

      'react/no-unescaped-entities': [
        'error',
        {
          forbid: ['>', '}']
        }
      ],

      'spaced-comment': 'error',
      'use-isnan': 'error'
    }
  },
  {
    files: ['**/patternfly-docs/pages/*'],

    rules: {
      'arrow-body-style': 'off'
    }
  }
];
