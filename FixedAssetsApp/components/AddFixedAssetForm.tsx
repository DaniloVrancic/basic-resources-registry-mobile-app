import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert, Pressable, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown'; // assuming you're using a dropdown library
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { addFixedAsset } from '@/db/db';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Icon } from '@rneui/themed';
import CameraScanner from './camera/CameraScanner';
import { useThemeColor } from '@/hooks/useThemeColor';


let db: SQLiteDatabase;
const AddNewFixedAsset = ({ onAssetAdded }: any) => {

    const textColor = useThemeColor({}, 'text');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [employee, setEmployee] = useState('');
    const [location, setLocation] = useState('');
    const [value, setValue] = useState('');
    const [barcode, setBarcode] = useState('');
    const [photoUrl, setPhotoUrl] = useState(null);

    const [isScanning, setIsScanning] = useState(false);
    const [cameraScanned, setCameraScanned] = useState(false);


    db = useSQLiteContext();

    const validateForm = () => {
        if (!name || !employee || !location || !value || !barcode) {
            Alert.alert("Error", "All fields except image are mandatory.");
            return false;
        }
        if (isNaN(parseInt(value))) {
            Alert.alert("Error", "Value must be a number.");
            return false;
        }
        return true;
    };

    const handleImagePicker = async () => {
        let result : any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhotoUrl(result.assets[0].uri);
        }
    };

    const handleAddAsset = () => {
        if (validateForm()) {
            // Add asset to database here
            const newAsset = {
                name,
                description,
                location,
                value: parseFloat(value),
                barcode,
                employee,
                photoUrl
            };
            // Assume addAssetToDatabase is a function that adds the asset to your database
            addFixedAsset(newAsset);

            // Trigger callback to notify parent component
            onAssetAdded && onAssetAdded(newAsset);

            // Clear form
            setName('');
            setDescription('');
            setLocation('');
            setValue('');
            setBarcode('');
            setEmployee('');
            setPhotoUrl(null);
        }
    };

    const handleBarCodeScanned = ({ type, data }: any) => {
        setBarcode(data);
        setIsScanning(false);
    };

    const handleScannedValue = (myScannedValue: any) => {
        setBarcode(myScannedValue);
        setCameraScanned(true);
    }

    const handleNewScan = () => {
        setBarcode('');
        setCameraScanned(false);
    }

    const openModalScanner = () => {setCameraScanned(false); setIsScanning(true)};
    const closeModalScanner = () => setIsScanning(false);

    return (
        <ThemedView style={styles.formContainer}>
            <ThemedView>
                <ThemedText type='title'>Add New Fixed Asset</ThemedText>
            </ThemedView>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter asset name"
            />

            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
                style={[styles.textInput, styles.descriptionInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter asset description"
                multiline
            />

            <ThemedText style={styles.label}>Location</ThemedText>
            <Dropdown
                style={dropdownStyles.dropdown}
                placeholderStyle={dropdownStyles.placeholderStyle}
                selectedTextStyle={dropdownStyles.selectedTextStyle}
                data={[
                    { label: 'Location 1', value: 'location1' },
                    { label: 'Location 2', value: 'location2' },
                    // Add more locations as needed
                ]}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select location"
                value={location}
                onChange={item => setLocation(item.value)}
            />

            <ThemedText style={styles.label}>Employee</ThemedText>
            <Dropdown
                style={dropdownStyles.dropdown}
                placeholderStyle={dropdownStyles.placeholderStyle}
                selectedTextStyle={dropdownStyles.selectedTextStyle}
                data={[
                    { label: 'Employee 1', value: 'employee1' },
                    { label: 'Employee 2', value: 'employee2' },
                    // Add more employees as needed
                ]}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select employee"
                value={employee}
                onChange={item => setEmployee(item.value)}
            />

            <ThemedText style={styles.label}>Value</ThemedText>
            <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={setValue}
                placeholder="Enter asset value"
                keyboardType="numeric"
            />

            <ThemedText style={styles.label}>Barcode</ThemedText>
            <ThemedView style={styles.barcodeInputContainer}>
                <TextInput
                    style={[styles.textInput, styles.barcodeInput]}
                    value={barcode}
                    onChangeText={setBarcode}
                    placeholder="Scan or enter barcode"
                />
                <ThemedView>
                    <Button title="Scan Barcode" onPress={() => setIsScanning(true)} color='#F4A300' />
                </ThemedView>
            </ThemedView>

            <ThemedText style={styles.label}>Photo (Optional)</ThemedText>
            <Pressable onPress={handleImagePicker}>
                <ThemedView style={styles.imagePicker}>
                    {photoUrl ? (
                        <Image source={{ uri: photoUrl }} style={styles.image} />
                    ) : (
                        <Text style={styles.imagePlaceholder}>Select Image</Text>
                    )}
                </ThemedView>
            </Pressable>

            <Button title="Add Asset" onPress={handleAddAsset} />

            {isScanning && (
                <Modal animationType="fade" transparent={true}> 
                <ThemedView lightColor="ghostwhite" darkColor="rgba(0,0,0,1)" style={modalStyles.modalContainer}>

                    <ThemedView style={modalStyles.modalHeader}>
                            <Pressable style={modalStyles.modalCloseButton} onPress={closeModalScanner}>
                                <Icon name="undo" type="material" size={24} color={textColor} />
                            </Pressable>
                            <Pressable style={[modalStyles.modalSpaceFill]} onPress={closeModalScanner}></Pressable>
                    </ThemedView>

                    <ThemedView style={{backgroundColor:'rgba(0,0,0,0)'}}>
                        <ThemedText type="subtitle" style={{textAlign:'center'}}>Scan Code:</ThemedText>
                    </ThemedView>
                    <ThemedView>
                         {/* Fill with Content here */}
                         <CameraScanner onCodeScanned={handleScannedValue} onNewScanButtonTapped={handleNewScan}/>
                    </ThemedView>
                </ThemedView>
                {
                    (!cameraScanned) ? 
                    (<ThemedView style={{backgroundColor:'rgba(255,0,0,0.5)'}}>
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center', color:'rgba(0,0,255,0.5)'}}>No Code Found</ThemedText>
                    </ThemedView>)
                    :
                    (<ThemedView style={{backgroundColor:'rgba(0,255,0,0.5)'}}>
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center'}}>Scanned Code:</ThemedText>
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center'}}>{barcode}</ThemedText>
                    </ThemedView>)
                }
              </Modal>  
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginVertical: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 8,
    },
    barcodeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    barcodeInput: {
        minWidth: '40%',
        marginRight: 10,
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    imagePlaceholder: {
        color: 'gray',
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
});

const dropdownStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        width: '90%',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
    },
    dropdown: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 12,
        top: -8,
        zIndex: 999,
        paddingHorizontal: 4,
        fontSize: 12,
        color: '#888',
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#666',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#333',
    },
    iconStyle: {
        width: 20,
        height: 20,
        tintColor: '#666',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: '#333',
    },
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

export default AddNewFixedAsset;
