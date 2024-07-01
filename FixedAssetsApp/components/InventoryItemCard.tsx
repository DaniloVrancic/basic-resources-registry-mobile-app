import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { InventoryItem } from "@/app/data_interfaces/inventory-item";


const InventoryItemCard: React.FC<InventoryItem> = ({
    currentEmployeeId,
    currentLocationId,
    fixedAssetId,
    newEmployeeId,
    newLocationId
}) => {
    const textColor = useThemeColor({}, 'text');


    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
            <ThemedText type='title'>Inventory List</ThemedText>
            <ThemedText type="defaultSemiBold">Fixed Asset:</ThemedText>
            <ThemedText type="subtitle">{fixedAssetId}</ThemedText>
            <ThemedView style={styles.transferContainer}>
                <ThemedText style={styles.transferText}>Person in Charge: {currentEmployeeId}</ThemedText>
                <Ionicons name="arrow-forward-sharp" size={32} color={textColor}/>
                <ThemedText style={styles.transferText}>{newEmployeeId}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.transferContainer}>
                <ThemedText style={styles.transferText}>Location of Asset: {currentLocationId}</ThemedText>
                <Ionicons name="arrow-forward-sharp" size={32} color={textColor}/>
                <ThemedText style={styles.transferText}>{newLocationId}</ThemedText>
            </ThemedView>
        </ThemedView>
    );
}

export default InventoryItemCard;

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5, 
        padding: 10,
        marginVertical: 5,
        margin: 5
    },
    transferContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        fontSize: 10,
        fontWeight: 300
    },
    transferText: {
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