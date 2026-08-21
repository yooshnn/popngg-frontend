import antfu from '@antfu/eslint-config';

export default antfu(
  {
    typescript: true,
    jsonc: false,
    yaml: false,
    markdown: false,
    stylistic: { semi: true },
    react: true,
    ignores: [
      '.wrangler/**',
      '.react-router/**',
      'build/**',
      'public/**',
      'worker-configuration.d.ts',
    ],
  },
  {
    name: 'popngg/rules',
    rules: {
      'no-empty-pattern': ['warn', { allowObjectPatternsAsParameters: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'ts/no-use-before-define': [
        'error',
        { functions: false, typedefs: false, variables: true },
      ],
    },
  },
  {
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
