import { InventoryList } from '@/app/data_interfaces/inventory-list';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import React, { Suspense, useEffect, useState } from 'react';
import { ThemedView } from './ThemedView';
import LoadingAnimation from './fallback/LoadingAnimation';
import { ThemedText } from './ThemedText';
import { getItemsForList, getItemsFromViewForListId, getItemsFromViewForListIdWithShowFilters } from '@/db/db';
import InventoryItemCard from './InventoryItemCard';
import { InventoryItem } from '@/app/data_interfaces/inventory-item';
import { Pressable, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TransferList } from '@/app/data_interfaces/transfer-list';
import { Icon } from '@rneui/themed';

let db: SQLiteDatabase;

interface InventoryItemListWithShowFilters {

    id: number;
    name: string;
    showChangingEmployees?: boolean | undefined;
    showChangingLocations?: boolean | undefined;
}

const InventoryItemList: React.FC<InventoryItemListWithShowFilters> = ({
    id,
    name,
    showChangingEmployees,
    showChangingLocations
}) => {
    const textColor = useThemeColor({}, 'text');
    let parametersForList;

    db = useSQLiteContext();
    const [loadedItems, setLoadedItems]: any = useState([]);

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


    return (
        <ThemedView lightColor='#17153B' darkColor='ghostwhite' style={styles.listContainer}>
            <ThemedText lightColor='ghostwhite' darkColor='#17153B' style={styles.listTitle} type='subtitle'>{name}</ThemedText>

            <Pressable style={styles.editIcon} onPress={() => {console.log("Edit clicked")}}>
                <Icon type="material" name="edit" iconStyle={{color: 'ghostwhite'}}/>
            </Pressable>
            <Pressable style={styles.deleteIcon} onPress={() => {console.log("Trash clicked")}}>
                <Icon type="material" name="delete" iconStyle={{color: 'ghostwhite'}}/>
            </Pressable>
            <Pressable style={styles.addIcon} onPress={() => {console.log("Add clicked")}}>
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
                                return <InventoryItemCard key={element.fixedAssetId} {...element}/>
                            }
                        }
                        )
                    }
                </ThemedView>
            </Suspense>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        borderColor: 'black',
        borderRadius: 15,
        paddingVertical: 20,
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
        top: "2%",
        left: "47.5%",
        backgroundColor: 'purple',
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 100,
    },
    editIcon: {
        position: "absolute",
        top: "2%",
        left: "10%",
        backgroundColor: 'purple',
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 100
    },
    addIcon: {
        position: "absolute",
        top: "2%",
        right: "10%",
        backgroundColor: 'purple',
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 100
    }
})

export default InventoryItemList;