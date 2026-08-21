import type { TableConfig } from '~/features/table';
import { parseAsString } from 'nuqs';
import { singleKeyBinding } from '~/features/table';

export const tableConfig = {
  filter: {
    search: singleKeyBinding('q', parseAsString),
  },
  sort: {
    initial: { key: 'rank', order: 'asc' },
    options: ['rank', 'name', 'clearLevel', 'updatedAt'],
  },
  pagination: {
    initial: { size: 20 },
    allowedSizes: [20, 50, 100],
  },
} as const satisfies TableConfig;
