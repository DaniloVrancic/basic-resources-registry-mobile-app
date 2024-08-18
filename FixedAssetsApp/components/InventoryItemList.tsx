import { InventoryList } from '@/app/data_interfaces/inventory-list';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import React, { Suspense, useEffect, useState } from 'react';
import { ThemedView } from './ThemedView';
import LoadingAnimation from './fallback/LoadingAnimation';
import { ThemedText } from './ThemedText';
import { addInventoryItemForList, deleteTransferListById, getItemsFromViewForListId, updateTransferList } from '@/db/db';
import InventoryItemCard from './InventoryItemCard';
import { Alert, Modal, Pressable, StyleSheet, TextInput } from 'react-native';
import { TransferList } from '@/app/data_interfaces/transfer-list';
import { Icon } from '@rneui/themed';
import InventoryItemSelectors from './custom_for_this_project/InventoryItemSelectors';

let db: SQLiteDatabase;

interface InventoryItemListWithShowFilters {

    id: number;
    name: string;
    showChangingEmployees?: boolean | undefined;
    showChangingLocations?: boolean | undefined;
}

const InventoryItemList: React.FC<InventoryItemListWithShowFilters | any> = ({
    id,
    name,
    showChangingEmployees,
    showChangingLocations,
    possibleEmployees,
    possibleLocations,
    possibleFixedAssets,
    onDeleteList = () => {},
    onAddedToList = (listId: number) => {}
    }) => {
    const textColor = useThemeColor({}, 'text');
    let parametersForList;

    db = useSQLiteContext();
    const [loadedItems, setLoadedItems] = useState([]);
    const [showAddPrompt, setShowAddPrompt] = useState(false);
    const [inputEditedName, setInputEditedName] = useState<string>(name);

    const [addModal, setAddModal] = useState(false);

    useEffect(() => {
        loadItemsForList(db, id, showChangingEmployees, showChangingLocations);
      }, []);

    const loadItemsForList = async (db: SQLiteDatabase, id: number, showChangingEmployees: boolean | undefined, showChangingLocations: boolean | undefined) => {
        try {
            setLoadedItems(await getItemsFromViewForListId(db, id));
            
        } catch (error) {
          console.error('Error loading Items For List: ', error);
        }
      };

      const handleDeleteItem = async () =>
      {
        try{
            let result = await deleteTransferListById(db, id);
            onDeleteList && onDeleteList();
        }
        catch(error){
            console.error(error);
        }
      }

      const confirmDeleteLocationAlert = () =>
        {
            Alert.alert('Confirm Deletion', 'Delete this Transfer List?', [
                {
                  text: 'Cancel',
                  onPress: () => {},
                  style: 'cancel'
                },
                {text: 'OK', onPress: () => handleDeleteItem()},
              ]);
        }

        const handleConfirmUpdate = async () => {
            if (inputEditedName.trim() === '') {
              Alert.alert('Error', 'List name cannot be empty.');
              return;
            }
            // Add the new list to the database here
            try {
              // Add your database insertion logic here
                setShowAddPrompt(false);
                try{
                  await updateTransferList(db, inputEditedName, id); // Reload the list after adding
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

        const handleCancelUpdate = () => {
            setInputEditedName(name);
            setShowAddPrompt(false);
          };

        const handleDeletedItem = async (fixedAssetId: number, transferListId: number) => {
            try{
                setLoadedItems(await getItemsFromViewForListId(db, id));
                Alert.alert("Success", "Transfer List has been successfully deleted!");
                } catch (error) {
                    console.error('Error Removing Location: ', error);
                }
        }

        const handleUpdatedItem = async(fixedAssetId: number, transferListId: number) => {
            try{
                setLoadedItems(await getItemsFromViewForListId(db, id));
                Alert.alert("Transferred Item Updated", "The data transfer information has been successfully updated.");
                } catch (error) {
                    console.error('Error Removing Location: ', error);
                }
        }

        const handleAddItem = async (item: any) => {
            const { currentEmployeeId, currentLocationId, fixed_asset_id, newLocationId, new_employee_id, transferListId } = item;

            if([currentEmployeeId, currentLocationId, fixed_asset_id, newLocationId, new_employee_id, transferListId].includes(-1))
            {
                Alert.alert("Error", "One of the necessary options hasn't been set. Please check and try again.");
                return; // Exit the function if any attribute is -1 (Not set)
            }
            else{
                try{

                    var result = await addInventoryItemForList(db, item);
                    
                    
                    Alert.alert("Success", "New Transfer Item has been successfully added to the list.");
                    onAddedToList && onAddedToList(id);
                }
                catch(error){
                    console.error(error);
                    Alert.alert("Error", "An error occured, couldn't add Transfer Item to list.")
                }
            }
        }


    return (
        <ThemedView lightColor='#17153B' darkColor='ghostwhite' style={styles.listContainer}>
            <ThemedText lightColor='ghostwhite' darkColor='#17153B' style={styles.listTitle} type='subtitle'>{inputEditedName}</ThemedText>

            <Pressable style={styles.editIcon} onPress={() => {setShowAddPrompt(true)}}>
                <Icon type="material" name="edit" iconStyle={{color: 'ghostwhite'}}/>
            </Pressable>
            <Pressable style={styles.deleteIcon} onPress={() => {confirmDeleteLocationAlert();}}>
                <Icon type="material" name="delete" iconStyle={{color: 'ghostwhite'}}/>
            </Pressable>
            <Pressable style={styles.addIcon} onPress={() => {setAddModal(true);}}> 
                {/* FIX ADD CLICKED */}
                <Icon type="material" name="add" iconStyle={{color: 'ghostwhite'}}/>
            </Pressable>

            <Suspense fallback={<LoadingAnimation text="Loading Inventory Items..." />}>
                <ThemedView style={{borderRadius: 10}}>
                    {
                        loadedItems.map((element: TransferList) => 
                        {
                            if(showChangingEmployees == false && element.currentEmployeeId != element.new_employee_id){
                                return;
                            }
                            else if(showChangingLocations === false && element.currentLocationId != element.newLocationId){
                                return;
                            }
                            else{
                                return <InventoryItemCard key={element.fixedAssetId * 10_000 + element.transferListId}
                                possibleEmployees={possibleEmployees}
                                possibleFixedAssets={possibleFixedAssets}
                                possibleLocations={possibleLocations}
                                onDeleteItem={() => {handleDeletedItem(element.fixedAssetId, element.transferListId);}}
                                onUpdateItem={() => {handleUpdatedItem(element.fixedAssetId, element.transferListId);}}
                                {...element}/>
                            }
                        }
                        )
                    }
                </ThemedView>
            </Suspense>

            <Modal visible={showAddPrompt} animationType="fade" transparent={false}>
                <ThemedView style={{backgroundColor:'rgba(255,255,255,0.8)', minHeight: '90%', height: '100%'}}>
                <ThemedView style={modalStyles2.modalContainer}>
                <ThemedText style={modalStyles2.modalTitle}>Enter List Name</ThemedText> 
                <TextInput
                    style={modalStyles2.textInput}
                    value={inputEditedName}
                    onChangeText={setInputEditedName}
                    placeholder="Enter Name"
                    placeholderTextColor="grey"
                />
                <ThemedView style={modalStyles2.buttonContainer}>
                <Pressable style={modalStyles2.button} onPress={handleCancelUpdate}>
                    <ThemedText style={modalStyles2.buttonText}>Cancel</ThemedText>
                    </Pressable>
                    <Pressable style={modalStyles2.button} onPress={handleConfirmUpdate}>
                    <ThemedText style={modalStyles2.buttonText}>Confirm</ThemedText>
                    </Pressable>
                </ThemedView>
                </ThemedView>
                </ThemedView>
            </Modal>

            <Modal animationType="slide" visible={addModal}>
                <InventoryItemSelectors
                possibleEmployees={possibleEmployees}
                possibleFixedAssets={possibleFixedAssets}
                possibleLocations={possibleLocations}
                titleToDisplay="Add Transfer Item"
                transferListId={id}
                onPressClose={() => {setAddModal(false)}}
                onPressSave={ item => {
                    handleAddItem(item);
                } }
                />
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        borderColor: 'black',
        borderRadius: 15,
        paddingVertical: 30,
        paddingHorizontal: 8,
    },
    listTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        paddingBottom: 15
    },
    deleteIcon: {
        position: "absolute",
        top: 10,
        left: "47.5%",
        backgroundColor: 'purple',
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 100,
    },
    editIcon: {
        position: "absolute",
        top: 10,
        left: "10%",
        backgroundColor: 'purple',
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 100
    },
    addIcon: {
        position: "absolute",
        top: 10,
        right: "10%",
        backgroundColor: 'purple',
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 100
    }
})

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

export default InventoryItemList;