import { MessagesSquare } from 'lucide-react-native';
import { View } from 'react-native';

import { BaseRecommendationCard } from '@/recommendations/base-recommendation-card';
import type {
  RecommendationCardProps,
  RecommendationDefinition,
} from '@/recommendations/types';
import type { ConsultationRecommendation } from '@/types/recommendation';
import { DetailPill } from './detail-pill';

function ConsultationCard({
  item,
  onPress,
}: RecommendationCardProps<ConsultationRecommendation>) {
  return (
    <BaseRecommendationCard
      icon={<MessagesSquare size={20} color="#b45309" />}
      tileClassName="bg-amber-500/15"
      label={consultationDefinition.label}
      title={item.title}
      subtitle={item.subtitle ?? item.astrologerName}
      ctaLabel={consultationDefinition.ctaLabel}
      onPress={onPress}
      accessory={
        item.isOnline ? (
          <View
            className="size-2.5 rounded-full bg-success"
            accessibilityLabel="Online now"
          />
        ) : null
      }
    >
      {item.pricePerMinute ? (
        <DetailPill>{`₹${item.pricePerMinute}/min`}</DetailPill>
      ) : null}
    </BaseRecommendationCard>
  );
}

export const consultationDefinition: RecommendationDefinition<'consultation'> =
  {
    type: 'consultation',
    label: 'Consultation',
    ctaLabel: 'Chat now',
    Card: ConsultationCard,
  };
