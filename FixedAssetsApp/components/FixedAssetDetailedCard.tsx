import { FixedAsset } from "@/app/data_interfaces/fixed-asset"
import { ThemedView } from "./ThemedView"
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";
import { Image } from "react-native";

const FixedAssetCardDetailedCard: React.FC<FixedAsset> = ({
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
            <ThemedView style={styles.cardContainer}>
                <ThemedView lightColor="#17153B" style={styles.cardHeader}>
                    <ThemedView style={styles.imageContainer}>
                        <Image style={styles.imageTag}
                            resizeMode="cover"
                            source={{uri: 'https://picsum.photos/200'}}
                            onError={() => {console.log('Failed to load image');}} // Optional error handler
                            >
                        </Image>
                    </ThemedView>
                    <ThemedView style={styles.headerTextContainer}>

                    
                        <ThemedView style={{flexDirection: 'column', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.0)'}}>
                            <ThemedText lightColor="ghostwhite">Product_ID: {id}</ThemedText>
                            <ThemedText lightColor="ghostwhite">Name: {name}</ThemedText>
                            <ThemedText lightColor="ghostwhite">Price: {price}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                        <ThemedView style={styles.descriptionContainer}>
                            <ThemedText style={styles.descriptionTitle}>Description:</ThemedText> 
                            <ThemedText style={styles.descriptionContent}>{description}</ThemedText>   
                        </ThemedView>


                        <ThemedView style={styles.itemsInColumn}>
                            <ThemedText>Barcode: {barcode}</ThemedText>
                            <ThemedText>Creation Date: {creationDate.toString()}</ThemedText>
                            <ThemedText>Assigned Employee (ID): {assignedEmployeeId}</ThemedText>
                            <ThemedText>Assigned Location (ID): {assignedLocationId}</ThemedText>
                        </ThemedView>
                        
                        
                        <ThemedView style={styles.itemsInColumn}>
                            <ThemedText>Photo (URL):</ThemedText>
                            <ThemedText>{photoUrl}</ThemedText>
                        </ThemedView>
                    </ThemedView>
            
          )
}

export default FixedAssetCardDetailedCard;

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'column',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden'
    },
    cardHeader: {
        flexDirection: 'row',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    cardContent: {
        flexDirection: 'column'
    },
    imageTag: {
        width: 150,
        height: 150,
        borderColor: 'grey',
        borderWidth: 2,
        backgroundColor: 'ghostwhite',
        borderRadius: 10,
    },
    imageContainer: {
        flex: 3,
        backgroundColor: 'rgba(0,0,0,0.0)'
    },
    headerTextContainer: {
        flex: 3,
        paddingVertical: 5,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.0)',
        flexWrap: 'wrap'
    },
    descriptionContainer: {
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: 'grey',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'ghostwhite'
    },
    descriptionTitle: {
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 700
    },
    descriptionContent: {
        marginHorizontal: 10
    },
    itemsInColumn: {
        alignItems: 'center',
        marginVertical: 5
    }
    

});