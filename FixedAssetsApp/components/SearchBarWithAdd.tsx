import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { useState } from "react";
import { StyleSheet, Modal } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function SearchBarWithAdd({
  onAddClick,
  filterChildren
}){
    const [searchText, setSearchText] = useState('');

    const [showModal, setShowModal] = useState(false); //Going to be set to true if the Modal needs to be shown

    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

  const handleFilterPress = () => {
    openModal();
  };

    return (
        <ThemedView style={[styles.searchContainer, { backgroundColor }]}>
        <Ionicons  
        name="search-sharp"
        size={24}
        color="grey"
        style={searchText ? styles.hiddenIcon : styles.searchIcon}
        />
        <TextInput
        style={[styles.searchInput, { color: textColor }]}
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: textColor }]} onPress={onAddClick}>
        <Ionicons name="add" size={24} color={backgroundColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
        <Ionicons name="filter" size={24} color={textColor} />
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalHeader}>

              <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalSpaceFill} onPress={closeModal}>
              </TouchableOpacity>
              
            </ThemedView>

            {filterChildren}
        </ThemedView>
      </Modal>
    </ThemedView>
    )
}
const styles = StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 8,
      marginLeft: 3,
      marginRight: 3,
      marginBottom: 4,
      marginTop: 4
    },
    searchIcon: {
      marginLeft: 8,
    },
    hiddenIcon: {
      display: 'none',
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
    },
    addButton: {
      backgroundColor: '#007AFF',
      padding: 8,
      borderRadius: 8,
      marginLeft: 8,
    },
    filterButton: {
      marginLeft: 8,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // semi-transparent background
    },
    modalHeader: {
      display: "flex",
      backgroundColor:"rgba(0, 0, 0, 0.0)",
      flexDirection: "row"
    },
    modalSpaceFill: {
      flex: 10,
    },
    modalCloseButton: {
      justifyContent: 'flex-end',
      flex: 1,
      padding: 16,
      borderRadius: 50,
      backgroundColor: 'rgba(200,200,200, 0.8)'
    }
  });