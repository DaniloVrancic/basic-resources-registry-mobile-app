import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, Modal, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from './ThemedView';
import { Location } from '@/app/data_interfaces/location';
import MapView, { Marker } from 'react-native-maps';
import { GestureHandlerRootView, LongPressGestureHandler, ScrollView, State } from 'react-native-gesture-handler';
import { FixedAsset } from '@/app/data_interfaces/fixed-asset';
import FixedAssetCard from './FixedAssetCard';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getFixedItemsForLocationId } from '@/db/db';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';


let db: SQLiteDatabase;
const LocationMap: React.FC<Location> = ( {id, name, size, latitude, longitude} ) => {

            db = useSQLiteContext();
            const textColor = useThemeColor({}, 'text');
  
            const currentLocation = {id, name, size, latitude, longitude};
            const [showAssetList, setShowAssetList] = useState(false);
            const [loadedAssets, setLoadedAssets] = useState([]);
            

            const loadAssetsForThisLocation= async (db: SQLiteDatabase, id: number) => {
                try{
                    setLoadedAssets(await getFixedItemsForLocationId(db, id));
                }
                catch(error){
                    console.error("Failed to load Assets for this location (ID = " + id + ")");
                    console.error(error);
                }
            }

            const handlePinClick = () => {
                setShowAssetList(true);
                loadAssetsForThisLocation(db, id);
            };
            return (
                <GestureHandlerRootView>
                <ThemedView style={styles.container}>
                    <ThemedView style={styles.header} lightColor='#17153B' darkColor='ghostWhite'>
                        <ThemedText lightColor='ghostwhite' darkColor='#17153B' style={styles.title}>Location: {name}</ThemedText>
                        <ThemedText lightColor='ghostwhite' darkColor='#17153B' style={styles.title}>Size: {size}m2</ThemedText>
                    </ThemedView>
                    
              
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.0920,
                            longitudeDelta: 0.0420,
                        }}
                    >
                        
                        <Marker
                            coordinate={{ latitude, longitude }}
                            title={name}
                            onPress= {handlePinClick}
                            />
                        
                    </MapView>
                  
                   

                    <Modal visible={showAssetList} animationType="slide">
                        <ThemedView style={modalStyles.modalContainer}>
                            <ThemedView style={modalStyles.modalHeader}>
                                    <Pressable style={modalStyles.modalCloseButton} onPress={() => {setShowAssetList(false)}}>
                                        <Ionicons name="close" size={24} color={textColor} />
                                    </Pressable>
                                    <Pressable style={[modalStyles.modalSpaceFill]} onPress={() => setShowAssetList(false)}></Pressable>
                            </ThemedView>

                                <ThemedText style={styles.assetListTitle}>Assets at {name}</ThemedText>
                            <ThemedView style={modalStyles.modalContent}>
                                <ScrollView>
                                    {loadedAssets.map((asset: FixedAsset) => 
                                        <ThemedView key={asset.id} style={{paddingVertical: 20}}>
                                            <FixedAssetCard key={asset.id} {...asset}></FixedAssetCard>
                                        </ThemedView>
                                    )}
                                </ScrollView>
                                
                            </ThemedView>
                        </ThemedView>
                     </Modal>
                    
                </ThemedView>
                </GestureHandlerRootView>
            );
        

    
};

export default LocationMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.0)'
    },
    header: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
        borderColor: 'grey',
        borderWidth: 2,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    map: {
        width: '100%',
        height: '80%',
    },
    assetListTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 2,
        borderColor: 'grey',
        width: '100%',
        paddingLeft: '5%'
    },
    assetItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    assetItemText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 8,
        width: '100%',

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
    modalCloseButton: {
        justifyContent: 'flex-end',
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 10,
    marginRight: 5,
    borderRadius: 50,
    backgroundColor: 'rgba(200,200,200, 0.8)',
    },
    modalContent : {
        width: '90%',
        alignSelf: 'center'
    },
    modalSpaceFill: {
        flex: 10,
    }

    })