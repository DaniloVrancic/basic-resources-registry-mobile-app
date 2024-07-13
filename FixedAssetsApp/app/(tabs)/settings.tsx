import { StyleSheet } from 'react-native';

import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"

export default function Settings() {
    return (
        <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="settings" style={styles.headerImage} />}>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Settings</ThemedText>
        </ThemedView>
        </ParallaxScrollView>
    )

    
}

const styles = StyleSheet.create({
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute', //Always let the title stay in the same position
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 8,
      padding: 6,
      textAlign: 'center'
    },
  });