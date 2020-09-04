module.exports = {
  globals: {
    jest: true
  },
  env: {
    browser: false,
    node: true,
    es6: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'never'],
    'eol-last': ['error', 'always'],
    'no-console': 'off',
    'prettier/prettier': 'error'
  }
}
