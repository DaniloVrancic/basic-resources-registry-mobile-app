import { Modal, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBarWithAdd from '@/components/SearchBarWithAdd';
import RangeSlider from 'rn-range-slider';
import { SetStateAction, Suspense, useCallback, useEffect, useState } from 'react';
import { EmployeeSearchCriteria } from '../search_criteria_interfaces/employee-search-criteria';
import { useThemeColor } from '@/hooks/useThemeColor';
import Thumb from '@/components/slider_components/Thumb';
import Rail from '@/components/slider_components/Rail';
import RailSelected from '@/components/slider_components/RailSelected';
import Label from '@/components/slider_components/Label';
import Notch from '@/components/slider_components/Notch';
import { Ionicons } from '@expo/vector-icons';
import EmployeeCard from '@/components/EmployeeCard';
import LoadingAnimation from '@/components/fallback/LoadingAnimation';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Employee } from '../data_interfaces/employee';
import { getAllEmployees, getAllEmployeesWithNameAndBetweenRange, getEmployeesForContainsName } from '@/db/db';
import AddEmployeeForm from '@/components/AddEmployeeForm';

let db: SQLiteDatabase;
export default function Employees() {
  

  db = useSQLiteContext();
  const [loadedEmployees, setLoadedEmployees] = useState([]);

  const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);

  const openShowAdd = () => {setShowAddEmployee(true);}
  const closeShowAdd = () => {setShowAddEmployee(false);}
  
  

  useEffect(() => {
    loadEmployeesFromDatabase(db);
  }, []);

  const loadEmployeesFromDatabase = async (db: SQLiteDatabase) => {
    try {
      setLoadedEmployees(await getAllEmployees(db));
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleEmployeesSearch = async (name: string) => {
    try {
      setLoadedEmployees(await getEmployeesForContainsName(db, name));
    } catch (error) {
      console.error('Error loading Fixed Assets: ', error);
    }
  }

  const textColor = useThemeColor({}, 'text');


  return (
      <SafeAreaView style={styles.safeArea}>
          <ThemedView style={{flex: 18}}>
            <SearchBarWithAdd
              onAddClick={() => { openShowAdd(); }}
              filterChildren={employeeAdvancedFiltering(loadedEmployees, setLoadedEmployees)}
              renderAddButton={true}
              renderAdvancedFilterButton={true}
              searchHandler={handleEmployeesSearch}
            />
          </ThemedView>
          <ThemedView style={[styles.titleContainer, {flex:8, borderBottomColor: 'grey', borderBottomWidth: 2}]}>
            <ThemedText type="title" style={{paddingHorizontal: 12}}>Employees</ThemedText>
          </ThemedView>
          <ThemedView style={{backgroundColor: 'ghostwhite', flex: 84}}>
            <Suspense fallback={<LoadingAnimation text="Loading data..." />}>
              
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                
                  {
                  loadedEmployees.map((employee: Employee) => 
                    <EmployeeCard key={employee.id} {...employee}/>
                  )}
                  {/* Add more employees or your dynamic list here */}
                  
                </ScrollView>
                
            </Suspense>
          </ThemedView>

          <Modal visible={showAddEmployee} animationType="slide">
            <ThemedView style={modalStyles.modalContainer}>
              <ThemedView style={modalStyles.modalHeader}>
                <Pressable style={modalStyles.modalCloseButton} onPress={() => {closeShowAdd()}}>
                  <Ionicons name="close" size={24} color={textColor} />
                </Pressable>
                <Pressable style={modalStyles.modalSpaceFill} onPress={() => {closeShowAdd()}}></Pressable>
              </ThemedView>
                {
                  //Rest of the container here
                }
                <AddEmployeeForm/>
            </ThemedView>
        </Modal>

      </SafeAreaView>
  )
}





function handleAddEmployee() {}

function employeeAdvancedFiltering(employees: any, setEmployees: any) {
  const currentSearchCriteria: EmployeeSearchCriteria = {name: "" as string, income_min: 20_000 as number, income_max: 100_000 as number};
  const [employeeName, setEmployeeName] = useState(currentSearchCriteria.name);
  const [minIncome, setMinIncome] = useState(currentSearchCriteria.income_min);
  const [maxIncome, setMaxIncome] = useState(currentSearchCriteria.income_max); // Assume a maximum income of 8000 for the slider

  const textColor = useThemeColor({}, 'text');

  const handleNameChange = (newName: string) => {
    setEmployeeName(newName);
  };

  


const renderThumb = useCallback(() => <Thumb name={"Income range"}/>, []);
const renderRail = useCallback(() => <Rail/>, []);
const renderRailSelected = useCallback(() => <RailSelected/>, []);
const renderLabel = useCallback((value: any) => <Label text={value}/>, []);
const renderNotch = useCallback(() => <Notch/>, []);
const [rangeDisabled, setRangeDisabled] = useState(false);
const [floatingLabel, setFloatingLabel] = useState(false);

const handleValueChange = useCallback((low: SetStateAction<number>, high: SetStateAction<number>) => {
  setMinIncome(low as number);
  setMaxIncome(high as number);
}, []);

const advancedFilter = async () => {
      try {
        setEmployees(await getAllEmployeesWithNameAndBetweenRange(db, employeeName, minIncome, maxIncome));
      } catch (error) {
        console.error('Error loading Fixed Assets: ', error);
      }
};



  return (
    <ThemedView style={[styles.advancedFilterContainer]}>
      <ThemedText style={[styles.advancedFilterLabel]}>Name:</ThemedText>
      <TextInput
        style={[styles.advancedFilterInput, {paddingHorizontal: 5}]}
        placeholder="Search by name of employee..."
        value={employeeName}
        onChangeText={handleNameChange}
        placeholderTextColor={'rgba(160, 160, 160, 1)'}
      />
      <ThemedText style={[styles.advancedFilterLabel]}>Income Range:</ThemedText>
      
      <ThemedView style={styles.advancedFilterSliderContainer}>
        <ThemedText>{minIncome?.toString()}</ThemedText>
          <RangeSlider
            style={styles.advancedFilterSlider}
            min={20_000}
            max={100_000}
            step={1000}
            onValueChanged={handleValueChange}
            disableRange={rangeDisabled}
            floatingLabel={floatingLabel}
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={renderLabel}
            renderNotch={renderNotch}
            low={minIncome}
            high={maxIncome}
          />
        <ThemedText>{maxIncome?.toString()}</ThemedText>
      </ThemedView>
      <Pressable style={styles.advancedFilterButton} onPress={advancedFilter}>
          <Ionicons style={{paddingHorizontal: 6}} name="filter" size={24} color={'ghostwhite'} />
          <ThemedText style={styles.advancedFilterButtonText}>Apply Filter</ThemedText>
      </Pressable>
    </ThemedView>

  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 2,
    flexDirection: 'column'
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
    height: 40, // Maintain height or adjust as necessary
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8, // Horizontal padding is usually fine
    paddingVertical: 5, // Don't increase to avoid text clipping
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
  scrollViewContent: {
    padding: 10,
    // Add additional styling as needed
  },
});

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
      }

});