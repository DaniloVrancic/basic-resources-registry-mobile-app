export interface InventoryItem {
    fixedAssetId: number; // Reference to FixedAsset
    currentEmployeeId: number; // Reference to Employee
    newEmployeeId: number; // Reference to Employee
    currentLocationId: number; // Reference to Location
    newLocationId: number; // Reference to Location
  }