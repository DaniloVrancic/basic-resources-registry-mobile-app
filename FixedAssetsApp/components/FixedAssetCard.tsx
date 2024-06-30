import { FixedAsset } from "@/app/data_interfaces/fixed-asset";
import { ThemedView } from "./ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";

const FixedAssetCard: React.FC<FixedAsset> = ({
    id,
    name,
    description,
    barcode,
    price,
    creationDate,
    assignedEmployeeId, // Reference to Employee
    assignedLocationId, // Reference to Location
    photoUrl
}) => {
    const textColor = useThemeColor({}, 'text');

    return (
        <ThemedView></ThemedView>
    );
}

export default FixedAssetCard;

const styles = StyleSheet.create({

    fixedAssetCardContainer: {
        padding: 8
    },
    
});