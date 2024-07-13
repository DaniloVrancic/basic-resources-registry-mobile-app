export interface InventoryItem {
    fixed_asset_id: number; // Reference to FixedAsset
    currentEmployeeId: number; // Reference to Employee
    new_employee_id: number; // Reference to Employee
    currentLocationId: number; // Reference to Location
    newLocationId: number; // Reference to Location
    transfer_list_id: number
  }