export class ApiShapeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiShapeError';
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function ensureRecord(value: unknown, message = 'Expected object.'): Record<string, unknown> {
  if (!isRecord(value)) throw new ApiShapeError(message);
  return value;
}

export function ensureArray<T = unknown>(value: unknown, message = 'Expected array.'): T[] {
  if (!Array.isArray(value)) throw new ApiShapeError(message);
  return value as T[];
}

export function ensureString(value: unknown, message = 'Expected string.'): string {
  if (typeof value !== 'string') throw new ApiShapeError(message);
  return value;
}

export function ensureNumber(value: unknown, message = 'Expected number.'): number {
  if (typeof value !== 'number' || Number.isNaN(value)) throw new ApiShapeError(message);
  return value;
}

export function ensurePaginated<T>(value: unknown, itemGuard?: (v: unknown) => v is T): {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
} {
  const obj = ensureRecord(value, 'Expected paginated object.');
  const data = ensureArray(obj.data, 'Expected paginated `data` array.');

  if (itemGuard) {
    for (const item of data) {
      if (!itemGuard(item)) throw new ApiShapeError('Invalid item in paginated data.');
    }
  }

  return {
    data: data as T[],
    current_page: ensureNumber(obj.current_page, 'Expected `current_page` number.'),
    last_page: ensureNumber(obj.last_page, 'Expected `last_page` number.'),
    per_page: ensureNumber(obj.per_page, 'Expected `per_page` number.'),
    total: ensureNumber(obj.total, 'Expected `total` number.'),
  };
}

