const returnOrder = require('../modules/returnOrder');

const { expect } = require('chai');

const db=require('../modules/db');
const dbase=new db('./unit_test/testingDb.sqlite');
const rOrd=new returnOrder(dbase.getDb());




describe('return order',()=>{
    
    beforeEach(async ()=>{
        await rOrd.createTable();
        await rOrd.addReturnOrder('2022/05/03','[{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"}]',1);
    });
 
    test('get orders in state (issued)',async()=>{

      
        const expRet={
            id:1,
            returnDate:"2022/05/03",
            products:'[{"SKUId":12,"description":"a product","price":10.99,"qty":30},{"SKUId":180,"description":"another product","price":11.99,"qty":20}]',
            restockOrderId:1
        }

        const ret = await rOrd.getReturnOrders();
        expect(ret[0].returnDate).equal(expRet.returnDate);
        const items=await rOrd.getRetItROrd(1);
        const exp=[{"products":'[{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"}]'}]
        expect(JSON.stringify(items)).equal(JSON.stringify(exp));
    });
    test('get return order by non existing id',async()=>{
        try {
            await rOrd.getReturnOrderId(9100);
        } catch (error) {
            expect(error).equal(404);
        }
    })

    afterAll(async ()=>{

       const aux = await rOrd.getReturnOrders();

       //Deleting 
       for(const x of aux){

           if(x.returnDate==="2022/05/03" && x.restockOrderId===1){
               await rOrd.deleteReturnOrder(x.id);
           }
       }
    });
})