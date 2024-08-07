import { StyleSheet, SafeAreaView, ScrollView, TextInput, Pressable, Modal } from 'react-native';

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
import { getAllFixedAssets, getAllFixedAssetsWithBarcode, getAllFixedAssetsWithNameAndBetweenRange, getFixedItemsForContainsName } from '@/db/db';
import { FixedAsset } from '../data_interfaces/fixed-asset';
import { Icon } from '@rneui/themed';
import CameraScanner from '@/components/camera/CameraScanner';
import FixedAssetCardDetailedCard from '@/components/FixedAssetDetailedCard';

let db: SQLiteDatabase;
export default function HomeScreen() {
  db = useSQLiteContext();
  const textColor = useThemeColor({}, 'text');

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
    gap: 9,
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

const modalStyles = StyleSheet.create({
  modalContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 8,
  },
  modalHeader: {
      display: 'flex',
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      flexDirection: 'row-reverse',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      paddingBottom: 40,
      marginRight: 20
  },
  modalCloseButton: {
      justifyContent: 'flex-end',
  textAlign: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  flex: 1,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 50,
  backgroundColor: 'rgba(200,200,200, 0.8)',
  },
  modalSpaceFill: {
      flex: 10,
  }

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


const [isCameraScannerVisible, setIsCameraScannerVisible] = useState<boolean>(false);
const [cameraScanned, setCameraScanned] = useState<boolean>(false);
const [scannedBarCode, setScannedBarCode] = useState<string | undefined>(undefined);

const openModalScanner = () => {setIsCameraScannerVisible(true);}
const closeModalScanner = () => {setIsCameraScannerVisible(false); setCameraScanned(false);}

const handleValueChange = useCallback((low: SetStateAction<number>, high: SetStateAction<number>) => {
  setMinPrice(low as number);
  setMaxPrice(high as number);
}, []);

const advancedFilter = async () => {
  try {
      setAssets(await getAllFixedAssetsWithNameAndBetweenRange(db, nameToSearch, minPrice, maxPrice));
  } catch (error) {
    console.error('Error loading Fixed Assets: ', error);
  }

};

const advancedFilterBarcode = () => {
  
  
};

const [foundAsset, setFoundAsset] = useState<FixedAsset | undefined>(undefined);

function isObjectEmpty(obj: any) { 
  return Object.keys(obj).length === 0; 
} 

const handleScannedValue = async (myScannedValue : any) => {
  //console.log(myScannedValue); //For testing purposes
  

  const searchedAsset : any = await getAllFixedAssetsWithBarcode(db, myScannedValue);
  setCameraScanned(true);
  console.log((new Date()).toISOString() + "----------------------------------");
  console.log(searchedAsset);
  if(searchedAsset == null || isObjectEmpty(searchedAsset))
    {
    //console.log("OBJECT IS EMPTY");
    setFoundAsset(undefined);
  }
  else{
    //console.log("SETTING SEARCHED ASSETS");
    setFoundAsset(searchedAsset);
    setScannedBarCode(myScannedValue);
  }
  console.log(foundAsset);
}



const handleNewScan = () => {
  setCameraScanned(false);
}


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
          low={minPrice}
          high={maxPrice}
        />
        <ThemedText>{maxPrice?.toString()}</ThemedText>
      </ThemedView>
      <Pressable style={styles.advancedBarCodeButton} onPress={openModalScanner}>
        <Ionicons style={{paddingHorizontal: 6}} name="barcode-sharp" size={24} color={'ghostwhite'} />
        <ThemedText style={styles.advancedFilterButtonText}>Scan Code</ThemedText>
      </Pressable>
      <Pressable style={styles.advancedFilterButton} onPress={advancedFilter}>
        <Ionicons style={{paddingHorizontal: 6}} name="filter" size={24} color={'ghostwhite'} />
        <ThemedText style={styles.advancedFilterButtonText}>Apply Filter</ThemedText>
      </Pressable>


      <Modal visible={isCameraScannerVisible} animationType="fade" transparent={true}> 
                <ThemedView lightColor="ghostwhite" darkColor="rgba(0,0,0,1)" style={modalStyles.modalContainer}>

                    <ThemedView style={modalStyles.modalHeader}>
                            <Pressable style={modalStyles.modalCloseButton} onPress={closeModalScanner}>
                                <Icon name="undo" type="material" size={24} color={textColor} />
                            </Pressable>
                            <Pressable style={[modalStyles.modalSpaceFill]} onPress={closeModalScanner}></Pressable>
                    </ThemedView>

                    
                {
                    (!cameraScanned) ? 
                    (<ThemedView style={{backgroundColor:'rgba(0,0,0,0)'}}>
                        <ThemedView style={{backgroundColor:'rgba(0,0,0,0)'}}>
                          <ThemedText type="subtitle" style={{textAlign:'center'}}>Scan Code:</ThemedText>
                      </ThemedView>
                      <ThemedView style={{minHeight: '66%'}}>
                          {/* Fill with Content here */}
                          <CameraScanner onCodeScanned={handleScannedValue} onNewScanButtonTapped={handleNewScan}/>
                      </ThemedView>
                    </ThemedView>)
                    :
                    (
                      <ThemedView>
                          {
                            //<FixedAssetCardDetailedCard fixedAssetState={foundAsset} setFixedAssetState={setFoundAsset}/>
                          }
                      </ThemedView>
                    )
                }
                </ThemedView>
            </Modal>


    </ThemedView>

  )
}