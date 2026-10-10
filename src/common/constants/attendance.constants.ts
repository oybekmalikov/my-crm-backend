export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  PENDING: 'pending',
  LATE: 'late',
} as const;

export const ATTENDANCE_STATUS_VALUES = Object.values(ATTENDANCE_STATUS);

/** Maps legacy status values to the canonical set used at runtime. */
export function normalizeAttendanceStatus(status: string): string {
  const map: Record<string, string> = {
    participate: ATTENDANCE_STATUS.PRESENT,
    did_not_participate: ATTENDANCE_STATUS.ABSENT,
    present: ATTENDANCE_STATUS.PRESENT,
    absent: ATTENDANCE_STATUS.ABSENT,
    pending: ATTENDANCE_STATUS.PENDING,
    late: ATTENDANCE_STATUS.LATE,
  };
  return map[status] ?? status;
}

export const ATTENDANCE_THRESHOLD_PERCENT = 75;
export const CONSECUTIVE_ABSENCE_WARNING = 3;
