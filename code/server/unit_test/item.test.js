const item = require('../modules/item');

const { expect } = require('chai');

const db=require('../modules/db');
const dbase=new db('./unit_test/testingDb.sqlite');
const it=new item(dbase.getDb());



describe('item',()=>{

   
    beforeAll(async()=>{
        await it.createTable();
    }) 

    test('suppSkuCombExists existing ',async()=>{

        await it.addNewItem(7,"Laptop new gen", 799, 5, 7);
     
        const ret = await it.suppSkuCombExists(7,5);
        expect(ret).equal(true);
        const items=await it.getItems();
        expect(items.length).equal(1);
        await it.modifyItem(7,7,"new description for item test",98.99);
        const item=await it.getItemsById(7,7);
        expect(items[0].id).equal(item.id);
        expect(item.price).equal(98.99);
    });


    test('suppSkuCombExists of non existing ',async()=>{
     

        const ret = await it.suppSkuCombExists(677,7);
        expect(ret).equal(false);

       
    });

    afterAll(async ()=>{

        await it.deleteItem(7,7)

    });
});