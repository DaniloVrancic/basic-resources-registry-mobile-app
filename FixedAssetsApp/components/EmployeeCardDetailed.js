import React, { useState } from "react";
import { Employee } from "@/app/data_interfaces/employee";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { Image, Pressable, TextInput, StyleSheet, PermissionsAndroid } from "react-native";
import { ThemedText } from "./ThemedText";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { updateEmployee } from "@/db/db";
import { Avatar, BottomSheet, Button, ListItem } from "@rneui/themed";
import { CameraOptions, launchCamera } from "react-native-image-picker";
import useCamera from "./camera/Camera";



let db;
const EmployeeCardDetailed = ({
    id,
    name,
    email,
    income,
    photoUrl
}) => {
    
    const textColor = useThemeColor({}, 'text');
    const defaultImage = require('@/assets/images/defaultUserPhoto.png');

    const [editMode, setEditMode] = useState(false);

    const [inputName, setInputName] = useState(name);
    const [inputEmail, setInputEmail] = useState(email);
    const [inputIncome, setInputIncome] = useState(income);
    const [inputPhotoUrl, setInputPhotoUrl] = useState(photoUrl);
    const [isPhotoBottomSheetVisible, setPhotoBottomSheetVisible] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    db = useSQLiteContext();

    const handleUploadPhoto = () => {console.log("HANDLE UPLOAD PHOTO HERE!");}

    const handlePressChanges = async () => {
        if(editMode){
            if (!/^[a-zA-Z\s]{1,64}$/.test(inputName)) {
                setErrorMessage('Please enter a valid name.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(inputEmail)) {
                setErrorMessage('Please enter a valid email address.');
                return;
            }

            if (isNaN(inputIncome) || inputIncome.toString() === '') {
                setErrorMessage('Income must be a valid number.');
                return;
            }

            setErrorMessage('');

            let currentEmployeeChanges = {id: id, name: inputName, email: inputEmail, income: inputIncome, photoUrl: inputPhotoUrl}

            let rows = await updateEmployee(db, currentEmployeeChanges);
            
            if(rows.changes > 0){
                
            }
            

            setEditMode(false);
        }
        else{
            setEditMode(true);
        }
    }

    const handleChangeIncome = (myNumber) => {

        if(isNaN(parseInt(myNumber)))
        {
            myNumber.replace("NaN", "");
            setInputIncome(0);
        }
        else{
            setInputIncome(parseInt(myNumber));
            if(isNaN(inputIncome)){
                setInputIncome(0);
            }
        }
    }

    const getInitials = (name) => {
        // Split the name by spaces and filter out empty strings
        const nameParts = name.split(' ').filter(part => part.length > 0);
        
        // Get the first 3 initials and capitalize them
        const initials = nameParts.slice(0, 3).map(part => part.charAt(0).toUpperCase());
    
        // Join the initials into a string
        return initials.join('');
    }

    const onPressAvatar = () => {
        
        setPhotoBottomSheetVisible(true);
    }

    
    const [cameraPhoto, setCameraPhoto] = useState('');

    let options = {
        saveToPhotos: true,
        mediaType: 'photo',
    }

    const openCamera = async () => {

        

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
            console.log("HELLOOOO");
            const result = await launchCamera(options);
            console.log(result);
            //setCameraPhoto(result);
        }
    };


    return (
        <ThemedView style={styles.cardContainer}>
            <ThemedView style={styles.cardHeader}>
                <ThemedView style={styles.imageEditing}>
                    
                <ThemedView
                    style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: 10,
                    backgroundColor: 'rgba(0,0,0,0.0)',
                    paddingTop: 10
                    }}
                >
                        <Avatar
                        size={90}
                        rounded
                        icon={{ name: 'adb', type: 'material' }}
                        containerStyle={{ backgroundColor: 'purple', }}
                        title={getInitials(name)}
                        onPress={() => {

                            if(editMode){
                                onPressAvatar();
                            }
                            
                            }}
                        >
                            <Avatar.Accessory 
                            size={26}
                            style={{borderRadius: 100}}
                            onPress={() => {

                                if(editMode){
                                    onPressAvatar();
                                }
                            }} 
                            color={(editMode) ? 'lime' : 'grey'} />
                        </Avatar>
        </ThemedView>
                    
                </ThemedView>
                
                <ThemedView style={styles.employeeIdContainer}>
                    <ThemedText style={{fontSize: 16, color:'ghostwhite'}}>Employee ID: </ThemedText>
                    <ThemedText style={{fontSize: 20, fontWeight: 700, color: 'ghostwhite'}}>{id}</ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.cardContent} lightColor="ghostwhite" darkColor="#17153B">

                <ThemedView style={{ backgroundColor: 'rgba(0,0,0,0.0)'}}>
                    <ThemedText style={{color: 'red', fontSize: 18, fontWeight: 600}}>{(errorMessage.length > 0) ? "ERROR: " + errorMessage : ""}</ThemedText>
                </ThemedView>

                <ThemedView style={styles.cardContentElement}>
                    <ThemedText style={[{color: textColor, textAlign: "center"}]}>Name:</ThemedText>
                    <TextInput  value={inputName} 
                                onChangeText={setInputName}
                                style={[{color: textColor}, styles.textInput]} 
                                readOnly={!editMode}></TextInput>
                </ThemedView>

                <ThemedView style={styles.cardContentElement}>
                    <ThemedText style={[{color: textColor, textAlign: "center"}]}>Email:</ThemedText>
                    <TextInput  value={inputEmail}
                                onChangeText={setInputEmail}
                                style={[{color: textColor}, styles.textInput]} 
                                readOnly={!editMode}></TextInput>
                </ThemedView>

                <ThemedView style={[styles.cardContentElement, {marginBottom: 20}]}>
                    <ThemedText>Income:</ThemedText>
                    <TextInput  value={inputIncome.toString()} 
                                onChangeText={handleChangeIncome}
                                style={[{color: textColor}, styles.textInput]} 
                                readOnly={!editMode}></TextInput>
                </ThemedView>

            <Pressable onPress={handlePressChanges} style={{marginBottom: 20}}>
                        <ThemedText style={styles.editUserPressable}>{(editMode) ? "Save Changes" : "Edit User"}</ThemedText>
            </Pressable>

            </ThemedView>


            <BottomSheet modalProps={{}} isVisible={isPhotoBottomSheetVisible} backdropStyle={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
                
                    <Button
                        title="Take Photo with Camera"
                        buttonStyle={{backgroundColor: 'rgb(70, 50, 175)', borderColor: 'black', borderWidth: 1, height: 60}}
                        titleStyle={{fontSize: 20}}
                        icon={{name: 'camera', type: 'ionicon', color:"white"}}
                        onPress={openCamera}
                    ></Button>

                    <Button
                        title="Open Photo from Gallery"
                        buttonStyle={{backgroundColor: 'rgb(70, 50, 175)', borderColor: 'black', borderWidth: 1, height: 60}}
                        titleStyle={{fontSize: 20}}
                        icon={{name: 'photo', color:"white"}}
                        onPress={() => {}}
                    ></Button>

                    <Button
                        title="Cancel"
                        buttonStyle={{borderColor: 'black', borderWidth: 1,backgroundColor: 'red', height: 60}}
                        titleStyle={{fontSize: 20}}
                        icon={{name: 'x', type: 'foundation'}}
                        onPress={() => {setPhotoBottomSheetVisible(false);}}
                    ></Button>
                
            </BottomSheet>                
        </ThemedView>
    );
}

export default EmployeeCardDetailed;

const styles = StyleSheet.create(
    {
        cardContainer: {
            backgroundColor: "rgba(0,0,0,0.0)",
            borderWidth: 2,
            borderColor: 'grey',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            overflow: 'hidden'
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
            alignItems: 'center',
            
        },
        cardContentElement: {
            backgroundColor: "rgba(0,0,0,0.0)",
            paddingVertical: 15,
            alignSelf:'center',
            justifyContent: 'center',
            textAlign: 'center',
            
        },
        textInput: {
            fontSize: 16,
            textAlign: 'center'
        },
        imageTag: {
            width: 80,
            height: 80,
            borderRadius: 100,
            marginTop: 15
        },
        employeeIdContainer: {
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: 'rgba(0,0,0,0.0)',
        },
        imageEditing: {
            paddingTop: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            backgroundColor: 'rgba(0,0,0,0.0)'
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