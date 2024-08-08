import React, { useState } from "react";
import { Pressable, TextInput, StyleSheet, PermissionsAndroid, ScrollView } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useSQLiteContext } from "expo-sqlite";
import { addEmployee } from "@/db/db";
import { Avatar, BottomSheet, Button, Input } from "@rneui/themed";
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker";

const AddEmployeeForm : React.FC<any> = ({ onEmployeeAdded }) => {
    const textColor = useThemeColor({}, 'text');
    const defaultImage = require('@/assets/images/defaultUserPhoto.png');

    const [inputName, setInputName] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputIncome, setInputIncome] = useState<string | undefined>(undefined);
    const [inputPhotoUrl, setInputPhotoUrl] = useState('');
    const [isPhotoBottomSheetVisible, setPhotoBottomSheetVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    var nameInputField : any = React.createRef();

    const db = useSQLiteContext();

    const handleAddEmployee = async () => {
        if (!/^[a-zA-Z\s]{1,64}$/.test(inputName)) {
            setErrorMessage('Please enter a valid name.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputEmail)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        if (isNaN(parseInt(inputIncome as string)) || (inputIncome as string) === '') {
            setErrorMessage('Income must be a valid number.');
            return;
        }

        setErrorMessage('');

        const newEmployee = {
            id: Date.now(),
            name: inputName,
            email: inputEmail,
            income: parseFloat(inputIncome?.toString() as string),
            photoUrl: inputPhotoUrl
        };

        let result = await addEmployee(db, newEmployee);
        onEmployeeAdded(newEmployee);
    }

    const handleChangeIncome = (myNumber: any) => {
        if (isNaN(parseInt(myNumber))) {
            myNumber.replace("NaN", "");
            setInputIncome("");
        } else {
            setInputIncome(myNumber);
        }
    }

    const onPressAvatar = () => {
        setPhotoBottomSheetVisible(true);
    }

    const openCamera = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: "Camera Permission",
                  message: "My Asset Manager needs access to your camera for this feature to work.",
                  buttonNeutral: "Ask Me Later",
                  buttonNegative: "Cancel",
                  buttonPositive: "OK"
                }
            );

            let options: any = {
                saveToPhotos: true,
                mediaType: 'photo',
                height: 1024,
                width: 768
            }

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const result = await launchCameraAsync(options);
                if (!result.canceled) {
                    const resultPhotoUri = (result.assets[0].uri);
                    setInputPhotoUrl(resultPhotoUri);
                }
            } else {
                setInputPhotoUrl("");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const openGallery = async () => {
        const result = await launchImageLibraryAsync();
        if (!result.canceled) {
            const resultUri = result.assets[0].uri;
            setInputPhotoUrl(resultUri);
        }
        else{
            setInputPhotoUrl("");
        }
    }

    return (
        <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>Add New Employee</ThemedText>
            
                <ThemedView style={styles.formContent}>
                    <ThemedText style={{ color: 'red', fontSize: 18, fontWeight: 600 }}>{errorMessage && "ERROR: " + errorMessage}</ThemedText>

                    <ThemedView style={styles.formElement}>
                        <ThemedText style={[styles.labelStyle, { color: textColor }]}>Name:</ThemedText>
                        <Input value={inputName} onChangeText={setInputName} style={[{ color: textColor }, styles.textInput]} />
                    </ThemedView>

                    <ThemedView style={styles.formElement}>
                        <ThemedText style={[styles.labelStyle, { color: textColor }]}>Email:</ThemedText>
                        <Input value={inputEmail} onChangeText={setInputEmail} style={[{ color: textColor }, styles.textInput]} />
                    </ThemedView>

                    <ThemedView style={styles.formElement}>
                        <ThemedText style={[styles.labelStyle, { color: textColor }]}>Income:</ThemedText>
                        <Input value={(inputIncome)} onChangeText={handleChangeIncome} style={[{ color: textColor }, styles.textInput]} keyboardType="numeric" />
                    </ThemedView>

                    <ThemedView style={styles.formElement}>
                        <ThemedText style={[styles.labelStyle, { color: textColor }]}>Photo:</ThemedText>
                        <Avatar
                            size={100}
                            rounded
                            icon={{ name: 'person', type: 'material', size: 64 }}
                            iconStyle={{backgroundColor:'purple', minWidth: '90%', minHeight: '90%', alignSelf:'center', justifyContent:'center'}}
                            onPress={onPressAvatar}
                            source={inputPhotoUrl ? { uri: inputPhotoUrl } : undefined}
                            containerStyle={{alignSelf: "center", backgroundColor:'purple'}}
                        >
                            <Avatar.Accessory size={40} style={{ borderRadius: 100, backgroundColor: 'purple', borderWidth: 2.5, borderColor: 'black' }} onPress={onPressAvatar} />
                        </Avatar>
                    </ThemedView>

                    <Pressable onPress={handleAddEmployee} style={styles.addButton}>
                        <ThemedText style={styles.addButtonText}>Add Employee</ThemedText>
                    </Pressable>
                </ThemedView>
            

            <BottomSheet modalProps={{}} isVisible={isPhotoBottomSheetVisible} backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <Button title="Take Photo with Camera" buttonStyle={styles.bottomSheetButton} onPress={openCamera} />
                <Button title="Open Photo from Gallery" buttonStyle={styles.bottomSheetButton} onPress={openGallery} />
                <Button title="Cancel" buttonStyle={[styles.bottomSheetButton, styles.cancelButton]} onPress={() => setPhotoBottomSheetVisible(false)} />
            </BottomSheet>
        </ThemedView>
    );
}

export default AddEmployeeForm;

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'grey',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    formContent: {
        alignItems: 'center',
        overflow:'visible'
    },
    formElement: {
        marginVertical: 10,
        width: '100%'
    },
    textInput: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 8,
        marginTop: 5,
        marginBottom: 3
    },
    addButton: {
        backgroundColor: 'purple',
        padding: 15,
        borderRadius: 12,
        borderColor: 'grey',
        borderWidth: 2,
        textAlign: 'center',
        marginTop: 20,
        width: '80%',
        alignSelf: 'center'
    },
    addButtonText: {
        color: 'ghostwhite',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    bottomSheetButton: {
        backgroundColor: 'rgb(70, 50, 175)',
        borderColor: 'black',
        borderWidth: 1,
        height: 60,
        marginVertical: 5
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    labelStyle: {
        paddingHorizontal: 5,
        fontSize: 18,
        fontWeight: 500
    }
});
