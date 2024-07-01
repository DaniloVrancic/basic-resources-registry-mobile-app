import { Image, StyleSheet, Platform, SafeAreaView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  console.log(Platform.OS);
  return (
    
    <SafeAreaView style={styles.safeArea}>
      <ThemedText type='title'>Welcome to Home Screen (For fixed assets)</ThemedText>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 2,
    flexDirection: 'column'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
