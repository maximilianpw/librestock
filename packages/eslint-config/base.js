import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import pluginImport from 'eslint-plugin-import'
import pluginPromise from 'eslint-plugin-promise'
import pluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: true,
      },
    },
  },

  // Import plugin configuration
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/order': 'error',
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
    },
  },

  // Code quality plugins
  {
    plugins: {
      unicorn: pluginUnicorn,
      promise: pluginPromise,
    },
    rules: {
      'unicorn/better-regex': 'error',
      'unicorn/catch-error-name': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',

      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
    },
  },

  // TypeScript rules
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
    },
  },

  // General JavaScript rules
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },

  // Prettier should be last
  prettierConfig,

  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
    ],
  },
)
