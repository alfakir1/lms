export type ApiEnvelope<T> = {
  status: 'success' | 'error' | (string & {});
  data: T;
  message?: string;
  meta?: unknown;
};

export class ApiResponseError extends Error {
  readonly status: string;
  readonly meta?: unknown;

  constructor(message: string, status: string, meta?: unknown) {
    super(message);
    this.name = 'ApiResponseError';
    this.status = status;
    this.meta = meta;
  }
}

function isEnvelope(payload: unknown): payload is ApiEnvelope<unknown> {
  return (
    !!payload &&
    typeof payload === 'object' &&
    'status' in payload &&
    'data' in payload &&
    typeof (payload as any).status === 'string'
  );
}

/**
 * STRICT backend envelope unwrap:
 * - Rejects non-envelope responses
 * - Throws if `status !== "success"`
 */
export function unwrapApi<T>(payload: unknown): T {
  if (!isEnvelope(payload)) {
    throw new ApiResponseError('Invalid API response envelope.', 'invalid_envelope');
  }

  if (payload.status !== 'success') {
    throw new ApiResponseError(payload.message || 'Request failed.', payload.status, payload.meta);
  }

  return payload.data as T;
}
