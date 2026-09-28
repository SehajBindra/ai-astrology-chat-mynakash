import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface StateViewProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
}

/** Shared layout for full-screen loading / empty / error states. */
export function StateView({
  icon,
  title,
  description,
  children,
}: StateViewProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-10">
      {icon}
      <Text className="text-center text-lg font-semibold text-foreground">
        {title}
      </Text>
      {description ? (
        <Text className="text-center text-sm text-muted">{description}</Text>
      ) : null}
      {children}
    </View>
  );
}
