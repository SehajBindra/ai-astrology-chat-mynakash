import { memo } from 'react';
import { ScrollView } from 'react-native';

import type { Recommendation } from "@/types/recommendation";
import { RECOMMENDATION_CARD_WIDTH } from './base-recommendation-card';
import { handleRecommendationPress } from './handle-recommendation-press';
import { resolveRecommendation } from './registry';

const GAP = 10;

interface RecommendationRailProps {
  recommendations: readonly Recommendation[];
}

/**
 * Horizontally scrolling cards attached to an AI message. The rail knows
 * nothing about individual types; it asks the registry for each card.
 *
 * A plain ScrollView is used on purpose: a message carries a handful of
 * cards, and the timeline around it is already virtualized.
 */
export const RecommendationRail = memo(function RecommendationRailInner({
  recommendations,
}: RecommendationRailProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={RECOMMENDATION_CARD_WIDTH + GAP}
      snapToAlignment="start"
      className="mt-2 self-stretch"
      contentContainerClassName="gap-2.5 pr-4"
      accessibilityLabel="Recommendations"
    >
      {recommendations.map(item => {
        const { Card } = resolveRecommendation(item);
        return (
          <Card
            key={item.id}
            item={item}
            onPress={() => handleRecommendationPress(item)}
          />
        );
      })}
    </ScrollView>
  );
});
