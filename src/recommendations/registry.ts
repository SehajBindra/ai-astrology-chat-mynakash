import type { ComponentType } from 'react';

import type {
  Recommendation,
  RecommendationType,
} from "@/types/recommendation";
import { articleDefinition } from './cards/article';
import { consultationDefinition } from './cards/consultation';
import { FallbackCard } from './cards/fallback-card';
import { gemstoneDefinition } from './cards/gemstone';
import { panchangDefinition } from './cards/panchang';
import { promotionDefinition } from './cards/promotion';
import { remedyDefinition } from './cards/remedy';
import { tarotDefinition } from './cards/tarot';
import type { RecommendationCardProps, RecommendationRegistry } from './types';

/**
 * Single source of truth for recommendation experiences.
 *
 * To add a new experience:
 *   1. add its interface to `KnownRecommendation` (src/types/recommendation.ts)
 *   2. create `cards/<type>.tsx` exporting a card + definition
 *   3. register it here (the compiler enforces this step)
 */
export const recommendationRegistry: RecommendationRegistry = {
  gemstone: gemstoneDefinition,
  tarot: tarotDefinition,
  consultation: consultationDefinition,
  article: articleDefinition,
  promotion: promotionDefinition,
  panchang: panchangDefinition,
  remedy: remedyDefinition,
};

export function isKnownRecommendationType(
  type: string,
): type is RecommendationType {
  return Object.prototype.hasOwnProperty.call(recommendationRegistry, type);
}

export interface ResolvedRecommendation {
  label: string;
  ctaLabel: string;
  Card: ComponentType<RecommendationCardProps<Recommendation>>;
  onPress?(item: Recommendation): void;
}

const fallbackDefinition: ResolvedRecommendation = {
  label: 'Recommendation',
  ctaLabel: 'Learn more',
  Card: FallbackCard,
};

/**
 * Looks up how to render a recommendation, falling back to a generic card for
 * unknown types. This is the only place that widens the per-type generics:
 * the registry's mapped type guarantees `registry[item.type]` matches `item`.
 */
export function resolveRecommendation(
  item: Recommendation,
): ResolvedRecommendation {
  if (!isKnownRecommendationType(item.type)) {
    return fallbackDefinition;
  }
  return recommendationRegistry[item.type] as unknown as ResolvedRecommendation;
}
