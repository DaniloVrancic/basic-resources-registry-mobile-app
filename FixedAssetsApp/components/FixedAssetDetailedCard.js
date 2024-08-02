import { FixedAsset } from "@/app/data_interfaces/fixed-asset"
import { ThemedView } from "./ThemedView"
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { Pressable, StyleSheet } from "react-native";
import { Avatar, BottomSheet, Button, Icon } from "@rneui/themed";
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker";
import { useState } from "react";

const FixedAssetCardDetailedCard = (
    {fixedAssetState,
    setFixedAssetState
    }
) => {

    const textColor = useThemeColor({}, 'text');
    const [isPhotoBottomSheetVisible, setPhotoBottomSheetVisible] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const defaultImageUrl = "@/assets/images/defaultImage.png";

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


    return (
            <ThemedView style={styles.cardContainer}>
                <ThemedView lightColor="#17153B" style={styles.cardHeader}>
                    <ThemedView style={styles.imageContainer}>
                    <Avatar
                                size={120}
                                icon={{ name: 'token', type: 'material' }}
                                placeholderStyle={{backgroundColor: 'purple', borderRadius: 20}}
                                containerStyle={{borderRadius: 20}}
                                source={(fixedAssetState.photoUrl == null || fixedAssetState.length === 0) ? {uri: 'https://www.gravatar.com/avatar/?d=mp'} : { uri: fixedAssetState.photoUrl }}
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
                    <ThemedView style={styles.headerTextContainer}>

                    
                        <ThemedView style={{flexDirection: 'column', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.0)'}}>
                            <ThemedText lightColor="ghostwhite">Product_ID: {fixedAssetState.id}</ThemedText>
                            <ThemedText lightColor="ghostwhite">Name: {fixedAssetState.name}</ThemedText>
                            <ThemedText lightColor="ghostwhite">Price: {fixedAssetState.price}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <Pressable style={styles.editModeContainer} onPress={() => {setEditMode(!editMode)}}>
                        <Icon name="edit" type="material" iconStyle={(editMode) ? {color: 'lime'} : {color: 'black'}}/>
                    </Pressable>

                </ThemedView>

                        <ThemedView style={styles.descriptionContainer}>
                            <ThemedText style={styles.descriptionTitle}>Description:</ThemedText> 
                            <ThemedText style={styles.descriptionContent}>{fixedAssetState.description}</ThemedText>   
                        </ThemedView>


                        <ThemedView style={styles.itemsInColumn}>
                            <ThemedText>Barcode: {fixedAssetState.barcode}</ThemedText>
                            <ThemedText>Creation Date: {fixedAssetState.creationDate.toString()}</ThemedText>
                            <ThemedText>Assigned Employee (ID): {fixedAssetState.employee_id}</ThemedText>
                            <ThemedText>Assigned Location (ID): {fixedAssetState.location_id}</ThemedText>
                        </ThemedView>
                        
                        
                        <ThemedView style={styles.itemsInColumn}>
                            <ThemedText>Photo (URL):</ThemedText>
                            <ThemedText>{fixedAssetState.photoUrl}</ThemedText>
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
        marginHorizontal: 10
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
    }
    

});