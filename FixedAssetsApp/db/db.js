import {
    enablePromise,
    openDatabase,
  } from "react-native-sqlite-storage";

  enablePromise(true);

  const MY_DATABASE_NAME = "my_fixed_assets.db";

  export const connectToDatabase = async () => {
    return openDatabase(
      { name: MY_DATABASE_NAME, location: "default" },
      () => {},
      ((error) => {
        console.error(error)
        throw Error("Could not connect to database");
      }
    ))
  }

  export const createTables = async (db) => {
    const employeeTableQuery = `
      CREATE TABLE IF NOT EXISTS 'employee' (
       'id' INT NOT NULL AUTOINCREMENT,
       'name' TEXT NOT NULL,
       'email' TEXT NOT NULL,
       'income' INT NOT NULL,
       'photoUrl' TEXT NULL,
       PRIMARY KEY ('id'))
    `
    const locationTableQuery = `
     'id' INT NOT NULL AUTO_INCREMENT,
      'name' TEXT NOT NULL,
      'size' INT NOT NULL,
      'latitude' DECIMAL(10,8) NOT NULL,
      'longitude' DECIMAL(11,8) NOT NULL,
      PRIMARY KEY ('id'))
     )
    `

    const fixedAssetTableQuery = `
      CREATE TABLE IF NOT EXISTS 'fixed_asset' (
     'id' INT NOT NULL AUTOINCREMENT,
     'name' TEXT NOT NULL,
     'description' TEXT NULL,
     'barcode' TEXT NULL,
     'price' DECIMAL(7,2) NOT NULL,
     'creationDate' TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
     'location_id' INT NOT NULL,
     'employee_id' INT NULL,
     'photoUrl' TEXT NULL,
     PRIMARY KEY ('id'),
     INDEX 'fk_fixed_asset_location_idx' ('location_id' ASC) VISIBLE,
     INDEX 'fk_fixed_asset_employee1_idx' ('employee_id' ASC) VISIBLE,
     CONSTRAINT 'fk_fixed_asset_location'
       FOREIGN KEY ('location_id')
       REFERENCES 'my_fixed_assets'.'location' ('id')
       ON DELETE NO ACTION
       ON UPDATE NO ACTION,
     CONSTRAINT 'fk_fixed_asset_employee1'
       FOREIGN KEY ('employee_id')
       REFERENCES 'my_fixed_assets'.'employee' ('id')
       ON DELETE NO ACTION
       ON UPDATE NO ACTION)
    `

    const transferListQuery = `
    CREATE TABLE IF NOT EXISTS 'transfer_list' (
    'id' INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY ('id'))
    `

    const inventoryItemQuery = `
    CREATE TABLE IF NOT EXISTS 'inventory_item' (
    'fixed_asset_id' INT NOT NULL,
    'transfer_list_id' INT NOT NULL,
    'currentEmployeeId' INT NOT NULL,
    'new_employee_id' INT NOT NULL,
    'currentLocationId' INT NOT NULL,
    'newLocationId' INT NOT NULL,
    PRIMARY KEY ('fixed_asset_id', 'transfer_list_id'),
    INDEX 'fk_inventory_item_transfer_list1_idx' ('transfer_list_id' ASC) VISIBLE,
    INDEX 'fk_inventory_item_employee1_idx' ('currentEmployeeId' ASC) VISIBLE,
    INDEX 'fk_inventory_item_employee2_idx' ('new_employee_id' ASC) VISIBLE,
    INDEX 'fk_inventory_item_location1_idx' ('currentLocationId' ASC) VISIBLE,
    INDEX 'fk_inventory_item_location2_idx' ('newLocationId' ASC) VISIBLE,
     CONSTRAINT 'fk_inventory_item_fixed_asset1'
       FOREIGN KEY ('fixed_asset_id')
       REFERENCES 'my_fixed_assets'.'fixed_asset' ('id')
       ON DELETE NO ACTION
       ON UPDATE NO ACTION,
     CONSTRAINT 'fk_inventory_item_transfer_list1'
       FOREIGN KEY ('transfer_list_id')
       REFERENCES 'my_fixed_assets'.'transfer_list' ('id')
       ON DELETE NO ACTION
       ON UPDATE NO ACTION,
     CONSTRAINT 'fk_inventory_item_employee1'
       FOREIGN KEY ('currentEmployeeId')
       REFERENCES 'my_fixed_assets'.'employee' ('id')
       ON DELETE NO ACTION
       ON UPDATE NO ACTION,
     CONSTRAINT 'fk_inventory_item_employee2'
       FOREIGN KEY ('new_employee_id')
       REFERENCES 'my_fixed_assets'.'employee' ('id')
       ON DELETE NO ACTION
       ON UPDATE NO ACTION,
     CONSTRAINT 'fk_inventory_item_location1'
       FOREIGN KEY ('currentLocationId')
       REFERENCES 'my_fixed_assets'.'location' ('id')
       ON DELETE NO ACTION
       ON UPDATE NO ACTION,
     CONSTRAINT 'fk_inventory_item_location2'
       FOREIGN KEY ('newLocationId')
       REFERENCES 'my_fixed_assets'.'location' ('id')
       ON DELETE NO ACTION
       ON UPDATE NO ACTION)
    `

    try {
      await db.executeSql(locationTableQuery);
      await db.executeSql(employeeTableQuery);
      await db.executeSql(fixedAssetTableQuery);
      await db.executeSql(transferListQuery);
      await db.executeSql(inventoryItemQuery);

    } catch (error) {
      console.error(error)
      throw Error(`Failed to create tables`)
    }
  }