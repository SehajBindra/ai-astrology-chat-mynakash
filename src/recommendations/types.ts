import type { ComponentType } from 'react';

import type {
  Recommendation,
  RecommendationOfType,
  RecommendationType,
} from "@/types/recommendation";

export interface RecommendationCardProps<T extends Recommendation> {
  item: T;
  onPress(): void;
}

/**
 * Everything the app needs to know about one recommendation experience.
 * The chat never branches on `type`; it looks the definition up instead.
 */
export interface RecommendationDefinition<K extends RecommendationType> {
  type: K;
  /** Human readable category, e.g. "Gemstone". */
  label: string;
  /** Label for the primary action, e.g. "View gemstone". */
  ctaLabel: string;
  Card: ComponentType<RecommendationCardProps<RecommendationOfType<K>>>;
  /** Overrides the default press behaviour (analytics, deep links, ...). */
  onPress?(item: RecommendationOfType<K>): void;
}

/**
 * Mapped type: one definition per known type. Adding a member to
 * `KnownRecommendation` without registering it fails type-checking.
 */
export type RecommendationRegistry = {
  [K in RecommendationType]: RecommendationDefinition<K>;
};
