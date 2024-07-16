import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { InventoryItem } from "@/app/data_interfaces/inventory-item";


const InventoryItemCard: React.FC<InventoryItem> = ({
    currentEmployeeId,
    currentLocationId,
    fixed_asset_id,
    new_employee_id,
    newLocationId
}) => {
    const textColor = useThemeColor({}, 'text');


    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
            <ThemedText type="defaultSemiBold">Fixed Asset:</ThemedText>
            <ThemedText type="subtitle">{fixed_asset_id}</ThemedText>
            <ThemedView style={styles.transferContainer}>
                <ThemedText style={styles.transferText}>Person in Charge:</ThemedText>
                <ThemedText style={[styles.transferText, styles.transferTextValue]}>{currentEmployeeId}</ThemedText>
                <Ionicons name="arrow-forward-sharp" size={32} style={{marginBottom: 5, paddingBottom: 3}} color={textColor}/>
                <ThemedText style={[styles.transferText, styles.transferTextValue]}>{new_employee_id}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.transferContainer}>
            <ThemedText style={styles.transferText}>Location of Asset:</ThemedText>
            <ThemedText style={[styles.transferText, styles.transferTextValue]}>{currentLocationId}</ThemedText>
                <Ionicons name="arrow-forward-sharp" size={32} color={textColor}/>
                <ThemedText style={[styles.transferText, styles.transferTextValue]}>{newLocationId}</ThemedText>
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
        textAlign: 'right',
        gap: 12,
        paddingHorizontal: 6,
    },
    transferTextValue: {
        fontSize: 20,
        paddingTop: 4
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