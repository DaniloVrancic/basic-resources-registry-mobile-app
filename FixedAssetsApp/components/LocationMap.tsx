import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';


interface LocationMapProps {
    route: {
        params: {
            name: string;
            latitude: number;
            longitude: number;
        };
    };
}

const LocationMap: React.FC<LocationMapProps> = ({ route }) => {
    const { name, latitude, longitude } = route.params;

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