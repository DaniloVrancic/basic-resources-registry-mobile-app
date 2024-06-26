export interface FixedAssetSearchCriteria {
    name?: string;
    barcode?: number;
    price_min?: number;
    price_max?: number;
    locationId?: number;
    employeeId?: number;
  }