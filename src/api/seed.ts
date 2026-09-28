import type { Message } from "@/types/message";

const minutes = (n: number) => n * 60 * 1000;

/**
 * Initial conversation. Messages `1`–`4` are the payload from the assignment,
 * extended with `createdAt`, `status` and `author`. The earlier session exists
 * to demonstrate date separators and more recommendation types.
 *
 * Timestamps are relative to `now` so "Today" / "Yesterday" stay meaningful.
 */
export function createSeedConversation(now: Date = new Date()): Message[] {
  const today = now.getTime();
  const yesterday = today - minutes(60 * 24);

  return [
    {
      id: 'y1',
      type: 'system',
      text: 'Your session with AI Astrologer has started.',
      createdAt: new Date(yesterday - minutes(12)).toISOString(),
    },
    {
      id: 'y2',
      type: 'user',
      text: 'What does this week look like for me?',
      status: 'sent',
      createdAt: new Date(yesterday - minutes(11)).toISOString(),
    },
    {
      id: 'y3',
      type: 'ai',
      text: 'The Moon moves through your 10th house this week, so visibility at work is high. Start new things before Thursday.',
      createdAt: new Date(yesterday - minutes(10)).toISOString(),
      recommendations: [
        {
          id: 'y3-1',
          type: 'panchang',
          title: "Today's Panchang",
          tithi: 'Shukla Tritiya',
          nakshatra: 'Rohini',
        },
        {
          id: 'y3-2',
          type: 'remedy',
          title: 'Saturday Remedy',
          subtitle: 'Offer mustard oil to Shani Dev',
          day: 'Saturday',
          durationDays: 7,
        },
        {
          id: 'y3-3',
          type: 'promotion',
          title: 'First consultation free',
          subtitle: 'For new users this week',
          discountLabel: '100% OFF',
          code: 'FIRST',
        },
      ],
    },
    {
      id: 'y4',
      type: 'system',
      text: 'Session ended.',
      createdAt: new Date(yesterday - minutes(2)).toISOString(),
    },
    {
      id: '1',
      type: 'system',
      text: 'Your session with AI Astrologer has started.',
      createdAt: new Date(today - minutes(6)).toISOString(),
    },
    {
      id: '2',
      type: 'user',
      text: 'Can you tell me about my career this year?',
      status: 'sent',
      createdAt: new Date(today - minutes(5)).toISOString(),
    },
    {
      id: '3',
      type: 'ai',
      text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
      createdAt: new Date(today - minutes(4)).toISOString(),
      recommendations: [
        {
          id: '1',
          type: 'gemstone',
          title: 'Blue Sapphire',
          subtitle: 'Recommended for Saturn',
          planet: 'Saturn',
        },
        {
          id: '2',
          type: 'tarot',
          title: 'Career Tarot Reading',
          cardCount: 3,
        },
        {
          id: '3',
          type: 'consultation',
          title: 'Talk to an Astrologer',
          isOnline: true,
          pricePerMinute: 25,
        },
        {
          id: '4',
          type: 'article',
          title: 'Understanding Saturn Mahadasha',
          readTimeMinutes: 6,
        },
      ],
    },
    {
      id: '4',
      type: 'human',
      text: 'I also recommend focusing on your upcoming Jupiter transit.',
      author: { name: 'Acharya Rohan' },
      createdAt: new Date(today - minutes(3)).toISOString(),
    },
  ];
}
