export interface InventoryItem {
    fixed_asset_id: number | null; // Reference to FixedAsset
    currentEmployeeId: number | null; // Reference to Employee
    new_employee_id: number | null; // Reference to Employee
    currentLocationId: number | null; // Reference to Location
    newLocationId: number | null; // Reference to Location
    transfer_list_id: number
  }