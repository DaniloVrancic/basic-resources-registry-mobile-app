import { FixedAsset } from "@/app/data_interfaces/fixed-asset"
import { ThemedView } from "./ThemedView"
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { Pressable, StyleSheet, TextInput } from "react-native";
import { Avatar, BottomSheet, Button, Icon } from "@rneui/themed";
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { updateFixedAsset } from "@/db/db";
import { useOppositeThemeColor } from "@/hooks/useOppositeThemeColor";

let db;
const FixedAssetCardDetailedCard = (
    {fixedAssetState,
    setFixedAssetState
    }
) => {

    const textColor = useThemeColor({}, 'text');
    const oppositeTextColor = useOppositeThemeColor({}, 'text');
    const [isPhotoBottomSheetVisible, setPhotoBottomSheetVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [inputBarcode, setInputBarcode] = useState(fixedAssetState.barcode);
    const [inputName, setInputName] = useState(fixedAssetState.name);
    const [inputDescription, setInputDescription] = useState(fixedAssetState.description);
    const [inputCreationDate, setInputCreationDate] = useState(fixedAssetState.creationDate);

    const defaultImageUrl = "@/assets/images/defaultImage.png";

    db = useSQLiteContext();

    const onPressAvatar = () => {
        
        setPhotoBottomSheetVisible(true);
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
                          alert(res.customButton);
                        } else {
                         // let source = res;
                          // var resourcePath1 = source.assets[0].uri;
                          const source = { uri: res.uri };
                          console.log('response', JSON.stringify(res));
                           
                        
                         
                          
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
        console.log(resultUri);
        setInputPhotoUrl(resultUri);
    }

    const handleSaveButtonPress = async () => {


        let tempAssetState = {...fixedAssetState};
        let rows = await updateFixedAsset(db, fixedAssetState);
    }

    const handleChangeBarcode = (myBarcode) => {
        
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
                            <ThemedText lightColor="ghostwhite">Product_ID: {fixedAssetState.id}</ThemedText>
                                <ThemedView style={[{backgroundColor: 'rgba(0,0,0,0.0)'}, styles.cardContentElement]}>
                                    <ThemedText lightColor="ghostwhite" style={{textAlign: 'center'}}>Name: </ThemedText>
                                    <TextInput  value={inputName} 
                                                onChangeText={setInputName}
                                                style={[{color: oppositeTextColor}, styles.textInput, (editMode) ? {color: 'yellow'} : {color: textColor}]} 
                                                readOnly={!editMode}/>
                                </ThemedView>
                            <ThemedText lightColor="ghostwhite">Price: {fixedAssetState.price}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <Pressable style={styles.editModeContainer} onPress={() => {setEditMode(!editMode)}}>
                        <Icon name="edit" type="material" iconStyle={(editMode) ? {color: 'lime'} : {color: 'black'}}/>
                    </Pressable>

                </ThemedView>

                        <ThemedView darkColor="white" style={styles.descriptionContainer}>
                            <ThemedText lightColor="white" darkColor="black" style={styles.descriptionTitle}>Description:</ThemedText> 
                            <TextInput  value={inputDescription} 
                                            onChangeText={setInputDescription}
                                            multiline={true}
                                            
                                            style={[{color: oppositeTextColor}, styles.textInput, styles.descriptionContent, (editMode) ? {borderColor: 'lime', borderWidth: 1} : {borderWidth: 0}]} 
                                            readOnly={!editMode}/>
                        </ThemedView>


                        <ThemedView style={styles.itemsInColumn}>
                        <ThemedView style={[styles.cardContentElement, styles.barcodeInputElement, {marginBottom: 20}]}>
                                <ThemedText style={{textAlign: 'center'}}>Barcode: </ThemedText>
                                <TextInput  value={inputBarcode} 
                                            onChangeText={setInputBarcode}
                                            style={[{color: textColor}, styles.textInput, (editMode) ? {borderColor: 'lime', borderWidth: 1} : {borderWidth: 0}]} 
                                            readOnly={!editMode}/>
                        </ThemedView>
                        <ThemedView style={[styles.cardContentElement, styles.barcodeInputElement, {marginBottom: 20}]}>
                                <ThemedText style={{textAlign: 'center'}}>Creation Date: </ThemedText>
                                <TextInput  value={inputCreationDate.toString()} 
                                            onChangeText={setInputCreationDate}
                                            style={[{color: textColor}, styles.textInput, (editMode) ? {borderColor: 'lime', borderWidth: 1} : {borderWidth: 0}]} 
                                            readOnly={!editMode}/>
                        </ThemedView>
                            <ThemedText>Assigned Employee (ID): {fixedAssetState.employee_id}</ThemedText>
                            <ThemedText>Assigned Location (ID): {fixedAssetState.location_id}</ThemedText>
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
                    ></Button>

                    <Button
                        title="Open Photo from Gallery"
                        buttonStyle={{backgroundColor: 'rgb(70, 50, 175)', borderColor: 'black', borderWidth: 1, height: 60}}
                        titleStyle={{fontSize: 20}}
                        icon={{name: 'photo', color:"white"}}
                        onPress={openGallery}
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