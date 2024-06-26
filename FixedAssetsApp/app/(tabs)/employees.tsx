import { StyleSheet } from 'react-native';

import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from 'react-native-screens';
import SearchBarWithAdd from '@/components/SearchBarWithAdd';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Employees() {
    return (
      <GestureHandlerRootView>
        <SafeAreaView style={styles.safeArea}>
          <SearchBarWithAdd onAddClick={() => {console.log("Employees default click")}} filterChildren={null}/>
          <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Employees</ThemedText>
          </ThemedView>
        </SafeAreaView>
      </GestureHandlerRootView>
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
      padding: 3
    },
    
  });