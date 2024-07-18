import { InventoryList } from '@/app/data_interfaces/inventory-list';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import React, { Suspense, useEffect, useState } from 'react';
import { ThemedView } from './ThemedView';
import LoadingAnimation from './fallback/LoadingAnimation';
import { ThemedText } from './ThemedText';
import { getItemsForList, getItemsFromViewForListId } from '@/db/db';
import InventoryItemCard from './InventoryItemCard';
import { InventoryItem } from '@/app/data_interfaces/inventory-item';
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TransferList } from '@/app/data_interfaces/transfer-list';

let db: SQLiteDatabase;
const InventoryItemList: React.FC<InventoryList> = ({
    id,
    name
}) => {
    const textColor = useThemeColor({}, 'text');
    let parametersForList;

    db = useSQLiteContext();
    const [loadedItems, setLoadedItems]: any = useState([]);

    useEffect(() => {
        loadItemsForList(db, id);
      }, [id]);

    const loadItemsForList = async (db: SQLiteDatabase, id: number) => {
        try {
            setLoadedItems(await getItemsFromViewForListId(db, id));
        } catch (error) {
          console.error('Error loading Items For List: ', error);
        }
      };


    return (
        <ThemedView lightColor='#17153B' darkColor='ghostwhite' style={styles.listContainer}>
            <ThemedText lightColor='ghostwhite' darkColor='#17153B' style={styles.listTitle} type='subtitle'>{name}</ThemedText>
            <Suspense fallback={<LoadingAnimation text="Loading Inventory Items..." />}>
                <ThemedView style={{borderRadius: 10}}>
                    {
                        loadedItems.map((element: TransferList) => 
                            <InventoryItemCard key={element.fixedAssetId} {...element}/>
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
        paddingVertical: 12,
        paddingHorizontal: 5,
    },
    listTitle: {
        textAlign: 'center'
    }
})

export default InventoryItemList;