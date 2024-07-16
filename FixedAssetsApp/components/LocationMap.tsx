import React, { useState } from 'react';
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



const LocationMap: React.FC<Location> = ( {id, name, size, latitude, longitude} ) => {

            const textColor = useThemeColor({}, 'text');
  
            const currentLocation = {id, name, size, latitude, longitude};
            const [showAssetList, setShowAssetList] = useState(false);
            
            const fixedAssets: FixedAsset[] = [];

            const handlePinClick = () => {
                setShowAssetList(true);
            };
            return (
                <GestureHandlerRootView>
                <ThemedView style={styles.container}>
                    <ThemedText style={styles.title}>Location: {name}</ThemedText>
                    <ThemedText style={styles.title}>Size: {size}m2</ThemedText>
                    
                 
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        
                        <Marker
                            coordinate={{ latitude, longitude }}
                            title={name}
                            onPress= {handlePinClick}
                            />
                        
                    </MapView>


                    <Modal visible={showAssetList} animationType="slide">
                            <ThemedView style={modalStyles.modalHeader}>
                                    <Pressable style={modalStyles.modalCloseButton} onPress={() => {setShowAssetList(false)}}>
                                        <Ionicons name="close" size={24} color={textColor} />
                                    </Pressable>
                                    <Pressable style={[modalStyles.modalSpaceFill]} onPress={() => setShowAssetList(false)}></Pressable>
                            </ThemedView>
                        <ThemedView style={styles.assetListContainer}>
                            <ThemedText style={styles.assetListTitle}>Assets at {name}</ThemedText>
                            <ScrollView>
                                {fixedAssets.map((asset) => (
                                    <ThemedView key={asset.id} style={styles.assetItem}>
                                        <FixedAssetCard key={asset.id} {...asset}></FixedAssetCard>
                                    </ThemedView>
                                ))}
                            </ScrollView>
                            
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
    assetListContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    assetListTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
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
    marginVertical: 10,
    marginRight: 5,
    borderRadius: 50,
    backgroundColor: 'rgba(200,200,200, 0.8)',
    },
    modalSpaceFill: {
        flex: 10,
    }
    })