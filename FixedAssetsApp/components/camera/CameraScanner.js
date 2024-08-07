import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";

const CameraScanner = () => {
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
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    //console.log("Requesting for camera permission")
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    //console.log("No access to camera")
    return <Text>No access to camera</Text>;
  }

  //console.log("Success!")
  return (
    <View style={[styles.container, styles.containerBorder]}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} styles={styles.scanAgainButton} onPress={() => setScanned(false)}>
          <Text>Niggers</Text>
          </Button>
      )}
    </View>
  );
}

export default CameraScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'100%',
    minHeight:'40%',
    flexDirection: "column",
    justifyContent: "center",
  },
  containerBorder: {
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 10
  },
  scanAgainButton: {
    minHeight: 30,
  }
});
