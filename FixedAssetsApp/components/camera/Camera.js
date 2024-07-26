import { useState } from "react"
import { PermissionsAndroid } from "react-native";
import { launchCamera } from "react-native-image-picker";

const useCamera = () => {

    const [cameraPhoto, setCameraPhoto] = useState('');

    let options = {
        mediaType: 'photo'
    }

    const openCamera = async () => {

        

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
            
            const result = await launchCamera(options);
            console.log(result);
            setCameraPhoto(result);
        }
    };
    return { cameraPhoto, openCamera };
};

export default useCamera;