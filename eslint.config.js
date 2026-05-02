import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    ...js.configs.recommended,
  },
  prettierConfig,
]
