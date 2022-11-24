jest.mock('../manageWarehouse');
const manageWarehouse=require('../manageWarehouse');
jest.mock('../manageTests');
const manageTests=require('../manageTests');
jest.mock('../manageOrders');
const manageOrders=require('../manageOrders');
jest.mock('../manageUsers');
const manageUsers=require('../manageUsers');
jest.mock('../modules/db');
const db=require('../modules/db');
const { expect } = require('chai');
const apiImpl=require('../apiImpl');
const { application } = require('express');
const getDb=jest.fn();
db.prototype.getDb=getDb;
getDb.mockReturnValue('db');
const api=new apiImpl();
describe('manageWarehouse',()=>{

    test('get skus',async()=>{
        const getSkus=jest.fn();
        manageWarehouse.prototype.getSkus=getSkus;
        getSkus.mockReturnValue([{"id":1},{"id":2}]);
        const ret=await api.getSkus();
        expect(ret.length).equal(2);
    })

    test('get sku by id',async()=>{
        const getSku=jest.fn();
        manageWarehouse.prototype.getSkuById=getSku;
        getSku.mockReturnValue({"id":1});
        const ret=await api.getSkuById(1);
        expect(ret.id).equal(1);
    })

    test("get sku by id no id found",async()=>{
        try {
            const getSku=jest.fn();
            manageWarehouse.prototype.getSkuById=getSku;
            getSku.mockImplementation(async ()=>{throw 422});
            await api.getSkus();
        } catch (error) {
            expect(error).equal(404);
        }
    })

    test('add new sku',async()=>{
        const addSku=jest.fn();
        manageWarehouse.prototype.addSku=addSku;
        await api.addNewSku({"description":"description","weight":20,"volume":21,"notes":"notes","price":21.11,"availableQuantity":0});
        expect(addSku.mock.calls[0][0]).equal('description');
    })


    test('modify sku',async()=>{
        const getTd=jest.fn();
        const modSku=jest.fn();
        manageTests.prototype.getTestDescId=getTd;
        manageWarehouse.prototype.modifySku=modSku;
        getTd.mockReturnValue({
            "id": 1,
            "name": "ink",
            "procedureDescription": "checking ink viscosity",
            "idSKU": 1
        });
        const body={"newDescription":"new desc","newVolume":21,
        "newWeight":25,"newNotes":"new notes","newPrice":1.99,
        "newAvailableQuantity":2,"newTestDescriptors":[1,2,3]};
        await api.modifySku(1,body);
        expect(modSku.mock.calls[0][0]).equal(1);
        expect(getTd.mock.calls[0][0]).equal(1);
        expect(getTd.mock.calls[1][0]).equal(2);
        expect(getTd.mock.calls[2][0]).equal(3);
    })

    test('get sku item',async()=>{
        const getSkuIt=jest.fn();
        manageWarehouse.prototype.getSkuItemsByRfid=getSkuIt;
        getSkuIt.mockReturnValue({
            "RFID":"12345678901234567890123456789015",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        const expRet={
            "RFID":"12345678901234567890123456789015",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/29 12:30"
        };
        const ret=await api.getSkuItemByRfid("12345678901234567890123456789015");
        expect(JSON.stringify(ret)).equal(JSON.stringify(expRet));
    })
    test('add sku item',async()=>{
        const addSku=jest.fn();
        manageWarehouse.prototype.addNewSkuItem=addSku;
        await api.addSkuItem({"RFID":"12190","SKUId":2,"DateOfStock":"2022/06/14"});
        expect(addSku.mock.calls[0][0]).equal('12190');
    })
    test('add item',async()=>{
        const supp=jest.fn();
        const addIt=jest.fn();
        manageUsers.prototype.hasSupp=supp;
        manageWarehouse.prototype.addNewItem=addIt;
        const body={
            "id":"1",
            "description":"desc",
            "SKUId":12,
            "price":12.99,
            "supplierId":1
        }
        await api.addItem(body);
        expect(supp.mock.calls[0][0]).equal(body.supplierId);
        expect(addIt.mock.calls[0][0]).equal(1);
    })
    test('modify item',async()=>{
        const modIt=jest.fn();
        manageWarehouse.prototype.modifyItem=modIt;
        await api.modifyItem(1,1,{"newDescription":"new desc","newPrice":31.44});
        expect(modIt.mock.calls[0][0]).equal(1);
        expect(modIt.mock.calls[0][1]).equal(1);
        expect(modIt.mock.calls[0][2]).equal("new desc");
        expect(modIt.mock.calls[0][3]).equal(31.44);
    })
    test('delete item',async()=>{
        const delIt=jest.fn();
        manageWarehouse.prototype.deleteItem=delIt;
        await api.deleteItem(1,1);
        expect(delIt.mock.calls[0][0]).equal(1);
        expect(delIt.mock.calls[0][1]).equal(1);
    })
    test('delete sku',async()=>{
        const del=jest.fn();
        manageWarehouse.prototype.deleteSku=del;
        await api.deleteSku(1);
        expect(del.mock.calls[0][0]).equal(1);
    })
    test('delete sku item',async()=>{
        const del=jest.fn();
        manageWarehouse.prototype.deleteSkuItem=del;
        await api.deleteSkuItem("39484");
        expect(del.mock.calls[0][0]).equal("39484");
    })
    test('delete pos',async()=>{
        const del=jest.fn();
        manageWarehouse.prototype.deletePos=del;
        await api.deletePos("39484");
        expect(del.mock.calls[0][0]).equal("39484");
    });
});
describe('manage orders',()=>{
    test('get restock order id',async()=>{
        const rord=jest.fn();
        rord.mockReturnValue({
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERED",
            "products": [{"SKUId":12,"itemId":12,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":180,"itemId":12,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1,
            "transportNote":{"deliveryDate":"2021/12/29"},
            "skuItems" : [{"SKUId":12,"itemId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"itemId":12,"rfid":"12345678901234567890123456789017"}]
        })
        manageOrders.prototype.getRestockOrderById=rord;
        const ret=await api.getRestockOrderId(1);
        expect(ret.state).equal("DELIVERED");
    })


    test('get return items of restock order',async()=>{
        const retItROrd=jest.fn();
        const tRes=jest.fn();
        manageOrders.prototype.getReturnItemsRestockOrder=retItROrd;
        manageTests.prototype.getTestResultRfid=tRes;
        retItROrd.mockReturnValue([{"SKUId":12,"itemId":12,"rfid":"12345678901234567890123456789016"},
        {"SKUId":12,"itemId":12,"rfid":"12345678901234567890123456789017"}]);
        tRes.mockReturnValueOnce([
            {
                "id":1,
                "idTestDescriptor":14,
                "Date":"2021/11/29",
                "Result": false
            },
            {
                "id":2,
                "idTestDescriptor":12,
                "Date":"2021/11/29",
                "Result": true
            }
        ]).mockReturnValue([
            {
                "id":3,
                "idTestDescriptor":22,
                "Date":"2021/11/29",
                "Result": true
            },
            {
                "id":4,
                "idTestDescriptor":23,
                "Date":"2021/11/29",
                "Result": true
            }
        ]);
        const ret=await api.getRetItemsRestOrd(1);
        expect(JSON.stringify(ret)).equal(JSON.stringify([{"SKUId":12,"itemId":12,"rfid":"12345678901234567890123456789016"}]))
    })

    test('change sku its availability',async()=>{
        const getSkuIt=jest.fn();
        const modSkuIt=jest.fn();
        manageWarehouse.prototype.modifySkuItem=modSkuIt;
        manageWarehouse.prototype.getSkuItemsByRfid=getSkuIt;
        getSkuIt.mockReturnValueOnce({
            "RFID":"12345678901234567890123456789015",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/29 12:30"
        }).mockReturnValue({
            "RFID":"12345678901234567890123456789016",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        await api.changeAvlSkuIt([
            "12345678901234567890123456789015",
            "12345678901234567890123456789016"
        ],false)
        for(let i=0;i<modSkuIt.mock.calls.length;i++) expect(modSkuIt.mock.calls[i][2]).equal(0);
    })
    test('add internal order',async()=>{
        const getSku=jest.fn();
        getSku.mockImplementation(async()=>new Promise((resolve,reject)=>resolve()));
        const cust=jest.fn();
        cust.mockImplementation(async()=>new Promise((resolve,reject)=>resolve()));
        const addord=jest.fn();
        manageOrders.prototype.addInternalOrder=addord;
        manageWarehouse.prototype.getSkuById=getSku;
        manageUsers.prototype.hasCust=cust;
        await api.addInternalOrder({"issueDate":"2022/06/05","products":[{"SKUId":12,"description":"a product","price":10.99,"qty":3},
        {"SKUId":180,"description":"another product","price":11.99,"qty":3}],"customerId":1});
        expect(addord.mock.calls[0]!==undefined).equal(true);
    })
    test('modify internal order to accepted',async()=>{
        const getSku=jest.fn();
        const getIOrd=jest.fn();
        const modIOrd=jest.fn();
        const modSkuIt=jest.fn();
        manageWarehouse.prototype.modifySkuItem=modSkuIt;
        manageOrders.prototype.modifyInternalOrder=modIOrd;
        manageOrders.prototype.getInternalOrderById=getIOrd;
        manageWarehouse.prototype.getSkuById=getSku;
        getIOrd.mockReturnValue({
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ISSUED",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            "customerId" : 1
        });
        getSku.mockImplementationOnce(()=>Promise.resolve({
            "description" : "a product",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 50,
             "price" : 10.99,
             "testDescriptors" : [1,3,4]
        })).mockImplementation(()=>Promise.resolve({
            "description" : "another products",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 50,
             "price" : 11.99,
             "testDescriptors" : [2,5,6]
        }));
        await api.modifyInternalOrder(1,{"newState":"ACCEPTED"});
        expect(modIOrd.mock.calls[0][0]).equal(1);
    })

    test('modify state rest order',async()=>{
        const rord=jest.fn();
        const modState=jest.fn();
        manageOrders.prototype.modifyRestockOrderState=modState;
        manageOrders.prototype.getRestockOrderById=rord;
        rord.mockReturnValue({
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERED",
            "products": [{"SKUId":12,"itemId":12,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":180,"itemId":12,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1,
            "transportNote":{"deliveryDate":"2021/12/29"},
            "skuItems" : [{"SKUId":12,"itemId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"itemId":12,"rfid":"12345678901234567890123456789017"}]
        })
        const retItROrd=jest.fn();
        const tRes=jest.fn();
        manageOrders.prototype.getReturnItemsRestockOrder=retItROrd;
        manageTests.prototype.getTestResultRfid=tRes;
        retItROrd.mockReturnValue([{"SKUId":12,"itemId":12,"rfid":"12345678901234567890123456789016"},
        {"SKUId":12,"itemId":12,"rfid":"12345678901234567890123456789017"}]);
        tRes.mockReturnValueOnce([
            {
                "id":1,
                "idTestDescriptor":14,
                "Date":"2021/11/29",
                "Result": false
            },
            {
                "id":2,
                "idTestDescriptor":12,
                "Date":"2021/11/29",
                "Result": true
            }
        ]).mockReturnValue([
            {
                "id":3,
                "idTestDescriptor":22,
                "Date":"2021/11/29",
                "Result": true
            },
            {
                "id":4,
                "idTestDescriptor":23,
                "Date":"2021/11/29",
                "Result": true
            }
        ]);
        const getSkuIt=jest.fn();
        const modSkuIt=jest.fn();
        manageWarehouse.prototype.modifySkuItem=modSkuIt;
        manageWarehouse.prototype.getSkuItemsByRfid=getSkuIt;
        getSkuIt.mockReturnValueOnce({
            "RFID":"12345678901234567890123456789016",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/29 12:30"
        }).mockReturnValue({
            "RFID":"12345678901234567890123456789016",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        await api.modifyStateRestOrd(1,{"newState":"COMPLETEDRETURN"})
        expect(modSkuIt.mock.calls[0][2]).equal(1);
    })
    test('delete restock order',async()=>{
        const del=jest.fn();
        manageOrders.prototype.deleteRestockOrders=del;
        await api.deleteRestockOrder(1);
        expect(del.mock.calls[0][0]).equal(1);
    })
    test('delete internal order',async()=>{
        const del=jest.fn();
        manageOrders.prototype.deleteInternalOrder=del;
        await api.deleteInternalOrder(1);
        expect(del.mock.calls[0][0]).equal(1);
    })
    test('delete return order',async()=>{
        const del=jest.fn();
        manageOrders.prototype.deleteReturnOrder=del;
        await api.deleteReturnOrder(1);
        expect(del.mock.calls[0][0]).equal(1);
    })
});

describe('manage tests',()=>{
    
    test('add test descriptor',async()=>{
        const getSku=jest.fn();
        const addTd=jest.fn();
        const getTds=jest.fn();
        const modSku=jest.fn();
        manageWarehouse.prototype.getSkuById=getSku;
        manageWarehouse.prototype.modifySku=modSku;
        manageTests.prototype.getTestDescriptors=getTds;
        manageTests.prototype.addTestDescriptor=addTd;
        getSku.mockReturnValue({
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 50,
             "price" : 10.99,
             "testDescriptors" : [1,3,4]
        });
        getTds.mockReturnValue([
            {
                "id":1,
                "name":"test descriptor 1",
                "procedureDescription": "This test is described by...",
                "idSKU" :1
    
            },
            {
                "id":7,
                "name":"test descriptor 7",
                "procedureDescription": "This test is described by...",
                "idSKU" :1
            }
        ]);
        const body={
            "name":"test descriptor 7",
            "procedureDescription": "This test is described by...",
            "idSKU" :1
        }
        await api.addTestDescriptor(body);
        expect(JSON.stringify(modSku.mock.calls[0][7])).equal(JSON.stringify([1,3,4,7]));
    });

    test('modify test descriptor',async()=>{
        const getSku=jest.fn();
        const modTd=jest.fn();
        const getTd=jest.fn();
        const modSku=jest.fn();
        manageWarehouse.prototype.getSkuById=getSku;
        manageWarehouse.prototype.modifySku=modSku;
        manageTests.prototype.getTestDescId=getTd;
        manageTests.prototype.modifyTestDesc=modTd;
        getSku.mockReturnValueOnce({
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 50,
             "price" : 10.99,
             "testDescriptors" : [2,5]
        }).mockReturnValue({
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 50,
             "price" : 10.99,
             "testDescriptors" : [1,3,4,7]
        });
        getTd.mockReturnValue({
            "id":7,
            "name":"test descriptor 7",
            "procedureDescription": "This test is described by...",
            "idSKU" :1
        });
        const body={
            "newName":"test descriptor 7",
            "newProcedureDescription": "This test is described by...",
            "newIdSKU" :2
        }
        await api.modifyTestDescriptor(7,body);
        expect(JSON.stringify(modSku.mock.calls[0][7])).equal(JSON.stringify([1,3,4]));
        expect(JSON.stringify(modSku.mock.calls[1][7])).equal(JSON.stringify([2,5,7]));
    });

    test('delete test descriptor',async()=>{
        const getSku=jest.fn();
        const delTd=jest.fn();
        const getTd=jest.fn();
        const modSku=jest.fn();
        manageWarehouse.prototype.getSkuById=getSku;
        manageWarehouse.prototype.modifySku=modSku;
        manageTests.prototype.getTestDescId=getTd;
        manageTests.prototype.deleteTestDesc=delTd;
        getSku.mockReturnValue({
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 50,
             "price" : 10.99,
             "testDescriptors" : [1,3,4,7]
        });
        getTd.mockReturnValue({
            "id":7,
            "name":"test descriptor 7",
            "procedureDescription": "This test is described by...",
            "idSKU" :1
        });
        await api.deleteTestDescriptor(7);
        expect(JSON.stringify(modSku.mock.calls[0][7])).equal(JSON.stringify([1,3,4]));
    });

    test('modify test result',async()=>{
        const getSkuIt=jest.fn();
        const getTd=jest.fn();
        const addTr=jest.fn();
        manageTests.prototype.addTestResult=addTr;
        manageTests.prototype.getTestDescId=getTd;
        manageWarehouse.prototype.getSkuItemsByRfid=getSkuIt;
        getSkuIt.mockReturnValue({
            "RFID":"12345678901234567890123456789016",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        getTd.mockReturnValue({
            "id":7,
            "name":"test descriptor 7",
            "procedureDescription": "This test is described by...",
            "idSKU" :1
        });
        const body={
            "rfid":"12345678901234567890123456789016",
            "idTestDescriptor":"7",
            "Date":"2022/02/02",
            "Result":true
        }
        await api.addTestResult(body);
        expect(addTr.mock.calls.length).equal(1);
        expect(addTr.mock.calls[0][0]).equal(body.rfid);
        expect(addTr.mock.calls[0][1]).equal(7);
        expect(addTr.mock.calls[0][2]).equal(body.Date);
        expect(addTr.mock.calls[0][3]).equal(body.Result);
    });

    test('add test result but sku item and test descriptor have different sku id',async()=>{
        try {
            const getSkuIt=jest.fn();
            const getTd=jest.fn();
            manageTests.prototype.getTestDescId=getTd;
            manageWarehouse.prototype.getSkuItemsByRfid=getSkuIt;
            getSkuIt.mockReturnValue({
                "RFID":"12345678901234567890123456789016",
                "SKUId":1,
                "Available":1,
                "DateOfStock":"2021/11/29 12:30"
            });
            getTd.mockReturnValue({
                "id":7,
                "name":"test descriptor 7",
                "procedureDescription": "This test is described by...",
                "idSKU" :2
            });
            const body={
                "rfid":"12345678901234567890123456789016",
                "idTestDescriptor":"7",
                "Date":"2022/02/02",
                "Result":true
            }
            await api.addTestResult(body);
        } catch (error) {
            expect(error).equal(422);
        }
    })
    test('delete test result',async()=>{
        const del=jest.fn();
        manageTests.prototype.deleteTestResult=del;
        await api.deleteTestResult(1,"1234");
        expect(del.mock.calls[0][0]).equal("1234");
        expect(del.mock.calls[0][1]).equal(1);
    })
})

describe('manage users',()=>{
    test('manager session',async()=>{
        const session=jest.fn();
        manageUsers.prototype.session=session;
        const body={
            "username":"manag1@ezwh.com",
            "password":"testpassword"
        }
        await api.managerSession(body);
        expect(session.mock.calls[0][2]).equal("manager");
    })
    test('customer session',async()=>{
        const session=jest.fn();
        manageUsers.prototype.session=session;
        const body={
            "username":"user1@ezwh.com",
            "password":"testpassword"
        }
        await api.customerSession(body);
        expect(session.mock.calls[0][2]).equal("customer");
    })
    test('clerk session',async()=>{
        const session=jest.fn();
        manageUsers.prototype.session=session;
        const body={
            "username":"clerk1@ezwh.com",
            "password":"testpassword"
        }
        await api.clerkSession(body);
        expect(session.mock.calls[0][2]).equal("clerk");
    })
    test('supplier session',async()=>{
        const session=jest.fn();
        manageUsers.prototype.session=session;
        const body={
            "username":"supp1@ezwh.com",
            "password":"testpassword"
        }
        await api.supplierSession(body);
        expect(session.mock.calls[0][2]).equal("supplier");
    })
    test('quality employee session',async()=>{
        const session=jest.fn();
        manageUsers.prototype.session=session;
        const body={
            "username":"qemp1@ezwh.com",
            "password":"testpassword"
        }
        await api.qualityEmpSession(body);
        expect(session.mock.calls[0][2]).equal("qualityEmployee");
    })
    test('delivery employee session',async()=>{
        const session=jest.fn();
        manageUsers.prototype.session=session;
        const body={
            "username":"delemp1@ezwh.com",
            "password":"testpassword"
        }
        await api.deliveryEmplSession(body);
        expect(session.mock.calls[0][2]).equal("deliveryEmployee");
    })
    test('delete user',async()=>{
        const del=jest.fn();
        manageUsers.prototype.deleteUser=del;
        await api.deleteUser("api@ezwh.com","customer");
        expect(del.mock.calls[0][0]).equal("api@ezwh.com");
        expect(del.mock.calls[0][1]).equal("customer");
    })
})
