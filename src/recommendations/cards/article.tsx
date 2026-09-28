import { BookOpen } from 'lucide-react-native';

import { BaseRecommendationCard } from '@/recommendations/base-recommendation-card';
import type {
  RecommendationCardProps,
  RecommendationDefinition,
} from '@/recommendations/types';
import type { ArticleRecommendation } from '@/types/recommendation';
import { DetailPill } from './detail-pill';

function ArticleCard({
  item,
  onPress,
}: RecommendationCardProps<ArticleRecommendation>) {
  return (
    <BaseRecommendationCard
      icon={<BookOpen size={20} color="#059669" />}
      tileClassName="bg-emerald-500/15"
      label={articleDefinition.label}
      title={item.title}
      subtitle={item.subtitle}
      ctaLabel={articleDefinition.ctaLabel}
      onPress={onPress}
    >
      {item.readTimeMinutes ? (
        <DetailPill>{`${item.readTimeMinutes} min read`}</DetailPill>
      ) : null}
    </BaseRecommendationCard>
  );
}

export const articleDefinition: RecommendationDefinition<'article'> = {
  type: 'article',
  label: 'Article',
  ctaLabel: 'Read',
  Card: ArticleCard,
};
