module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    quotes: ['error', 'single'],
  },
}
