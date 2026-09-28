import { Card, PressableFeedback } from 'heroui-native';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

/** Keep in sync with the `w-[200px]` class below (used for snapping). */
export const RECOMMENDATION_CARD_WIDTH = 200;

interface BaseRecommendationCardProps {
  /** Lucide icon element shown in the tile, e.g. `<Flame size={20} />`. */
  icon: ReactNode;
  /** Tailwind background class for the icon tile, e.g. `bg-sky-500/15`. */
  tileClassName: string;
  label: string;
  title: string;
  subtitle?: string;
  ctaLabel: string;
  onPress(): void;
  /** Type-specific details rendered between the subtitle and the CTA. */
  children?: ReactNode;
  /** Optional element pinned to the top-right corner (badges, status). */
  accessory?: ReactNode;
}

/**
 * Shared shell for every recommendation card: consistent size, press
 * feedback and accessibility. Type-specific cards only fill in details.
 */
export function BaseRecommendationCard({
  icon,
  tileClassName,
  label,
  title,
  subtitle,
  ctaLabel,
  onPress,
  children,
  accessory,
}: BaseRecommendationCardProps) {
  return (
    <PressableFeedback
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${title}. ${ctaLabel}`}
      className="w-[200px] rounded-3xl"
    >
      <PressableFeedback.Highlight />
      <Card className="flex-1 gap-3 p-3.5">
        <Card.Header className="flex-row items-start justify-between">
          <View
            className={`size-10 items-center justify-center rounded-2xl ${tileClassName}`}
          >
            {icon}
          </View>
          {accessory}
        </Card.Header>
        <Card.Body className="gap-1">
          <Text className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            {label}
          </Text>
          <Card.Title numberOfLines={2} className="text-[15px] leading-5">
            {title}
          </Card.Title>
          {subtitle ? (
            <Card.Description numberOfLines={2} className="text-xs">
              {subtitle}
            </Card.Description>
          ) : null}
          {children}
        </Card.Body>
        <Card.Footer>
          <Text className="text-[13px] font-semibold text-accent">
            {ctaLabel} →
          </Text>
        </Card.Footer>
      </Card>
    </PressableFeedback>
  );
}
