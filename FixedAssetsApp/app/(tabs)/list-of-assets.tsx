import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBarWithAdd from '@/components/SearchBarWithAdd';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import Thumb from '@/components/slider_components/Thumb';
import Rail from '@/components/slider_components/Rail';
import RailSelected from '@/components/slider_components/RailSelected';
import Label from '@/components/slider_components/Label';
import Notch from '@/components/slider_components/Notch';
import { InventoryListSearchCriteria } from '../search_criteria_interfaces/inventory-list-search-criteria';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CheckBox } from '@rneui/themed/dist/CheckBox';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { getAllInventoryLists, getAllInventoryListsForContainsName, getAllInventoryListsFromView, getAllLocationsForContainsName } from '@/db/db';
import InventoryItemList from '@/components/InventoryItemList';
import { TransferList } from '../data_interfaces/transfer-list';
import { InventoryList } from '../data_interfaces/inventory-list';

let db: SQLiteDatabase;
export default function ListOfAssets() {

  db = useSQLiteContext();
  const [loadedLists, setLoadedLists] = useState([]);

  const currentSearchCriteria: InventoryListSearchCriteria = {keywordToSearch: "", isChangingEmployee: true, isChangingLocation: true};

    
  const [searchChangingEmployee, setSearchChangingEmployee] = useState(currentSearchCriteria.isChangingEmployee);
  const [searchChangingLocation, setSearchChangingLocation] = useState(currentSearchCriteria.isChangingLocation);

  useEffect(() => {
    loadInventoryTransferLists(db);
  }, []);

  const loadInventoryTransferLists = async (db: SQLiteDatabase) => {
    try {
      setLoadedLists(await getAllInventoryLists(db));
    } catch (error) {
      console.error('Error loading Inventory Lists: ', error);
    }
  };

  const handleSearchListOfAssets = async (name: string) => {
    try {
      setLoadedLists(await getAllInventoryListsForContainsName(db, name));
    } catch (error) {
      console.error('Error loading Inventory Lists: ', error);
    }
  }

  return (
      <SafeAreaView style={styles.safeArea}>
          <ThemedView style={{flex: 18}}>
            <SearchBarWithAdd
              onAddClick={() => { console.log("Location default click") }}
              filterChildren={listOfAssetsAdvancedFiltering(searchChangingEmployee, setSearchChangingEmployee, searchChangingLocation, setSearchChangingLocation, currentSearchCriteria)}
              renderAddButton={true}
              renderAdvancedFilterButton={true}
              searchHandler={handleSearchListOfAssets}
              />

          </ThemedView>
          <ThemedView style={[styles.titleContainer, {flex:8, borderBottomColor: 'grey', borderBottomWidth: 2}]}>
            <ThemedText style={{paddingHorizontal: 20}} type="title">List of Assets</ThemedText>
          </ThemedView>
          <ThemedView lightColor='ghostwhite' darkColor='black' style={{ flex: 84}}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
             {
                loadedLists.map((inventoryList: InventoryList) =>
                  <ThemedView key={inventoryList.id } style={{marginVertical: 10, borderRadius: 15}}>
                    <InventoryItemList key={inventoryList.id} id={inventoryList.id} name={inventoryList.name} showChangingEmployees={undefined} showChangingLocations={undefined}/>
                  </ThemedView>
                )
             }
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
      justifyContent: 'space-between', //for easier hitting the button, leave some space between elements
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

  function listOfAssetsAdvancedFiltering(searchChangingEmployee: any, setSearchChangingEmployee: any, searchChangingLocation: any, setSearchChangingLocation: any, currentSearchCriteria: any) {

    const [keywordToSearch, setKeywordToSearch] = useState("");

    const textColor = useThemeColor({}, 'text');
  
    const handleNameChange = (newName: string) => {
      setKeywordToSearch(newName);
      currentSearchCriteria.keywordToSearch = keywordToSearch;
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
          placeholder="Search by name of Transfer List..."
          value={keywordToSearch}
          onChangeText={handleNameChange}
          placeholderTextColor={'rgba(160, 160, 160, 1)'}
        />
        <ThemedText style={[styles.advancedFilterLabel]}>Filters:</ThemedText>
        
        <ThemedView style={styles.checkboxContainer}>
        <CheckBox
            checked={searchChangingEmployee as boolean}
            checkedColor="#A0C"
            containerStyle={{ width: "75%", backgroundColor: 'rgba(0,0,0,0)' }}
            onIconPress={() => {
              setSearchChangingEmployee(!searchChangingEmployee);
              currentSearchCriteria.isChangingLocation = searchChangingEmployee;
            }}
            onLongIconPress={() => {}
            }
            onLongPress={() => {}}
            onPress={() => {
              setSearchChangingEmployee(!searchChangingEmployee);
              currentSearchCriteria.isChangingLocation = searchChangingEmployee;
            }}
            size={40}
            textStyle={{}}
            title="Show Changing Employees"
            titleProps={{}}
            uncheckedColor="#F00"
            style={{backgroundColor: 'rgba(0,0,0,1)'}}
          />
        </ThemedView>
  
      <ThemedView style={styles.checkboxContainer}>
      <CheckBox
            checked={searchChangingLocation as boolean}
            checkedColor="#A0C"
            containerStyle={{ width: "75%", backgroundColor: 'rgba(0,0,0,0)'}}
            onIconPress={() => {
              setSearchChangingLocation(!searchChangingLocation);
              currentSearchCriteria.isChangingLocation = searchChangingLocation;
            }}
            onLongIconPress={() =>
            {}
            }
            onLongPress={() => {}}
            onPress={() => {
              setSearchChangingLocation(!searchChangingLocation);
              console.log(searchChangingLocation);
              currentSearchCriteria.isChangingLocation = searchChangingLocation;
            }}
            size={40}
            textStyle={{}}
            title="Show Changing Location"
            titleProps={{}}
            uncheckedColor="#F00"
          />
      </ThemedView>
        <Pressable style={styles.advancedFilterButton} onPress={advancedFilter}>
          <Ionicons style={{paddingHorizontal: 6}} name="filter" size={24} color={'ghostwhite'} />
          <ThemedText style={styles.advancedFilterButtonText}>Apply Filter</ThemedText>
        </Pressable>
      </ThemedView>
    )
  }
