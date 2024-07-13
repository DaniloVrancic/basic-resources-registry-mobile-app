import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from "../../components/ThemedText"
import { ThemedView } from "../..//components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBarWithAdd from '../../components/SearchBarWithAdd';
import { SetStateAction, Suspense, useCallback, useEffect, useState } from 'react';
import { useThemeColor } from '../../hooks/useThemeColor';
import Thumb from '../../components/slider_components/Thumb';
import Rail from '../../components/slider_components/Rail';
import RailSelected from '../../components/slider_components/RailSelected';
import Label from '../../components/slider_components/Label';
import Notch from '../../components/slider_components/Notch';
import RnRangeSlider from 'rn-range-slider';
import LocationCard from '../../components/LocationCard';
import MapView from 'react-native-maps';
import LoadingAnimation from '@/components/fallback/LoadingAnimation';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { getAllLocations } from '@/db/db';
import { Location } from '../data_interfaces/location';

let db: SQLiteDatabase;
export default function Locations() {

  db = useSQLiteContext();
  const [loadedLocations, setLoadedLocations] = useState([]);

  useEffect(() => {
    loadLocationsFromDatabase(db);
  }, []);

  const loadLocationsFromDatabase = async (db: SQLiteDatabase) => {
    try {
      setLoadedLocations(await getAllLocations(db));
    } catch (error) {
      console.error('Error loading locations: ', error);
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>
          <ThemedView style={{flex: 18}}>
            <SearchBarWithAdd
              onAddClick={() => { console.log("Location default click") }}
              filterChildren={locationAdvancedFiltering()}
              renderAddButton={true}
              renderAdvancedFilterButton={true}
            />
          </ThemedView>
          <ThemedView style={[styles.titleContainer, {flex:12, paddingHorizontal: 12}]}>
            <ThemedText type="title">Location</ThemedText>
          </ThemedView>
          <ThemedView style={{backgroundColor: 'lime', flex: 80}}>

          <Suspense fallback={<LoadingAnimation text="Loading data..." />}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* Replace the content below with your actual list components */}
                {
                 loadedLocations.map((location: Location) => 
                  <LocationCard key={location.id} {...location}/>
                )}
                {/* Add more employees or your dynamic list here */}
              </ScrollView>
          </Suspense>
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
      textAlign: 'center',
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
    advancedFilterSlider: { //slider going to be seperated from other elements
      flex: 1,
      marginHorizontal: 8,
    },
    advancedFilterSliderContainer: { //center all elements inside slider
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    advancedFilterButton: { //center the button and assign color to it
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
  });



  function locationAdvancedFiltering() {
    const currentSearchCriteria: LocationSearchCriteria = {city: "", sizeMin: 0, sizeMax: 1000};
    const [searchCriteria, setSearchCriteria] = useState(currentSearchCriteria);
    const [cityName, setCityName] = useState(currentSearchCriteria.city);
    const [minSize, setMinSize] = useState(currentSearchCriteria.sizeMin);
    const [maxSize, setMaxSize] = useState(currentSearchCriteria.sizeMax); // Assume a maximum income of 8000 for the slider
  
    const textColor = useThemeColor({}, 'text');
  
    const handleNameChange = (newName: string) => {
      setCityName(newName)
      searchCriteria.city = newName;
    };
  
    
  
  
  const renderThumb = useCallback(() => <Thumb name={"Area size"}/>, []);
  const renderRail = useCallback(() => <Rail/>, []);
  const renderRailSelected = useCallback(() => <RailSelected/>, []);
  const renderLabel = useCallback((value: any) => <Label text={value}/>, []);
  const renderNotch = useCallback(() => <Notch/>, []);
  const [rangeDisabled, setRangeDisabled] = useState(false);
  const [floatingLabel, setFloatingLabel] = useState(false);
  
  const handleValueChange = useCallback((low: SetStateAction<number>, high: SetStateAction<number>) => {
    setMinSize(low as number);
    currentSearchCriteria.sizeMin = low as number;
    setMaxSize(high as number);
    currentSearchCriteria.sizeMax = high as number;
  }, []);
  
  const advancedFilter = () => {
    // Implement the advanced filter logic here
    console.log('Advanced filter applied:', searchCriteria);
  };
  
  
  
    return (
  
      <ThemedView style={[styles.advancedFilterContainer]}>

        <ThemedText style={[styles.advancedFilterLabel]}>Name:</ThemedText>
        <TextInput
          style={[styles.advancedFilterInput, {paddingHorizontal: 5}]}
          placeholder="Search by city name..."
          value={cityName}
          onChangeText={handleNameChange}
          placeholderTextColor={'rgba(160, 160, 160, 1)'}
        />
        <ThemedText style={[styles.advancedFilterLabel]}>Size of Area (in square meters):</ThemedText>
        <ThemedView style={styles.advancedFilterSliderContainer}>
          <ThemedText>{minSize?.toString()}</ThemedText>
          <RnRangeSlider
            style={styles.advancedFilterSlider}
            min={800}
            max={8000}
            step={100}
            onValueChanged={handleValueChange}
            disableRange={rangeDisabled}
            floatingLabel={floatingLabel}
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={renderLabel}
            renderNotch={renderNotch}
          />
          <ThemedText>{maxSize?.toString()}</ThemedText>
        </ThemedView>
        <Pressable style={styles.advancedFilterButton} onPress={advancedFilter}>
          <Ionicons style={{paddingHorizontal: 6}} name="filter" size={24} color={'ghostwhite'} />
          <ThemedText style={styles.advancedFilterButtonText}>Apply Filter</ThemedText>
        </Pressable>
      </ThemedView>
  
    )
  }