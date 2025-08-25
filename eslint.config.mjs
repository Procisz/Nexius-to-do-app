import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    globalIgnores(['dist/**/*', 'node_modules/**/*', '.angular/**/*']),
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },
        processor: angularTemplate.processors['extract-inline-html'],
        extends: fixupConfigRules(
            compat.extends(
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:@angular-eslint/recommended',
                'plugin:import/recommended',
                'plugin:import/typescript',
            ),
        ),
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                { type: 'attribute', prefix: 'app', style: 'camelCase' },
            ],
            '@angular-eslint/component-selector': [
                'error',
                { type: 'element', prefix: 'app', style: 'kebab-case' },
            ],

            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: true,
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: true }],
            '@typescript-eslint/no-inferrable-types': 'warn',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            'import/order': [
                'error',
                {
                    groups: ['external', 'builtin', 'internal', 'parent', 'sibling', 'index'],
                    pathGroups: [{ pattern: 'src/**', group: 'internal', position: 'after' }],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'prefer-const': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: angularTemplateParser,
        },
        plugins: {
            '@angular-eslint/template': angularTemplate,
        },
        rules: {
            ...angularTemplate.configs.recommended.rules,
            ...angularTemplate.configs.accessibility.rules,

            '@typescript-eslint/await-thenable': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
        },
    },
]);
