import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown'; // assuming you're using a dropdown library
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { addFixedAsset } from '@/db/db';


let db: SQLiteDatabase;
const AddNewFixedAsset = ({ onAssetAdded }: any) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [value, setValue] = useState('');
    const [barcode, setBarcode] = useState('');
    const [image, setImage] = useState(null);
    const [isScanning, setIsScanning] = useState(false);


    db = useSQLiteContext();

    const validateForm = () => {
        if (!name || !category || !location || !value || !barcode) {
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
            setImage(result.assets[0].uri);
        }
    };

    const handleAddAsset = () => {
        if (validateForm()) {
            // Add asset to database here
            const newAsset = {
                name,
                category,
                location,
                value: parseFloat(value),
                barcode,
                image
            };
            // Assume addAssetToDatabase is a function that adds the asset to your database
            addFixedAsset(newAsset);

            // Trigger callback to notify parent component
            onAssetAdded && onAssetAdded(newAsset);

            // Clear form
            setName('');
            setCategory('');
            setLocation('');
            setValue('');
            setBarcode('');
            setImage(null);
        }
    };

    const handleBarCodeScanned = ({ type, data }: any) => {
        setBarcode(data);
        setIsScanning(false);
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter asset name"
            />

            <Text style={styles.label}>Category</Text>
            <Dropdown
                style={dropdownStyles.dropdown}
                placeholderStyle={dropdownStyles.placeholderStyle}
                selectedTextStyle={dropdownStyles.selectedTextStyle}
                data={[
                    { label: 'Category 1', value: 'category1' },
                    { label: 'Category 2', value: 'category2' },
                    // Add more categories as needed
                ]}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select category"
                value={category}
                onChange={item => setCategory(item.value)}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
                style={styles.textInput}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter asset location"
            />

            <Text style={styles.label}>Value</Text>
            <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={setValue}
                placeholder="Enter asset value"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Barcode</Text>
            <View style={styles.barcodeInputContainer}>
                <TextInput
                    style={[styles.textInput, styles.barcodeInput]}
                    value={barcode}
                    onChangeText={setBarcode}
                    placeholder="Scan or enter barcode"
                />
                <Button title="Scan Barcode" onPress={() => setIsScanning(true)} />
            </View>

            {isScanning && (
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            )}

            <Text style={styles.label}>Photo (Optional)</Text>
            <TouchableOpacity onPress={handleImagePicker}>
                <View style={styles.imagePicker}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Text style={styles.imagePlaceholder}>Select Image</Text>
                    )}
                </View>
            </TouchableOpacity>

            <Button title="Add Asset" onPress={handleAddAsset} />
        </View>
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
        marginBottom: 16,
    },
    barcodeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    barcodeInput: {
        flex: 1,
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

export default AddNewFixedAsset;
