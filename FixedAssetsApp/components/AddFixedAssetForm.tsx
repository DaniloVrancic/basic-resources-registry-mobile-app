import React, { useEffect, useState } from 'react';
import {  Text, TextInput, StyleSheet, Image, Alert, Pressable, Modal, PermissionsAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown'; // assuming you're using a dropdown library
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { addFixedAsset, getAllEmployees, getAllLocations } from '@/db/db';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { BottomSheet, Button, Icon } from '@rneui/themed';
import CameraScanner from './camera/CameraScanner';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FixedAsset } from '@/app/data_interfaces/fixed-asset';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import useOrientation from '@/hooks/useOrientation';
import { ORIENTATION } from '@/constants/orientation';



let db: SQLiteDatabase;
let orientation: string;
const AddNewFixedAsset = ({ onAssetAdded }: any) => {

    const textColor = useThemeColor({}, 'text');
    const {t} = useTranslation();
    (orientation = useOrientation());

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [employee, setEmployee] = useState<number>(-1);
    const [location, setLocation] = useState<number>(-1);
    const [price, setPrice] = useState<string>('');
    const [barcode, setBarcode] = useState('');
    const [photoUrl, setPhotoUrl] = useState(null);

    const [isScanning, setIsScanning] = useState(false);
    const [cameraScanned, setCameraScanned] = useState(false);

    const [possibleEmployees, setPossibleEmployees] = useState<any[]>([]);
    const [possibleLocations, setPossibleLocations] = useState<any[]>([]);

    const [isPhotoBottomSheetVisible, setPhotoBottomSheetVisible] = useState(false);

    const [value, setValue] = useState(null);
    const [isFocusEmployee, setIsFocusEmployee] = useState(false);
    const [isFocusLocation, setIsFocusLocation] = useState(false);


    db = useSQLiteContext();

    useEffect(() => {
        loadEmployeesFromDatabase(db);
        loadLocationsFromDatabase(db);
    }, 
    []);

    const renderLabelEmployee = () => {
        if (value || isFocusEmployee) {
          return (
            <ThemedText style={[dropdownStyles.label, isFocusEmployee && { color: 'blue' }]}>
              {t('fixedAssets.selectEmployee')}:
            </ThemedText>
          );
        }
        return null;
      };

      const renderLabelLocation = () => {
        if (value || isFocusLocation) {
          return (
            <ThemedText style={[dropdownStyles.label, isFocusLocation && { color: 'blue' }]}>
              {t('fixedAssets.selectLocation')}:
            </ThemedText>
          );
        }
        return null;
      };

          /*
       * The code below will fetch all the Employee data from the database and correctly filter only the data that we will use.
       * This data is then bound to the State which will be used to display all the possible Employees to select in a drop down menu.
       */
          const loadEmployeesFromDatabase = async (db: SQLiteDatabase) => {
            try {
                var fetchedEmployees = (await getAllEmployees(db));
                var valuesToReturn: any[] = [];
    
                fetchedEmployees.forEach((element: any) => {
                    var mappedElement: any = { label: element.name, value: element.id};
                    valuesToReturn.push(mappedElement);
                });
                setPossibleEmployees(valuesToReturn);
            } catch (error) {
              console.error('Error loading employees:', error);
            }
          };
    
    
          /*
           * The code below will fetch all the Location data from the database and correctly filter only the data that we will use.
           * This data is then bound to the State which will be used to display all the possible locations to select in a drop down menu.
           */
        const loadLocationsFromDatabase = async (db : SQLiteDatabase) => {
            try {
                var fetchedLocations = (await getAllLocations(db));
                var valuesToReturn : any[] = [];
    
                fetchedLocations.forEach((element : any) => {
                    var mappedElement = { label: element.name, value: element.id};
                    valuesToReturn.push(mappedElement);
                });
                setPossibleLocations(valuesToReturn);
            } catch (error) {
              console.error('Error loading employees:', error);
            }
          };

    const handleChangePrice = (myNumber: any) => {
        if(myNumber === ""){
            setPrice(myNumber);
            return;
        }
        // Allow only digits and a single dot
        const validNumber = myNumber.replace(/[^0-9.]/g, '');
        
        // Check if the string has more than one dot
        const dotCount = (validNumber.match(/\./g) || []).length;
        
        // If there is more than one dot, keep the current inputPrice
        if (dotCount > 1) {
            return;
        }
        
        // Allow empty string to reset the input
        if (validNumber === '') {
            setPrice('');
            return;
        }
        
        // Parse the number
        const parsedNumber = parseFloat(validNumber);
        
        // Set inputPrice to the parsed number if it's a valid number or just the validNumber
        if (!isNaN(parsedNumber) || validNumber === '.') {
            setPrice(validNumber);
        }
    };

    const validateForm = () => {
        if (!name || !employee || !location || !price || !barcode) {
            Alert.alert(t('alertMessages.error'), t('fixedAssets.mandatoryFieldsError'));
            return false;
        }
        if (isNaN(parseInt(price))) {
            Alert.alert(t('alertMessages.error'), t('fixedAssets.valueMustBeNumberError'));
            return false;
        }
        return true;
    };

    const handleImagePicker = async () => {
        setPhotoBottomSheetVisible(true);
    };

    let options: any = {
        saveToPhotos: true,
        mediaType: 'photo',
        height: 1024,
        width: 768
    }

    const openCamera = async () => {
        try{
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: t('camera.permissionTitle'),
                  message: t('camera.permissionMessage'),
                  buttonNeutral: t('labels.askMeLater'),
                  buttonNegative: t('labels.cancel'),
                  buttonPositive: t('labels.ok')
                }
              );

              let result: any;
                
                if(granted === PermissionsAndroid.RESULTS.GRANTED){
                   // console.log(granted);
                    
                    result = await ImagePicker.launchCameraAsync(options);
                      
                }
                else{
                    console.log("Permission not given.");
                    Alert.alert(t('alertMessages.accessDenied'), t('alertMessages.permissionNotGiven'))
                }
               

                    const resultPhotoUri = (result.assets[0].uri);
                    setPhotoUrl(resultPhotoUri);
                
                
        }
        catch(error)
        {
            console.error(error);
        }
    };



    const openGallery = async () => {
        const result: any = await ImagePicker.launchImageLibraryAsync(options);
        const resultUri: any = result.assets[0].uri;
        setPhotoUrl(resultUri);
    }

    const handleAddAsset = async () => {
        if (validateForm()) {
            // Add asset to database here
            const newAsset: FixedAsset = {
                name,
                creationDate: new Date(),
                description,
                barcode,
                price: parseFloat(price),
                photoUrl: (photoUrl) ? photoUrl : "",
                employee_id: employee,
                location_id: location


            };
            // Assume addAssetToDatabase is a function that adds the asset to your database
            let result = await addFixedAsset(db, newAsset);

            // Trigger callback to notify parent component
            onAssetAdded && onAssetAdded(newAsset);

            // Clear form
            setName('');
            setDescription('');
            setPrice('');
            setBarcode('');
            setEmployee(-1);
            setLocation(-1);
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
                <ThemedText type='title' style={{textAlign: 'center'}}>{t("fixedAssets.addNewTitle")}</ThemedText>
            </ThemedView>
                <ThemedText style={[styles.label, , {color: textColor}]}>{t("labels.name")}</ThemedText>
            <TextInput
                style={[styles.textInput, {color: textColor}]}
                placeholderTextColor={textColor}
                value={name}
                onChangeText={setName}
                placeholder={t("fixedAssets.enterAssetName")}
            />

            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
                style={[styles.textInput, styles.descriptionInput, {color: textColor}]}
                placeholderTextColor={textColor}
                value={description}
                onChangeText={setDescription}
                placeholder={t("fixedAssets.enterAssetDescription")}
                multiline
            />

            <ThemedText style={styles.label}>{t("labels.location")}</ThemedText>
            {renderLabelLocation()}
            <Dropdown
                style={dropdownStyles.dropdown}
                placeholderStyle={dropdownStyles.placeholderStyle}
                selectedTextStyle={dropdownStyles.selectedTextStyle}
                search
                data={possibleLocations}
                labelField="label"
                valueField="value"
                placeholder={t("fixedAssets.selectLocation")}
                value={location}
                onFocus={() => setIsFocusEmployee(true)}
                onBlur={() => setIsFocusEmployee(false)}
                onChange={item => setLocation(item.value as number)}
                renderLeftIcon={() => (
                    <AntDesign
                    style={dropdownStyles.icon}
                    color={isFocusLocation ? 'blue' : 'black'}
                    name="Safety"
                    size={20}
                    />
                )}
            />

            <ThemedText style={styles.label}>{t("labels.employee")}</ThemedText>
            {renderLabelEmployee()}
            <Dropdown
                style={dropdownStyles.dropdown}
                placeholderStyle={dropdownStyles.placeholderStyle}
                selectedTextStyle={dropdownStyles.selectedTextStyle}
                search
                dropdownPosition="top"
                inverted={false}
                data={possibleEmployees}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={t("fixedAssets.selectEmployee")}
                value={employee}
                onFocus={() => setIsFocusEmployee(true)}
                onBlur={() => setIsFocusEmployee(false)}
                onChange={item => setEmployee(item.value)}
                renderLeftIcon={() => (
                    <AntDesign
                    style={dropdownStyles.icon}
                    color={isFocusEmployee ? 'blue' : 'black'}
                    name="Safety"
                    size={20}
                    />
                )}
            />

            <ThemedText style={styles.label}>{t("labels.value")}</ThemedText>
            <TextInput
                style={[styles.textInput, {color: textColor}]}
                placeholderTextColor={textColor}
                value={price}
                onChangeText={handleChangePrice}
                placeholder={t("fixedAssets.enterAssetValue")}
                keyboardType="numeric"
            />

            <ThemedText style={styles.label}>{t("labels.barcode")}</ThemedText>
            <ThemedView style={[styles.barcodeInputContainer, {flexDirection: 'column'}]}>
                <TextInput
                    style={[styles.textInput, styles.barcodeInput, {color: textColor}]}
                    placeholderTextColor={textColor}
                    value={barcode}
                    onChangeText={setBarcode}
                    placeholder={t("fixedAssets.scanOrEnterBarcode")}
                />
                <ThemedView style={{marginTop: 10}}>
                    <Button title={t("labels.scanBarcode")} onPress={() => setIsScanning(true)} color='#F4A300' />
                </ThemedView>
            </ThemedView>

            <ThemedText style={styles.label}>{t("labels.photoOptional")}</ThemedText>
            <Pressable onPress={handleImagePicker}>
                <ThemedView style={styles.imagePicker}>
                    {photoUrl ? (
                        <Image source={{ uri: photoUrl }} style={styles.image} />
                    ) : (
                        <Text style={styles.imagePlaceholder}>{t("fixedAssets.selectImage")}</Text>
                    )}
                </ThemedView>
            </Pressable>

            <Button title={t("fixedAssets.addAsset")} onPress={handleAddAsset} />

            {isScanning && (
                <Modal animationType="fade" transparent={false} onRequestClose={closeModalScanner}> 
                <ThemedView lightColor="ghostwhite" darkColor="rgba(0,0,0,1)" style={[modalStyles.modalContainer]}>
                    <ThemedView style={[modalStyles.modalHeader]}>
                            <Pressable style={modalStyles.modalCloseButton} onPress={closeModalScanner}>
                                <Icon name="undo" type="material" size={24} color={textColor} />
                            </Pressable>
                            <Pressable style={[modalStyles.modalSpaceFill]} onPress={closeModalScanner}></Pressable>
                    </ThemedView>

                    <ThemedView style={{backgroundColor:'rgba(0,0,0,0)'}}>
                        <ThemedText type="subtitle" style={{textAlign:'center'}}>{t("labels.scanBarcode")}:</ThemedText>
                    </ThemedView>
                    <ThemedView>
                         {/* Fill with Content here */}
                         <CameraScanner onCodeScanned={handleScannedValue} onNewScanButtonTapped={handleNewScan}/>
                    </ThemedView>
                </ThemedView>
                {
                    (!cameraScanned) ? 
                    (<ThemedView style={{backgroundColor:'rgba(220,0,0,1.0)'}}>
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center', color:'rgba(0,0,200,1.0)'}}>{t("fixedAssets.noCodeFound")}</ThemedText>
                    </ThemedView>)
                    :
                    (<ThemedView style={{backgroundColor:'rgba(0,220,0,1.0)'}}>
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center'}}>{t("fixedAssets.scannedCode")}:</ThemedText>
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center'}}>{barcode}</ThemedText>
                    </ThemedView>)
                }
              </Modal>
                
            )}

            <BottomSheet modalProps={{}} isVisible={isPhotoBottomSheetVisible} backdropStyle={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
                        
                <Button
                    title={t("bottomSheet.takePhotoWithCamera")}
                    buttonStyle={{backgroundColor: 'rgb(70, 50, 175)', borderColor: 'black', borderWidth: 1, height: 60}}
                    titleStyle={{fontSize: 20}}
                    icon={{name: 'camera', type: 'ionicon', color:"white"}}
                    onPress={openCamera}
                />

                <Button
                    title={t("bottomSheet.openPhotoFromGallery")}
                    buttonStyle={{backgroundColor: 'rgb(70, 50, 175)', borderColor: 'black', borderWidth: 1, height: 60}}
                    titleStyle={{fontSize: 20}}
                    icon={{name: 'photo', color:"white"}}
                    onPress={openGallery}
                />

                <Button
                    title={t("bottomSheet.close")}
                    buttonStyle={{borderColor: 'black', borderWidth: 1,backgroundColor: 'red', height: 60}}
                    titleStyle={{fontSize: 20}}
                    icon={{name: 'x', type: 'foundation'}}
                    onPress={() => {setPhotoBottomSheetVisible(false);}}
                    />
            
            </BottomSheet>

        </ThemedView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
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
        padding: 8,
    },
    modalHeader: {
        display: 'flex',
        paddingTop: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        paddingBottom: 60,
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
