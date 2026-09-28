import { Sparkles } from 'lucide-react-native';

import type { UnknownRecommendation } from '@/types/recommendation';
import { BaseRecommendationCard } from '@/recommendations/base-recommendation-card';
import type { RecommendationCardProps } from '@/recommendations/types';

/** Renders recommendation types this app version does not know yet. */
export function FallbackCard({
  item,
  onPress,
}: RecommendationCardProps<UnknownRecommendation>) {
  return (
    <BaseRecommendationCard
      icon={<Sparkles size={20} color="#64748b" />}
      tileClassName="bg-default"
      label="Recommended"
      title={item.title}
      subtitle={item.subtitle}
      ctaLabel="Learn more"
      onPress={onPress}
    />
  );
}
