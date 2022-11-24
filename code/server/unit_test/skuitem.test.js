const skuitem =require('../modules/skuitem');

const { expect } = require('chai');

const db=require('../modules/db');
const dbase=new db('./unit_test/testingDb.sqlite');
const sItem=new skuitem(dbase.getDb());

describe('skuitem',()=>{

    beforeEach(async ()=>{
        await sItem.createTable();
        await sItem.addNewSkuItem("12345678901234567890123456789014",18,1,"2021/12/29 19:53");
    })

    test('getSkuItemByid testing',async()=>{

        const expRet={
            rfid: "12345678901234567890123456789014",
            SKUId: 18,
            Available: 1,
            DateOfStock: "2021/12/29 19:53"
          }

          const ret = await sItem.getSkuItemByRfid("12345678901234567890123456789014")
          expect(ret.RFID).equal(expRet.rfid);

    })


    afterAll(async ()=>{
        await sItem.deleteSkuItem("12345678901234567890123456789014")

    })
});