import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp, useRoute } from '@react-navigation/native';

type LocationMapRouteProp = RouteProp<{ LocationMap: { latitude: number; longitude: number } }, 'LocationMap'>;

const LocationMap: React.FC = () => {
    const route = useRoute<LocationMapRouteProp>();
    const { latitude, longitude } = route.params;

    return (
        <View style={styles.container}>
            <MapView
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
        </View>
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