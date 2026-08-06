import antfu from '@antfu/eslint-config';

export default function defineConfig(options = {}, ...userConfigs) {
  return antfu(
    {
      typescript: true,
      jsonc: false,
      yaml: false,
      markdown: false,
      stylistic: { semi: true },
      ...options,
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
    ...userConfigs,
  );
}
