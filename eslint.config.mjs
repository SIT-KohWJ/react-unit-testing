//import js from "@eslint/js";
//import globals from "globals";
import { defineConfig } from "eslint/config";
import reactPlugin from 'eslint-plugin-react';
import jestPlugin from 'eslint-plugin-jest';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import pluginSecurity from 'eslint-plugin-security';
import babelParser from '@babel/eslint-parser';

export default defineConfig([
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },
    plugins: {
      react: reactPlugin,
      security: pluginSecurity,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'security/detect-eval-with-expression': 'error',
    },
    settings: {
      react: {
        version: 'detect', // Automatically picks up from package.json
      },
    },
  },
  {
    files: ['**/*.test.{js,jsx}'],
    plugins: {
      jest: jestPlugin,
      'testing-library': testingLibraryPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
      'testing-library/await-async-events': 'off',
    },
    languageOptions: {
      globals: {
        test: true,
        expect: true,
        describe: true,
        beforeEach: true,
        afterEach: true,
        it: true,
        jest: true,
      },
    },
  },
]);
