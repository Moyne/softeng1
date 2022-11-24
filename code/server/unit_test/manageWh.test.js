jest.mock('../modules/sku')
const sku=require('../modules/sku');
jest.mock('../modules/skuitem');
const skuitem=require('../modules/skuitem');
jest.mock('../modules/position');
const position=require('../modules/position');
jest.mock('../modules/item');
const item=require('../modules/item');
const { expect } = require('chai');
const warehouse=require('../manageWarehouse');
const wh=new warehouse('db');
describe('skus',()=>{
    beforeEach(async()=>{
        sku.mockReset();
    })
    test('getSkus',async()=>{
        const getSku=jest.fn();
        sku.prototype.getSkus=getSku;
        getSku.mockReturnValue([{
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 1,
             "price" : 10.99,
             "testDescriptors" : '1,3,4'
         },{
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 1,
             "price" : 10.99,
             "testDescriptors" : '1,3,4'
         }]);
        const ret=await wh.getSkus();
        const expRet=[{
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 1,
             "price" : 10.99,
             "testDescriptors" : [1,3,4]
         },{
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 1,
             "price" : 10.99,
             "testDescriptors" : [1,3,4]
         }];
        expect(JSON.stringify(ret)).equal(JSON.stringify(expRet));
    })

    test('getSkuById',async()=>{
        const getSku=jest.fn();
        sku.prototype.getSkuById=getSku;
        getSku.mockReturnValue({
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 1,
             "price" : 10.99,
             "testDescriptors" : '1,3,4'
         });
        const ret=await wh.getSkuById(1);
        const expRet={
            "description" : "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 1,
             "price" : 10.99,
             "testDescriptors" : [1,3,4]
         }
        expect(JSON.stringify(ret)).equal(JSON.stringify(expRet));
    })

    test('modify sku',async()=>{
        const modSku=jest.fn();
        const getSku=jest.fn();
        const getSkuIt=jest.fn();
        const modPos=jest.fn();
        const getPos=jest.fn();
        position.prototype.getPosById=getPos;
        position.prototype.modifyPos=modPos;
        skuitem.prototype.getSkuItemsById=getSkuIt;
        sku.prototype.getSkuById=getSku;
        sku.prototype.modifySku=modSku;
        getSku.mockImplementation(()=>{return{
            "description": "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 1,
             "price" : 10.99,
             "testDescriptors" : '19,29,39'
         }});
         getSkuIt.mockReturnValue([
            {
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            }
        ]);
        getPos.mockReturnValue({
            "positionID":"800234523412",
            "aisleID": "8002",
            "row": "3452",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 100,
            "occupiedVolume":50
        });
        await wh.modifySku(1,"a new sku",100,50,"first SKU",10.99,2,[1,3,4]);
        expect(modPos.mock.calls[0][0]).equal("800234523412");
        expect(modPos.mock.calls[0][7]).equal(200);
        expect(modPos.mock.calls[0][8]).equal(100);
        expect(modSku.mock.calls[0][7]).equal([1,3,4].toString());
    })

    test('modify sku pos',async()=>{
        const modSkuPos=jest.fn();
        const getSku=jest.fn();
        const getSkuIt=jest.fn();
        const modPos=jest.fn();
        const getPos=jest.fn();
        position.prototype.getPosById=getPos;
        position.prototype.modifyPos=modPos;
        skuitem.prototype.getSkuItemsById=getSkuIt;
        sku.prototype.getSkuById=getSku;
        sku.prototype.modifySkuPos=modSkuPos;
        getSku.mockImplementation(()=>{return{
            "description": "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 1,
             "price" : 10.99,
             "testDescriptors" : '19,29,39'
         }});
         getSkuIt.mockReturnValue([
            {
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            }
        ]);
        getPos.mockReturnValueOnce({
            "positionID":"800234523412",
            "aisleID": "8002",
            "row": "3452",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 100,
            "occupiedVolume":50
        }).mockReturnValue({
            "positionID":"800234523423",
            "aisleID": "8002",
            "row": "3452",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 100,
            "occupiedVolume":50
        });
        await wh.modifySkuPos(1,"800234523423")
        expect(modPos.mock.calls[0][0]).equal("800234523412");
        expect(modPos.mock.calls[0][7]).equal(0);
        expect(modPos.mock.calls[0][8]).equal(0);
        expect(modPos.mock.calls[1][0]).equal("800234523423");
        expect(modPos.mock.calls[1][7]).equal(200);
        expect(modPos.mock.calls[1][8]).equal(100);
        expect(modSkuPos.mock.calls[0][1]).equal("800234523423");
    })

    test('modify sku pos but not enough space in position',async()=>{
        try {
            const modSkuPos=jest.fn();
            const getSku=jest.fn();
            const getSkuIt=jest.fn();
            const modPos=jest.fn();
            const getPos=jest.fn();
            position.prototype.getPosById=getPos;
            position.prototype.modifyPos=modPos;
            skuitem.prototype.getSkuItemsById=getSkuIt;
            sku.prototype.getSkuById=getSku;
            sku.prototype.modifySkuPos=modSkuPos;
            getSku.mockImplementation(()=>{return{
                "description": "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "position" : "800234523423",
                "availableQuantity" : 1,
                "price" : 10.99,
                "testDescriptors" : '19,29,39'
            }});
            getSkuIt.mockReturnValue([
                {
                    "RFID":"12345678901234567890123456789014",
                    "SKUId":1,
                    "DateOfStock":"2021/11/29 12:30"
                },
                {
                    "RFID":"12345678901234567890123456789015",
                    "SKUId":1,
                    "DateOfStock":"2021/11/29 12:30"
                }
            ]);
            getPos.mockReturnValue({
                "positionID":"800234523412",
                "aisleID": "8002",
                "row": "3452",
                "col": "3412",
                "maxWeight": 1000,
                "maxVolume": 1000,
                "occupiedWeight": 950,
                "occupiedVolume":50
            });
            await wh.modifySkuPos(1,"800234523412");
        } catch (error) {
            expect(error).equal(422);
        }
    })

    test('delete sku',async()=>{
        const delSku=jest.fn();
        const getSku=jest.fn();
        const modPos=jest.fn();
        const getPos=jest.fn();
        position.prototype.getPosById=getPos;
        position.prototype.modifyPos=modPos;
        sku.prototype.getSkuById=getSku;
        sku.prototype.deleteSku=delSku;
        getSku.mockImplementation(()=>{return{
            "description": "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "position" : "800234523423",
            "availableQuantity" : 1,
            "price" : 10.99,
            "testDescriptors" : '19,29,39'
        }});
        getPos.mockReturnValue({
            "positionID":"800234523412",
            "aisleID": "8002",
            "row": "3452",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 100,
            "occupiedVolume":50
        });
        await wh.deleteSku(1);
        expect(modPos.mock.calls[0][7]).equal(0);
        expect(modPos.mock.calls[0][8]).equal(0);
    })
});

describe('position',()=>{
    test('modify position',async()=>{
        const modSkuPos=jest.fn();
        const modPos=jest.fn();
        const getPos=jest.fn();
        position.prototype.getPosById=getPos;
        position.prototype.modifyPos=modPos;
        sku.prototype.modifyPos=modSkuPos;
        getPos.mockReturnValue({
            "positionID":"800234523412",
            "aisleID": "8002",
            "row": "3452",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 100,
            "occupiedVolume":50
        });
        await wh.modifyPos("800234523412","8002","3452","0011",1000,1000,100,50);
        expect(modPos.mock.calls[0][0]).equal("800234523412");
        expect(modPos.mock.calls[0][1]).equal("800234520011");
        expect(modSkuPos.mock.calls[0][0]).equal("800234523412");
        expect(modSkuPos.mock.calls[0][1]).equal("800234520011");
    })
})

describe('sku item',()=>{
    test('modify sku item',async()=>{
        const modSku=jest.fn();
        const getSku=jest.fn();
        const getSkuIt=jest.fn();
        const modPos=jest.fn();
        const getPos=jest.fn();
        const modSkuIt=jest.fn();
        const getSkuRfid=jest.fn();
        position.prototype.getPosById=getPos;
        position.prototype.modifyPos=modPos;
        skuitem.prototype.getSkuItemsById=getSkuIt;
        skuitem.prototype.getSkuItemByRfid=getSkuRfid;
        skuitem.prototype.modifySkuItem=modSkuIt;
        sku.prototype.getSkuById=getSku;
        sku.prototype.modifySku=modSku;
        getSku.mockImplementation(()=>{return{
            "description": "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 3,
             "price" : 10.99,
             "testDescriptors" : '19,29,39'
         }});
         getSkuIt.mockReturnValue([
            {
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            }
        ]);
        getSkuRfid.mockReturnValue({
            "RFID":"12345678901234567890123456789016",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/29 12:30"
        })
        getPos.mockReturnValue({
            "positionID":"800234523412",
            "aisleID": "8002",
            "row": "3452",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 300,
            "occupiedVolume":150
        });
        await wh.modifySkuItem("12345678901234567890123456789016","12345678901234567890123456789016",0,"2021/11/29 12:30");
        expect(modPos.mock.calls[0][0]).equal("800234523412");
        expect(modPos.mock.calls[0][7]).equal(200);
        expect(modPos.mock.calls[0][8]).equal(100);
        expect(modSku.mock.calls[0][6]).equal(2);
    })

    test('delete sku item',async()=>{
        const modSku=jest.fn();
        const getSku=jest.fn();
        const getSkuIt=jest.fn();
        const modPos=jest.fn();
        const getPos=jest.fn();
        const delSkuIt=jest.fn();
        const getSkuRfid=jest.fn();
        position.prototype.getPosById=getPos;
        position.prototype.modifyPos=modPos;
        skuitem.prototype.getSkuItemsById=getSkuIt;
        skuitem.prototype.getSkuItemByRfid=getSkuRfid;
        skuitem.prototype.deleteSkuItem=delSkuIt;
        sku.prototype.getSkuById=getSku;
        sku.prototype.modifySku=modSku;
        getSku.mockImplementation(()=>{return{
            "description": "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 3,
             "price" : 10.99,
             "testDescriptors" : '19,29,39'
         }});
         getSkuIt.mockReturnValue([
            {
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            }
        ]);
        getSkuRfid.mockReturnValue({
            "RFID":"12345678901234567890123456789016",
            "SKUId":1,
            "Available":1,
            "DateOfStock":"2021/11/29 12:30"
        })
        getPos.mockReturnValue({
            "positionID":"800234523412",
            "aisleID": "8002",
            "row": "3452",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 300,
            "occupiedVolume":150
        });
        await wh.deleteSkuItem("12345678901234567890123456789016");
        expect(modPos.mock.calls[0][0]).equal("800234523412");
        expect(modPos.mock.calls[0][7]).equal(200);
        expect(modPos.mock.calls[0][8]).equal(100);
        expect(modSku.mock.calls[0][6]).equal(2);
    })
})

describe('item',()=>{
    test('add new item',async()=>{
        const getSku=jest.fn();
        const suppSku=jest.fn();
        const addIt=jest.fn();
        sku.prototype.getSkuById=getSku;
        item.prototype.suppSkuCombExists=suppSku;
        item.prototype.addNewItem=addIt;
        getSku.mockImplementation(()=>{return{
            "description": "a new sku",
             "weight" : 100,
             "volume" : 50,
             "notes" : "first SKU",
             "position" : "800234523412",
             "availableQuantity" : 3,
             "price" : 10.99,
             "testDescriptors" : '19,29,39'
        }});
        suppSku.mockReturnValue(false);
        await wh.addNewItem(1,"desc",11.99,1,1);
        expect(addIt.mock.calls[0][0]).equal(1);
    })

    test('add new item fail because combination of sku and supplier exists already',async()=>{
        try {
            const getSku=jest.fn();
            const suppSku=jest.fn();
            const addIt=jest.fn();
            sku.prototype.getSkuById=getSku;
            item.prototype.suppSkuCombExists=suppSku;
            item.prototype.addNewItem=addIt;
            getSku.mockImplementation(()=>{return{
                "description": "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "position" : "800234523412",
                "availableQuantity" : 3,
                "price" : 10.99,
                "testDescriptors" : '19,29,39'
            }});
            suppSku.mockReturnValue(true);
            await wh.addNewItem(1,"desc",11.99,1,1);
        } catch (error) {
            expect(error).equal(422);
        }
    })
})