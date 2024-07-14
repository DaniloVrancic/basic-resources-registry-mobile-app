import { FixedAsset } from "../app/data_interfaces/fixed-asset";
import { useThemeColor } from "../hooks/useThemeColor";
import { Image, Pressable, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

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
        <ThemedView lightColor="#17153B" darkColor="ghostwhite" style={styles.cardHeader}>
            <ThemedText lightColor="ghostwhite" darkColor="#17153B" style={styles.cardHeaderText}>{name}</ThemedText>
        </ThemedView>

            <ThemedView style={styles.cardImageTextSeperator}>
                <ThemedView style={{flex: 1}}>
                    <Image src={defaultImageUrl}
                        resizeMode="cover"
                        onError={() => {console.log('Failed to load image.');}}
                        style={{width: '100%'}}
                        />
                </ThemedView>
                <ThemedView style={{flex: 3}}>
                    <ThemedText style={{fontWeight: 600}}>Price: ${price}</ThemedText>
                    <ThemedView style={styles.creationDateContainer}>
                        <ThemedText>Creation Date: </ThemedText>
                        <ThemedText style={{fontWeight: 600}}>{creationDate.toString()}</ThemedText>
                    </ThemedView>
                    <Pressable>
                        
                    </Pressable>
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
        borderRadius: 15, 
        paddingBottom: 10,
        flexDirection: 'column',
        overflow: 'hidden'
    },
    cardHeader: {
        borderWidth: 2,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginBottom: 15
    },
    cardHeaderText: {
        fontSize: 18,
        fontWeight: 700
    },
    cardImageTextSeperator: {
        paddingHorizontal: 10,
        flexDirection: 'row'
    },
    creationDateContainer:{
        marginTop: 10,
        flexDirection: 'row',
        maxWidth: "100%",
        flexWrap: 'wrap'
    }
    
});