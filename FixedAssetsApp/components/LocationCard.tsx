import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Location } from "@/app/data_interfaces/location";
import { useOppositeThemeColor } from "@/hooks/useOppositeThemeColor";
import LocationMap from "./LocationMap";


const LocationCard: React.FC<Location> = (
    {id, name, size, latitude, longitude}
) => {
    const thisLocation: Location = {id, name, size, latitude, longitude};
    const textColor = useThemeColor({}, 'text');
    const [showMapModal, setShowMapModal] = useState(false);

    type RootStackParamList = {
        LocationMap: { name: string; latitude: number; longitude: number };
        // other routes can be defined here
      };
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'LocationMap'>>();

    const handleShowOnMap = () => {
        setShowMapModal(true);
    };

    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
            <ThemedView style={[styles.cardHeader]}>
                <ThemedText style={[styles.centerTextContainer, styles.cardHeaderText]} type='title'>{name}</ThemedText>
                <ThemedText style={[styles.centerTextContainer, styles.cardHeaderText]} type="defaultSemiBold">Size of area: {size} m2</ThemedText>
            </ThemedView>

            <ThemedView style={styles.cardContent}>
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

                <Modal visible={showMapModal} animationType="slide">
                    <ThemedView lightColor="ghostwhite" darkColor="rgba(0,0,0,1)" style={modalStyles.modalContainer}>
                        <LocationMap id={id} name={name} size={size} latitude={latitude} longitude={longitude}></LocationMap>
                    
                    </ThemedView>
                    
                </Modal>
        </ThemedView>
    );
}

export default LocationCard;

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1.5,
        borderColor: 'grey',
        borderRadius: 10, 
        paddingBottom: 10,
         overflow: 'hidden'
    },
    cardHeader: {
        backgroundColor: '#17153B',
        borderColor: 'black',
        borderWidth: 2,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        alignItems: 'center',
        minWidth: '95%',
        maxWidth: '100%',
        paddingVertical: 10,
       
    },
    cardHeaderText: {
        color:'ghostwhite'
    },
    cardContent: {
        paddingHorizontal: 12
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

const modalStyles = StyleSheet.create({
    modalContainer: {

    },
    })