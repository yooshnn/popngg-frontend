import type { CompiledTableConfig } from './compile-table-config';
import { writeBinding } from './core/url-binding';
import { readAppliedValue } from './form/field-config';
import { resolvePaginationState } from './pagination/use-table-pagination';
import { resolveSortState } from './sort/use-table-sort';

/** Builds canonical request params without leaking unrelated URL keys. */
export function buildTableParams(
  compiled: CompiledTableConfig,
  values: Record<string, unknown>,
): URLSearchParams {
  const params = new URLSearchParams();

  for (const binding of Object.values(compiled.filter ?? {})) {
    writeBinding(params, binding, binding.read(values));
  }

  for (const field of Object.values(compiled.form ?? {})) {
    writeBinding(
      params,
      field.binding,
      readAppliedValue(field, field.binding.read(values)),
    );
  }

  if (compiled.sort) {
    const resolved = resolveSortState(compiled.sort, values);
    writeBinding(params, compiled.sort.key, resolved.key);
    writeBinding(params, compiled.sort.order, resolved.order);
  }

  if (compiled.pagination) {
    const resolved = resolvePaginationState(compiled.pagination, values);
    writeBinding(params, compiled.pagination.page, resolved.page);
    writeBinding(params, compiled.pagination.size, resolved.size);
  }

  return params;
}
