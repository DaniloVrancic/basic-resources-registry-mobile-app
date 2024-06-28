export interface InventoryListSearchCriteria {
    keywordToSearch?: string;
    isChangingEmployee?: boolean; //Will be true if the currentEmployeeId and newEmployeeId are not the same
    isChangingLocation?: boolean; //Will be true is the currentLocationId and newLocationId are not the same
  }