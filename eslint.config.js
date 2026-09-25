import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import * as IMPORT from 'eslint-plugin-import'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.output']),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['./src/components/ui/*'],
    plugins: {
      "import" : IMPORT
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "import/prefer-default-export" : "warn",
      "import/order" : "warn",
      "import/no-unused-modules" : "error",
    }
  },
])
