import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Alert, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TransferList } from "@/app/data_interfaces/transfer-list";
import { Button, Icon } from "@rneui/themed";
import { deleteInventoryItemById, getAllEmployees, getAllFixedAssets, getAllLocations, updateInventoryItemForList } from "@/db/db";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import InventoryItemSelectors from "@/components/custom_for_this_project/InventoryItemSelectors"
import { Dropdown } from "react-native-element-dropdown";

let db;
const InventoryItemCard = ( {
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
    possibleEmployees,
    possibleFixedAssets,
    possibleLocations,
    onUpdateItem = () => {},
    onDeleteItem = () => {}
}) => {
    const textColor = useThemeColor({}, 'text');
    db = useSQLiteContext();

    const [editModal, setEditModal] = useState(false);



    
    

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



    const handleUpdateItem = async (item) => {

        try{
            var result = await updateInventoryItemForList(db, item);
            onUpdateItem && onUpdateItem(); //Invoke the onUpdateItem user sent method if it exists;

            setEditModal(false);
        }
        catch(error){
            console.error(error);
            Alert.alert("Error", "An error occurred while updating the item. Please try again.");
        }
      }







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

            <Modal animationType="slide" visible={editModal}>
                <InventoryItemSelectors 
                fixedAssetId={fixedAssetId}
                currentEmployeeId={currentEmployeeId}
                currentLocationId={currentLocationId}
                new_employee_id={new_employee_id}
                newLocationId={newLocationId}
                transferListId={transferListId}
                possibleFixedAssets={possibleFixedAssets}
                possibleEmployees={possibleEmployees} 
                possibleLocations={possibleLocations}
                titleToDisplay="Edit Transfer Item"
                onPressClose={() => {setEditModal(false)}}
                onPressSave={ item => {
                    handleUpdateItem(item);
                } }
                />
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
        padding: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    elementGroupLabel:{
        position: 'absolute',
        fontSize: 18,
        top: -16,
        left: 15,
        
    }
  
  });
