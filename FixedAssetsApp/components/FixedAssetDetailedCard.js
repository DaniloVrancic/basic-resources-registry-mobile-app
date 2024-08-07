import { Pressable, StyleSheet, TextInput, PermissionsAndroid, Modal } from "react-native";
import { ThemedView } from "./ThemedView"
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { Avatar, BottomSheet, Button, Icon } from "@rneui/themed";
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { updateFixedAsset, getAllEmployees, getAllLocations } from "@/db/db";
import { useOppositeThemeColor } from "@/hooks/useOppositeThemeColor";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dropdown } from "react-native-element-dropdown";
import CameraScanner from "./camera/CameraScanner";

let db;
const FixedAssetCardDetailedCard = (
    {fixedAssetState,
    setFixedAssetState
    }
) => {

    const textColor = useThemeColor({}, 'text');
    const oppositeTextColor = useOppositeThemeColor({}, 'text');
    const [isPhotoBottomSheetVisible, setPhotoBottomSheetVisible] = useState(false);
    const [isCameraScannerVisible, setIsCameraScannerVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [inputBarcode, setInputBarcode] = useState(fixedAssetState.barcode);
    const [inputName, setInputName] = useState(fixedAssetState.name);
    const [inputPrice, setInputPrice] = useState(fixedAssetState.price.toString());
    const [inputDescription, setInputDescription] = useState(fixedAssetState.description);
    const [inputCreationDate, setInputCreationDate] = useState(fixedAssetState.creationDate.toString());
    const [inputAssignedEmployeeId, setInputAssignedEmployeeId] = useState(fixedAssetState.employee_id);
    const [inputAssignedLocationId, setInputAssignedLocationId] = useState(fixedAssetState.location_id);
    const [inputPhotoUrl, setInputPhotoUrl] = useState(fixedAssetState.photoUrl);

    const [cameraScanned, setCameraScanned] = useState(false);
    
    const [errorMessage, setErrorMessage] = useState('');

    const [possibleEmployees, setPossibleEmployees] = useState([]);
    const [possibleLocations, setPossibleLocations] = useState([]);

    const defaultImageUrl = "@/assets/images/defaultImage.png";

    db = useSQLiteContext();

    useEffect(() => {
        loadEmployeesFromDatabase(db);
        loadLocationsFromDatabase(db);
    }, 
    [])
    

      /*
       * The code below will fetch all the Employee data from the database and correctly filter only the data that we will use.
       * This data is then bound to the State which will be used to display all the possible Employees to select in a drop down menu.
       */
    const loadEmployeesFromDatabase = async (db) => {
        try {
            var fetchedEmployees = (await getAllEmployees(db));
            var valuesToReturn = [];

            fetchedEmployees.forEach(element => {
                var mappedElement = { label: element.name, value: element.id};
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
    const loadLocationsFromDatabase = async (db) => {
        try {
            var fetchedLocations = (await getAllLocations(db));
            var valuesToReturn = [];

            fetchedLocations.forEach(element => {
                var mappedElement = { label: element.name, value: element.id};
                valuesToReturn.push(mappedElement);
            });
            setPossibleLocations(valuesToReturn);
        } catch (error) {
          console.error('Error loading employees:', error);
        }
      };

    const onPressAvatar = () => {
        
        setPhotoBottomSheetVisible(true);
    }

    let options = {
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
                  title: "Camera Permission to use for App",
                  message:"My Asset Manager needs access to your camera for this feature to work. ",
                  buttonNeutral: "Ask Me Later",
                  buttonNegative: "Cancel",
                  buttonPositive: "OK"
                }
              );
              let result;
                
                if(granted === PermissionsAndroid.RESULTS.GRANTED){
                    console.log(granted);
                    
                    result = await launchCameraAsync(options, (res) => {
                        console.log('Response = ', res);
                  
                        if (res.didCancel) {
                          console.log('User cancelled image picker');
                        } else if (res.error) {
                          console.log('ImagePicker Error: ', res.error);
                        } else if (res.customButton) {
                          console.log('User tapped custom button: ', res.customButton);
                          alert(res.customButton); //Messages to be displayed for specific errors.
                        } else {
                         // let source = res;
                          // var resourcePath1 = source.assets[0].uri;
                          const source = { uri: res.uri };
                          //console.log('response', JSON.stringify(res));
                        }
                      }).catch((warn) => {console.warn(warn)});
                      
                }
                else{
                    console.log("Permission not given.");
                }
                const resultPhotoUri = (result.assets[0].uri);
                setInputPhotoUrl(resultPhotoUri);
        }
        catch(error)
        {
            console.error(error);
        }
    };

    const openGallery = async () => {
        const result = await launchImageLibraryAsync(options);
        const resultUri = result.assets[0].uri;
        setInputPhotoUrl(resultUri);
    }

    const handleSaveButtonPress = async () => {

        if(editMode){
            if (!/^[a-zA-Z\s]{1,64}$/.test(inputName)) {
                setErrorMessage('Please enter a valid name.');
                return;
            }

            const barcodeRegex = /^[A-Z0-9\-_]+$/;
            if (!barcodeRegex.test(inputBarcode)) {
                setErrorMessage('Please enter a valid barcode.');
                return;
            }

            const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
            if (!dateRegex.test(inputCreationDate)) {
                setErrorMessage('Please enter a valid creation date.');
                return;
            }

            // Handle inputPrice
            let processedPrice;
            if (inputPrice === '.' || inputPrice === '' || inputPrice.length == 0) {
                processedPrice = 0;
            } else if (inputPrice.startsWith('.')) {
                processedPrice = parseFloat('0' + inputPrice);
            } else if (inputPrice.endsWith('.')) {
                processedPrice = parseFloat(inputPrice + '00');
            } else {
                processedPrice = parseFloat(inputPrice);
            }

            if (isNaN(processedPrice)) {
                setErrorMessage('Please enter a valid price.');
                return;
            }


            
            const tempAssetState = {id: fixedAssetState.id, name: inputName, description: inputDescription,
                barcode: inputBarcode, price: processedPrice, creationDate: inputCreationDate, employee_id: inputAssignedEmployeeId,
                location_id: inputAssignedLocationId, photoUrl: inputPhotoUrl
            };
            
            try{
                var rows = await updateFixedAsset(db, tempAssetState);

                setErrorMessage('');
                setFixedAssetState(tempAssetState); //If the data has changed, set the original fixed asset state to this new state.

                setEditMode(false);
            }
            catch(myError){
                console.error(myError);
            }
            
            

            
        }
    }

    const handleChangeBarcode = (myBarcode) => {
        
    }

    const [value, setValue] = useState(null);
    const [isFocusEmployee, setIsFocusEmployee] = useState(false);
    const [isFocusLocation, setIsFocusLocation] = useState(false);

    const renderItem = item => {
        return (
          <ThemedView style={styles.item}>
            <ThemedText style={styles.textItem}>{item.label}</ThemedText>
            {item.value === value && (
              <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )}
          </ThemedView>
        );
      };

      const renderLabelEmployee = () => {
        if (value || isFocusEmployee) {
          return (
            <ThemedText style={[dropdownStyles.label, isFocusEmployee && { color: 'blue' }]}>
              Select Employee:
            </ThemedText>
          );
        }
        return null;
      };

      const renderLabelLocation = () => {
        if (value || isFocusLocation) {
          return (
            <ThemedText style={[dropdownStyles.label, isFocusLocation && { color: 'blue' }]}>
              Select Location:
            </ThemedText>
          );
        }
        return null;
      };

      const handleChangePrice = (myNumber) => {
        if(myNumber === ""){
            setInputPrice(myNumber);
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
            setInputPrice('');
            return;
        }
        
        // Parse the number
        const parsedNumber = parseFloat(validNumber);
        
        // Set inputPrice to the parsed number if it's a valid number or just the validNumber
        if (!isNaN(parsedNumber) || validNumber === '.') {
            setInputPrice(validNumber);
        }
    };

    const openModalScanner = () => {setCameraScanned(false); setIsCameraScannerVisible(true)};
    const closeModalScanner = () => setIsCameraScannerVisible(false);


    const handleScannedValue = myScannedValue => {
        setInputBarcode(myScannedValue);
        setCameraScanned(true);
    }

    const handleNewScan = () => {
        setInputBarcode(fixedAssetState.barcode);
        setCameraScanned(false);
    }

    return (
            <ThemedView style={styles.cardContainer}>
                <ThemedView lightColor="#17153B" style={styles.cardHeader}>
                    <ThemedView style={styles.imageContainer}>
                    {
                            (fixedAssetState.photoUrl == null || fixedAssetState.photoUrl.length === 0) ?
                            <Avatar
                                size={120}
                                icon={{ name: 'token', type: 'material' }}
                                placeholderStyle={{backgroundColor: 'purple', borderRadius: 20}}
                                iconStyle={{ backgroundColor: 'purple', borderRadius: 20, minWidth: '100%', height: '100%', justifyContent: 'center' }}
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

                            :

                            <Avatar
                                size={120}
                                icon={{ name: 'token', type: 'material' }}
                                placeholderStyle={{backgroundColor: 'purple', borderRadius: 20}}
                                containerStyle={{borderRadius: 20}}
                                avatarStyle={{borderRadius: 20, borderWidth: 2, borderColor: 'grey'}}
                                source={{ uri: fixedAssetState.photoUrl }}
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

                    }
                    </ThemedView>
                    <ThemedView style={styles.headerTextContainer}>
                    
                        <ThemedView style={{flexDirection: 'column', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.0)'}}>
                            <ThemedText lightColor="ghostwhite">Product ID: {fixedAssetState.id}</ThemedText>
                                <ThemedView style={[{backgroundColor: 'rgba(0,0,0,0.0)', alignItems: 'center'}, styles.cardContentElement]}>
                                    <ThemedText lightColor="ghostwhite" style={{textAlign: 'center', fontSize: 16}}>Name: </ThemedText>
                                    <TextInput  value={inputName} 
                                                onChangeText={setInputName}
                                                style={[{color: oppositeTextColor, fontSize: 15}, styles.textInput, (editMode) ? {color: 'yellow'} : {color: 'ghostwhite'}]} 
                                                readOnly={!editMode}/>
                                </ThemedView>
                            
                            <ThemedView style={[{backgroundColor: 'rgba(0,0,0,0.0)', alignItems: 'center'}, styles.cardContentElement]}>
                            <ThemedText lightColor="ghostwhite" style={{textAlign: 'center', fontSize: 16}}>Price: </ThemedText>
                                    <TextInput  value={inputPrice.toString()} 
                                                onChangeText={handleChangePrice}
                                                style={[{color: oppositeTextColor, fontSize: 15}, styles.textInput, (editMode) ? {color: 'yellow'} : {color: 'ghostwhite'}]} 
                                                readOnly={!editMode}/>
                                </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    <Pressable style={styles.editModeContainer} onPress={() => {setEditMode(!editMode)}}>
                        <Icon name="edit" type="material" iconStyle={(editMode) ? {color: 'lime'} : {color: 'black'}}/>
                    </Pressable>

                </ThemedView>

                        <ThemedView darkColor="white" style={styles.descriptionContainer}>
                            <ThemedText lightColor="black" darkColor="black" style={styles.descriptionTitle}>Description:</ThemedText> 
                            <TextInput  value={inputDescription} 
                                            onChangeText={setInputDescription}
                                            multiline={true}
                                            
                                            style={[{color: 'black', fontSize: 15}, styles.textInput, styles.descriptionContent, (editMode) ? {borderColor: 'lime', borderWidth: 1} : {borderWidth: 0}]} 
                                            readOnly={!editMode}/>
                        </ThemedView>
                        <ThemedView style={{width:'100%', justifyContent: 'center'}}>
                            {
                                (errorMessage.length > 0) && <ThemedText>{errorMessage}</ThemedText>
                            }
                        </ThemedView>

                        <ThemedView style={styles.itemsInColumn}>
                        <ThemedView style={[styles.cardContentElement, styles.barcodeInputElement, {marginBottom: 20, alignItems:'center'}]}>
                                <ThemedText style={{textAlign: 'center'}}>Barcode: </ThemedText>
                                <TextInput  value={inputBarcode} 
                                            onChangeText={setInputBarcode}
                                            style={[{color: textColor}, styles.textInput, {marginHorizontal: '10%'}, (editMode) ? {borderColor: 'lime', borderWidth: 1} : {borderWidth: 0}]} 
                                            readOnly={!editMode}/>
                                <Button radius={"sm"} type="solid" color={'rgba(200,170,0,0.9)'} onPress={openModalScanner} disabled={!editMode}>
                                    <Icon name="barcode-sharp" type="ionicon" color="white" style={{paddingHorizontal: 5}} />
                                    Scan Code 
                                </Button>
                        </ThemedView>
                        <ThemedView style={[styles.cardContentElement, styles.barcodeInputElement, {marginBottom: 20}]}>
                                <ThemedText style={{textAlign: 'center'}}>Creation Date: </ThemedText>
                                <TextInput  value={inputCreationDate.toString()} 
                                            onChangeText={setInputCreationDate}
                                            style={[{color: textColor}, styles.textInput, (editMode) ? {borderColor: 'lime', borderWidth: 1} : {borderWidth: 0}]} 
                                            readOnly={!editMode}/>
                        </ThemedView>

                           
                            {
                                (editMode) ? 
                                (<ThemedView style={dropdownStyles.container}>
                                        {renderLabelEmployee()}
                                        <Dropdown
                                        dropdownPosition="top"
                                        inverted={false}
                                        style={[dropdownStyles.dropdown, isFocusEmployee && { borderColor: 'blue' }]}
                                        placeholderStyle={dropdownStyles.placeholderStyle}
                                        selectedTextStyle={dropdownStyles.selectedTextStyle}
                                        inputSearchStyle={dropdownStyles.inputSearchStyle}
                                        iconStyle={dropdownStyles.iconStyle}
                                        data={possibleEmployees}
                                        search
                                        maxHeight={'90%'}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocusEmployee ? 'Select item' : '...'}
                                        searchPlaceholder="Search..."
                                        value={inputAssignedEmployeeId}
                                        onFocus={() => setIsFocusEmployee(true)}
                                        onBlur={() => setIsFocusEmployee(false)}
                                        onChange={item => {
                                            setInputAssignedEmployeeId(item.value);
                                            setIsFocusEmployee(false);
                                        }}
                                        renderLeftIcon={() => (
                                            <AntDesign
                                            style={dropdownStyles.icon}
                                            color={isFocusEmployee ? 'blue' : 'black'}
                                            name="Safety"
                                            size={20}
                                            />
                                        )}
                                        />
                                </ThemedView>) 
                                : 
                                (<ThemedText>Assigned Employee (ID): {fixedAssetState.employee_id}</ThemedText>)
                            }
                            {
                                (editMode) ? 
                                (<ThemedView style={dropdownStyles.container}>
                                    {renderLabelLocation()}
                                    <Dropdown
                                    dropdownPosition="top"
                                    inverted={false}
                                    style={[dropdownStyles.dropdown, isFocusLocation && { borderColor: 'blue' }]}
                                    placeholderStyle={dropdownStyles.placeholderStyle}
                                    selectedTextStyle={dropdownStyles.selectedTextStyle}
                                    inputSearchStyle={dropdownStyles.inputSearchStyle}
                                    iconStyle={dropdownStyles.iconStyle}
                                    data={possibleLocations}
                                    search
                                    maxHeight={'90%'}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocusLocation ? 'Select item' : '...'}
                                    searchPlaceholder="Search..."
                                    value={inputAssignedLocationId}
                                    onFocus={() => setIsFocusLocation(true)}
                                    onBlur={() => setIsFocusLocation(false)}
                                    onChange={item => {
                                        setInputAssignedLocationId(item.value);
                                        setIsFocusLocation(false);
                                    }}
                                    renderLeftIcon={() => (
                                        <AntDesign
                                        style={dropdownStyles.icon}
                                        color={isFocusLocation ? 'blue' : 'black'}
                                        name="Safety"
                                        size={20}
                                        />
                                    )}
                                    />
                            </ThemedView>)
                                :
                                (<ThemedText>Assigned Location (ID): {fixedAssetState.location_id}</ThemedText>) 
                            }
                            
                        </ThemedView>
                        
                        
                        <ThemedView style={styles.itemsInColumn}>
                            {editMode && <Pressable style={{maxHeight: 60, height: 50, maxWidth:60, width: 50, backgroundColor:'purple', borderRadius: 100, padding: 5, justifyContent:'center'}}
                                            onPress={handleSaveButtonPress}>
                                <Icon name="save" type="material" iconStyle={(editMode) ? {color:'lime'} :{color:'white'}}/>
                            </Pressable>}
                        </ThemedView>

                        <BottomSheet modalProps={{}} isVisible={isPhotoBottomSheetVisible} backdropStyle={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
                
                    <Button
                        title="Take Photo with Camera"
                        buttonStyle={{backgroundColor: 'rgb(70, 50, 175)', borderColor: 'black', borderWidth: 1, height: 60}}
                        titleStyle={{fontSize: 20}}
                        icon={{name: 'camera', type: 'ionicon', color:"white"}}
                        onPress={openCamera}
                    />

                    <Button
                        title="Open Photo from Gallery"
                        buttonStyle={{backgroundColor: 'rgb(70, 50, 175)', borderColor: 'black', borderWidth: 1, height: 60}}
                        titleStyle={{fontSize: 20}}
                        icon={{name: 'photo', color:"white"}}
                        onPress={openGallery}
                    />

                    <Button
                        title="Cancel"
                        buttonStyle={{borderColor: 'black', borderWidth: 1,backgroundColor: 'red', height: 60}}
                        titleStyle={{fontSize: 20}}
                        icon={{name: 'x', type: 'foundation'}}
                        onPress={() => {setPhotoBottomSheetVisible(false);}}
                        />
                
            </BottomSheet>


            <Modal visible={isCameraScannerVisible} animationType="fade" transparent={true}> 
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
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center'}}>{inputBarcode}</ThemedText>
                    </ThemedView>)
                }
                
            </Modal>
        </ThemedView>

                    
            
          )


}

export default FixedAssetCardDetailedCard;

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'column',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden'
    },
    cardHeader: {
        flexDirection: 'row',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    cardContent: {
        flexDirection: 'column'
    },
    imageTag: {
        width: 150,
        height: 150,
        borderColor: 'grey',
        borderWidth: 2,
        backgroundColor: 'ghostwhite',
        borderRadius: 10,
    },
    imageContainer: {
        flex: 3,
        backgroundColor: 'rgba(0,0,0,0.0)'
    },
    headerTextContainer: {
        flex: 3,
        paddingVertical: 5,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.0)',
        flexWrap: 'wrap'
    },
    descriptionContainer: {
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: 'grey',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'ghostwhite'
    },
    descriptionTitle: {
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 700
    },
    descriptionContent: {
        marginHorizontal: 10,
        padding: 5,
        flexWrap: 'wrap',
        maxWidth:'100%'
    },
    editModeContainer: {
     backgroundColor: 'rgba(255,255,255,1.0)',
     height: 40,
     width: 40,
     borderRadius: 100,
     justifyContent: 'center'
       
    },
    itemsInColumn: {
        alignItems: 'center',
        marginVertical: 5
    },
    cardContentElement: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    barcodeInputElement: {
        minWidth: '100%',
        justifyContent:'center'
    },
    textInput: {
        paddingHorizontal: 5,   
    }
    

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

const dropdownStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        width: '90%'
      },
      dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 26,
        top: 52,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
  });