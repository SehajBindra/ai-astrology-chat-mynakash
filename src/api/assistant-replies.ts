import type { Recommendation } from "@/types/recommendation";

interface ReplyTemplate {
  keywords: string[];
  text: string;
  recommendations: Recommendation[];
}

const TEMPLATES: ReplyTemplate[] = [
  {
    keywords: ['love', 'relationship', 'marriage', 'partner'],
    text: 'Venus is well placed for you right now, and relationships benefit from honest conversations this month.',
    recommendations: [
      {
        id: 'love-1',
        type: 'tarot',
        title: 'Love Tarot Reading',
        cardCount: 3,
      },
      {
        id: 'love-2',
        type: 'gemstone',
        title: 'Diamond',
        subtitle: 'Strengthens Venus',
        planet: 'Venus',
      },
      {
        id: 'love-3',
        type: 'consultation',
        title: 'Relationship Expert',
        isOnline: true,
        pricePerMinute: 30,
      },
    ],
  },
  {
    keywords: ['money', 'finance', 'wealth', 'career', 'job', 'business'],
    text: 'Jupiter supports steady financial growth. Avoid impulsive decisions until the end of the month.',
    recommendations: [
      {
        id: 'money-1',
        type: 'gemstone',
        title: 'Yellow Sapphire',
        subtitle: 'Recommended for Jupiter',
        planet: 'Jupiter',
      },
      {
        id: 'money-2',
        type: 'remedy',
        title: 'Thursday Remedy',
        subtitle: 'Donate yellow lentils',
        day: 'Thursday',
        durationDays: 11,
      },
      {
        id: 'money-3',
        type: 'article',
        title: 'Jupiter Transit Explained',
        readTimeMinutes: 4,
      },
      {
        id: 'money-4',
        type: 'promotion',
        title: 'Wealth report at 50% off',
        discountLabel: '50% OFF',
        code: 'JUPITER',
      },
    ],
  },
  {
    keywords: ['health', 'stress', 'sleep', 'energy'],
    text: 'The Moon is sensitive in your chart this week. Rest and a steady routine will help more than anything else.',
    recommendations: [
      {
        id: 'health-1',
        type: 'remedy',
        title: 'Monday Remedy',
        subtitle: 'Offer water to Shiva',
        day: 'Monday',
        durationDays: 9,
      },
      {
        id: 'health-2',
        type: 'panchang',
        title: "Today's Panchang",
        tithi: 'Krishna Panchami',
        nakshatra: 'Hasta',
      },
    ],
  },
];

const FALLBACK: Omit<ReplyTemplate, 'keywords'> = {
  text: 'Thanks for sharing. Your chart shows a period of steady progress; a closer look at your dasha will tell us more.',
  recommendations: [
    {
      id: 'default-1',
      type: 'panchang',
      title: "Today's Panchang",
      tithi: 'Shukla Dashami',
      nakshatra: 'Pushya',
    },
    {
      id: 'default-2',
      type: 'consultation',
      title: 'Talk to an Astrologer',
      isOnline: true,
      pricePerMinute: 25,
    },
  ],
};

/** Picks a canned AI reply for the mock API based on keywords in the prompt. */
export function buildAssistantReply(prompt: string, idPrefix: string) {
  const normalized = prompt.toLowerCase();
  const template =
    TEMPLATES.find(t => t.keywords.some(k => normalized.includes(k))) ??
    FALLBACK;

  return {
    text: template.text,
    // Recommendation ids must be unique per message, not globally.
    recommendations: template.recommendations.map(r => ({
      ...r,
      id: `${idPrefix}-${r.id}`,
    })),
  };
}
