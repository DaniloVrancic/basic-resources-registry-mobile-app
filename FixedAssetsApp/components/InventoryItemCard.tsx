import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { InventoryItem } from "@/app/data_interfaces/inventory-item";
import { TransferList } from "@/app/data_interfaces/transfer-list";


const InventoryItemCard: React.FC<TransferList> = ({
    currentEmployeeId,
    currentEmployeeName,
    currentLocationId,
    currentLocationName,
    fixedAssetId,
    fixedAssetName,
    newEmployeeName,
    new_employee_id,
    newLocationId,
    newLocationName,
    transferListId,
    transferListName
}) => {
    const textColor = useThemeColor({}, 'text');


    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
            <ThemedText type="defaultSemiBold">Fixed Asset:</ThemedText>
            <ThemedText type="subtitle" style={{marginBottom: 15}}>{fixedAssetName}</ThemedText>
            <ThemedView style={styles.transferContainer}>
                <ThemedText style={[styles.transferText, styles.transferHeaderText]}>Person in Charge:</ThemedText>
                    <ThemedView style={styles.transferValues}>
                        { currentEmployeeId === new_employee_id ? (
                                        <ThemedText style={[styles.transferText, styles.transferTextValue]}>{currentEmployeeName}</ThemedText>
                            ) : (
                                <>
                                         <ThemedText style={[styles.transferText, styles.transferTextValue]}>{currentEmployeeName}</ThemedText>
                                         <Ionicons name="arrow-forward-sharp" size={32} style={{marginBottom: 5, paddingBottom: 3}} color={textColor}/>
                                         <ThemedText style={[styles.transferText, styles.transferTextValue]}>{newEmployeeName}</ThemedText>
                                </>
                            )
                        }
                       
                    </ThemedView>
            </ThemedView>
            <ThemedView style={styles.transferContainer}>
                    <ThemedText style={[styles.transferText, styles.transferHeaderText]}>Location of Asset:</ThemedText>
                    <ThemedView style={styles.transferValues}>
                    {currentLocationId === newLocationId ? (
                        <ThemedText style={[styles.transferText, styles.transferTextValue]}>{currentLocationName}</ThemedText>
                    ) : (
                        <>
                            <ThemedText style={[styles.transferText, styles.transferTextValue]}>{currentLocationName}</ThemedText>
                            <Ionicons name="arrow-forward-sharp" size={32} color={textColor}/>
                            <ThemedText style={[styles.transferText, styles.transferTextValue]}>{newLocationName}</ThemedText>
                        </>
                    )}
                    </ThemedView>
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 10,
        fontWeight: 300
    },
    transferHeaderText: {
        textAlign: 'center',
        paddingHorizontal: 6,
        fontWeight: 700
    },
    transferText: {
        textAlign: 'center',
        paddingHorizontal: 6,
    },
    transferTextValue: {
        fontSize: 16,
        flexWrap: 'wrap',
        maxWidth: '90%',
        paddingTop: 4
    },
    transferValues: {
        flexDirection: 'row',
        alignSelf: 'center'
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