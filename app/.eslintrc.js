module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "vue/no-unused-components": 1,
    "no-unused-vars": "warn",
    "vue/no-unused-vars": "warn",
    "no-undef": 1,
    "no-trailing-spaces": ["warn", { "skipBlankLines": true }],
    "comma-dangle": ["warn", "always-multiline"],
    "semi": ["warn", "always"],
    "max-len": ["warn", { "code": 120 }],
    "eqeqeq": ["warn", "always"],    
    "vue/return-in-computed-property": "warn",
    "quotes": ["warn", "single"],
    "no-empty": "warn",
    "no-empty-function": "warn",
    "padded-blocks": ["warn", "never"],
    "array-bracket-spacing": "warn",
    "vue/multiline-html-element-content-newline": "warn",
    "vue/html-closing-bracket-newline": "warn",
    "object-curly-spacing": ["warn", "always"],
    "vue/html-indent": "warn",
    "eol-last": "warn",
    "no-mixed-spaces-and-tabs": "warn",
    "space-before-blocks": "warn"
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
}
