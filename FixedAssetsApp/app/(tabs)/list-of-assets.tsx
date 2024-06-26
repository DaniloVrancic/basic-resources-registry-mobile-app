import { StyleSheet } from 'react-native';

import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SearchBarWithAdd from '@/components/SearchBarWithAdd';

export default function ListOfAssets() {
    return (
      
        <SafeAreaView style={styles.safeArea}>
          <SearchBarWithAdd 
          onAddClick={() => {console.log("List of assets default click")}} 
          filterChildren={null}
          renderAddButton={true}
          renderAdvancedFilterButton={true}
          />
          <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">List of Assets</ThemedText>
          </ThemedView>
        </SafeAreaView>


    )

    
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 2,
  },
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 12,
      padding: 6,
      textAlign: 'center'
    },
  });