import { InventoryList } from '@/app/data_interfaces/inventory-list';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import React, { Suspense, useEffect, useState } from 'react';
import { ThemedView } from './ThemedView';
import LoadingAnimation from './fallback/LoadingAnimation';
import { ThemedText } from './ThemedText';
import { getItemsForList } from '@/db/db';
import InventoryItemCard from './InventoryItemCard';
import { InventoryItem } from '@/app/data_interfaces/inventory-item';
import { StyleSheet } from 'react-native';

let db: SQLiteDatabase;
const InventoryItemList: React.FC<InventoryList> = ({
    id,
    name
}) => {
    const textColor = useThemeColor({}, 'text');

    db = useSQLiteContext();
    const [loadedItems, setLoadedItems] = useState([]);

    useEffect(() => {
        loadItemsForList(db, id);
      }, [id]);

    const loadItemsForList = async (db: SQLiteDatabase, id: number) => {
        try {
            setLoadedItems(await getItemsForList(db, id));
        } catch (error) {
          console.error('Error loading Items For List: ', error);
        }
      };


    return (
        <ThemedView style={styles.listContainer}>
            <ThemedText style={styles.listTitle} type='subtitle'>{name}</ThemedText>
            <Suspense fallback={<LoadingAnimation text="Loading Inventory Items..." />}>
                <ThemedView>
                    {
                        loadedItems.map((element: InventoryItem) => 
                            <InventoryItemCard key={element.fixed_asset_id} {...element}/>
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