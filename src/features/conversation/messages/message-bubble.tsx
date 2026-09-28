import type { ReactNode } from 'react';
import { View } from 'react-native';
import { tv, type VariantProps } from 'tailwind-variants';

import type { GroupPosition } from "@/features/conversation/timeline/build-timeline";

const bubble = tv({
  base: 'max-w-full rounded-3xl px-4 py-2.5',
  variants: {
    tone: {
      user: 'bg-accent',
      ai: 'border border-border bg-surface',
      human: 'border border-warning/40 bg-warning/10',
    },
    position: {
      single: '',
      first: '',
      middle: '',
      last: '',
    },
    failed: {
      true: 'opacity-70',
    },
  },
  // Flatten the corner that faces the sender's other messages in the group.
  compoundVariants: [
    { tone: 'user', position: ['first', 'middle'], class: 'rounded-br-md' },
    { tone: 'user', position: ['middle', 'last'], class: 'rounded-tr-md' },
    {
      tone: ['ai', 'human'],
      position: ['first', 'middle'],
      class: 'rounded-bl-md',
    },
    {
      tone: ['ai', 'human'],
      position: ['middle', 'last'],
      class: 'rounded-tl-md',
    },
  ],
});

type BubbleVariants = VariantProps<typeof bubble>;

interface MessageBubbleProps {
  tone: NonNullable<BubbleVariants['tone']>;
  position: GroupPosition;
  failed?: boolean;
  children: ReactNode;
}

export function MessageBubble({
  tone,
  position,
  failed,
  children,
}: MessageBubbleProps) {
  return <View className={bubble({ tone, position, failed })}>{children}</View>;
}
