import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MapView, { Marker } from 'react-native-maps';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useOppositeThemeColor } from '@/hooks/useOppositeThemeColor';
import { Location } from '@/app/data_interfaces/location';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { addLocation } from '@/db/db';

let db: SQLiteDatabase;
const AddLocationForm: React.FC<any> = ({onAddNewLocation}) => {
  const [locationName, setLocationName] = useState('');
  const [locationSize, setLocationSize] = useState('');
  const [markerCoords, setMarkerCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  db = useSQLiteContext();

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoords({ latitude, longitude });
  };

  const handleSaveLocation = async () => {
    // Validate the inputs
    if (!locationName || !locationSize || !markerCoords) {
      Alert.alert('Error', 'Please fill in all fields and place the marker on the map.');
      return;
    }

    const newLocation: any = {
      name: locationName,
      size: parseFloat(locationSize),
      latitude: markerCoords.latitude,
      longitude: markerCoords.longitude,
    };

    
    Alert.alert("Added new location", "New location has been saved.");
    var newAddedLocation = await addLocation(db, newLocation);

    console.log(newAddedLocation);
    
    // Reset state after saving
    setLocationName('');
    setLocationSize('');
    setMarkerCoords(null);
    onAddNewLocation(); //Trigger this method
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Location Name"
        value={locationName}
        onChangeText={setLocationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Location Size (m2)"
        value={locationSize}
        keyboardType="numeric"
        onChangeText={setLocationSize}
      />
      <MapView style={styles.map} onPress={handleMapPress}>
        {markerCoords && (
          <Marker
            coordinate={markerCoords}
            draggable
            onDragEnd={(e) => setMarkerCoords(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>
      <ThemedView style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={handleSaveLocation}>
          <ThemedText style={styles.buttonText}>Save</ThemedText>
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
          <ThemedText style={styles.buttonText}>Cancel</ThemedText>
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
    height: 300,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
