import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Prettier integration
  prettierConfig,

  {
    // Configuration for all JavaScript files.
    // `.mjs` is included so build/tooling scripts get the same quality rules as
    // src/ — without it they fall back to eslint:recommended with no globals at
    // all, which reports every `process`/`console` reference as no-undef.
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',

        // Chart.js and other libraries (if used globally)
        Chart: 'readonly',
        L: 'readonly', // Leaflet
        bootstrap: 'readonly',

        // Google Maps (if used)
        google: 'readonly',

        // Common browser APIs
        Element: 'readonly',
        NodeList: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        FormData: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',

        // Web APIs
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly',
        CustomEvent: 'readonly',
        getComputedStyle: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        performance: 'readonly',
        navigator: 'readonly'
      }
    },
    plugins: {
      prettier
    },
    rules: {
      // Prettier formatting
      'prettier/prettier': 'error',

      // JavaScript best practices
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // ESLint 9+ lints catch bindings by default (caughtErrors: 'all'),
          // so the project's `_`-prefix convention has to cover them too —
          // otherwise `catch (_e) { /* ignore */ }` is reported as unused.
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error']
        }
      ],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',

      // Modern JavaScript
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': ['error', 'never'],

      // Code quality
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'never'],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true
        }
      ],
      semi: ['error', 'always'],

      // Function and variable naming
      camelcase: [
        'error',
        {
          properties: 'never',
          ignoreImports: true
        }
      ],

      // Import/Export
      'no-duplicate-imports': 'error',

      // Error prevention
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-duplicate-case': 'error',

      // Best practices for DOM manipulation
      'no-global-assign': 'error',
      'no-implicit-globals': 'error',

      // Async/await best practices
      'require-await': 'error',
      'no-async-promise-executor': 'error',

      // Array and object methods
      'array-callback-return': 'error',
      'no-loop-func': 'error'
    }
  },

  {
    // Specific rules for module files
    files: ['src/**/*.js'],
    rules: {
      // Module-specific rules
      'no-undef': 'error'
    }
  },

  {
    // Configuration files don't need to be as strict
    files: ['*.config.js', 'vite.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      'no-console': 'off'
    }
  },

  {
    // Node-side tooling scripts (e.g. scripts/social-preview.mjs).
    // These run under Node, so they need Node globals on top of the browser
    // globals declared above — the browser ones stay relevant because
    // Playwright `page.evaluate()` callbacks are authored inline here and are
    // statically analysed as part of this file.
    files: ['scripts/**/*.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        URL: 'readonly'
      }
    },
    rules: {
      // Tooling scripts legitimately report progress on stdout.
      'no-console': 'off'
    }
  },

  {
    // Ignore patterns
    ignores: ['dist/**', 'node_modules/**', 'public/**', '*.min.js', 'coverage/**']
  }
];
