import { StyleSheet, SafeAreaView, ScrollView, TextInput, Pressable, Modal, Alert, FlatList } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SearchBarWithAdd from '@/components/SearchBarWithAdd';
import FixedAssetCard from '@/components/FixedAssetCard';
import RangeSlider from 'rn-range-slider';
import { FixedAssetSearchCriteria } from '../search_criteria_interfaces/fixed-asset-search-criteria';
import { SetStateAction, useCallback, useEffect, useState, useTransition } from 'react';
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
import AddNewFixedAsset from '@/components/AddFixedAssetForm';
import { useTranslation } from 'react-i18next';
import useOrientation from '@/hooks/useOrientation';
import { ORIENTATION } from '@/constants/orientation';

let db: SQLiteDatabase;
let t: any;
let orientation: any;
export default function HomeScreen() {
  db = useSQLiteContext();
  const textColor = useThemeColor({}, 'text');
  ({t} = useTranslation());
  (orientation = useOrientation());

  const currentSearchCriteria: FixedAssetSearchCriteria = {name: "" as string, price_min: 0, price_max: 10_000, barcode: 111111, employeeId: 1, locationId: 1};
  const [searchCriteria, setSearchCriteria] = useState(currentSearchCriteria);

  
  const [loadedFixedAssets, setLoadedFixedAssets] = useState([]);
  const [showAddFixedAsset, setShowAddList] = useState<boolean>(false);

  const openShowAdd = () => {setShowAddList(true);}
  const closeShowAdd = () => {setShowAddList(false);}

 
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

  const handleFixedAssetAdded = async () => {
    try {
        setLoadedFixedAssets(await getAllFixedAssets(db));
        Alert.alert(t('alertMessages.fixedAssetAdded'), t("alertMessages.fixedAssetAddedMessage"));
    } catch (error) {
        console.error('Error loading Fixed Assets: ', error);
    }
  }

  const handleDeletedFixedItem = (id: number) => {
    try{
        var fixedAssetsWithoutDeletedAsset = loadedFixedAssets.filter((val: FixedAsset) => val.id != id);
        setLoadedFixedAssets(fixedAssetsWithoutDeletedAsset);
        Alert.alert(t('alertMessages.success'), t('alertMessages.fixedAssetDeleteMessage'));
    } catch (error) {
        console.error('Error Removing Fixed Asset: ', error);
    }
  }


  return (
    
    <SafeAreaView style={styles.safeArea}>
      {
        (orientation === ORIENTATION.PORTRAIT) ? 
        <ThemedView style={{flex: 28, flexDirection: 'column'}}>
        <ThemedView style={styles.searchBarContainer}>
          <SearchBarWithAdd
                  onAddClick={() => { openShowAdd(); }}
                  filterChildren={fixedAssetAdvancedFiltering(loadedFixedAssets, setLoadedFixedAssets)}
                  renderAddButton={true}
                  renderAdvancedFilterButton={true}
                  searchHandler={handleFixedAssetSearch}
                />
        </ThemedView>
        <ThemedView style={[styles.fixedAssetHeader]}>
          <ThemedText type="title">{t('tabs.fixedAssets')}:</ThemedText>
        </ThemedView>
        </ThemedView>
        :
        <ThemedView style={{flex: 30, flexDirection: 'row', 
        borderBottomColor: 'grey', borderBottomWidth: 2, borderTopWidth: 1, marginBottom: 10}}>
        
        <ThemedView style={[styles.fixedAssetHeaderLandscape]}>
          <ThemedText type="title">{t('tabs.fixedAssets')}:</ThemedText>
        </ThemedView>
        <ThemedView style={styles.searchBarContainerLandscape}>
          <SearchBarWithAdd
                  onAddClick={() => { openShowAdd(); }}
                  filterChildren={fixedAssetAdvancedFiltering(loadedFixedAssets, setLoadedFixedAssets)}
                  renderAddButton={true}
                  renderAdvancedFilterButton={true}
                  searchHandler={handleFixedAssetSearch}
                />
        </ThemedView>
        </ThemedView>
        
      }
      
        
      
          <ThemedView style={(orientation === ORIENTATION.PORTRAIT) ? styles.fixedAssetContent : styles.fixedAssetContentLandscape} lightColor='ghostwhite' darkColor='#17153B'>
          <FlatList
          data={loadedFixedAssets}
          
          contentContainerStyle={
            (orientation === ORIENTATION.PORTRAIT) ? styles.scrollViewContent : styles.scrollViewContentLandscape
          }
          keyExtractor={(fixedAsset: FixedAsset) => fixedAsset.id?.toString() as string}
          renderItem={({ item: fixedAsset }) => (
            (orientation === ORIENTATION.PORTRAIT) ? 
            <ThemedView style={styles.fixedAssetCardContainer}>
              <FixedAssetCard 
                onDeletedFixedAsset={() => {handleDeletedFixedItem(fixedAsset.id as number)}} 
                {...fixedAsset} 
              />
            </ThemedView>
            :
            <ThemedView style={styles.fixedAssetCardContainerLandscape}>
              <FixedAssetCard 
                onDeletedFixedAsset={() => {handleDeletedFixedItem(fixedAsset.id as number)}} 
                {...fixedAsset} 
              />
            </ThemedView>
                )}
            />
          </ThemedView>

          <Modal visible={showAddFixedAsset} animationType="slide" onRequestClose={() => {closeShowAdd();}}>
             <ScrollView>
                <ThemedView style={[modalStyles.modalContainer, {padding: 20}]}>
                  <ThemedView style={modalStyles.modalHeader}>
                    <Pressable style={modalStyles.modalCloseButton} onPress={() => {closeShowAdd()}}>
                      <Ionicons name="close" size={24} color={textColor} />
                    </Pressable>
                    <Pressable style={modalStyles.modalSpaceFill} onPress={() => {closeShowAdd()}}></Pressable>
                  </ThemedView>
                    {
                      //Rest of the container here
                      <AddNewFixedAsset onAssetAdded={() => handleFixedAssetAdded()}/>
                    }
                
                </ThemedView>
            </ScrollView>
        </Modal>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: '7.5%',
    paddingVertical: 10,
    flexDirection: 'column'
  },
  searchBarContainer:{
    flex: 12,
    padding: 2,
  },
  searchBarContainerLandscape:{
    flex: 20,
    padding: 2,
  },
  scrollViewContent: {
    flexDirection: 'column',
    padding: 10,
    // Add additional styling as needed
  },
  scrollViewContentLandscape: {
    width: "100%",
    
  },
  flexHeaderLandscape: {
    flex: 20
  },
  fixedAssetCardContainer: {
    marginVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  fixedAssetCardContainerLandscape: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    marginHorizontal: '1%',
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
  fixedAssetHeaderLandscape: {
    flex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 16,
  },
  fixedAssetContent: {
    flex: 84
  },
  fixedAssetContentLandscape: {
    flex: 86,
    overflow: 'visible'
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
  setScannedBarCode(myScannedValue.toString());

  if(searchedAsset == null || isObjectEmpty(searchedAsset))
    {

    setFoundAsset(undefined);
  }
  else{

    setFoundAsset({...searchedAsset});
    
  }
}



const handleNewScan = () => {
  setCameraScanned(false);
}


  return (
 <ScrollView>
        <ThemedView style={[styles.advancedFilterContainer]}>
          <ThemedText style={[styles.advancedFilterLabel]}>{t("labels.name")}:</ThemedText>
          <TextInput
            style={[styles.advancedFilterInput, {paddingHorizontal: 5}]}
            placeholder= {t("filter.searchByAssetName") + "..."}
            value={nameToSearch}
            onChangeText={handleNameChange}
            placeholderTextColor={'rgba(160, 160, 160, 1)'}
          />
          <ThemedText style={[styles.advancedFilterLabel]}>{t("filter.valueAssetRange")}:</ThemedText>
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
          {

          (orientation === ORIENTATION.PORTRAIT) ? 
          <ThemedView>
            <Pressable style={styles.advancedBarCodeButton} onPress={openModalScanner}>
              <Ionicons style={{paddingHorizontal: 6}} name="barcode-sharp" size={24} color={'ghostwhite'} />
              <ThemedText style={styles.advancedFilterButtonText}>{t("filter.scanCode")}</ThemedText>
            </Pressable>
            <Pressable style={styles.advancedFilterButton} onPress={advancedFilter}>
              <Ionicons style={{paddingHorizontal: 6}} name="filter" size={24} color={'ghostwhite'} />
              <ThemedText style={styles.advancedFilterButtonText}>{t("filter.applyFilter")}</ThemedText>
            </Pressable>
          </ThemedView>
          :
          <ThemedView style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
            <Pressable style={styles.advancedBarCodeButton} onPress={openModalScanner}>
              <Ionicons style={{paddingHorizontal: 6}} name="barcode-sharp" size={24} color={'ghostwhite'} />
              <ThemedText style={styles.advancedFilterButtonText}>{t("filter.scanCode")}</ThemedText>
            </Pressable>
            <Pressable style={styles.advancedFilterButton} onPress={advancedFilter}>
              <Ionicons style={{paddingHorizontal: 6}} name="filter" size={24} color={'ghostwhite'} />
              <ThemedText style={styles.advancedFilterButtonText}>{t("filter.applyFilter")}</ThemedText>
            </Pressable>
          </ThemedView>
          }


          <Modal visible={isCameraScannerVisible} animationType="fade" transparent={true}  onRequestClose={closeModalScanner}> 
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
                          (foundAsset == undefined) ?
                        (<ThemedView style={{backgroundColor:'rgba(0,0,0,0)'}}>
                          <ThemedView style={{backgroundColor:'rgba(0,0,0,0)'}}>
                            <ThemedText type="subtitle" style={{textAlign:'center'}}>Scan Code:</ThemedText>
                        </ThemedView>
                        <ThemedView style={{minHeight: '66%'}}>
                            {/* Fill with Content here */}
                            <CameraScanner onCodeScanned={handleScannedValue} onNewScanButtonTapped={handleNewScan}/>
                        </ThemedView>
                        <ThemedView style={{minWidth: '100%',backgroundColor:'rgba(200,0,0,0.8', alignItems:'center'}}>
                          <ThemedText type='defaultSemiBold' style={{backgroundColor:'rgba(0,0,0,0)'}}>Item with barcode: {scannedBarCode}</ThemedText>
                          <ThemedText lightColor='red' darkColor='red' style={{backgroundColor:'rgba(0,0,0,0)'}}>Not found.</ThemedText>
                        </ThemedView>
                      </ThemedView>
                      )
                        :
                        (
                        <ThemedView style={{paddingVertical:'20%', backgroundColor:'rgba(0,0,0,0)' }}>
                          {
                            <FixedAssetCardDetailedCard setFixedAssetState={setFoundAsset} fixedAssetState={foundAsset}/>
                          }
                      </ThemedView>) 
                          
                          
                        )
                    }
                    </ThemedView>
                </Modal>


        </ThemedView>
    </ScrollView>

  )
}