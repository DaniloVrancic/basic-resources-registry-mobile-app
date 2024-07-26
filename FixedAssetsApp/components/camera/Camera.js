import { useState } from "react"
import { PermissionsAndroid } from "react-native";
import { launchCamera } from "react-native-image-picker";

const useCamera = () => {

    const [cameraPhoto, setCameraPhoto] = useState('');

    let options = {
        mediaType: 'photo'
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
                
                if(granted === PermissionsAndroid.RESULTS.GRANTED){
                    const result = await launchCamera(options, (res) => {
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
                  
                           setCameraPhoto(source.uri);
                         
                          
                        }
                      });
                }
                else{
                    console.log("Permission not given.");
                }
        }
        catch(error)
        {
            console.error(error);
        }
    };
    return { cameraPhoto, openCamera };
};

export default useCamera;