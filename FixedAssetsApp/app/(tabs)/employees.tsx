import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBarWithAdd from '@/components/SearchBarWithAdd';
import RangeSlider from 'rn-range-slider';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { EmployeeSearchCriteria } from '../search_criteria_interfaces/employee-search-criteria';
import { useThemeColor } from '@/hooks/useThemeColor';
import Thumb from '../../components/slider_components/Thumb';
import Notch from '../../components/slider_components/Notch';
import Label from '../../components/slider_components/Label';
import Rail from '../../components/slider_components/Rail';
import RailSelected from '../../components/slider_components/RailSelected';
import { Ionicons } from '@expo/vector-icons';

export default function Employees() {
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.safeArea}>
        <SearchBarWithAdd
          onAddClick={() => { console.log("Employees default click") }}
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
  const currentSearchCriteria: EmployeeSearchCriteria = {name: "", income_min: 800, income_max: 8000};
  const [searchCriteria, setSearchCriteria] = useState(currentSearchCriteria);
  const [minIncome, setMinIncome] = useState("800");
  const [maxIncome, setMaxIncome] = useState("8000"); // Assume a maximum income of 8000 for the slider

  const textColor = useThemeColor({}, 'text');

  const handleNameChange = (text: string) => {
    searchCriteria.name = text;
    setSearchCriteria({ ...searchCriteria });
  };

  


const renderThumb = useCallback(() => <Thumb name={"Income range"}/>, []);
const renderRail = useCallback(() => <Rail/>, []);
const renderRailSelected = useCallback(() => <RailSelected/>, []);
const renderLabel = useCallback((value: any) => <Label text={value}/>, []);
const renderNotch = useCallback(() => <Notch/>, []);
const [rangeDisabled, setRangeDisabled] = useState(false);
const [floatingLabel, setFloatingLabel] = useState(false);

const handleValueChange = useCallback((low: SetStateAction<number>, high: SetStateAction<number>) => {
  setMinIncome(low.toString());
  currentSearchCriteria.income_min = low as number;
  setMaxIncome(high.toString());
  currentSearchCriteria.income_max = high as number;
}, []);

const advancedFilter = () => {
  // Implement the advanced filter logic here
  console.log('Advanced filter applied:', searchCriteria);
};

  return (
    <GestureHandlerRootView>
    <ThemedView style={[styles.advancedFilterContainer]}>
      <ThemedText style={[styles.advancedFilterLabel]}>Name:</ThemedText>
      <TextInput
        style={[styles.advancedFilterInput, {paddingHorizontal: 5}]}
        placeholder="Search by name..."
        value={searchCriteria.name}
        onChangeText={handleNameChange}
        placeholderTextColor={'rgba(160, 160, 160, 1)'}
      />
      <ThemedText style={[styles.advancedFilterLabel]}>Income Range:</ThemedText>
      <ThemedView style={styles.advancedFilterSliderContainer}>
        <ThemedText>{minIncome.toString()}</ThemedText>
        <RangeSlider
          style={styles.advancedFilterSlider}
          min={800}
          max={8000}
          step={100}
          onValueChanged={handleValueChange}
          disableRange={rangeDisabled}
          floatingLabel={floatingLabel}
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
        />
        <ThemedText>{maxIncome.toString()}</ThemedText>
      </ThemedView>
      <Pressable style={styles.advancedFilterButton} onPress={advancedFilter}>
        <Ionicons style={{paddingHorizontal: 6}} name="filter" size={24} color={'ghostwhite'} />
        <ThemedText style={styles.advancedFilterButtonText}>Apply Filter</ThemedText>
      </Pressable>
    </ThemedView>
    </GestureHandlerRootView>
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
  advancedFilterContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    color: 'ghostwhite',
    borderColor: 'ghostwhite'
  },
  advancedFilterInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 16,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.8)'
    
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
  advancedFilterButton: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(106, 27, 154)', // Blue-purple color
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  advancedFilterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});