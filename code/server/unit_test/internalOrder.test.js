const internalOrder = require('../modules/internalOrder');

const { expect } = require('chai');

const db=require('../modules/db');
const dbase=new db('./unit_test/testingDb.sqlite');
const iOrd=new internalOrder(dbase.getDb());




describe('internalOrder',()=>{
    
    beforeEach(async ()=>{
        await iOrd.createTable();
        await iOrd.addinternalOrder("2021/11/29 09:33", "ISSUED","[{SKUId:12,description:a product,price:10.99,qty:2}]",1);
    });
 
    test('get orders in state (issued)',async()=>{

      
        const expRet={
            id:1,
            issueDate:"2021/11/29 09:33",
            state: "ISSUED",
            products: [{SKUId:12,description:"a product",price:10.99,qty:2}],
            customerId:1

          }

        const ret = await iOrd.getOrdersInState("ISSUED");
        expect(ret[0].issueDate).equal(expRet.issueDate);
        await iOrd.modifyState(ret[0].id,"ACCEPTED");
        const accepted=await iOrd.getOrdersInState("ACCEPTED");
        expect(accepted[0].issueDate).equal(expRet.issueDate);
        await iOrd.modifyProdAndStateIntOrd(accepted[0].id,'[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]',"COMPLETED");
        const completed=await iOrd.getInternalOrderId(accepted[0].id);
        expect(completed.issueDate).equal(expRet.issueDate);
    });

    test('get internal order by id not existant',async()=>{
        try {
            await iOrd.getInternalOrderId(1718031);
        } catch (error) {
            expect(error).equal(404);
        }
    })
    test('getInState with undefined State',async()=>{
        const ret = await iOrd.getOrdersInState("finished");

        expect(JSON.stringify(ret)).equal("[]");
    })

    afterAll(async ()=>{

       const aux = await iOrd.getInternalOrders()

       //Deleting 
       for(const x of aux){

           if(x.issueDate==="2021/11/29 09:33" && x.customerId===1){
               await iOrd.deleteIntOrd(x.id);

           }
       }
    });
});