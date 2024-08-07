import React, { useState } from "react";
import { Pressable, TextInput, StyleSheet, PermissionsAndroid } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useSQLiteContext } from "expo-sqlite";
import { addEmployee } from "@/db/db";
import { Avatar, BottomSheet, Button } from "@rneui/themed";
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker";

const AddEmployeeForm : React.FC<any> = ({ onEmployeeAdded }) => {
    const textColor = useThemeColor({}, 'text');
    const defaultImage = require('@/assets/images/defaultUserPhoto.png');

    const [inputName, setInputName] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputIncome, setInputIncome] = useState<number | undefined>(undefined);
    const [inputPhotoUrl, setInputPhotoUrl] = useState('');
    const [isPhotoBottomSheetVisible, setPhotoBottomSheetVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    var nameInput;

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

        if (isNaN(inputIncome as number) || (inputIncome as number).toString() === '') {
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
            setInputIncome(0);
        } else {
            setInputIncome(parseInt(myNumber));
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
                console.log("Camera permission denied");
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
    }

    return (
        <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>Add New Employee</ThemedText>

            <ThemedView style={styles.formContent}>
                <ThemedText style={{ color: 'red', fontSize: 18, fontWeight: 600 }}>{errorMessage && "ERROR: " + errorMessage}</ThemedText>

                <ThemedView style={styles.formElement}>
                    <ThemedText style={{ color: textColor }}>Name:</ThemedText>
                    <TextInput value={inputName} onChangeText={setInputName} style={[{ color: textColor }, styles.textInput]} />
                </ThemedView>

                <ThemedView style={styles.formElement}>
                    <ThemedText style={{ color: textColor }}>Email:</ThemedText>
                    <TextInput value={inputEmail} onChangeText={setInputEmail} style={[{ color: textColor }, styles.textInput]} />
                </ThemedView>

                <ThemedView style={styles.formElement}>
                    <ThemedText style={{ color: textColor }}>Income:</ThemedText>
                    <TextInput value={(inputIncome as number).toString()} onChangeText={handleChangeIncome} style={[{ color: textColor }, styles.textInput]} keyboardType="numeric" />
                </ThemedView>

                <ThemedView style={styles.formElement}>
                    <ThemedText style={{ color: textColor }}>Photo:</ThemedText>
                    <Avatar
                        size={90}
                        rounded
                        icon={{ name: 'person', type: 'material' }}
                        source={inputPhotoUrl ? { uri: inputPhotoUrl } : defaultImage}
                        onPress={onPressAvatar}
                    >
                        <Avatar.Accessory size={26} style={{ borderRadius: 100 }} onPress={onPressAvatar} />
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
        overflow: 'hidden'
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    formContent: {
        alignItems: 'center',
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
        marginTop: 5
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
        backgroundColor: 'red'
    }
});
