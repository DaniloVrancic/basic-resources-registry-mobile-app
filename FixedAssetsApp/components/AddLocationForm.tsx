import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MapView, { Marker,  PROVIDER_GOOGLE } from 'react-native-maps';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { addLocation } from '@/db/db';
import { useTranslation } from 'react-i18next';


let db: SQLiteDatabase;
const AddLocationForm: React.FC<any> = ({onAddNewLocation}) => {
  const [locationName, setLocationName] = useState('');
  const [locationSize, setLocationSize] = useState('');
  const [markerCoords, setMarkerCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const textColor = useThemeColor({}, 'text');

  const {t} = useTranslation();

  db = useSQLiteContext();

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoords({ latitude, longitude });
  };

  const handleSaveLocation = async () => {
    // Validate the inputs
    if (!locationName || !locationSize || !markerCoords) {
      Alert.alert(t('alertMessages.error'), t('errorMessages.fillFieldsAndPlaceMapMarker')+'.');
      return;
    }

    const newLocation: any = {
      name: locationName,
      size: parseFloat(locationSize),
      latitude: markerCoords.latitude,
      longitude: markerCoords.longitude,
    };

    
    
    var newAddedLocation = await addLocation(db, newLocation);

    
    // Reset state after saving
    setLocationName('');
    setLocationSize('');
    setMarkerCoords(null);
    onAddNewLocation(); //Trigger this method

    Alert.alert(t('alertMessages.locationAdded'), t('alertMessages.locationAddedMessage'));
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.input, {color: textColor}]}
        placeholder={t('locations.enterLocationName')}
        placeholderTextColor={textColor}
        value={locationName}
        onChangeText={setLocationName}
      />
      <TextInput
        style={[styles.input, {color: textColor}]}
        placeholder={t('locations.enterLocationSize')}
        placeholderTextColor={textColor}
        value={locationSize}
        keyboardType="numeric"
        onChangeText={setLocationSize}
      />
      <ThemedView style={styles.mapContainer}>
          <MapView style={styles.map} onPress={handleMapPress} provider={PROVIDER_GOOGLE}>
            {markerCoords && (
              <Marker
                coordinate={markerCoords}
                draggable
                onDragEnd={(e) => setMarkerCoords(e.nativeEvent.coordinate)}
              />
            )}
          </MapView>
      </ThemedView>
      <ThemedView style={[styles.buttonContainer]}>
        <Pressable style={styles.saveButton} onPress={handleSaveLocation}>
          <ThemedText style={styles.buttonText}>{t('labels.save')}</ThemedText>
        </Pressable>
        <Pressable
          style={styles.cancelButton}
          onPress={() => {
            // Reset state and clear inputs
            setLocationName('');
            setLocationSize('');
            setMarkerCoords(null);
          }}
          >
          <ThemedText style={styles.buttonText}>{t('labels.cancel')}</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

export default AddLocationForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    minHeight: '100%',
    height: '100%'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  map: {
    flex: 1,
    minHeight: '90%',
    height: '100%',
    marginBottom: 16,
  },
  mapContainer: {
    height: 350
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.0)'
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
