import { MoonStar } from 'lucide-react-native';

import { BaseRecommendationCard } from '@/recommendations/base-recommendation-card';
import type {
  RecommendationCardProps,
  RecommendationDefinition,
} from '@/recommendations/types';
import type { TarotRecommendation } from '@/types/recommendation';
import { DetailPill } from './detail-pill';

function TarotCard({
  item,
  onPress,
}: RecommendationCardProps<TarotRecommendation>) {
  return (
    <BaseRecommendationCard
      icon={<MoonStar size={20} color="#7c3aed" />}
      tileClassName="bg-violet-500/15"
      label={tarotDefinition.label}
      title={item.title}
      subtitle={item.subtitle}
      ctaLabel={tarotDefinition.ctaLabel}
      onPress={onPress}
    >
      {item.cardCount ? (
        <DetailPill>{`${item.cardCount}-card spread`}</DetailPill>
      ) : null}
    </BaseRecommendationCard>
  );
}

export const tarotDefinition: RecommendationDefinition<'tarot'> = {
  type: 'tarot',
  label: 'Tarot Reading',
  ctaLabel: 'Draw cards',
  Card: TarotCard,
};
