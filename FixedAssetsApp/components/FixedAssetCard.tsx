import { FixedAsset } from "../app/data_interfaces/fixed-asset";
import { useThemeColor } from "../hooks/useThemeColor";
import { Image, Modal, Pressable, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FixedAssetCardDetailedCard from "./FixedAssetDetailedCard";

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

    const [showModal, setShowModal] = useState(false);
    const [fixedAssetDetails, setFixedAssetDetails] = useState({id: id, name: name, description: description, barcode: barcode,
        price: price, creationDate: creationDate, assignedEmployeeId: assignedEmployeeId, assignedLocationId: assignedLocationId, photoUrl: photoUrl
    });

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleDetailsPress = () => {
        openModal();
      };

    return (
        <ThemedView style={styles.fixedAssetCardContainer}>
        <ThemedView lightColor="#17153B" darkColor="ghostwhite" style={styles.cardHeader}>
            <ThemedText lightColor="ghostwhite" darkColor="#17153B" style={styles.cardHeaderText}>{name}</ThemedText>
        </ThemedView>

            <ThemedView style={styles.cardImageTextSeperator}>
                <ThemedView style={{flex: 2}}>
                        <Image style={styles.imageTag}
                            resizeMode="cover"
                            source={{uri: 'https://picsum.photos/200'}}
                            onError={() => {console.log('Failed to load image');}} // Optional error handler
                            >
                        </Image>
                </ThemedView>
                <ThemedView style={{flex: 3}}>
                    <ThemedText style={{fontWeight: 600}}>Price: ${price}</ThemedText>
                    <ThemedView style={styles.creationDateContainer}>
                        <ThemedText>Creation Date: </ThemedText>
                        <ThemedText style={{fontWeight: 600}}>{creationDate.toString()}</ThemedText>
                    </ThemedView>
                    <Pressable style={styles.buttonDesign} onPress={handleDetailsPress}>
                        <ThemedText style={styles.buttonText}>More Details</ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>

            <Modal visible={showModal} animationType="slide" transparent={true}>
                <ThemedView lightColor="ghostwhite" darkColor="rgba(0,0,0,1)" style={modalStyles.modalContainer}>

                    <ThemedView style={modalStyles.modalHeader}>
                            <Pressable style={modalStyles.modalCloseButton} onPress={closeModal}>
                                <Ionicons name="close" size={24} color={textColor} />
                            </Pressable>
                            <Pressable style={[modalStyles.modalSpaceFill]} onPress={closeModal}></Pressable>
                    </ThemedView>

                    <ThemedView>
                         <FixedAssetCardDetailedCard {...fixedAssetDetails}/>
                    </ThemedView>
                </ThemedView>
            </Modal>

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
    },
    buttonDesign: {
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
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageTag: {
        width: 100,
        height: 100,
        borderColor: 'grey',
        borderWidth: 2,
        backgroundColor: 'ghostwhite',
        borderRadius: 10,
        alignSelf: 'center',
    }
    
    
});

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 8,
    },
    modalHeader: {
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
        marginRight: 20
    },
    modalCloseButton: {
        justifyContent: 'flex-end',
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(200,200,200, 0.8)',
    },
    modalSpaceFill: {
        flex: 10,
    }

});