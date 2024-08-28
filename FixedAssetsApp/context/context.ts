import { Employee } from "@/app/data_interfaces/employee";
import { FixedAsset } from "@/app/data_interfaces/fixed-asset";
import { Location } from "@/app/data_interfaces/location";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { createContext } from "react";



export const PossibleEmployeesContext = createContext<any | undefined>(undefined);
export const PossibleLocationsContext = createContext<any | undefined>(undefined);
export const PossibleFixedAssetsContext = createContext<any | undefined>(undefined);

export function useNewestEmployees() {
    
}