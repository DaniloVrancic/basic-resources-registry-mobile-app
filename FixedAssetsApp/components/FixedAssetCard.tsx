import { FixedAsset } from "../app/data_interfaces/fixed-asset";
import { useThemeColor } from "../hooks/useThemeColor";
import { Image, StyleSheet } from "react-native";
<<<<<<< HEAD
import { ThemedView } from "../components/ThemedView";
=======
import { ThemedView } from "@/components/ThemedView";
>>>>>>> fbd2a4c (MP 1.4.22: Finished Fixed Asset Card)
import { ThemedText } from "./ThemedText";

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
            <ThemedView style={styles.cardImageTextSeperator}>

            
                <ThemedView style={{flex: 1}}>
                    <Image src={defaultImageUrl}
                        resizeMode="cover"
                        onError={() => {console.log('Failed to load image.');}}
                        style={{width: '100%'}}
                        />
                </ThemedView>
                <ThemedView style={{flex: 3}}>
                    <ThemedText>Name: {name}</ThemedText>
                    <ThemedText>Description: {description}</ThemedText>
                    <ThemedText>Barcode: {barcode}</ThemedText>
                    <ThemedText>Price: {price}</ThemedText>
                    <ThemedText>Creation Date: {creationDate.toUTCString()}</ThemedText>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

export default FixedAssetCard;

const styles = StyleSheet.create({

    fixedAssetCardContainer: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5, 
        padding: 10,
        marginVertical: 5,
        margin: 5,
        flexDirection: 'column',
    },
    cardImageTextSeperator: {
        flexDirection: 'row'
    },
    
});