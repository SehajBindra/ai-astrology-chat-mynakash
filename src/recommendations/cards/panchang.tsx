import { CalendarDays } from 'lucide-react-native';
import { Text } from 'react-native';

import { BaseRecommendationCard } from '@/recommendations/base-recommendation-card';
import type {
  RecommendationCardProps,
  RecommendationDefinition,
} from '@/recommendations/types';
import type { PanchangRecommendation } from '@/types/recommendation';

function PanchangCard({
  item,
  onPress,
}: RecommendationCardProps<PanchangRecommendation>) {
  return (
    <BaseRecommendationCard
      icon={<CalendarDays size={20} color="#ea580c" />}
      tileClassName="bg-orange-500/15"
      label={panchangDefinition.label}
      title={item.title}
      subtitle={item.subtitle}
      ctaLabel={panchangDefinition.ctaLabel}
      onPress={onPress}
    >
      {item.tithi ? (
        <Text className="text-xs text-muted">{`Tithi · ${item.tithi}`}</Text>
      ) : null}
      {item.nakshatra ? (
        <Text className="text-xs text-muted">{`Nakshatra · ${item.nakshatra}`}</Text>
      ) : null}
    </BaseRecommendationCard>
  );
}

export const panchangDefinition: RecommendationDefinition<'panchang'> = {
  type: 'panchang',
  label: 'Panchang',
  ctaLabel: 'See full day',
  Card: PanchangCard,
};
