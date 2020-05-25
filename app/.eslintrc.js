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
    "no-console": "off",
    "no-debbug": "off",
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
    "space-before-blocks": "warn",
    "keyword-spacing": "warn",
    "key-spacing": "warn",
    "prefer-const": "warn",
    "prefer-arrow-callback": "warn",
    "no-param-reassign": "warn",
    "curly": ['warn', 'multi-or-nest', 'consistent'],
    "vue/mustache-interpolation-spacing": "warn",
    "space-before-function-paren": ["warn", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    "no-multi-spaces": "warn",
    "vue/order-in-components": "warn",
    "vue/attributes-order": "warn",
    "no-else-return": "warn",
    "indent": ["warn", 2],
    "vue/html-closing-bracket-spacing": "warn",
    "no-unreachable": "warn"
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
}
