module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    'no-throw-literal': 0,
    'react/jsx-filename-extension': [0],
    'no-else-return': 0,
    'consistent-return': 0,
    'react/no-unused-state': 0,
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    'no-use-before-define': 0,
    'no-return-assign': 0,
    'react/prefer-stateless-function': 0,
    'import/no-unresolved': 0,
  },
};
