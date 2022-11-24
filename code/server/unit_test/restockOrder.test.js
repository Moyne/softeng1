const restockOrder = require('../modules/restockOrder');

const { expect } = require('chai');

const db=require('../modules/db');
const dbase=new db('./unit_test/testingDb.sqlite');
const rOrd=new restockOrder(dbase.getDb());




describe('return order',()=>{
    
    beforeEach(async ()=>{
        await rOrd.createTable();
        await rOrd.addRestockOrder('2022/05/03','ISSUED','[{"SKUId":12,"description":"a product","price":10.99,"qty":30},{"SKUId":180,"description":"another product","price":11.99,"qty":20}]',1);
    });
 
    test('get orders in state (issued)',async()=>{

      
        const expRet={
            id:1,
            issueDate:"2022/05/03",
            state: "ISSUED",
            products:'[{"SKUId":12,"description":"a product","price":10.99,"qty":30},{"SKUId":180,"description":"another product","price":11.99,"qty":20}]',
            supplierId:1,
            skuItems:''
        }

        const ret = await rOrd.getOrdersInState('ISSUED')
        expect(ret[0].issueDate).equal(expRet.issueDate);
        await rOrd.modifyState(ret[0].id,"DELIVERED");
        await rOrd.modifySkuItemsRestOrd(ret[0].id,'[{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"}]');
        const skuIt=await rOrd.getReturnItemsOfRestockOrder(ret[0].id);
        expect(skuIt).equal('[{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"}]');
        await rOrd.modifyTNote(ret[0].id,'{"deliveryDate":"2022/01/05}');
        const order=await rOrd.getRestockOrderId(ret[0].id);
        expect(order.state).equal("DELIVERED");
    });
    test('get restockOrder by non existing id',async()=>{
        try {
            await rOrd.getRestockOrderId(-1);
        } catch (error) {
            expect(error).equal(404);
        }
    })
    test('getInState with undefined State',async()=>{
        const ret = await rOrd.getOrdersInState('bhafafo')

        expect(JSON.stringify(ret)).equal("[]");
    })

    afterAll(async ()=>{

       const aux = await rOrd.getRestockOrders()

       //Deleting 
       for(const x of aux){

           if(x.issueDate==="2022/05/03" && x.supplierId===1){
               await rOrd.deleteRestOrd(x.id)
           }
       }
    });
});