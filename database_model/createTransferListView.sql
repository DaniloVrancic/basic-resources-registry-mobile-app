CREATE VIEW `transfer_list_view` AS
    SELECT 
		`tl`.`id` AS `transferListId`,
        `fa`.`id` AS `assetId`,
        `fa`.`name` AS `fixedAssetName`,
        `it`.`currentLocationId` AS `currentLocationId`,
        `cl`.`name` AS `currentLocationName`,
        `it`.`newLocationId` AS `newLocationId`,
		`nl`.`name` AS `newLocationName`,
        `it`.`currentEmployeeId` AS `currentEmployeeId`,
        `ce`.`name` AS `currentEmployeeName`,
        `it`.`new_employee_id` AS `new_employee_id`,
        `ne`.`name` AS `newEmployeeName`
    FROM
        ((((((`inventory_item` `it`
        LEFT JOIN `location` `cl` ON ((`cl`.`id` = `it`.`currentLocationId`)))
        LEFT JOIN `location` `nl` ON ((`nl`.`id` = `it`.`newLocationId`)))
        LEFT JOIN `transfer_list` `tl` ON ((`tl`.`id` = `it`.`transfer_list_id`)))
        LEFT JOIN `fixed_asset` `fa` ON ((`fa`.`id` = `it`.`fixed_asset_id`)))
        LEFT JOIN `employee` `ce` ON ((`ce`.`id` = `it`.`currentEmployeeId`)))
        LEFT JOIN `employee` `ne` ON ((`ne`.`id` = `it`.`new_employee_id`)));