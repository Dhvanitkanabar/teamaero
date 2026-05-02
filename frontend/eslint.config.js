import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ignore built artefacts and third-party code
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },

  // Core JS recommended rules
  js.configs.recommended,

  // React + JSX source files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // ── React Hooks ──────────────────────────────────────────────────
      ...reactHooks.configs.recommended.rules,

      // ── React Refresh (HMR) ──────────────────────────────────────────
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ── Code Quality ─────────────────────────────────────────────────
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',

      // ── Storage: prevent raw storage access (use utils/storage.js) ───
      // Uncomment below to enforce the storage utility pattern project-wide:
      // 'no-restricted-globals': [
      //   'error',
      //   { name: 'localStorage', message: 'Use utils/storage.js helpers instead.' },
      //   { name: 'sessionStorage', message: 'Use utils/storage.js helpers instead.' },
      // ],

      // ── Imports ──────────────────────────────────────────────────────
      'no-duplicate-imports': 'error',

      // ── Async / Promises ─────────────────────────────────────────────
      'no-return-await': 'warn',
      'require-await': 'warn',
    },
  },
];
