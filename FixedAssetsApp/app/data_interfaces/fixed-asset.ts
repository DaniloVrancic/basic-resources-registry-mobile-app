export interface FixedAsset {
    id: number;
    name: string;
    description: string;
    barcode: string;
    price: number;
    creationDate: Date; //Represents the date of the asset getting input in database
    employee_id: number; // Reference to Employee
    location_id: number; // Reference to Location
    photoUrl: string; // URL to the asset's photo
  }