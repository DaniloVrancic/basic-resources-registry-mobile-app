import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Location } from "@/app/data_interfaces/location";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";


const LocationCard: React.FC<Location> = ({
    id,
    name,
    size,
    latitude,
    longitude
}) => {
    const textColor = useThemeColor({}, 'text');

    type RootStackParamList = {
        LocationMap: { name: string; latitude: number; longitude: number };
        // other routes can be defined here
      };
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'LocationMap'>>();

    const handleShowOnMap = () => {
        navigation.navigate('LocationMap', { name, latitude, longitude });
    };

    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
            <ThemedText type='title'>{name}</ThemedText>
            <ThemedText type="defaultSemiBold">Size of area: {size} m2</ThemedText>
            <ThemedView style={styles.coordinatesContainer}>
                <Ionicons name="pin-outline" size={32} color={textColor} style={styles.coordinateText}/>
                <ThemedText style={styles.coordinateText}>Latitude: {latitude}</ThemedText>
                <ThemedText style={styles.coordinateText}>Longitude: {longitude}</ThemedText>
            </ThemedView>

            <Pressable
                style={styles.showOnMapButton}
                onPress={handleShowOnMap}>
                <ThemedText style={styles.showOnMapButtonText}>Show on Map</ThemedText>
            </Pressable>
        </ThemedView>
    );
}

export default LocationCard;

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5, 
        padding: 10,
        marginVertical: 5,
        margin: 5
    },
    coordinatesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        fontSize: 10,
        fontWeight: 300
    },
    coordinateText: {
        gap: 12,
        paddingHorizontal: 6
    },
    showOnMapButton: {
        backgroundColor: 'rgb(106, 27, 154)', // Purple-blueish color
        padding: 12,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    showOnMapButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});