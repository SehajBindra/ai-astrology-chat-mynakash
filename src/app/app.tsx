import '../../global.css';

import { HeroUINativeProvider } from 'heroui-native';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './navigation/root-navigator';

export default function App() {
  const isDark = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <HeroUINativeProvider>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <RootNavigator />
          </HeroUINativeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
