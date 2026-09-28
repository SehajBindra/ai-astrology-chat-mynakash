const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar day, e.g. `2026-09-27`. */
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

/** "Today", "Yesterday", or e.g. "Mon, 22 Sep" (year added when it differs). */
export function formatDayLabel(date: Date, now: Date): string {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (dayKey(date) === dayKey(now)) {
    return 'Today';
  }
  if (dayKey(date) === dayKey(yesterday)) {
    return 'Yesterday';
  }
  const label = `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${
    MONTHS[date.getMonth()]
  }`;
  return date.getFullYear() === now.getFullYear()
    ? label
    : `${label} ${date.getFullYear()}`;
}

/** e.g. "9:05 PM". Formatted by hand to avoid Intl differences across engines. */
export function formatTime(date: Date): string {
  const hours = date.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${pad(date.getMinutes())} ${suffix}`;
}
