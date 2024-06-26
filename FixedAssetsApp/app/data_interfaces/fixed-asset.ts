export interface FixedAsset {
    id: number;
    name: string;
    description: string;
    barcode: number;
    price: number;
    creationDate: Date;
    assignedEmployeeId: number; // Reference to Employee
    assignedLocationId: number; // Reference to Location
    photoUrl: string; // URL to the asset's photo
  }