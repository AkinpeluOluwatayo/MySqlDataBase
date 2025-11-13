use cape_codd;
-- 2.17
select SKU, SKU DESCRIPTION
from INVENTORY;
-- 2.18
select SKU DESCRIPTION, SKU
from INVENTORY;
-- 2.19
select WarehouseID as ID
from INVENTORY;

-- 2.20
select distinct WarehouseID as ID
from INVENTORY;

-- 2.21
select WarehouseID, SKU, SKU_Description, QuantityOnHand,QuantityOnOrder
from INVENTORY;

-- 2.22
select *
from INVENTORY;

-- 2.23
select QuantityOnHand > 0
from INVENTORY;

-- 2.24
select SKU, SKU_Description  = 0
from INVENTORY;
