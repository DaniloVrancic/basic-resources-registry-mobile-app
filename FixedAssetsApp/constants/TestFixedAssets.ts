import { FixedAsset } from "@/app/data_interfaces/fixed-asset";

const testFixedAssets: FixedAsset[] = [
    {
      id: 101,
      name: "Laptop",
      description: "15-inch laptop with 16GB RAM and 512GB SSD",
      barcode: 123456789012,
      price: 1550.00,
      creationDate: new Date("2023-01-15"),
      employee_id: 101,
      location_id: 1,
      photoUrl: "https://example.com/photos/laptop.jpg",
    },
    {
      id: 102,
      name: "Projector",
      description: "4K Ultra HD projector",
      barcode: 987654321098,
      price: 1200.00,
      creationDate: new Date("2023-02-10"),
      employee_id: 102,
      location_id: 2,
      photoUrl: "https://example.com/photos/projector.jpg",
    },
    {
      id: 103,
      name: "Office Chair",
      description: "Ergonomic office chair with lumbar support",
      barcode: 123450987654,
      price: 300.00,
      creationDate: new Date("2023-03-05"),
      employee_id: 103,
      location_id: 3,
      photoUrl: "https://example.com/photos/office-chair.jpg",
    },
    {
      id: 104,
      name: "Printer",
      description: "Wireless all-in-one printer",
      barcode: 567890123456,
      price: 200.00,
      creationDate: new Date("2023-04-12"),
      employee_id: 104,
      location_id: 4,
      photoUrl: "https://example.com/photos/printer.jpg",
    },
    {
      id: 105,
      name: "Desk",
      description: "Standing desk with adjustable height",
      barcode: 678901234567,
      price: 450.00,
      creationDate: new Date("2023-05-20"),
      employee_id: 105,
      location_id: 5,
      photoUrl: "https://example.com/photos/desk.jpg",
    },
  ];
  
  export default testFixedAssets;
  