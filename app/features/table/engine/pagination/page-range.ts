export function getLastPage(total: number, size: number) {
  return Math.max(1, Math.ceil(total / size));
}

export function clampPage(page: number, total: number, size: number) {
  return Math.min(page, getLastPage(total, size));
}
