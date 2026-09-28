import type { Message, MessageType } from "@/types/message";
import { dayKey, formatDayLabel } from "@/utils/date";

/** Where a message sits within a run of consecutive messages from one sender. */
export type GroupPosition = 'single' | 'first' | 'middle' | 'last';

export type TimelineItem =
  | { kind: 'date'; key: string; label: string }
  | {
      kind: 'message';
      key: string;
      messageId: string;
      messageType: MessageType;
      position: GroupPosition;
    };

/** Messages further apart than this start a new group. */
export const GROUP_WINDOW_MS = 5 * 60 * 1000;

/** Identifies "the same sender". System events never group. */
function senderKey(message: Message): string | null {
  switch (message.type) {
    case 'system':
      return null;
    case 'human':
      return `human:${message.author.name}`;
    default:
      return message.type;
  }
}

function belongTogether(a: Message, b: Message): boolean {
  const key = senderKey(a);
  if (key === null || key !== senderKey(b)) {
    return false;
  }
  const gap = Date.parse(b.createdAt) - Date.parse(a.createdAt);
  return gap >= 0 && gap <= GROUP_WINDOW_MS;
}

function positionOf(joinsPrevious: boolean, joinsNext: boolean): GroupPosition {
  if (joinsPrevious && joinsNext) {
    return 'middle';
  }
  if (joinsPrevious) {
    return 'last';
  }
  if (joinsNext) {
    return 'first';
  }
  return 'single';
}

/**
 * Turns chronological messages into the flat list the virtualized timeline
 * renders: date separators are inserted between days, and each message gets
 * a group position used to collapse avatars, spacing and bubble corners.
 *
 * Pure and framework-free so it is cheap to memoize.
 */
export function buildTimeline(
  messages: readonly Message[],
  now: Date = new Date(),
): TimelineItem[] {
  const items: TimelineItem[] = [];
  let currentDay: string | null = null;

  messages.forEach((message, index) => {
    const date = new Date(message.createdAt);
    const day = dayKey(date);

    if (day !== currentDay) {
      currentDay = day;
      items.push({
        kind: 'date',
        key: `date-${day}`,
        label: formatDayLabel(date, now),
      });
    }

    const previous = messages[index - 1];
    const next = messages[index + 1];
    const sameDay = (other?: Message) =>
      !!other && dayKey(new Date(other.createdAt)) === day;

    items.push({
      kind: 'message',
      key: message.id,
      messageId: message.id,
      messageType: message.type,
      position: positionOf(
        sameDay(previous) && belongTogether(previous!, message),
        sameDay(next) && belongTogether(message, next!),
      ),
    });
  });

  return items;
}
