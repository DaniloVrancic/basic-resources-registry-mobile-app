import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

export default function SearchBarWithAdd(){
    const [searchText, setSearchText] = useState('');

    return (
    <ThemedView style={styles.searchContainer}>
        <Ionicons  
        name="search-sharp"
        size={24}
        color="grey"
        style={searchText ? styles.hiddenIcon : styles.searchIcon}
        />
        <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
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
  });