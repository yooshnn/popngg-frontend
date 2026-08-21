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
    medal: tableFields.medal,
    rank: tableFields.rank,
    score: tableFields.score,
  },
  sort: {
    initial: { key: 'level', order: 'desc' },
    options: ['level', 'score'],
  },
  pagination: {
    initial: { size: 20 },
    allowedSizes: [20, 50, 100],
  },
} as const satisfies TableConfig;

export type RecordsFormValues = FormDraftValues<typeof tableConfig.form>;
