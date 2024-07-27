import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useState, ReactNode } from "react";
import { StyleSheet, Modal, Pressable } from "react-native";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SQLiteDatabase } from "expo-sqlite";

interface SearchBarWithAddProps {
  /*
  onAddClick: () => void, will be the function defined in children components
  that will handle the adding of the appropriate item to that category,
  for example if the category is about Locations, then a handleLocationAdding method
  should be assigned to onAddClick to handle item adding appropiately
  */
  onAddClick: () => void;
  /*
  filterChildren will contain the look of the React component being sent as a child 
  and it will build it into the Modal
  */
  filterChildren: React.ReactNode;

  /*
  Will determine if the Add button will even be rendered 
  */
  renderAddButton: boolean;

  /*
  Will determine if the advanced filter button will be rendered
  set to true for render,
  false to ommit
  */
  renderAdvancedFilterButton: boolean;

  searchHandler?: ((name?: any) => void) | undefined;
}

const SearchBarWithAdd: React.FC<SearchBarWithAddProps> = ({
  onAddClick = () => {
    console.log("Default add button clicked");
  },
  filterChildren = null,
  renderAddButton = true,
  renderAdvancedFilterButton = true,
  searchHandler = (x) => {console.log(2+2);}
}) => {
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleFilterPress = () => {
    openModal();
  };

  return (
    <GestureHandlerRootView>
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
        onSubmitEditing={(event) => {searchHandler(event.nativeEvent.text)}}
      />
      {renderAddButton && (
        <Pressable style={[styles.addButton, { backgroundColor: textColor }]} onPress={onAddClick}>
          <Ionicons name="add" size={24} color={backgroundColor} />
        </Pressable>
      )}
      {renderAdvancedFilterButton && (
        <Pressable style={styles.filterButton} onPress={handleFilterPress}>
          <Ionicons name="filter" size={24} color={textColor} />
        </Pressable>
      )}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalHeader}>
            <Pressable style={styles.modalCloseButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color={textColor} />
            </Pressable>
            <Pressable style={styles.modalSpaceFill} onPress={closeModal}></Pressable>
          </ThemedView>
          {filterChildren}
        </ThemedView>
      </Modal>
    </ThemedView>
    </GestureHandlerRootView>
  );
};

export default SearchBarWithAdd;

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
    marginTop: 4,
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
    padding: 5,
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
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingBottom: 40
  },
  modalSpaceFill: {
    flex: 10,
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
});