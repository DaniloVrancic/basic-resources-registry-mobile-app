import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Alert, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TransferList } from "@/app/data_interfaces/transfer-list";
import { Icon } from "@rneui/themed";
import { deleteInventoryItemById, getAllEmployees, getAllFixedAssets, getAllLocations } from "@/db/db";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Dropdown } from "react-native-element-dropdown";

let db;
const InventoryItemCard = ({
    currentEmployeeId,
    currentEmployeeName,
    currentLocationId,
    currentLocationName,
    fixedAssetId,
    fixedAssetName,
    newEmployeeName,
    new_employee_id,
    newLocationId,
    newLocationName,
    transferListId,
    transferListName,
    onDeleteItem = () => {}
}) => {
    const textColor = useThemeColor({}, 'text');
    db = useSQLiteContext();

    const [editModal, setEditModal] = useState(false);

    const [possibleEmployees, setPossibleEmployees] = useState([]);
    const [possibleLocations, setPossibleLocations] = useState([]);
    const [possibleFixedAssets, setPossibleFixedAssets] = useState([]);

    const loadFixedAssetsFromDatabase = async (db) => {
        try {
            var fetchedEmployees = (await getAllFixedAssets(db));
            var valuesToReturn = [];

            fetchedEmployees.forEach(element => {
                var mappedElement = { label: element.name + " (ID: " + element.id + ")", value: element.id};
                valuesToReturn.push(mappedElement);
            });
            setPossibleFixedAssets(valuesToReturn);
        } catch (error) {
          console.error('Error loading employees:', error);
        }
      };

    const loadEmployeesFromDatabase = async (db) => {
        try {
            var fetchedEmployees = (await getAllEmployees(db));
            var valuesToReturn = [];

            fetchedEmployees.forEach(element => {
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
    const loadLocationsFromDatabase = async (db) => {
        try {
            var fetchedLocations = (await getAllLocations(db));
            var valuesToReturn = [];

            fetchedLocations.forEach(element => {
                var mappedElement = { label: element.name + " (ID: " + element.id + ")", value: element.id};
                valuesToReturn.push(mappedElement);
            });
            setPossibleLocations(valuesToReturn);
        } catch (error) {
          console.error('Error loading employees:', error);
        }
      };

    useEffect(() => {
        loadEmployeesFromDatabase(db);
        loadLocationsFromDatabase(db);
        loadFixedAssetsFromDatabase(db);
    }, 
    [])
    

    const handleDeleteItem = async () => {
        try{
            let result = await deleteInventoryItemById(db, fixedAssetId, transferListId);
            onDeleteItem && onDeleteItem();
        }
        catch(error){
            console.error(error);
        }
    }

    const confirmDelete = () => {
        {
            Alert.alert('Confirm Deletion', 'Delete this Transfer List Item?', [
                {
                  text: 'Cancel',
                  onPress: () => {},
                  style: 'cancel'
                },
                {text: 'OK', onPress: () => handleDeleteItem()},
              ]);
        }
    }

    const [value, setValue] = useState(null);

    const [isFocusFixedAsset, setIsFocusFixedAsset] = useState(false);
    const [isFocusCurrentEmployee, setIsFocusCurrentEmployee] = useState(false);
    const [isFocusNewEmployee, setIsFocusNewEmployee] = useState(false);
    const [isFocusCurrentLocation, setIsFocusCurrentLocation] = useState(false);
    const [isFocusNewLocation, setIsFocusNewLocation] = useState(false);

    const [inputAssignedFixedAssetId, setInputAssignedFixedAssetId] = useState(currentEmployeeId);
    const [inputAssignedCurrentEmployeeId, setInputAssignedCurrentEmployeeId] = useState(currentEmployeeId);
    const [inputAssignedNewEmployeeId, setInputAssignedNewEmployeeId] = useState(new_employee_id);
    const [inputAssignedCurrentLocationId, setInputAssignedCurrentLocationId] = useState(currentLocationId);
    const [inputAssignedNewLocationId, setInputAssignedNewLocationId] = useState(newLocationId);


    const renderLabelFixedAsset = (myIsFocusFixedAsset) => {
        if (value || myIsFocusFixedAsset) {
          return (
            <ThemedText style={[dropdownStyles.label, myIsFocusFixedAsset && { color: 'green' }]}>
              Select Fixed Asset:
            </ThemedText>
          );
        }
        return null;
      };

    const renderLabelEmployee = (myIsFocusEmployee) => {
        if (value || myIsFocusEmployee) {
          return (
            <ThemedText style={[dropdownStyles.label, myIsFocusEmployee && { color: 'blue' }]}>
              Select Employee:
            </ThemedText>
          );
        }
        return null;
      };

      const renderLabelLocation = (myIsFocusLocation) => {
        if (value || myIsFocusLocation) {
          return (
            <ThemedText style={[dropdownStyles.label, myIsFocusLocation && { color: 'blue' }]}>
              Select Location:
            </ThemedText>
          );
        }
        return null;
      };




    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
            <ThemedText type="defaultSemiBold">Fixed Asset:</ThemedText>
            <ThemedText type="subtitle" style={{marginBottom: 25}}>{fixedAssetName}</ThemedText>


        <Pressable style={styles.editIcon} onPress={() => {setEditModal(true);}}>
            <Icon type="material" name="edit"/>
        </Pressable>
        <Pressable style={styles.deleteIcon} onPress={() => {confirmDelete()}}>
            <Icon type="material" name="delete"/>
        </Pressable>
            

            <ThemedView style={styles.transferContainer}>
                <ThemedText style={[styles.transferText, styles.transferHeaderText]}>Person in Charge:</ThemedText>
                    <ThemedView style={styles.transferValues}>
                        { currentEmployeeId === new_employee_id ? (
                                        <ThemedText style={[styles.transferText, styles.transferTextValue]}>{(currentEmployeeName !== null && currentEmployeeName.length > 0) ? currentEmployeeName : "(empty)"}</ThemedText>
                            ) : (
                                <>
                                         <ThemedText style={[styles.transferText, styles.transferTextValue]}>{(currentEmployeeName !== null && currentEmployeeName.length > 0) ? currentEmployeeName : "(empty)"}</ThemedText>
                                         <Ionicons name="arrow-forward-sharp" size={32} style={{marginBottom: 5, paddingBottom: 3}} color={textColor}/>
                                         <ThemedText style={[styles.transferText, styles.transferTextValue]}>{(newEmployeeName !== null && newEmployeeName.length > 0) ? newEmployeeName : "(empty)"}</ThemedText>
                                </>
                            )
                        }
                       
                    </ThemedView>
            </ThemedView>
            <ThemedView style={styles.transferContainer}>
                    <ThemedText style={[styles.transferText, styles.transferHeaderText]}>Location of Asset:</ThemedText>
                    <ThemedView style={styles.transferValues}>
                    {
                        (currentLocationId === newLocationId) ? (
                            <ThemedText style={[styles.transferText, styles.transferTextValue]}>{currentLocationName}</ThemedText>
                        ) : (
                            <>
                                <ThemedText style={[styles.transferText, styles.transferTextValue]}>{currentLocationName}</ThemedText>
                                <Ionicons name="arrow-forward-sharp" size={32} color={textColor}/>
                                <ThemedText style={[styles.transferText, styles.transferTextValue]}>{newLocationName}</ThemedText>
                            </>
                    )}
                    </ThemedView>
            </ThemedView>

            <Modal animationType="fade" visible={editModal}>
                <ScrollView>
                    <ThemedView style={[modalStyles.modalContainer, {padding: 20}]}>
                    <ThemedView style={modalStyles.modalHeader}>
                        <Pressable style={modalStyles.modalCloseButton} onPress={() => {setEditModal(false)}}>
                            <Ionicons name="close" size={24} color={textColor} />
                        </Pressable>
                        <Pressable style={modalStyles.modalSpaceFill} onPress={() => {setEditModal(false)}}></Pressable>
                    </ThemedView>

                    <ThemedView style={modalStyles.elementGroup}>
                        <ThemedView style={modalStyles.elementGroupLabel}>
                            <ThemedText >Fixed Asset</ThemedText>
                        </ThemedView>
                        <ThemedView style={dropdownStyles.container}>
                                            {renderLabelFixedAsset(isFocusFixedAsset)}
                                            <Dropdown
                                            dropdownPosition="bottom"
                                            inverted={false}
                                            style={[dropdownStyles.dropdown, isFocusFixedAsset && { borderColor: 'green' }]}
                                            placeholderStyle={dropdownStyles.placeholderStyle}
                                            selectedTextStyle={dropdownStyles.selectedTextStyle}
                                            inputSearchStyle={dropdownStyles.inputSearchStyle}
                                            iconStyle={dropdownStyles.iconStyle}
                                            data={possibleFixedAssets}
                                            search
                                            maxHeight={'90%'}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocusFixedAsset ? 'Select item' : '...'}
                                            searchPlaceholder="Search Fixed Asset..."
                                            value={inputAssignedCurrentEmployeeId}
                                            onFocus={() => setIsFocusFixedAsset(true)}
                                            onBlur={() => setIsFocusFixedAsset(false)}
                                            onChange={item => {
                                                setInputAssignedFixedAssetId(item.value);
                                                setIsFocusFixedAsset(false);
                                            }}
                                            renderLeftIcon={() => (
                                                <AntDesign
                                                style={dropdownStyles.icon}
                                                color={isFocusFixedAsset ? 'green' : 'black'}
                                                name="Safety"
                                                size={20}
                                                />
                                            )}
                                            />
                            </ThemedView>
                        </ThemedView>

                    <ThemedView style={{marginVertical: 20, borderWidth: 1, padding: 0}}/>                        

                    <ThemedView style={modalStyles.elementGroup}>
                        <ThemedView style={modalStyles.elementGroupLabel}>
                            <ThemedText >Employees Transfer</ThemedText>
                        </ThemedView>    
                            <ThemedView style={dropdownStyles.container}>
                                        {renderLabelEmployee(isFocusCurrentEmployee)}
                                        <Dropdown
                                        dropdownPosition="bottom"
                                        inverted={false}
                                        style={[dropdownStyles.dropdown, isFocusCurrentEmployee && { borderColor: 'blue' }]}
                                        placeholderStyle={dropdownStyles.placeholderStyle}
                                        selectedTextStyle={dropdownStyles.selectedTextStyle}
                                        inputSearchStyle={dropdownStyles.inputSearchStyle}
                                        iconStyle={dropdownStyles.iconStyle}
                                        data={possibleEmployees}
                                        search
                                        maxHeight={'90%'}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocusCurrentEmployee ? 'Select item' : '...'}
                                        searchPlaceholder="Search Employee..."
                                        value={inputAssignedCurrentEmployeeId}
                                        onFocus={() => setIsFocusCurrentEmployee(true)}
                                        onBlur={() => setIsFocusCurrentEmployee(false)}
                                        onChange={item => {
                                            setInputAssignedCurrentEmployeeId(item.value);
                                            setIsFocusCurrentEmployee(false);
                                        }}
                                        renderLeftIcon={() => (
                                            <AntDesign
                                            style={dropdownStyles.icon}
                                            color={isFocusCurrentEmployee ? 'blue' : 'black'}
                                            name="Safety"
                                            size={20}
                                            />
                                        )}
                                        />
                            </ThemedView>
                            <Icon name="arrow-downward" type="material"/>
                            <ThemedView style={dropdownStyles.container}>
                                        {renderLabelEmployee(isFocusNewEmployee)}
                                        <Dropdown
                                        dropdownPosition="bottom"
                                        inverted={false}
                                        style={[dropdownStyles.dropdown, isFocusNewEmployee && { borderColor: 'blue' }]}
                                        placeholderStyle={dropdownStyles.placeholderStyle}
                                        selectedTextStyle={dropdownStyles.selectedTextStyle}
                                        inputSearchStyle={dropdownStyles.inputSearchStyle}
                                        iconStyle={dropdownStyles.iconStyle}
                                        data={possibleEmployees}
                                        search
                                        maxHeight={'90%'}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocusNewEmployee ? 'Select item' : '...'}
                                        searchPlaceholder="Search Employee..."
                                        value={inputAssignedNewEmployeeId}
                                        onFocus={() => setIsFocusNewEmployee(true)}
                                        onBlur={() => setIsFocusNewEmployee(false)}
                                        onChange={item => {
                                            setInputAssignedNewEmployeeId(item.value);
                                            setIsFocusNewEmployee(false);
                                        }}
                                        renderLeftIcon={() => (
                                            <AntDesign
                                            style={dropdownStyles.icon}
                                            color={isFocusNewEmployee ? 'blue' : 'black'}
                                            name="Safety"
                                            size={20}
                                            />
                                        )}
                                        />
                            </ThemedView>
                        </ThemedView>


                        <ThemedView style={{marginVertical: 20, borderWidth: 1, padding: 0}}/>    


                    </ThemedView>
                </ScrollView>
            </Modal>

        </ThemedView>
    );
}

export default InventoryItemCard;

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5, 
        padding: 10,
        marginVertical: 5,
        margin: 5
    },
    transferContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 10,
        fontWeight: 300
    },
    transferHeaderText: {
        textAlign: 'center',
        paddingHorizontal: 6,
        fontWeight: 700
    },
    transferText: {
        textAlign: 'center',
        paddingHorizontal: 6,
    },
    transferTextValue: {
        fontSize: 16,
        flexWrap: 'wrap',
        maxWidth: '90%',
        paddingTop: 4
    },
    transferValues: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    showOnMapButton: {
        backgroundColor: 'rgb(106, 27, 154)', // Purple-blueish color
        padding: 12,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    showOnMapButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteIcon: {
        position: "absolute",
        top: "10%",
        right: "5%",
        color: 'red',
        backgroundColor: 'gold',
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 100
    },
    editIcon: {
        position: "absolute",
        top: "10%",
        right: "25%",
        color: 'red',
        backgroundColor: 'gold',
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 100
    }
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
    },
    elementGroup:{
        borderWidth: 1.5,
        borderColor: 'grey',
        borderRadius: 15,
        margin: 5,
        padding: 5
    },
    elementGroupLabel:{
        position: 'absolute',
        fontSize: 18,
        top: -16,
        left: 15,
        
    }
  
  });

  const dropdownStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        width: '90%'
      },
      dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 26,
        top: 0,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
  });