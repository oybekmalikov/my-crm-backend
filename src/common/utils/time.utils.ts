/** Parse 'HH:mm' to total minutes from midnight. */
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

/**
 * Calculate how many minutes late a student arrived relative to lesson start.
 * Returns 0 when on time or early.
 */
export function calculateLateMinutes(
  lessonStartTime: string,
  arrivedAt: Date = new Date(),
): number {
  const lessonStart = timeToMinutes(lessonStartTime);
  const arrivedMinutes = arrivedAt.getHours() * 60 + arrivedAt.getMinutes();
  const diff = arrivedMinutes - lessonStart;
  return diff > 0 ? diff : 0;
}
