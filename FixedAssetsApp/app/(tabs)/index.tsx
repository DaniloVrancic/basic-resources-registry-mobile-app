import { StyleSheet, SafeAreaView, ScrollView, TextInput, Pressable } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SearchBarWithAdd from '@/components/SearchBarWithAdd';
import FixedAssetCard from '@/components/FixedAssetCard';
import RangeSlider from 'rn-range-slider';
import { FixedAssetSearchCriteria } from '../search_criteria_interfaces/fixed-asset-search-criteria';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import Thumb from '@/components/slider_components/Thumb';
import Rail from '@/components/slider_components/Rail';
import RailSelected from '@/components/slider_components/RailSelected';
import Label from '@/components/slider_components/Label';
import Notch from '@/components/slider_components/Notch';
import { Ionicons } from '@expo/vector-icons';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { getAllFixedAssets, getAllFixedAssetsWithNameAndBetweenRange, getFixedItemsForContainsName } from '@/db/db';
import { FixedAsset } from '../data_interfaces/fixed-asset';

let db: SQLiteDatabase;
export default function HomeScreen() {
  db = useSQLiteContext();

  const currentSearchCriteria: FixedAssetSearchCriteria = {name: "" as string, price_min: 0, price_max: 10_000, barcode: 111111, employeeId: 1, locationId: 1};
  const [searchCriteria, setSearchCriteria] = useState(currentSearchCriteria);

  
  const [loadedFixedAssets, setLoadedFixedAssets] = useState([]);

  useEffect(() => {
    loadFixedAssetsFromDatabase(db);
  }, []);

  const loadFixedAssetsFromDatabase = async (db: SQLiteDatabase) => {
    try {
      setLoadedFixedAssets(await getAllFixedAssets(db));
    } catch (error) {
      console.error('Error loading Fixed Assets: ', error);
    }
  };

  const handleFixedAssetSearch = async (name: string) => {
    try {
      setLoadedFixedAssets(await getFixedItemsForContainsName(db, name));
    } catch (error) {
      console.error('Error loading Fixed Assets: ', error);
    }
  }


  return (
    
    <SafeAreaView style={styles.safeArea}>

      <ThemedView style={styles.searchBarContainer}>
        <SearchBarWithAdd
                onAddClick={() => { console.log("Employees default click") }}
                filterChildren={fixedAssetAdvancedFiltering(loadedFixedAssets, setLoadedFixedAssets)}
                renderAddButton={true}
                renderAdvancedFilterButton={true}
                searchHandler={handleFixedAssetSearch}
              />
      </ThemedView>

      <ThemedView style={[styles.fixedAssetHeader]}>
            <ThemedText type="title">Fixed Assets:</ThemedText>
      </ThemedView>

          <ThemedView style={styles.fixedAssetContent} lightColor='ghostwhite' darkColor='#17153B'>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {/* Add more employees or your dynamic list here */}
                {loadedFixedAssets.map((fixedAsset: FixedAsset) =>
                  <ThemedView key={fixedAsset.id} style={styles.fixedAssetCardContainer}>
                    <FixedAssetCard key={fixedAsset.id} {...fixedAsset}/>
                  </ThemedView> 
                )}
            </ScrollView>
          </ThemedView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: '7%',
    flexDirection: 'column'
  },
  searchBarContainer:{
    flex: 12,
    padding: 2,
  },
  scrollViewContent: {
    flexDirection: 'column',
    padding: 10,
    // Add additional styling as needed
  },
  fixedAssetCardContainer: {
    marginVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  fixedAssetHeader: {
    flex: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomColor: 'grey', 
    borderBottomWidth: 2
  },
  fixedAssetContent: {
    flex: 82
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
  advancedBarCodeButton: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 60, 30)', // orange-reddish button color
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

});


function fixedAssetAdvancedFiltering(assets: any, setAssets: any) {
  const currentSearchCriteria: FixedAssetSearchCriteria = {name: "" as string, price_min: 0, price_max: 10_000, barcode: 111111, employeeId: 1, locationId: 1};
  const [nameToSearch, setNameToSearch] = useState(currentSearchCriteria.name);
  const [minPrice, setMinPrice] = useState(currentSearchCriteria.price_min);
  const [maxPrice, setMaxPrice] = useState(currentSearchCriteria.price_max); // Assume a maximum income of 8000 for the slider

  const textColor = useThemeColor({}, 'text');

  const handleNameChange = (newName: string) => {
    setNameToSearch(newName)
  };

  


const renderThumb = useCallback(() => <Thumb name={"Income range"}/>, []);
const renderRail = useCallback(() => <Rail/>, []);
const renderRailSelected = useCallback(() => <RailSelected/>, []);
const renderLabel = useCallback((value: any) => <Label text={value}/>, []);
const renderNotch = useCallback(() => <Notch/>, []);
const [rangeDisabled, setRangeDisabled] = useState(false);
const [floatingLabel, setFloatingLabel] = useState(false);

const handleValueChange = useCallback((low: SetStateAction<number>, high: SetStateAction<number>) => {
  setMinPrice(low as number);
  setMaxPrice(high as number);
}, []);

const advancedFilter = async () => {
  try {
      console.log(minPrice);
      console.log(currentSearchCriteria.price_max);
      setAssets(await getAllFixedAssetsWithNameAndBetweenRange(db, nameToSearch, minPrice, maxPrice));
  } catch (error) {
    console.error('Error loading Fixed Assets: ', error);
  }

};

const advancedFilterBarcode = () => {
  
  
};



  return (

    <ThemedView style={[styles.advancedFilterContainer]}>
      <ThemedText style={[styles.advancedFilterLabel]}>Name:</ThemedText>
      <TextInput
        style={[styles.advancedFilterInput, {paddingHorizontal: 5}]}
        placeholder="Search by asset name..."
        value={nameToSearch}
        onChangeText={handleNameChange}
        placeholderTextColor={'rgba(160, 160, 160, 1)'}
      />
      <ThemedText style={[styles.advancedFilterLabel]}>Value of Asset Range:</ThemedText>
      <ThemedView style={styles.advancedFilterSliderContainer}>
        <ThemedText>{minPrice?.toString()}</ThemedText>
        <RangeSlider
          style={styles.advancedFilterSlider}
          min={0}
          max={10_000}
          step={20}
          onValueChanged={handleValueChange}
          disableRange={rangeDisabled}
          floatingLabel={floatingLabel}
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
        />
        <ThemedText>{maxPrice?.toString()}</ThemedText>
      </ThemedView>
      <Pressable style={styles.advancedBarCodeButton} onPress={advancedFilterBarcode}>
        <Ionicons style={{paddingHorizontal: 6}} name="barcode-sharp" size={24} color={'ghostwhite'} />
        <ThemedText style={styles.advancedFilterButtonText}>Scan Code</ThemedText>
      </Pressable>
      <Pressable style={styles.advancedFilterButton} onPress={advancedFilter}>
        <Ionicons style={{paddingHorizontal: 6}} name="filter" size={24} color={'ghostwhite'} />
        <ThemedText style={styles.advancedFilterButtonText}>Apply Filter</ThemedText>
      </Pressable>
    </ThemedView>

  )
}