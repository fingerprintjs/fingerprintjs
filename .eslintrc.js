module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-console': 'warn',
    'max-len': ['error', { code: 120, ignoreUrls: true }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'VariableDeclarator > ObjectPattern > RestElement',
        message: 'Rest destructuring in object variables is not allowed: const {a, ...rest} = obj',
      },
      {
        selector: 'AssignmentExpression > ObjectPattern > RestElement',
        message: 'Rest destructuring in object assignments is not allowed: ({a, ...rest} = obj)',
      },
      {
        selector: 'VariableDeclarator > ArrayPattern > RestElement',
        message: 'Rest destructuring in array variables is not allowed: const [a, ...rest] = arr',
      },
      {
        selector: 'AssignmentExpression > ArrayPattern > RestElement',
        message: 'Rest destructuring in array assignments is not allowed: ([a, ...rest] = arr)',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['@typescript-eslint', 'import'],
      parserOptions: {
        project: ['tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      rules: {
        'max-len': ['error', { code: 120, ignoreUrls: true }],
        '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
        '@typescript-eslint/require-await': 'error',
        'prefer-template': 'error',
        'no-useless-concat': 'error',
        eqeqeq: ['error', 'always'],
        'padding-line-between-statements': [
          'error',
          { blankLine: 'always', prev: '*', next: 'function' },
          { blankLine: 'always', prev: 'function', next: '*' },
        ],
        'import/no-duplicates': 'error',
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            alphabetize: { order: 'asc', caseInsensitive: true },
            'newlines-between': 'always',
            warnOnUnassignedImports: true,
          },
        ],
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts'],
          },
        },
      },
    },
    {
      files: ['**/*.test.ts'],
      rules: {
        '@typescript-eslint/require-await': 'off',
        'no-restricted-syntax': [
          'warn',
          {
            selector: "CallExpression[callee.name='fit']",
            message: 'Do not commit focused tests (fit).',
          },
          {
            selector: "CallExpression[callee.name='fdescribe']",
            message: 'Do not commit focused suites (fdescribe).',
          },
          {
            selector: "CallExpression[callee.name='xit']",
            message: 'Do not commit skipped tests (xit).',
          },
          {
            selector: "CallExpression[callee.name='xdescribe']",
            message: 'Do not commit skipped suites (xdescribe).',
          },
        ],
      },
    },
  ],
}
