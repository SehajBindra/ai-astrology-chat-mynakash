import { Chip } from 'heroui-native';
import { Gift } from 'lucide-react-native';

import { BaseRecommendationCard } from '@/recommendations/base-recommendation-card';
import type {
  RecommendationCardProps,
  RecommendationDefinition,
} from '@/recommendations/types';
import type { PromotionRecommendation } from '@/types/recommendation';
import { DetailPill } from './detail-pill';

function PromotionCard({
  item,
  onPress,
}: RecommendationCardProps<PromotionRecommendation>) {
  return (
    <BaseRecommendationCard
      icon={<Gift size={20} color="#e11d48" />}
      tileClassName="bg-rose-500/15"
      label={promotionDefinition.label}
      title={item.title}
      subtitle={item.subtitle}
      ctaLabel={promotionDefinition.ctaLabel}
      onPress={onPress}
      accessory={
        item.discountLabel ? (
          <Chip size="sm" color="danger" variant="soft">
            {item.discountLabel}
          </Chip>
        ) : null
      }
    >
      {item.code ? <DetailPill>{`Code ${item.code}`}</DetailPill> : null}
    </BaseRecommendationCard>
  );
}

export const promotionDefinition: RecommendationDefinition<'promotion'> = {
  type: 'promotion',
  label: 'Offer',
  ctaLabel: 'Claim offer',
  Card: PromotionCard,
};
