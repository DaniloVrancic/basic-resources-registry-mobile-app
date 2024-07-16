import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from './ThemedView';
import { Location } from '@/app/data_interfaces/location';
import MapView, { Marker } from 'react-native-maps';



const LocationMap: React.FC<Location> = ( {id, name, size, latitude, longitude} ) => {

  
            const currentLocation = {id, name, size, latitude, longitude};
            
            return (
                <ThemedView style={styles.container}>
                    <ThemedText style={styles.title}>Chosen Location</ThemedText>
                    
                 
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

                        />
                    </MapView>
                    
                </ThemedView>
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
});