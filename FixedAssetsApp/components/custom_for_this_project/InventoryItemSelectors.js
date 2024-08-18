import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Icon } from "@rneui/themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import CameraScanner from "../camera/CameraScanner";
import { getAllFixedAssetsWithBarcode } from "@/db/db";
import { useSQLiteContext } from "expo-sqlite";


let db;
const InventoryItemSelectors = ({
    currentEmployeeId = -1,
    currentLocationId = -1,
    fixedAssetId = -1,
    new_employee_id = -1,
    newLocationId = -1,
    transferListId = -1,
    possibleFixedAssets,
    possibleEmployees,
    possibleLocations,
    titleToDisplay = "Default Text",
    onPressClose = () => {},
    onPressSave = item => {},
    isAddingItem = true,
}) => {

    const textColor = useThemeColor({}, 'text');
    db = useSQLiteContext();

    const [isFocusFixedAsset, setIsFocusFixedAsset] = useState(false);
    const [isFocusCurrentEmployee, setIsFocusCurrentEmployee] = useState(false);
    const [isFocusNewEmployee, setIsFocusNewEmployee] = useState(false);
    const [isFocusCurrentLocation, setIsFocusCurrentLocation] = useState(false);
    const [isFocusNewLocation, setIsFocusNewLocation] = useState(false);

    const [inputAssignedFixedAssetId, setInputAssignedFixedAssetId] = useState(fixedAssetId);
    const [inputAssignedCurrentEmployeeId, setInputAssignedCurrentEmployeeId] = useState(currentEmployeeId);
    const [inputAssignedNewEmployeeId, setInputAssignedNewEmployeeId] = useState(new_employee_id);
    const [inputAssignedCurrentLocationId, setInputAssignedCurrentLocationId] = useState(currentLocationId);
    const [inputAssignedNewLocationId, setInputAssignedNewLocationId] = useState(newLocationId);

    const [barcode, setBarcode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [cameraScanned, setCameraScanned] = useState(false);

    function isObjectEmpty(obj) { 
      return Object.keys(obj).length === 0; 
    } 
    

    const resetDefaultStates = () => {
        setInputAssignedFixedAssetId(fixedAssetId);
        setInputAssignedCurrentEmployeeId(currentEmployeeId);
        setInputAssignedNewEmployeeId(new_employee_id);
        setInputAssignedCurrentLocationId(currentLocationId);
        setInputAssignedNewLocationId(newLocationId);
      }

    const renderLabelFixedAsset = (myIsFocusFixedAsset) => {
        if (myIsFocusFixedAsset) {
          return (
            <ThemedText style={[dropdownStyles.label, myIsFocusFixedAsset && { color: 'green' }]}>
              Select Fixed Asset:
            </ThemedText>
          );
        }
        return null;
      };

    const renderLabelEmployee = (myIsFocusEmployee) => {
        if (myIsFocusEmployee) {
          return (
            <ThemedText style={[dropdownStyles.label, myIsFocusEmployee && { color: 'blue' }]}>
              Select Employee:
            </ThemedText>
          );
        }
        return null;
      };

      const renderLabelLocation = (myIsFocusLocation) => {
        if (myIsFocusLocation) {
          return (
            <ThemedText style={[dropdownStyles.labelBottom, myIsFocusLocation && { color: 'gold' }]}>
              Select Location:
            </ThemedText>
          );
        }
        return null;
      };

      const handleSaveChangesPress = () => {
        var item = {
            fixed_asset_id : inputAssignedFixedAssetId,
            transferListId : transferListId,
            currentEmployeeId : inputAssignedCurrentEmployeeId,
            new_employee_id : inputAssignedNewEmployeeId,
            currentLocationId : inputAssignedCurrentLocationId,
            newLocationId : inputAssignedNewLocationId,
        };

        onPressSave && onPressSave(item);

      }

    const handleScannedValue = async (myScannedValue) => {

        const searchedAsset = await getAllFixedAssetsWithBarcode(db, myScannedValue);
        setCameraScanned(true);
        setBarcode(myScannedValue.toString());

        if(searchedAsset == null || isObjectEmpty(searchedAsset))
          {

          Alert.alert("No such Asset found.", "No asset with this barcode has been found.");
          
        }
        else{
          var foundItem = {...searchedAsset};
          if(foundItem.id == null){
            setInputAssignedFixedAssetId(-1);
          }
          else{
            setInputAssignedFixedAssetId(foundItem.id);
          }

          if(foundItem.employee_id == null){
            setInputAssignedCurrentEmployeeId(-1);
          }
          else{
            setInputAssignedCurrentEmployeeId(foundItem.employee_id);
          }

          if(foundItem.location_id == null){
            setInputAssignedCurrentLocationId(-1);
          }
          else{
            setInputAssignedCurrentLocationId(foundItem.location_id);
          }
          Alert.alert("Success.", "An asset with this barcode was found and relevant data has been filled in.");
          closeModalScanner();
          
        }
    }

    const handleNewScan = () => {
        setBarcode('');
        setCameraScanned(false);
    }

    const openModalScanner = () => {setCameraScanned(false); setIsScanning(true)};
    const closeModalScanner = () => setIsScanning(false);

    return (
    <ThemedView>
        <ScrollView>
        
        <ThemedView style={[modalStyles.modalContainer, {padding: 20}]}>
                            <ThemedView style={modalStyles.modalHeader}>
                                <Pressable style={modalStyles.modalCloseButton} onPress={() => {onPressClose && onPressClose()}}>
                                    <Ionicons name="close" size={24} color={textColor} />
                                </Pressable>
                                <Pressable style={modalStyles.modalSpaceFill} onPress={() => {onPressClose && onPressClose()}}></Pressable>
                            </ThemedView>


                            <ThemedView style={{marginVertical: 10, padding: 10, alignItems: 'center'}}>
                                <ThemedText type="title">{titleToDisplay}</ThemedText>
                            </ThemedView>
                        <ThemedView style={modalStyles.elementGroup} darkColor="white">
                            <ThemedView style={modalStyles.elementGroupLabel}>
                                <ThemedText>Fixed Asset</ThemedText>
                            </ThemedView>
                            <ThemedView style={dropdownStyles.container}>
                                            {renderLabelFixedAsset(isFocusFixedAsset)}
                                            <Dropdown
                                            dropdownPosition="bottom"
                                            inverted={false}
                                            style={[dropdownStyles.dropdown, isFocusFixedAsset && { borderColor: 'green' }]}
                                            placeholderStyle={dropdownStyles.placeholderStyle}
                                            selectedTextStyle={dropdownStyles.selectedTextStyle}
                                            inputSearchStyle={dropdownStyles.inputSearchStyle}
                                            iconStyle={dropdownStyles.iconStyle}
                                            data={possibleFixedAssets}
                                            search
                                            maxHeight={'90%'}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocusFixedAsset ? 'Select item' : '...'}
                                            searchPlaceholder="Search Fixed Asset..."
                                            value={inputAssignedFixedAssetId}
                                            onFocus={() => setIsFocusFixedAsset(true)}
                                            onBlur={() => setIsFocusFixedAsset(false)}
                                            onChange={item => {
                                                setInputAssignedFixedAssetId(item.value);
                                                setIsFocusFixedAsset(false);
                                            }}
                                            renderLeftIcon={() => (
                                                <AntDesign
                                                style={dropdownStyles.icon}
                                                color={isFocusFixedAsset ? 'green' : 'black'}
                                                name="CodeSandbox"
                                                size={20}
                                                />
                                            )}
                                            />
                            </ThemedView>
                            {
                              (isAddingItem === true) ? 
                                <View style={{alignItems: 'center'}}>
                                  <ThemedText style={{color: 'black', marginBottom: 20}}>OR</ThemedText>
                                  <ThemedView>
                                    <Button title="Scan Barcode" onPress={() => setIsScanning(true)} color='#F4A300' />
                                  </ThemedView>
                                </View>
                                : 
                                <></>
                            }
                            
                        </ThemedView>

                    <ThemedView style={{marginVertical: 20, borderWidth: 1, padding: 0}}/>                        

                    <ThemedView style={modalStyles.elementGroup}  darkColor="white">
                        <ThemedView style={modalStyles.elementGroupLabel}>
                            <ThemedText >Employees Transfer</ThemedText>
                        </ThemedView>    
                            <ThemedView style={dropdownStyles.container}>
                                        {renderLabelEmployee(isFocusCurrentEmployee)}
                                        <Dropdown
                                        dropdownPosition="bottom"
                                        inverted={false}
                                        style={[dropdownStyles.dropdown, isFocusCurrentEmployee && { borderColor: 'blue' }]}
                                        placeholderStyle={dropdownStyles.placeholderStyle}
                                        selectedTextStyle={dropdownStyles.selectedTextStyle}
                                        inputSearchStyle={dropdownStyles.inputSearchStyle}
                                        iconStyle={dropdownStyles.iconStyle}
                                        data={possibleEmployees}
                                        search
                                        maxHeight={'90%'}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocusCurrentEmployee ? 'Select item' : '...'}
                                        searchPlaceholder="Search Employee..."
                                        value={inputAssignedCurrentEmployeeId}
                                        onFocus={() => setIsFocusCurrentEmployee(true)}
                                        onBlur={() => setIsFocusCurrentEmployee(false)}
                                        onChange={item => {
                                            setInputAssignedCurrentEmployeeId(item.value);
                                            setIsFocusCurrentEmployee(false);
                                        }}
                                        renderLeftIcon={() => (
                                            <AntDesign
                                            style={dropdownStyles.icon}
                                            color={isFocusCurrentEmployee ? 'blue' : 'black'}
                                            name="idcard"
                                            size={20}
                                            />
                                        )}
                                        />
                            </ThemedView>
                            <Icon name="arrow-downward" type="material"/>
                            <ThemedView style={dropdownStyles.container}>
                                        {renderLabelEmployee(isFocusNewEmployee)}
                                        <Dropdown
                                        dropdownPosition="bottom"
                                        inverted={false}
                                        style={[dropdownStyles.dropdown, isFocusNewEmployee && { borderColor: 'blue' }]}
                                        placeholderStyle={dropdownStyles.placeholderStyle}
                                        selectedTextStyle={dropdownStyles.selectedTextStyle}
                                        inputSearchStyle={dropdownStyles.inputSearchStyle}
                                        iconStyle={dropdownStyles.iconStyle}
                                        data={possibleEmployees}
                                        search
                                        maxHeight={'90%'}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocusNewEmployee ? 'Select item' : '...'}
                                        searchPlaceholder="Search Employee..."
                                        value={inputAssignedNewEmployeeId}
                                        onFocus={() => setIsFocusNewEmployee(true)}
                                        onBlur={() => setIsFocusNewEmployee(false)}
                                        onChange={item => {
                                            setInputAssignedNewEmployeeId(item.value);
                                            setIsFocusNewEmployee(false);
                                        }}
                                        renderLeftIcon={() => (
                                            <AntDesign
                                            style={dropdownStyles.icon}
                                            color={isFocusNewEmployee ? 'blue' : 'black'}
                                            name="idcard"
                                            size={20}
                                            />
                                        )}
                                        />
                            </ThemedView>
                        </ThemedView>


                        <ThemedView style={{marginVertical: 20, borderWidth: 1, padding: 0}}/>

                        <ThemedView style={modalStyles.elementGroup}  darkColor="white">
                        <ThemedView style={modalStyles.elementGroupLabel}>
                            <ThemedText >Location Transfer</ThemedText>
                        </ThemedView>    
                            <ThemedView style={dropdownStyles.container}>
                                        {renderLabelLocation(isFocusCurrentLocation)}
                                        <Dropdown
                                        dropdownPosition="top"
                                        inverted={false}
                                        style={[dropdownStyles.dropdown, isFocusCurrentLocation && { borderColor: 'gold' }]}
                                        placeholderStyle={dropdownStyles.placeholderStyle}
                                        selectedTextStyle={dropdownStyles.selectedTextStyle}
                                        inputSearchStyle={dropdownStyles.inputSearchStyle}
                                        iconStyle={dropdownStyles.iconStyle}
                                        data={possibleLocations}
                                        search
                                        maxHeight={'90%'}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocusCurrentLocation ? 'Select item' : '...'}
                                        searchPlaceholder="Search Location..."
                                        value={inputAssignedCurrentLocationId}
                                        onFocus={() => setIsFocusCurrentLocation(true)}
                                        onBlur={() => setIsFocusCurrentLocation(false)}
                                        onChange={item => {
                                            setInputAssignedCurrentLocationId(item.value);
                                            setIsFocusCurrentLocation(false);
                                        }}
                                        renderLeftIcon={() => (
                                            <AntDesign
                                            style={dropdownStyles.icon}
                                            color={isFocusCurrentLocation ? 'gold' : 'black'}
                                            name="earth"
                                            size={20}
                                            />
                                        )}
                                        />
                            </ThemedView>
                            <Icon name="arrow-downward" type="material"/>
                            <ThemedView style={dropdownStyles.container}>
                                        {renderLabelLocation(isFocusNewLocation)}
                                        <Dropdown
                                        dropdownPosition="top"
                                        inverted={false}
                                        style={[dropdownStyles.dropdown, isFocusNewLocation && { borderColor: 'gold' }]}
                                        placeholderStyle={dropdownStyles.placeholderStyle}
                                        selectedTextStyle={dropdownStyles.selectedTextStyle}
                                        inputSearchStyle={dropdownStyles.inputSearchStyle}
                                        iconStyle={dropdownStyles.iconStyle}
                                        data={possibleLocations}
                                        search
                                        maxHeight={'90%'}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocusNewLocation ? 'Select item' : '...'}
                                        searchPlaceholder="Search Location..."
                                        value={inputAssignedNewLocationId}
                                        onFocus={() => setIsFocusNewLocation(true)}
                                        onBlur={() => setIsFocusNewLocation(false)}
                                        onChange={item => {
                                            setInputAssignedNewLocationId(item.value);
                                            setIsFocusNewLocation(false);
                                        }}
                                        renderLeftIcon={() => (
                                            <AntDesign
                                            style={dropdownStyles.icon}
                                            color={isFocusNewLocation ? 'gold' : 'black'}
                                            name="earth"
                                            size={20}
                                            />
                                        )}
                                        />
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={{marginVertical: 20, borderWidth: 1, padding: 0}}/>

                        <ThemedView style={{justifyContent:'center', alignItems: 'center', width: '100%', minWidth: '100%'}}>
                            <Button
                                buttonStyle={{ justifyContent:'center', backgroundColor: 'purple' }}
                                containerStyle={{width: '90%', borderRadius: 10}}
                                disabledStyle={{
                                    borderWidth: 2,
                                    borderColor: "#00F"
                                }}
                                disabledTitleStyle={{ color: "#00F" }}
                                icon={
                                    <Icon
                                    name="save"
                                    type="material"
                                    size={15}
                                    color="#FFF"
                                    />
                                }
                                iconContainerStyle={{ background: "#000" }}
                                onPress={() => {    handleSaveChangesPress(); }}
                                title="Save Changes"
                                titleStyle={{ marginHorizontal: 5 }}
                            />
                        </ThemedView>                  
                    </ThemedView>
                </ScrollView>

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
                    (<ThemedView style={{backgroundColor:'rgba(220,0,0,1.0)'}}>
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center', color:'rgba(0,0,200,1.0)'}}>No Code Found</ThemedText>
                    </ThemedView>)
                    :
                    (<ThemedView style={{backgroundColor:'rgba(0,220,0,1.0)'}}>
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center'}}>Scanned Code:</ThemedText>
                        <ThemedText type="defaultSemiBold" style={{textAlign:'center'}}>{barcode}</ThemedText>
                    </ThemedView>)
                }
              </Modal>
                
            )}
    </ThemedView>
    )
}



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
    },
    elementGroup:{
        borderWidth: 1.5,
        borderColor: 'grey',
        borderRadius: 15,
        margin: 5,
        padding: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    elementGroupLabel:{
        position: 'absolute',
        fontSize: 18,
        top: -16,
        left: 19,
        borderRadius: 20,
        paddingHorizontal: 20,
        
    }
  
  });

  export default InventoryItemSelectors;

  
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
        top: 0,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      labelBottom: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 26,
        top: 56,
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