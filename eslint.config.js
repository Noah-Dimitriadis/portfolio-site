import js from '@eslint/js'
import globals from 'globals'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  prettierConfig,
]
