const sku=require('../modules/sku');

const { expect } = require('chai');

const db=require('../modules/db');
const dbase=new db('./unit_test/testingDb.sqlite');
const skus=new sku(dbase.getDb());

describe('skus',()=>{
    beforeEach(async ()=>{
        await skus.createTable();
        await skus.addNewSku("generic sku",130,150,"Notes",3,5.15);
        await skus.addNewSku("generic sku 2",110,180,"Notes 2",1,10.15);
    })

    test('getSkuById',async ()=>{
        const allSkus=await skus.getSkus();
        let skuid;
        for(const r of allSkus){
            if(r.description==='generic sku'){
                skuid=r.id;
                break;
            }
        }
        const ret=await skus.getSkuById(skuid);
        expect(ret.description).equal("generic sku"); 
    })

    test('getSkuById with wrong ID',async ()=>{
        try {
            await skus.getSkuById(10000000);
        } catch (error) {
            expect(error).equal(404);
        }
    })

    afterAll(async ()=>{
        const allSkus=await skus.getSkus();
        for(const r of allSkus){
            if(r.description==='generic sku' || r.description==='generic sku 2')  await skus.deleteSku(r.id);
        }
    })
})