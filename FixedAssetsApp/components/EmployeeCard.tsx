import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Employee } from "@/app/data_interfaces/employee";



const EmployeeCard: React.FC<Employee> = ({
    id,
    name,
    email,
    income,
    photoUrl
}) => {
    const textColor = useThemeColor({}, 'text');
    const defaultImage: any = require('@/assets/images/defaultUserPhoto.png');

    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
            <ThemedView style={styles.cardHeader}>
                    <ThemedView style={styles.imageContainer}>
                    <Image
                        style={styles.imageTag}
                        resizeMode="cover"
                        source={defaultImage}
                        onError={() => {console.log('Failed to load image');}} // Optional error handler
                    />
                    </ThemedView>
                    <ThemedText type='title' style={[styles.headerName,{paddingVertical: 10}]}>{name}</ThemedText>
            </ThemedView>

                <ThemedView style={styles.informationContainer}>
                    <ThemedView style={styles.emailContainer}>
                        <ThemedView style={{flexDirection: 'row'}}>
                            <Ionicons name="mail" size={16} color={'purple'} style={{fontSize: 20, paddingRight: 5, paddingTop: 2}}/>
                            <ThemedText style={{overflow: 'hidden', color: 'purple'}} type="defaultSemiBold">E-mail:</ThemedText>
                        </ThemedView>
                        <ThemedView style={{paddingHorizontal: 10, flexWrap:'wrap'}}>
                            <ThemedText style={{overflow: 'hidden'}} type="defaultSemiBold">{email}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={{flexDirection: 'row', minWidth: '135%', marginVertical: 5,}}>
                        <ThemedText style={{fontSize: 12, justifyContent: "flex-start", flex: 50}}>Income:</ThemedText>
                        <ThemedText style={{fontSize: 16, fontWeight: 600, justifyContent: "flex-end", flex: 50}}>${income}/year</ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.buttonContainer}>
                        <Pressable
                            style={styles.showOnEmployeeButton}
                            onPress={() => {}}>
                            <ThemedText style={styles.showOnEmployeeButtonText}>Show Larger View</ThemedText>
                        </Pressable>
                    </ThemedView>
                </ThemedView>
        </ThemedView>
    );
}

export default EmployeeCard;

const styles = StyleSheet.create({
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