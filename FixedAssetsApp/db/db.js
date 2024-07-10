import * as SQLite from 'expo-sqlite';

  const MY_DATABASE_NAME = "my_fixed_assets.db";

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
     'employee_id' INTEGER NULL,
     'photoUrl' TEXT NULL,
      FOREIGN KEY ('location_id') REFERENCES 'location' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION,
      FOREIGN KEY ('employee_id') REFERENCES 'employee' ('id') ON DELETE NO ACTION ON UPDATE NO ACTION
    `

    const transferListQuery = `
    CREATE TABLE IF NOT EXISTS 'transfer_list' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT);
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
      console.log("after Location table");
      await db.runAsync(employeeTableQuery);
       console.log("after Employee table");
      await db.runAsync(fixedAssetTableQuery);
       console.log("after Fixed Asset table");
      await db.runAsync(transferListQuery);
       console.log("after Transfer List table");
      await db.runAsync(inventoryItemQuery);
       console.log("after Inventory Item table");


      

    } catch (error) {
      console.error(error);
      throw Error(`Failed to create tables`);
    }
  }