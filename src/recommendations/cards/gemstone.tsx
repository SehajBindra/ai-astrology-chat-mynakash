import { Gem } from 'lucide-react-native';

import { BaseRecommendationCard } from '@/recommendations/base-recommendation-card';
import type {
  RecommendationCardProps,
  RecommendationDefinition,
} from '@/recommendations/types';
import type { GemstoneRecommendation } from '@/types/recommendation';
import { DetailPill } from './detail-pill';

function GemstoneCard({
  item,
  onPress,
}: RecommendationCardProps<GemstoneRecommendation>) {
  return (
    <BaseRecommendationCard
      icon={<Gem size={20} color="#0284c7" />}
      tileClassName="bg-sky-500/15"
      label={gemstoneDefinition.label}
      title={item.title}
      subtitle={item.subtitle}
      ctaLabel={gemstoneDefinition.ctaLabel}
      onPress={onPress}
    >
      {item.planet ? (
        <DetailPill>{`Planet · ${item.planet}`}</DetailPill>
      ) : null}
    </BaseRecommendationCard>
  );
}

export const gemstoneDefinition: RecommendationDefinition<'gemstone'> = {
  type: 'gemstone',
  label: 'Gemstone',
  ctaLabel: 'View gemstone',
  Card: GemstoneCard,
};
