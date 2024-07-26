import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Image, Modal, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Employee } from "@/app/data_interfaces/employee";
import EmployeeCardDetailed from "./EmployeeCardDetailed";
import { Avatar } from "@rneui/themed";



const EmployeeCard: React.FC<Employee> = ({
    id,
    name,
    email,
    income,
    photoUrl
}) => {
    const textColor = useThemeColor({}, 'text');
    const defaultImage: any = require('@/assets/images/defaultUserPhoto.png');
    const thisEmployee: Employee = {id: id, name: name, email: email, income: income, photoUrl: photoUrl};

    const [userPhoto, setUserPhoto] = useState(photoUrl);

    const [showModal, setShowModal] = useState(false); //show modal toggle
    const openModal = () => setShowModal(true); //for opening helping window
    const closeModal = () => setShowModal(false); //for closing helping window

    const getInitials = (name: string) => {
        // Split the name by spaces and filter out empty strings
        const nameParts = name.split(' ').filter(part => part.length > 0);
        
        // Get the first 3 initials and capitalize them
        const initials = nameParts.slice(0, 3).map(part => part.charAt(0).toUpperCase());
    
        // Join the initials into a string
        return initials.join('');
    }


    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
          
            <ThemedView style={styles.cardHeader}>
                    <ThemedView style={styles.imageContainer}>
                    <Avatar
                        size={80}
                        rounded
                        containerStyle={{ backgroundColor: 'purple', }}
                        title={getInitials(name)}
                        
                        >
                          
                        </Avatar>
                    </ThemedView>
                    <ThemedText type='title' style={[styles.headerName,{paddingVertical: 10}]}>{thisEmployee.name}</ThemedText>
            </ThemedView>

                <ThemedView style={styles.informationContainer}>
                    <ThemedView style={styles.emailContainer}>
                        <ThemedView style={{flexDirection: 'row'}}>
                            <Ionicons name="mail" size={16} color={'purple'} style={{fontSize: 20, paddingRight: 5, paddingTop: 2}}/>
                            <ThemedText style={{overflow: 'hidden', color: 'purple'}} type="defaultSemiBold">E-mail:</ThemedText>
                        </ThemedView>
                        <ThemedView style={{paddingHorizontal: 10, flexWrap:'wrap'}}>
                            <ThemedText style={{overflow: 'hidden'}} type="defaultSemiBold">{thisEmployee.email}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={{flexDirection: 'row', minWidth: '135%', marginVertical: 5,}}>
                        <ThemedText style={{fontSize: 12, justifyContent: "flex-start", flex: 50}}>Income:</ThemedText>
                        <ThemedText style={{fontSize: 16, fontWeight: 600, justifyContent: "flex-end", flex: 50}}>${thisEmployee.income}/year</ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.buttonContainer}>
                        <Pressable
                            style={styles.showOnEmployeeButton}
                            onPress={openModal}>
                            <ThemedText style={styles.showOnEmployeeButtonText}>Show Larger View</ThemedText>
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
                         <EmployeeCardDetailed {...thisEmployee}/>
                    </ThemedView>
                </ThemedView>
            </Modal>

        </ThemedView>
        

        
    );
}

export default EmployeeCard;

const imageStyles = StyleSheet.create({
    imageStyle: {
        width: '100%',
        height: '100%',
        aspectRatio: 1
    }
})

const styles = StyleSheet.create({ //Stylesheet for this card
    cardContainer: {
        maxHeight: 450,
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: 'purple',
        borderRadius: 5, 
        paddingBottom: 12,
        flexWrap: 'wrap',
        marginVertical: 5,
        overflow: 'scroll',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 2
    },
    cardHeader: {
        backgroundColor: '#17153B',
        borderColor: 'black',
        borderWidth: 2,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        alignItems: 'center',
        minWidth: '95%',
        maxWidth: '100%'
    },
    headerName:{
        color: 'ghostwhite'
    },
    showOnEmployeeButton: {
        backgroundColor: 'rgb(106, 27, 154)', // Purple-blueish color
        padding: 12,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'flex-end',
        alignSelf: 'center',
        width: '50%',
    },
    showOnEmployeeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    informationContainer: {
        padding: 10,
    },
    imageContainer: {

        marginVertical: 10,
        borderColor: 'grey',
        backgroundColor: 'rgba(0,0,0,0.0)',
        
    },
    imageTag: {
        width: 80,
        height: 80,
        marginVertical: 10,
        borderColor: 'grey',
        borderWidth: 2,
        backgroundColor: 'ghostwhite',
        borderRadius: 100,
    },
    emailContainer:{
        borderWidth: 1,
        borderColor: 'purple',
        borderRadius: 10,
        maxWidth: '100%',
        minWidth: '95%',
        padding: 10,
        flexDirection: 'column'
    },
    buttonContainer:{
        maxWidth: '100%',
        minWidth: '99%'
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