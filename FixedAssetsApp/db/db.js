import { MY_DATABASE_NAME } from '@/constants/DatabaseInformation';
import * as SQLite from 'expo-sqlite';


  export const connectToDatabase = async () => {
    const db = SQLite.openDatabaseAsync(MY_DATABASE_NAME);
    return db;
  }

  export const createTables = async (db) => {
    const employeeTableQuery = `
      CREATE TABLE IF NOT EXISTS 'employee' (
        'id' INTEGER PRIMARY KEY AUTOINCREMENT,
        'name' TEXT NOT NULL,
        'email' TEXT NOT NULL,
        'income' INTEGER NOT NULL,
        'photoUrl' TEXT
    );
  `;
    const locationTableQuery = `
    CREATE TABLE IF NOT EXISTS 'location' (
     'id' INTEGER PRIMARY KEY AUTOINCREMENT,
      'name' TEXT NOT NULL,
      'size' INTEGER NOT NULL,
      'latitude' REAL NOT NULL,
      'longitude' REAL NOT NULL
     );
    `

    const fixedAssetTableQuery = `
      CREATE TABLE IF NOT EXISTS 'fixed_asset' (
     'id' INTEGER PRIMARY KEY AUTOINCREMENT,
     'name' TEXT NOT NULL,
     'description' TEXT,
     'barcode' TEXT NOT NULL,
     'price' REAL NOT NULL,
     'creationDate' TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
     'location_id' INTEGER NOT NULL,
     'employee_id' INTEGER NOT NULL,
     'photoUrl' TEXT,
      FOREIGN KEY ('location_id') REFERENCES 'location' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION,
      FOREIGN KEY ('employee_id') REFERENCES 'employee' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION);
    `

    const transferListQuery = `
    CREATE TABLE IF NOT EXISTS 'transfer_list' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' TEXT NOT NULL
    );
    `

    const inventoryItemQuery = `
    CREATE TABLE IF NOT EXISTS 'inventory_item' (
    'fixed_asset_id' INTEGER NOT NULL,
    'transfer_list_id' INTEGER NOT NULL,
    'currentEmployeeId' INTEGER NOT NULL,
    'new_employee_id' INTEGER NOT NULL,
    'currentLocationId' INTEGER NOT NULL,
    'newLocationId' INTEGER NOT NULL,
    PRIMARY KEY ('fixed_asset_id', 'transfer_list_id'),
    FOREIGN KEY ('fixed_asset_id') REFERENCES 'fixed_asset' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY ('transfer_list_id') REFERENCES 'transfer_list' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY ('currentEmployeeId') REFERENCES 'employee' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY ('new_employee_id') REFERENCES 'employee' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY ('currentLocationId') REFERENCES 'location' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY ('newLocationId') REFERENCES 'location' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION
);

    CREATE INDEX IF NOT EXISTS 'fk_inventory_item_transfer_list1_idx' ON 'inventory_item' ('transfer_list_id');
    CREATE INDEX IF NOT EXISTS 'fk_inventory_item_employee1_idx' ON 'inventory_item' ('currentEmployeeId');
    CREATE INDEX IF NOT EXISTS 'fk_inventory_item_employee2_idx' ON 'inventory_item' ('new_employee_id');
    CREATE INDEX IF NOT EXISTS 'fk_inventory_item_location1_idx' ON 'inventory_item' ('currentLocationId');
    CREATE INDEX IF NOT EXISTS 'fk_inventory_item_location2_idx' ON 'inventory_item' ('newLocationId');
    `

    try {
      await db.execAsync('PRAGMA journal_mode = WAL');
      await db.execAsync('PRAGMA foreign_keys = ON');

      await db.runAsync(locationTableQuery);
      // console.log("after Location table");
      await db.runAsync(employeeTableQuery);
      // console.log("after Employee table");
      await db.runAsync(fixedAssetTableQuery);
      // console.log("after Fixed Asset table");
      await db.runAsync(transferListQuery);
      // console.log("after Transfer List table");
      await db.runAsync(inventoryItemQuery);
      // console.log("after Inventory Item table");
      

    } catch (error) {
      console.error(error);
      throw Error(`Failed to create tables`);
    }

    try{
      await insertTestDataIfEmpty(db); //will insert and fill the tables with some test data if the tables are empty
    }
    catch(error){
      console.error(error);
      throw Error(`Failed to insert into tables`);
    }
  };

  const insertTestDataIfEmpty = async (db) => {
    const tables = ['employee', 'location', 'fixed_asset', 'transfer_list', 'inventory_item']; //all the table names
    for (const table of tables) {
      
      const rowCount = await db.getFirstAsync(`SELECT COUNT(*) as 'count' FROM '${table}'`);
      if (rowCount["count"] === 0) {
        await insertTestData(db, table);
      }
    }
  };

  const insertTestData = async (db, table) => {
    let insertQueries = [];
    switch (table) {
      case 'employee':
        insertQueries = [
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('John Doe', 'john.doe@example.com', 50000, 'https://example.com/photo1.jpg')`,
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('Jane Smith', 'jane.smith@example.com', 55000, 'https://example.com/photo2.jpg')`,
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('Emily Johnson', 'emily.johnson@example.com', 60000, 'https://example.com/photo3.jpg')`,
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('Michael Brown', 'michael.brown@example.com', 45000, NULL)`,
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('Sarah Davis', 'sarah.davis@example.com', 48000, NULL)`,
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('Chris Evans', 'chris.evans@example.com', 52000, 'https://example.com/photo6.jpg')`,
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('Jessica Wilson', 'jessica.wilson@example.com', 53000, 'https://example.com/photo7.jpg')`,
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('David Martinez', 'david.martinez@example.com', 49000, NULL)`,
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('Laura White', 'laura.white@example.com', 47000, 'https://example.com/photo8.jpg')`,
          `INSERT INTO employee (name, email, income, photoUrl) VALUES ('Peter Green', 'peter.green@example.com', 51000, 'https://example.com/photo9.jpg')`
        ];
        break;
      case 'location':
        insertQueries = [
          `INSERT INTO location (name, size, latitude, longitude) VALUES ('Head Office', 500, 37.7749, -122.4194)`,
          `INSERT INTO location (name, size, latitude, longitude) VALUES ('Warehouse A', 1500, 34.0522, -118.2437)`,
          `INSERT INTO location (name, size, latitude, longitude) VALUES ('Branch Office', 300, 40.7128, -74.0060)`,
          `INSERT INTO location (name, size, latitude, longitude) VALUES ('Warehouse B', 2000, 51.5074, -0.1278)`,
          `INSERT INTO location (name, size, latitude, longitude) VALUES ('Remote Office', 250, 48.8566, 2.3522)`,
          `INSERT INTO location (name, size, latitude, longitude) VALUES ('Warehouse C', 1800, 35.6895, 139.6917)`,
          `INSERT INTO location (name, size, latitude, longitude) VALUES ('Sales Office', 400, 52.5200, 13.4050)`,
          `INSERT INTO location (name, size, latitude, longitude) VALUES ('Data Center', 1000, 41.9028, 12.4964)`
        ];
        break;
      case 'fixed_asset':
        insertQueries = [
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Laptop A', 'Dell Latitude', 'LAP001', 1000.00, 1, 1, 'https://example.com/assetA.jpg')`,
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Printer B', 'HP LaserJet', 'PRI001', 300.00, 2, 2, NULL)`,
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Monitor C', 'Samsung 24 inch', 'MON001', 150.00, 3, 3, 'https://example.com/assetC.jpg')`,
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Projector D', 'Epson 4K', 'PROJ001', 800.00, 4, 4, 'https://example.com/assetD.jpg')`,
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Tablet E', 'Apple iPad', 'TAB001', 500.00, 5, 5, NULL)`,
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Smartphone F', 'Samsung Galaxy', 'PHN001', 700.00, 1, 6, 'https://example.com/assetF.jpg')`,
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Desk G', 'Office Desk', 'DSK001', 200.00, 2, 7, NULL)`,
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Chair H', 'Ergonomic Chair', 'CHR001', 150.00, 3, 8, 'https://example.com/assetH.jpg')`,
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Server I', 'Dell PowerEdge', 'SRV001', 3000.00, 4, 9, 'https://example.com/assetI.jpg')`,
          `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Router J', 'Cisco Router', 'RTR001', 600.00, 5, 10, NULL)`
        ];
        break;
      case 'transfer_list':
        insertQueries = [
          `INSERT INTO transfer_list (name) VALUES ('Office Supplies Transfer')`,
          `INSERT INTO transfer_list (name) VALUES ('IT Equipment Transfer')`,
          `INSERT INTO transfer_list (name) VALUES ('Furniture Transfer')`,
          `INSERT INTO transfer_list (name) VALUES ('Electronics Transfer')`,
          `INSERT INTO transfer_list (name) VALUES ('Miscellaneous Transfer')`
        ];
        break;
      case 'inventory_item':
        insertQueries = [
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (1, 1, 1, 2, 1, 2)`,
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (2, 2, 2, 3, 2, 3)`,
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (3, 3, 3, 4, 3, 4)`,
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (4, 4, 4, 5, 4, 5)`,
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (5, 5, 5, 1, 5, 1)`,
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (6, 1, 6, 7, 1, 2)`,
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (7, 2, 7, 8, 2, 3)`,
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (8, 3, 8, 9, 3, 4)`,
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (9, 4, 9, 10, 4, 5)`,
          `INSERT INTO inventory_item (fixed_asset_id, transfer_list_id, currentEmployeeId, new_employee_id, currentLocationId, newLocationId) VALUES (10, 5, 10, 1, 5, 1)`
        ];
        break;
      default:
        return;
    }
  
    for (const query of insertQueries) {
      await db.runAsync(query);
    }
  };

  ///////////////////////////////////////// SELECT COMMANDS //////////////////////////////////////////

  //GETTING ALL EMPLOYEES FROM DB ////////////////////////////////////////////////////////////////////

  const getAllEmployeesQuery = "SELECT * FROM 'employee';";

  export const getAllEmployees = async (db) => {
    return new Promise((resolve, reject) => {
      
      db.withTransactionAsync( async () => {
        try{
          let rows = await db.getAllAsync(getAllEmployeesQuery, []);
          resolve(rows);
        }
        catch(error){
          reject(error);
        }
      });
    });
  };

  //GETTING ALL LOCATIONS FROM DATABASE ////////////////////////////////////////////////////////////////////

  const getAllLocationsQuery = "SELECT * FROM 'location';";

  export const getAllLocations = async (db) => {
    return new Promise((resolve, reject) => {
      
      db.withTransactionAsync( async () => {
        try{
          let rows = await db.getAllAsync(getAllLocationsQuery, []);
          resolve(rows);
        }
        catch(error){
          reject(error);
        }
      });
    });
  };

  //GETTING ALL THE FIXED ASSETS ////////////////////////////////////////////////////////////////////
  
  const getAllFixedAssetsQuery = "SELECT * FROM 'fixed_asset';";

  export const getAllFixedAssets = async (db) => {


    return new Promise((resolve, reject) => {
      
      db.withTransactionAsync( async () => {
        try{
          let rows = await db.getAllAsync(getAllFixedAssetsQuery, []);
          resolve(rows);
        }
        catch(error){
          reject(error);
        }
      });
    });
  };


  // GETTING INVENTORY ITEMS ////////////////////////////////////////////////////////////////////

  const getInventoryItemsForList = "SELECT * FROM 'inventory_item' WHERE transfer_list_id = $id"; //raw statement

  export const getItemsForList = async (db, id) => {
    return new Promise((resolve, reject) => {
      
      db.withTransactionSync( async () => {
        try{
          
          const allRows = await db.getAllAsync(getInventoryItemsForList, { $id: id });
          resolve(allRows);
        }
        catch(error){
          reject(error);
        }
      });
    });
  };


  //GETTING ALL THE INVENTORY TRANSFER LISTS ////////////////////////////////////////////////////////////////////

  const getInventoryListsQuery = "SELECT * FROM 'transfer_list'";
  export const getAllInventoryLists = async (db) => {


    return new Promise((resolve, reject) => {
      
      db.withTransactionAsync( async () => {
        try{
          let rows = await db.getAllAsync(getInventoryListsQuery, []);
          resolve(rows);
        }
        catch(error){
          reject(error);
        }
      });
    });
  };

