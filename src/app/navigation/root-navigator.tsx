import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useThemeColor } from 'heroui-native';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { ConversationScreen } from "@/features/conversation/screens/conversation-screen";
import { DemoMenu } from "@/features/demo/demo-menu";
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const renderDemoMenu = () => <DemoMenu />;

/** Keeps React Navigation's chrome in sync with the HeroUI / Uniwind theme tokens. */
function useNavigationTheme(): Theme {
  const isDark = useColorScheme() === 'dark';
  const [background, foreground, border, accent] = useThemeColor([
    'background',
    'foreground',
    'border',
    'accent',
  ]);

  return useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background,
        card: background,
        text: foreground,
        border,
        primary: accent,
      },
    };
  }, [isDark, background, foreground, border, accent]);
}

export function RootNavigator() {
  const theme = useNavigationTheme();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Conversation"
          component={ConversationScreen}
          options={{ title: 'AI Astrologer', headerRight: renderDemoMenu }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
