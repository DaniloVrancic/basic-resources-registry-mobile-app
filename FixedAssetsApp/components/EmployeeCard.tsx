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
    const defaultPhotoUrl: string = '@/assets/images/defaultUserPhoto.png';

    return (
        <ThemedView style={[styles.cardContainer, {cursor: 'pointer'}]}>
                <ThemedView style={styles.imageContainer}>
                <Image
                    style={{ height: '100%', width: '100%' }}
                    resizeMode="cover"
                    defaultSource={require(defaultPhotoUrl)}
                    onError={() => {console.log('Failed to load image');}} // Optional error handler
                />
                </ThemedView>
                <ThemedView style={styles.informationContainer}>
                    <ThemedText type='title'>{name}</ThemedText>

                    <ThemedView style={{flexDirection: 'row'}}>
                        <Ionicons name="mail" size={16} color={textColor} style={{fontSize: 16, paddingRight: 5}}/>
                        <ThemedText style={{overflow: 'hidden'}} type="defaultSemiBold">E-mail: {email}</ThemedText>
                    </ThemedView>

                    <ThemedView>
                        <ThemedText style={{fontSize: 10}}>Income: ${income}/month</ThemedText>
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
        maxHeight: 300,
        paddingLeft: 5,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5, 
        padding: 12,
        margin: 5,
        flexWrap: 'wrap',
        marginVertical: 5,
        marginLeft: 10,
        overflow: 'scroll'
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