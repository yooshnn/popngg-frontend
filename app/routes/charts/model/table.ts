import type { FormDraftValues, TableConfig } from '~/features/table';
import { parseAsString } from 'nuqs';
import { singleKeyBinding, tableFields } from '~/features/table';

export const tableConfig = {
  filter: {
    search: singleKeyBinding('q', parseAsString),
  },
  form: {
    version: tableFields.version,
    level: tableFields.level,
    difficulty: tableFields.difficulty,
  },
  sort: {
    initial: { key: 'version', order: 'desc' },
    options: ['version', 'title', 'genre', 'maxLevel'],
  },
  pagination: {
    initial: { size: 20 },
    allowedSizes: [20, 50, 100],
  },
} as const satisfies TableConfig;

export type ChartsFormValues = FormDraftValues<typeof tableConfig.form>;
