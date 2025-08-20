const js = require('@eslint/js')
const nextPlugin = require('@next/eslint-plugin-next')
const globals = require('globals')

module.exports = [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'coverage/**',
      'dist/**',
      'build/**',
      '*.config.js',
      '*.config.ts'
    ]
  },

  // Base JavaScript configuration
  js.configs.recommended,

  // Next.js specific configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // Additional rules based on your coding standards
      eqeqeq: ['error', 'always'],
      camelcase: [
        'error',
        {
          properties: 'never',
          allow: ['^[a-z]+(_[a-z]+)*$'] // Allow snake_case for API data
        }
      ],
      'no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error'
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        // React globals
        React: 'readonly',
        JSX: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },

  // TypeScript specific configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    rules: {
      ...require('@typescript-eslint/eslint-plugin').configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off' // Allow require() for Jest mocks
    }
  },

  // Test files configuration
  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,ts,tsx}'
    ],
    plugins: {
      'testing-library': require('eslint-plugin-testing-library')
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        // Additional Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      // Testing Library best practices
      'testing-library/prefer-screen-queries': 'error',
      'testing-library/no-container': 'error',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/prefer-presence-queries': 'error',
      'testing-library/prefer-query-by-disappearance': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/prefer-user-event': 'error',

      // Relax some rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      camelcase: 'off', // Allow snake_case in test data
      'no-unused-vars': 'off', // Allow unused variables in test setup
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
]
