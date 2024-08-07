import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";

const CameraScanner = (
  {
    onCodeScanned,
    onNewScanButtonTapped
  }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if(typeof onCodeScanned === 'function')
    {
      onCodeScanned(data);
    }
  };

  if (hasPermission === null) {
    //console.log("Requesting for camera permission")
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
   
    return <Text>No access to camera</Text>;
  }

  
  return (
    <View style={[styles.container, styles.containerBorder]}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            "ean13" , "ean8" , 
            "qr" , "pdf417" , 
            "code39" , "code93" , 
            "itf14" , "codabar" , 
            "code128" , "upc_a"]
        }}
        style={[StyleSheet.absoluteFillObject]}
      />
      {scanned && (
        <Button title={"Tap to Scan Again (Cancel Current Scan)"} styles={styles.scanAgainButton} onPress={() => {
          setScanned(false); 
          if(onNewScanButtonTapped != undefined)
          onNewScanButtonTapped();
        }}> </Button>
      )}
    </View>
  );
}

export default CameraScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'100%',
    minHeight:'66.66%',
    flexDirection: "column",
    justifyContent: "center",
  },
  containerBorder: {
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 10,
    overflow: 'hidden'
  },
  scanAgainButton: {
    minHeight: 30,
  }
});
