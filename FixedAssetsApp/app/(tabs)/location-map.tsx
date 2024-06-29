import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';

type LocationMapRouteProp = RouteProp<{ LocationMap: { latitude: number; longitude: number } }, 'LocationMap'>;

const LocationMap: React.FC = () => {
    const route = useRoute<LocationMapRouteProp>();
    const { latitude, longitude } = route.params;
    var myMapView = null;

    if(Platform.OS != 'web'){
        /*
        const Marker = require('react-native-maps');
        const MapView = require('react-native-maps').default;
        myMapView = <MapView
        style={styles.map}
        initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }}
    >
        <Marker coordinate={{ latitude, longitude }} />
    </MapView>
    */
    }

    return (
        <ThemedView style={styles.container}>
            {myMapView}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default LocationMap;