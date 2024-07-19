import React, { useState } from "react";
import { Employee } from "@/app/data_interfaces/employee";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { Image, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

const EmployeeCardDetailed: React.FC<Employee> = ({
    id,
    name,
    email,
    income,
    photoUrl
}) => {
    const textColor = useThemeColor({}, 'text');
    const defaultImage: any = require('@/assets/images/defaultUserPhoto.png');

    const [editMode, setEditMode] = useState(false);

    const handleUploadPhoto = () => {console.log("HANDLE UPLOAD PHOTO HERE!");}

    return (
        <ThemedView style={styles.cardContainer}>
            <ThemedView style={styles.cardHeader}>
                <ThemedView style={styles.imageEditing}>
                    <Image 
                    style={styles.imageTag}
                    resizeMode="center"
                    source={defaultImage}></Image>
                    <Pressable onPress={handleUploadPhoto} style={{display: editMode ? "flex" : "none"}}>
                        <ThemedText style={styles.uploadPhotoPressable}>Upload Photo</ThemedText>
                    </Pressable>
                </ThemedView>
                <ThemedView style={styles.employeeIdContainer}>
                    <ThemedText style={{fontSize: 16}}>Employee ID: </ThemedText>
                    <ThemedText style={{fontSize: 20, fontWeight: 700}}>{id}</ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.cardContent}>

            <Pressable onPress={handleUploadPhoto}>
                        <ThemedText style={styles.editUserPressable}>Edit User</ThemedText>
            </Pressable>

            </ThemedView>

        </ThemedView>
    );
}

export default EmployeeCardDetailed;

const styles = StyleSheet.create(
    {
        cardContainer: {
          backgroundColor: "rgba(0,0,0,0.0)"
            
        },
        cardHeader: {
            backgroundColor: '#17153B',
            padding: 10,
            borderColor: 'black',
            borderWidth: 2,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            
            paddingVertical: 0,
        },
        cardContent: {
            backgroundColor: "white"
        },
        imageTag: {
            width: 80,
            height: 80,
            borderRadius: 100
        },
        employeeIdContainer: {
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
        },
        imageEditing: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly"
        },
        uploadPhotoPressable: {
            backgroundColor: "purple",
            color: "ghostwhite",
            padding: 15,
            fontSize: 20,
            borderRadius: 12,
            borderColor: "grey",
            borderWidth: 2,
            textAlign: 'center',
            alignContent: "center"
        },
        editUserPressable: {
            backgroundColor: "purple",
            color: "ghostwhite",
            padding: 15,
            fontSize: 26,
            borderRadius: 12,
            borderColor: "grey",
            borderWidth: 2,
            textAlign: 'center',
            alignContent: "center",
            justifyContent: "center",
            alignSelf: "center",
            width: "70%",
            maxWidth: "80%",
            minWidth: "60%"
        }
    }
)