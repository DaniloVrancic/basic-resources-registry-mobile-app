import { Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
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
import { addTransferList, getAllEmployees, getAllFixedAssets, getAllInventoryLists, getAllInventoryListsForContainsName, getAllInventoryListsFromView, getAllLocations, getAllLocationsForContainsName } from '@/db/db';
import InventoryItemList from '@/components/InventoryItemList';
import { InventoryList } from '../data_interfaces/inventory-list';


let db: SQLiteDatabase;
export default function ListOfAssets() {

  db = useSQLiteContext();
  const textColor = useThemeColor({}, 'text');

  const [loadedLists, setLoadedLists] = useState([]);

  const currentSearchCriteria: InventoryListSearchCriteria = {keywordToSearch: "", isChangingEmployee: true, isChangingLocation: true};


  const [possibleEmployees, setPossibleEmployees] = useState([]);
  const [possibleLocations, setPossibleLocations] = useState([]);
  const [possibleFixedAssets, setPossibleFixedAssets] = useState([]);
    
  const [searchChangingEmployee, setSearchChangingEmployee] = useState(true);
  const [searchChangingLocation, setSearchChangingLocation] = useState(true);

  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [newListName, setNewListName] = useState('');

  const [showAddFixedAsset, setShowAddList] = useState<boolean>(false);

  const openShowAdd = () => {setShowAddList(true);}
  const closeShowAdd = () => {setShowAddList(false);}


  const loadFixedAssetsFromDatabase = async (db: SQLiteDatabase) => {
    try {
        var fetchedEmployees = (await getAllFixedAssets(db));
        var valuesToReturn: any = [];

        fetchedEmployees.forEach((element: any) => {
            var mappedElement = { label: element.name + " (ID: " + element.id + ")", value: element.id};
            valuesToReturn.push(mappedElement);
        });
        setPossibleFixedAssets(valuesToReturn);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

const loadEmployeesFromDatabase = async (db: SQLiteDatabase) => {
    try {
        var fetchedEmployees = (await getAllEmployees(db));
        var valuesToReturn: any = [];

        fetchedEmployees.forEach((element: any) => {
            var mappedElement = { label: element.name + " (ID: " + element.id + ")", value: element.id};
            valuesToReturn.push(mappedElement);
        });
        setPossibleEmployees(valuesToReturn);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };


  /*
   * The code below will fetch all the Location data from the database and correctly filter only the data that we will use.
   * This data is then bound to the State which will be used to display all the possible locations to select in a drop down menu.
   */
const loadLocationsFromDatabase = async (db: SQLiteDatabase) => {
    try {
        var fetchedLocations = (await getAllLocations(db));
        var valuesToReturn: any = [];

        fetchedLocations.forEach((element: any) => {
            var mappedElement = { label: element.name + " (ID: " + element.id + ")", value: element.id};
            valuesToReturn.push(mappedElement);
        });
        setPossibleLocations(valuesToReturn);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

useEffect(() => {

  loadInventoryTransferLists(db);
  loadLocationsFromDatabase(db);
  loadEmployeesFromDatabase(db);
  loadFixedAssetsFromDatabase(db);

}, 
[])

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

  const handleAddClick = () => {
    setShowAddPrompt(true);
  };

  const handleConfirmAdd = async () => {
    if (newListName.trim() === '') {
      Alert.alert('Error', 'List name cannot be empty.');
      return;
    }
    try {

        setShowAddPrompt(false);
        setNewListName('');
        try{
          await addTransferList(db, newListName); // Reload the list after adding
          setLoadedLists(await getAllInventoryLists(db));
        }
        catch(error)
        {
          console.error(error);
        }
        
        

    } catch (error) {
      console.error('Error adding new list: ', error);
      Alert.alert('Error adding new list');
    }
  };

  const handleCancelAdd = () => {
    setShowAddPrompt(false);
    setNewListName('');
  };

  const handleDeleteList = (id: number) => {
    try{
      var listWithoutDeletedLocation = loadedLists.filter((val: InventoryList) => val.id !== id);
      setLoadedLists(listWithoutDeletedLocation);
      Alert.alert("Success", "Transfer List has been successfully deleted!");
      } catch (error) {
          console.error('Error Removing Location: ', error);
      }
  }

  return (
      <SafeAreaView style={styles.safeArea}>
          <ThemedView style={{flex: 18}}>
            <SearchBarWithAdd
              onAddClick={() => {handleAddClick()} }
              filterChildren={listOfAssetsAdvancedFiltering(searchChangingEmployee, setSearchChangingEmployee, searchChangingLocation, setSearchChangingLocation, currentSearchCriteria, loadedLists, setLoadedLists)}
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
                    <InventoryItemList 
                    key={inventoryList.id} 
                    id={inventoryList.id} 
                    name={inventoryList.name} 
                    possibleEmployees={possibleEmployees}
                    possibleFixedAssets={possibleFixedAssets}
                    possibleLocations={possibleLocations}
                    showChangingEmployees={searchChangingEmployee} 
                    showChangingLocations={searchChangingLocation} 
                    onDeleteList={() => {handleDeleteList(inventoryList.id);}}/>
                  </ThemedView>
                )
             }
            </ScrollView>
          </ThemedView>


        <Modal visible={showAddFixedAsset} animationType="slide" >
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
                }
               
            </ThemedView>
            </ScrollView>
        </Modal>

        <Modal visible={showAddPrompt} animationType="fade" transparent={true}>
          <ThemedView style={{backgroundColor:'rgba(255,255,255,0.8)', minHeight: '90%', height: '100%'}}>
          <ThemedView style={modalStyles2.modalContainer}>
          <ThemedText style={modalStyles2.modalTitle}>Enter List Name</ThemedText>
          <TextInput
            style={modalStyles2.textInput}
            value={newListName}
            onChangeText={setNewListName}
            placeholder="Enter name"
            placeholderTextColor="grey"
          />
          <ThemedView style={modalStyles2.buttonContainer}>
          <Pressable style={modalStyles2.button} onPress={handleCancelAdd}>
              <ThemedText style={modalStyles2.buttonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable style={modalStyles2.button} onPress={handleConfirmAdd}>
              <ThemedText style={modalStyles2.buttonText}>Confirm</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
        </ThemedView>
      </Modal>

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

  const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 8,
        overflow:'scroll',
        backgroundColor: 'rgba(0,0,0,0.0)'
    },
    modalHeader: {
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
        marginRight: 20,
    },
    modalTitle: {
      fontSize: 20,
      marginBottom: 20,
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
    },
    textInput: {
      height: 40,
      width: '80%',
      borderColor: 'grey',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
      backgroundColor: 'white',
    },

});

const modalStyles2 = StyleSheet.create({
    modalContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 12,
        marginTop: '40%',
        overflow:'scroll',
        backgroundColor: 'rgba(250,250,250,1.0)',
        borderWidth: 4,
        borderRadius: 10,
        marginHorizontal: "1%"
    },
    modalTitle: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center'
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
    },
    textInput: {
      height: 40,
      width: '100%',
      minWidth: '70%',
      borderColor: 'grey',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
      backgroundColor: 'white',
      alignSelf: 'center'
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      backgroundColor:'rgba(255,255,255,0.0)'
    },
    button: {
      padding: 10,
      backgroundColor: 'blue',
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
});

  function listOfAssetsAdvancedFiltering(searchChangingEmployee: any, setSearchChangingEmployee: any, searchChangingLocation: any, setSearchChangingLocation: any, currentSearchCriteria: any, loadedLists: any, setLoadedLists: any) {

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
  
  const advancedFilter = async () => {
    
    console.log('Show changing employees: ' + searchChangingEmployee);
    console.log("Show chaning locations: " + searchChangingLocation);

    try {
      setLoadedLists(await getAllInventoryListsForContainsName(db, keywordToSearch));
  } catch (error) {
    console.error('Error loading Fixed Assets: ', error);
  }
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