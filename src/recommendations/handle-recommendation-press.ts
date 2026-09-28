import { Alert } from 'react-native';

import type { Recommendation } from "@/types/recommendation";
import { resolveRecommendation } from './registry';

/**
 * Single entry point for recommendation taps. Today it shows an Alert; this
 * is where analytics and deep-link navigation would be added, once for all
 * card types.
 */
export function handleRecommendationPress(item: Recommendation) {
  const definition = resolveRecommendation(item);
  if (definition.onPress) {
    definition.onPress(item);
    return;
  }
  Alert.alert(item.title, `${definition.label} · ${definition.ctaLabel}`);
}
