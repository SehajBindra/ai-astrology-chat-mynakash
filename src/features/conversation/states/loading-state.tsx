import { Spinner } from 'heroui-native';

import { StateView } from './state-view';

export function LoadingState() {
  return (
    <StateView icon={<Spinner size="lg" />} title="Loading conversation…" />
  );
}
