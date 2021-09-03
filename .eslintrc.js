module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    /* eslint-disable-next-line */
    'eqeqeq': 'off',
  },
};
