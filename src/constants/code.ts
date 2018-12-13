import { FunctionsErrorCode } from 'firebase-functions/lib/providers/https'

export const code: {
  ok: FunctionsErrorCode
  cancelled: FunctionsErrorCode
  unknown: FunctionsErrorCode
  invalidArgument: FunctionsErrorCode
  deadlineExceeded: FunctionsErrorCode
  notFound: FunctionsErrorCode
  alreadyExists: FunctionsErrorCode
  permissionDenied: FunctionsErrorCode
  resourceExhausted: FunctionsErrorCode
  failedPrecondition: FunctionsErrorCode
  aborted: FunctionsErrorCode
  outOfRange: FunctionsErrorCode
  unimplemented: FunctionsErrorCode
  internal: FunctionsErrorCode
  unavailable: FunctionsErrorCode
  dataLoss: FunctionsErrorCode
  unauthenticated: FunctionsErrorCode
} = {
  ok: 'ok',
  cancelled: 'cancelled',
  unknown: 'unknown',
  invalidArgument: 'invalid-argument',
  deadlineExceeded: 'deadline-exceeded',
  notFound: 'not-found',
  alreadyExists: 'already-exists',
  permissionDenied: 'permission-denied',
  resourceExhausted: 'resource-exhausted',
  failedPrecondition: 'failed-precondition',
  aborted: 'aborted',
  outOfRange: 'out-of-range',
  unimplemented: 'unimplemented',
  internal: 'internal',
  unavailable: 'unavailable',
  dataLoss: 'data-loss',
  unauthenticated: 'unauthenticated'
}
