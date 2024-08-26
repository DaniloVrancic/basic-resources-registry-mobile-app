import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, Modal, Pressable, Alert, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from './ThemedView';
import { Location } from '@/app/data_interfaces/location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GestureHandlerRootView, LongPressGestureHandler, ScrollView, State } from 'react-native-gesture-handler';
import { FixedAsset } from '@/app/data_interfaces/fixed-asset';
import FixedAssetCard from './FixedAssetCard';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { deleteLocationById, getFixedItemsForLocationId, updateLocation } from '@/db/db';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Button, Icon } from '@rneui/themed';
import { useOppositeThemeColor } from '@/hooks/useOppositeThemeColor';
import { useTranslation } from 'react-i18next';
import useOrientation from '@/hooks/useOrientation';
import { ORIENTATION } from '@/constants/orientation';


let db: SQLiteDatabase;
let orientation: string;
const LocationMap: React.FC<any> = ( {
    locationState, 
    setLocationState,
    onDeleteLocation = () => {}

} ) => {

            db = useSQLiteContext();
            orientation = useOrientation();
            const {t} = useTranslation();
            const textColor = useThemeColor({}, 'text');
            const oppositeTextColor = useOppositeThemeColor({}, 'text');
  
            const currentLocation: any = {id: locationState.id, name: locationState.name, size: locationState.size, latitude: locationState.latitude, longitude: locationState.longitude};

            const [markerPosition, setMarkerPosition] = useState({ latitude: currentLocation.latitude, longitude: currentLocation.longitude });
            const [showAssetList, setShowAssetList] = useState(false);
            const [loadedAssets, setLoadedAssets] = useState([]);

            const [inputName, setInputName] = useState<string>(locationState.name);
            const [inputSize, setInputSize] = useState<number>(locationState.size);

            const [editMode, setEditMode] = useState<boolean>(false);
            
            const handleEditPress = (e: any) => {
                setEditMode(!editMode);
            }

            const loadAssetsForThisLocation= async (db: SQLiteDatabase, id: number) => {
                try{
                    setLoadedAssets(await getFixedItemsForLocationId(db, currentLocation.id));
                }
                catch(error){
                    console.error("Failed to load Assets for this location (ID = " + id + ")");
                    console.error(error);
                }
            }

            const handlePinClick = () => {
                setShowAssetList(true);
                loadAssetsForThisLocation(db, currentLocation.id);
            };

            const handleMarkerDragEnd = (e: any) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setMarkerPosition({ latitude, longitude });
              };

              const handleSave = async () => {
                try {
                  var locationStateToSave: Location = {id: locationState.id, name: inputName, size: inputSize, latitude: markerPosition.latitude, longitude: markerPosition.longitude}
                  let changes = await updateLocation(db, locationStateToSave); // Updates location in DB
                  setLocationState(locationStateToSave);
                  Alert.alert(t('alertMessages.locationUpdated'), t('alertMessages.locationUpdatedMessage'));
                  setEditMode(false);
                  
                } catch (error) {
                  console.error("Failed to update location:", error);
                  Alert.alert(t('alertMessages.error'), t('alertMessages.locationUpdateError'));
                }
              };

              const handleChangeSize = (myNumber: any) => {

                if(isNaN(parseInt(myNumber)))
                {
                    myNumber.replace("NaN", "");
                    setInputSize(0);
                }
                else{
                    setInputSize(parseInt(myNumber));
                    if(isNaN(inputSize)){
                        setInputSize(0);
                    }
                }
            }

            
    const confirmDeleteLocationAlert = (id: number) =>
        {
            Alert.alert(t('alertMessages.confirmDeletion'), t('alertMessages.deleteLocationQuestion'), [
                {
                  text: t('labels.cancel'),
                  onPress: () => {},
                  style: 'cancel'
                },
                {text: t('labels.ok'), onPress: () => handleDeleteItem(id)},
              ]);
        }

        const handleDeleteItem = async (id: number) => {
            try{
                let result = await deleteLocationById(db, id);
                onDeleteLocation && onDeleteLocation();
            }
            catch(error){
                console.error(error);
            }
        }
    

            return (
                <GestureHandlerRootView>
                <ThemedView style={(orientation === ORIENTATION.PORTRAIT) ? styles.container : styles.containerLandscape}>
                    
                    { (orientation=== ORIENTATION.PORTRAIT) ?
                        <ThemedView style={styles.header} lightColor='#17153B' darkColor='#17153B'>
                        
                        <ThemedView style={[styles.transparentBackground, styles.alignCenterAll, styles.wrapContainer]}>
                                <ThemedText lightColor='ghostwhite' darkColor='ghostwhite' style={styles.title}>{t('locations.location')}:</ThemedText>
                                <TextInput  value={inputName} 
                                                        onChangeText={setInputName}
                                                        style={[{color: oppositeTextColor, fontSize: 18, flexWrap: 'wrap'}, styles.textInput, (editMode) ? {color: 'yellow'} : {color: 'ghostwhite'}]} 
                                                        readOnly={!editMode}/>
                        </ThemedView>
                        <ThemedView style={[styles.transparentBackground, styles.alignCenterAll, styles.wrapContainer]}>
                                <ThemedText lightColor='ghostwhite' darkColor='ghostwhite' style={styles.title}>{t('labels.size')}:</ThemedText>
                                <ThemedView style={[styles.transparentBackground, {flexDirection:'row'}]}>
                                <TextInput  value={inputSize.toString()} 
                                                        onChangeText={handleChangeSize}
                                                        style={[{color: oppositeTextColor, fontSize: 18, flexWrap: 'wrap'}, styles.textInput, (editMode) ? {color: 'yellow'} : {color: 'ghostwhite'}]} 
                                                        readOnly={!editMode}/><ThemedText style={[styles.transparentBackground, {color:'ghostwhite', fontSize:18, alignSelf:'center'}]}>m2</ThemedText>
                                </ThemedView>
                        </ThemedView>
                        

                        <ThemedView style={[{position:"absolute", backgroundColor:'rgba(0,0,0,0)',right: 20, top: 20}]}>
                            <Icon name='edit' type='material' iconStyle={(editMode) ? ({color: 'lime', backgroundColor:'ghostwhite', padding: 7, borderRadius: 100}) : ({color:'black', backgroundColor:'purple', padding: 7, borderRadius: 100})} onPress={handleEditPress}/>
                        </ThemedView>
                        <ThemedView style={[{position:"absolute", backgroundColor:'rgba(0,0,0,0)',right: 20, bottom: 20}]}>
                            <Icon name='delete' type='material' iconStyle={({color:'ghostwhite', backgroundColor:'purple', padding: 7, borderRadius: 100})} onPress={() => {confirmDeleteLocationAlert(locationState.id)}}/>
                        </ThemedView>
                    </ThemedView>
                    :
                    <ThemedView style={styles.headerLandscape} lightColor='#17153B' darkColor='#17153B'>
                        
                        <ThemedView style={[styles.transparentBackground, styles.alignCenterAll, styles.wrapContainer]}>
                                <ThemedText lightColor='ghostwhite' darkColor='ghostwhite' style={styles.title}>{t('locations.location')}:</ThemedText>
                                <TextInput  value={inputName} 
                                                        onChangeText={setInputName}
                                                        style={[{color: oppositeTextColor, fontSize: 18, flexWrap: 'wrap'}, styles.textInput, (editMode) ? {color: 'yellow'} : {color: 'ghostwhite'}]} 
                                                        readOnly={!editMode}/>
                        </ThemedView>
                        <ThemedView style={[styles.transparentBackground, styles.alignCenterAll, styles.wrapContainer]}>
                                <ThemedText lightColor='ghostwhite' darkColor='ghostwhite' style={styles.title}>{t('labels.size')}:</ThemedText>
                                <ThemedView style={[styles.transparentBackground, {flexDirection:'row'}]}>
                                <TextInput  value={inputSize.toString()} 
                                                        onChangeText={handleChangeSize}
                                                        style={[{color: oppositeTextColor, fontSize: 18, flexWrap: 'wrap'}, styles.textInput, (editMode) ? {color: 'yellow'} : {color: 'ghostwhite'}]} 
                                                        readOnly={!editMode}/><ThemedText style={[styles.transparentBackground, {color:'ghostwhite', fontSize:18, alignSelf:'center'}]}>m2</ThemedText>
                                </ThemedView>
                        </ThemedView>
                        

                        {
                            (orientation === ORIENTATION.PORTRAIT) ?
                            <ThemedView>
                                <ThemedView style={[{position:"absolute", backgroundColor:'rgba(0,0,0,0)',right: 20, top: 20}]}>
                                    <Icon name='edit' type='material' iconStyle={(editMode) ? ({color: 'lime', backgroundColor:'ghostwhite', padding: 7, borderRadius: 100}) : ({color:'black', backgroundColor:'purple', padding: 7, borderRadius: 100})} onPress={handleEditPress}/>
                                </ThemedView>
                                <ThemedView style={[{position:"absolute", backgroundColor:'rgba(0,0,0,0)',right: 20, bottom: 20}]}>
                                    <Icon name='delete' type='material' iconStyle={({color:'ghostwhite', backgroundColor:'purple', padding: 7, borderRadius: 100})} onPress={() => {confirmDeleteLocationAlert(locationState.id)}}/>
                                </ThemedView>
                             </ThemedView>
                             :
                             <ThemedView>
                                <ThemedView style={[{position:"absolute", backgroundColor:'rgba(0,0,0,0)', bottom: 10, left: '25%'}]}>
                                    <Icon name='edit' type='material' iconStyle={(editMode) ? ({color: 'lime', backgroundColor:'ghostwhite', padding: 7, borderRadius: 100}) : ({color:'black', backgroundColor:'purple', padding: 7, borderRadius: 100})} onPress={handleEditPress}/>
                                </ThemedView>
                                <ThemedView style={[{position:"absolute", backgroundColor:'rgba(0,0,0,0)', bottom: 10, right: '25%'}]}>
                                    <Icon name='delete' type='material' iconStyle={({color:'ghostwhite', backgroundColor:'purple', padding: 7, borderRadius: 100})} onPress={() => {confirmDeleteLocationAlert(locationState.id)}}/>
                                </ThemedView>
                             </ThemedView>
                        }
                    </ThemedView>
                    }
                    
              
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: locationState.latitude,
                            longitude: locationState.longitude,
                            latitudeDelta: 0.0920,
                            longitudeDelta: 0.0420,
                        }}>

                        <Marker
                        title={locationState.name}
                        onPress= {handlePinClick}
                        coordinate={{ latitude: locationState.latitude, longitude: locationState.longitude }}
                        draggable={editMode}
                        onDragEnd={handleMarkerDragEnd}/>
                        
                    </MapView>
                  
                   

                    <Modal visible={showAssetList} animationType="slide" onRequestClose={() => {setShowAssetList(false);}}>
                        <ThemedView style={modalStyles.modalContainer}>
                            <ThemedView style={modalStyles.modalHeader}>
                                    <Pressable style={modalStyles.modalCloseButton} onPress={() => {setShowAssetList(false)}}>
                                        <Ionicons name="close" size={24} color={textColor} />
                                    </Pressable>
                                    <Pressable style={[modalStyles.modalSpaceFill]} onPress={() => setShowAssetList(false)}></Pressable>
                            </ThemedView>

                                <ThemedText style={styles.assetListTitle}>{t('locations.assetsAt')} {locationState.name}</ThemedText>
                            <ThemedView style={modalStyles.modalContent}>
                                <ScrollView style={{minHeight:'100%'}}>
                                    {loadedAssets.map((asset: FixedAsset) => 
                                        <ThemedView key={asset.id} style={{marginVertical: 15}}>
                                            <FixedAssetCard key={asset.id} {...asset}></FixedAssetCard>
                                        </ThemedView>
                                    )}
                                    
                                    <ThemedView style={{padding: 100}}></ThemedView>
                                </ScrollView>
                                
                            </ThemedView>
                        </ThemedView>
                     </Modal>

                     {editMode ? (
                            <ThemedView style={styles.buttonContainer}>
                                <Button title={t('labels.save')} onPress={handleSave} />
                                <Button title={t('labels.cancel')} onPress={() => setEditMode(false)} />
                            </ThemedView>
                        ) : (
                                <></>
                        )}
                    
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
        backgroundColor: 'rgba(0,0,0,0.0)',
        marginBottom: 20,
    },
    containerLandscape: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.0)',
        marginBottom: 50
    },
    header: {
        width: '100%',
        padding: 20,
        minHeight: '30%',
        maxHeight: '30%',
        alignItems: 'center',
        borderColor: 'grey',
        borderWidth: 2,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        flex: 2,
    },
    headerLandscape: {
        width: '100%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
        borderColor: 'grey',
        borderWidth: 2,

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    map: {
        width: '100%',
        height: '80%',
        overflow:'hidden',
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
        padding: 3,
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
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0)'
      },
      textInput: {
        paddingHorizontal: 5,
    },
    transparentBackground: {
        backgroundColor: 'rgba(0,0,0,0)'
    },
    alignCenterAll: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapContainer: {
        flexWrap: 'wrap'
    }
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