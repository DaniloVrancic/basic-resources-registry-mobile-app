export interface FixedAsset {
    id: number;
    name: string;
    description: string;
    barcode: number;
    price: number;
    creationDate: Date; //Represents the date of the asset getting input in database
    assignedEmployeeId: number; // Reference to Employee
    assignedLocationId: number; // Reference to Location
    photoUrl: string; // URL to the asset's photo
  }