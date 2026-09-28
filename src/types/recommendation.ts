/**
 * Recommendation payloads attached to AI messages.
 *
 * Every known type extends `RecommendationBase` with a literal `type`, which
 * makes `KnownRecommendation` a discriminated union. Adding a new experience
 * means adding an interface here and a definition in the recommendation
 * registry; the registry is typed so the compiler flags any type that is
 * missing a renderer.
 */
interface RecommendationBase<T extends string> {
  id: string;
  type: T;
  title: string;
  subtitle?: string;
}

export interface GemstoneRecommendation extends RecommendationBase<'gemstone'> {
  planet?: string;
  priceLabel?: string;
}

export interface TarotRecommendation extends RecommendationBase<'tarot'> {
  cardCount?: number;
}

export interface ConsultationRecommendation
  extends RecommendationBase<'consultation'> {
  astrologerName?: string;
  pricePerMinute?: number;
  isOnline?: boolean;
}

export interface ArticleRecommendation extends RecommendationBase<'article'> {
  readTimeMinutes?: number;
}

export interface PromotionRecommendation
  extends RecommendationBase<'promotion'> {
  discountLabel?: string;
  code?: string;
}

export interface PanchangRecommendation extends RecommendationBase<'panchang'> {
  tithi?: string;
  nakshatra?: string;
}

export interface RemedyRecommendation extends RecommendationBase<'remedy'> {
  day?: string;
  durationDays?: number;
}

export type KnownRecommendation =
  | GemstoneRecommendation
  | TarotRecommendation
  | ConsultationRecommendation
  | ArticleRecommendation
  | PromotionRecommendation
  | PanchangRecommendation
  | RemedyRecommendation;

export type RecommendationType = KnownRecommendation['type'];

/**
 * A recommendation whose `type` this app version does not know yet (e.g. the
 * backend shipped a new experience before the app did). It still renders via
 * the fallback card instead of crashing.
 */
export interface UnknownRecommendation {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
}

export type Recommendation = KnownRecommendation | UnknownRecommendation;

export type RecommendationOfType<T extends RecommendationType> = Extract<
  KnownRecommendation,
  { type: T }
>;
