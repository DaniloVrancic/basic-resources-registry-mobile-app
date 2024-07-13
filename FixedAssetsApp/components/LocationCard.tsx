import React from "react";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Location } from "@/app/data_interfaces/location";
import { useOppositeThemeColor } from "@/hooks/useOppositeThemeColor";


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
            <ThemedText style={styles.centerTextContainer} type='title'>{name}</ThemedText>
            <ThemedText style={styles.centerTextContainer} type="defaultSemiBold">Size of area: {size} m2</ThemedText>

            <ThemedView style={styles.fullCoordinatesSection}>
             <Ionicons name="earth" size={32} color={useThemeColor({}, 'text')} style={{textAlign: 'center'}}/>
                <ThemedView style={styles.coordinatesContainer}>
                    <ThemedText style={styles.coordinateText}><ThemedText style={{fontWeight: "700"}}>Latitude:</ThemedText> {latitude}</ThemedText>
                    <ThemedText style={styles.coordinateText}><ThemedText style={{fontWeight: "700"}}>Longitude:</ThemedText> {longitude}</ThemedText>
                </ThemedView>
            </ThemedView>

            <Pressable
                style={styles.showOnMapButton}
                onPress={handleShowOnMap}>
                <Ionicons name="pin-outline" size={32} color={useOppositeThemeColor({}, 'text')} style={styles.coordinateText}/>
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
        borderRadius: 10, 
        padding: 10,
        marginVertical: 5,
        margin: 5,
    },
    coordinatesContainer: {
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        fontSize: 10,
        fontWeight: 300
    },
    coordinateText: {
        textAlign: 'center',
        gap: 12,
        paddingHorizontal: 6
    },
    showOnMapButton: {
        flexDirection: 'row',
        backgroundColor: 'rgb(106, 27, 154)', // Purple-blueish color
        paddingVertical: 5,
        paddingRight: 12,
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
    centerTextContainer: {
        textAlign: 'center'
    },
    fullCoordinatesSection: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 24,
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 15,
        marginVertical: 5,
    }
});