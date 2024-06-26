import { StyleSheet } from 'react-native';
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBarWithAdd from '@/components/SearchBarWithAdd';
import Slider from '@react-native-community/slider';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';
import { EmployeeSearchCriteria } from '../search_criteria_interfaces/employee-search-criteria';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function Employees() {
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.safeArea}>
        <SearchBarWithAdd 
          onAddClick={() => {console.log("Employees default click")}} 
          filterChildren={employeeAdvancedFiltering()}
          renderAddButton={true}
          renderAdvancedFilterButton={true}
        />
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Employees</ThemedText>
        </ThemedView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

function handleAddEmployee() {}

function employeeAdvancedFiltering() {
  const currentSearchCriteria: EmployeeSearchCriteria = {name: undefined, income_min: undefined, income_max: undefined};
  const [searchCriteria, setSearchCriteria] = useState(currentSearchCriteria);
  const [minIncome, setMinIncome] = useState(800);
  const [maxIncome, setMaxIncome] = useState(8000); // Assume a maximum income of 8000 for the slider
  
  const textColor = useThemeColor({}, 'text');

  const handleNameChange = (text: string) => {
    searchCriteria.name = text;
    setSearchCriteria({ ...searchCriteria });
  };

  const handleMinIncomeChange = (value: number) => {
    searchCriteria.income_min = value;
    setSearchCriteria({ ...searchCriteria });
    setMinIncome(value);
  };

  const handleMaxIncomeChange = (value: number) => {
    searchCriteria.income_max = value;
    setSearchCriteria({ ...searchCriteria });
    setMaxIncome(value);
  };

  return (
    <ThemedView style={[styles.advancedFiltercontainer]}>
      <ThemedText style={[styles.advancedFilterLabel]}>Name:</ThemedText>
      <TextInput
        style={[styles.advancedFilterinput]}
        placeholder="Search by name"
        value={searchCriteria.name}
        onChangeText={handleNameChange}
      />
      <ThemedText style={[styles.advancedFilterLabel]}>Income Range:</ThemedText>
      <ThemedView style={styles.advancedFilterSliderContainer}>
        <ThemedText>{minIncome}</ThemedText>
        <Slider
          style={styles.advancedFilterSlider}
          minimumValue={800}
          maximumValue={8000}
          step={100}
          value={minIncome}
          onValueChange={handleMinIncomeChange}
          minimumTrackTintColor={textColor}
          maximumTrackTintColor={textColor}
          thumbTintColor={textColor}
        />
        <ThemedText>{maxIncome}</ThemedText>
        <Slider
          style={styles.advancedFilterSlider}
          minimumValue={800}
          maximumValue={8000}
          step={100}
          value={maxIncome}
          onValueChange={handleMaxIncomeChange}
          minimumTrackTintColor={textColor}
          maximumTrackTintColor={textColor}
          thumbTintColor={textColor}
        />
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 6,
    textAlign: 'center',
  },
  advancedFiltercontainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  advancedFilterinput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  advancedFilterLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  advancedFilterSlider: {
    flex: 1,
    marginHorizontal: 8,
  },
  advancedFilterSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});