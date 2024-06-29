import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { Employee } from "@/app/data_interfaces/employee";



const EmployeeCard: React.FC<Employee> = ({
    id,
    name,
    email,
    income,
    photoUrl
}) => {
    const textColor = useThemeColor({}, 'text');
    const defaultPhotoUrl: string = 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg';

    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
                <ThemedView style={styles.imageContainer}>
                <Image
                    style={{ height: '100%', width: '100%' }}
                    resizeMode="stretch"
                    defaultSource={{uri: defaultPhotoUrl}}
                    onError={() => {console.log('Failed to load image');}} // Optional error handler
                />
                </ThemedView>
                <ThemedView style={styles.informationContainer}>
                    <ThemedText type='title'>{name}</ThemedText>

                    <ThemedView style={{flexDirection: 'row'}}>
                    <Ionicons name="mail" size={32} color={textColor} style={styles.coordinateText}/>
                    <ThemedText type="defaultSemiBold">E-mail: {email}</ThemedText>
                    </ThemedView>

                    <ThemedView>
                        <ThemedText style={styles.coordinateText}>Income: ${income}/month</ThemedText>
                    </ThemedView>

                    <Pressable
                        style={styles.showOnEmployeeButton}
                        onPress={() => {}}>
                        <ThemedText style={styles.showOnEmployeeButtonText}>Show Larger View</ThemedText>
                    </Pressable>
                </ThemedView>
        </ThemedView>
    );
}

export default EmployeeCard;

const styles = StyleSheet.create({
    cardContainer: {
        maxHeight: 200,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5, 
        padding: 10,
        marginVertical: 5,
        margin: 5
    },
    coordinateText: {
        gap: 12,
        paddingHorizontal: 6
    },
    showOnEmployeeButton: {
        backgroundColor: 'rgb(106, 27, 154)', // Purple-blueish color
        padding: 12,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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
        width: 50,
        height: 50,
        borderColor: 'grey',
        backgroundColor: 'red'
    }
});