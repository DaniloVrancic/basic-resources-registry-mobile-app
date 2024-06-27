import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBarWithAdd from '@/components/SearchBarWithAdd';
import { SetStateAction, useCallback, useState } from 'react';
import Thumb from '@/components/slider_components/Thumb';
import Rail from '@/components/slider_components/Rail';
import RailSelected from '@/components/slider_components/RailSelected';
import Label from '@/components/slider_components/Label';
import Notch from '@/components/slider_components/Notch';
import { InventoryListSearchCriteria } from '../search_criteria_interfaces/inventory-list-search-criteria';
import { useThemeColor } from '@/hooks/useThemeColor';
import CheckBox from '@react-native-community/checkbox';

export default function ListOfAssets() {
  return (
    
      <SafeAreaView style={styles.safeArea}>
          <ThemedView style={{flex: 18}}>
            <SearchBarWithAdd
              onAddClick={() => { console.log("Location default click") }}
              filterChildren={listOfAssetsAdvancedFiltering()}
              renderAddButton={true}
              renderAdvancedFilterButton={true}
            />
          </ThemedView>
          <ThemedView style={[styles.titleContainer, {flex:12}]}>
            <ThemedText type="title">Location</ThemedText>
          </ThemedView>
          <ThemedView style={{backgroundColor: 'lime', flex: 80}}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {/* Replace the content below with your actual list components */}
              <ThemedView style={{paddingVertical: 30}}>
                <ThemedText style={{color: 'red'}}>Employee 1 -&gt Employee 2</ThemedText>
                <ThemedText style={{color: 'red'}}>Location 1 -&gt Location 2</ThemedText>
              </ThemedView>
              <ThemedView style={{paddingVertical: 30}}>
                <ThemedText style={{color: 'red'}}>Employee 5 -&gt Employee 3</ThemedText>
                <ThemedText style={{color: 'red'}}>Location 2 -&gt Location 3</ThemedText>
              </ThemedView>
              <ThemedView style={{paddingVertical: 30}}>
                <ThemedText style={{color: 'red'}}>Employee 6 -&gt Employee 1</ThemedText>
                <ThemedText style={{color: 'red'}}>Location 6 -&gt Location 2</ThemedText>
              </ThemedView>
              <ThemedView style={{paddingVertical: 30}}>
                <ThemedText style={{color: 'red'}}>Employee 21 -&gt Employee 5</ThemedText>
                <ThemedText style={{color: 'red'}}>Location 3 -&gt Location 7</ThemedText>
              </ThemedView>
              <ThemedView style={{paddingVertical: 30}}>
                <ThemedText style={{color: 'red'}}>Employee 7 -&gt Employee 1</ThemedText>
                <ThemedText style={{color: 'red'}}>Location 5 -&gt Location 8</ThemedText>
              </ThemedView>
              <ThemedView style={{paddingVertical: 30}}>
                <ThemedText style={{color: 'red'}}>Employee 1 -&gt Employee 8</ThemedText>
                <ThemedText style={{color: 'red'}}>Location 6 -&gt Location 12</ThemedText>
              </ThemedView>
              {/* Add more employees or your dynamic list here */}
        </ScrollView>
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
    advancedFilterContainer: {
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 16,
      color: 'ghostwhite',
      borderColor: 'ghostwhite'
    },
    advancedFilterInput: {
      height: 40, // Maintain height or adjust as necessary
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 8, // Horizontal padding is usually fine
      paddingVertical: 5, // Don't increase to avoid text clipping
      color: 'white',
      backgroundColor: 'rgba(0,0,0,0.8)'
    },
    advancedFilterLabel: {
      marginBottom: 8,
      fontSize: 16,
      fontWeight: 'bold',
    },
    advancedFilterSlider: {
      flex: 1,
      marginHorizontal: 8,
    },
    advancedFilterSliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    advancedFilterButton: {
      flexDirection: 'row',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgb(106, 27, 154)', // Blue-purple color
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    advancedFilterButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    scrollViewContent: {
      padding: 10,
      // Add additional styling as needed
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    checkboxLabel: {
      marginRight: 10,
    },
  });

  function listOfAssetsAdvancedFiltering() {
    const currentSearchCriteria: InventoryListSearchCriteria = {isChangingEmployee: true, isChangingLocation: true};

    
    const [searchChangingEmployee, setSearchChangingEmployee] = useState(currentSearchCriteria.isChangingEmployee);
    const [searchChangingLocation, setSearchChangingLocation] = useState(currentSearchCriteria.isChangingLocation);
    const [keywordToSearch, setKeywordToSearch] = useState("");

    const textColor = useThemeColor({}, 'text');
  
    const handleNameChange = (newName: string) => {
      setKeywordToSearch(newName);
    };
  
    
  
  
  const renderThumb = useCallback(() => <Thumb name={"Income range"}/>, []);
  const renderRail = useCallback(() => <Rail/>, []);
  const renderRailSelected = useCallback(() => <RailSelected/>, []);
  const renderLabel = useCallback((value: any) => <Label text={value}/>, []);
  const renderNotch = useCallback(() => <Notch/>, []);
  const [rangeDisabled, setRangeDisabled] = useState(false);
  const [floatingLabel, setFloatingLabel] = useState(false);
  

  const handleValueChange = useCallback((low: SetStateAction<number>, high: SetStateAction<number>) => {
    
  }, []);
  
  const advancedFilter = () => {
    // Implement the advanced filter logic here
    console.log('Advanced filter applied:', currentSearchCriteria);
  };
  
  
  
    return (
  
      <ThemedView style={[styles.advancedFilterContainer]}>
        <ThemedText style={[styles.advancedFilterLabel]}>Name:</ThemedText>
        <TextInput
          style={[styles.advancedFilterInput, {paddingHorizontal: 5}]}
          placeholder="Search by name of employee..."
          value={keywordToSearch}
          onChangeText={handleNameChange}
          placeholderTextColor={'rgba(160, 160, 160, 1)'}
        />
        <ThemedText style={[styles.advancedFilterLabel]}>Filters:</ThemedText>
        
        <ThemedView style={styles.checkboxContainer}>
        <ThemedText style={styles.checkboxLabel}>Changing Employee</ThemedText>
        <CheckBox
          value={searchChangingEmployee}
          //onValueChange={setSearchChangingEmployee}
        />
      </ThemedView>
  
      <ThemedView style={styles.checkboxContainer}>
        <ThemedText style={styles.checkboxLabel}>Changing Location</ThemedText>
        <CheckBox
          value={searchChangingLocation}
          //onValueChange={setSearchChangingLocation}
        />

      </ThemedView>
        <Pressable style={styles.advancedFilterButton} onPress={advancedFilter}>
          <Ionicons style={{paddingHorizontal: 6}} name="filter" size={24} color={'ghostwhite'} />
          <ThemedText style={styles.advancedFilterButtonText}>Apply Filter</ThemedText>
        </Pressable>
      </ThemedView>
    )
  }