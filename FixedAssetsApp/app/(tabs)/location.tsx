import { StyleSheet } from 'react-native';

import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Location() {
    return (
      <SafeAreaView>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Location</ThemedText>
        </ThemedView>
      </SafeAreaView>
        
    )

    
}

const styles = StyleSheet.create({
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 8,
    },
  });