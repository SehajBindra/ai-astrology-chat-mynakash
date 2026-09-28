let counter = 0;

/** Collision-safe enough for client-generated ids within a session. */
export function createId(prefix = 'local'): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}
