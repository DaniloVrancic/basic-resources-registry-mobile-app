import { FixedAsset } from "@/app/data_interfaces/fixed-asset";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

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

    const defaultImageUrl = "@/assets/images/defaultImage.png";

    return (
        <ThemedView style={styles.fixedAssetCardContainer}>
            <ThemedView style={{flex: 1}}>
                <Image src={defaultImageUrl}
                       resizeMode="cover"
                       onError={() => {console.log('Failed to load image.');}}
                       style={{height: '100%', width: '100%'}}
                       />
            </ThemedView>
            <ThemedView style={{flex: 3}}>
                
            </ThemedView>
        </ThemedView>
    );
}

export default FixedAssetCard;

const styles = StyleSheet.create({

    fixedAssetCardContainer: {
        flexDirection: 'row',
        padding: 8
    },
    
});