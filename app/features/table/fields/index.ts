import { difficultyField } from './difficulty';
import { levelField } from './level';
import { medalField } from './medal';
import { rankField } from './rank';
import { scoreField } from './score';
import { versionField } from './version';

export { difficultyField } from './difficulty';
export { NumberInput, type NumberInputProps } from './inputs/number-input';
export {
  RangeFieldLayout,
  type RangeFieldLayoutProps,
} from './inputs/range-field-layout';
export {
  SelectInput,
  type SelectInputOption,
  type SelectInputProps,
} from './inputs/select-input';
export { levelField } from './level';
export { medalField } from './medal';
export { compactRange, type RangeFieldDefinition } from './range';
export { rankField } from './rank';
export { scoreField } from './score';
export {
  canonicalizeSelection,
  type GroupedSelectionFieldDefinition,
  type SelectionFieldDefinition,
  type SelectionGroup,
  toggleGroup,
  toggleSelection,
} from './selection';
export {
  NO_VERSION,
  type VersionDraft,
  versionField,
  type VersionFieldDefinition,
} from './version';

/** The filter fields shared by every chart-and-record table. */
export const tableFields = {
  version: versionField,
  level: levelField,
  difficulty: difficultyField,
  medal: medalField,
  rank: rankField,
  score: scoreField,
} as const;
