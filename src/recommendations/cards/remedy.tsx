import { Flame } from 'lucide-react-native';

import { BaseRecommendationCard } from '@/recommendations/base-recommendation-card';
import type {
  RecommendationCardProps,
  RecommendationDefinition,
} from '@/recommendations/types';
import type { RemedyRecommendation } from '@/types/recommendation';
import { DetailPill } from './detail-pill';

function RemedyCard({
  item,
  onPress,
}: RecommendationCardProps<RemedyRecommendation>) {
  const detail = [item.day, item.durationDays && `${item.durationDays} days`]
    .filter(Boolean)
    .join(' · ');

  return (
    <BaseRecommendationCard
      icon={<Flame size={20} color="#ca8a04" />}
      tileClassName="bg-yellow-500/15"
      label={remedyDefinition.label}
      title={item.title}
      subtitle={item.subtitle}
      ctaLabel={remedyDefinition.ctaLabel}
      onPress={onPress}
    >
      {detail ? <DetailPill>{detail}</DetailPill> : null}
    </BaseRecommendationCard>
  );
}

export const remedyDefinition: RecommendationDefinition<'remedy'> = {
  type: 'remedy',
  label: 'Remedy',
  ctaLabel: 'Start remedy',
  Card: RemedyCard,
};
