jest.mock('../modules/restockOrder')
const restockOrder=require('../modules/restockOrder');
jest.mock('../modules/internalOrder');
jest.mock('../modules/returnOrder');
const { expect } = require('chai');
const order=require('../manageOrders');
const returnOrder = require('../modules/returnOrder');
const internalOrder = require('../modules/internalOrder');
const or=new order('db');
describe('restock orders',()=>{

    test('getOrder',async()=>{
        const getRestOrdId=jest.fn();
        restockOrder.prototype.getRestockOrderId=getRestOrdId;
        getRestOrdId.mockReturnValue({id:1,issueDate:"2021/09/02",state:"ISSUED",
        products:'[{"SKUId":1,"itemId":12,"description":"desc","price":12.23,"qty":3}]',supplierId:1,transportNote:'{"deliveryDate":"2021/12/12"}',skuItems:''});
        const ret=await or.getRestockOrderById(1);
        const expRet={
            id: 1,
            issueDate: '2021/09/02',
            state: 'ISSUED',
            products: [ { SKUId: 1, itemId:12, description: 'desc', price: 12.23, qty: 3 } ],
            supplierId: 1,
            transportNote: { deliveryDate: '2021/12/12' },
            skuItems: []
          }
        expect(ret.id).equal(expRet.id);
    })
    test('modify sku it',async ()=>{
        const getRestOrdId=jest.fn();
        const modRestOrd=jest.fn();
        restockOrder.prototype.getRestockOrderId=getRestOrdId;
        restockOrder.prototype.modifySkuItemsRestOrd=modRestOrd;
        getRestOrdId.mockReturnValue({id:1,issueDate:"2021/09/02",state:"DELIVERED",
        products:'[{"SKUId":1,"itemId":12,"description":"desc","price":12.23,"qty":3}]',supplierId:1,transportNote:'{"deliveryDate":"2021/12/12"}',skuItems:''});
        await or.modifyRestockOrderSkuItems(1,[{"SKUId":1,"itemId":12,"rfid":"24124412"},{"SKUId":1,"itemId":12,"rfid":"13441"}]);
        expect(getRestOrdId.mock.calls[0][0]).equal(1);
        expect(modRestOrd.mock.calls[0][0]).equal(1);
        expect(modRestOrd.mock.calls[0][1]).equal('[{"SKUId":1,"itemId":12,"rfid":"24124412"},{"SKUId":1,"itemId":12,"rfid":"13441"}]');
    });
    test('modify sku it with more sku it than qty',async ()=>{
        try {
            const getRestOrdId=jest.fn();
            const modRestOrd=jest.fn();
            restockOrder.prototype.getRestockOrderId=getRestOrdId;
            restockOrder.prototype.modifySkuItemsRestOrd=modRestOrd;
            getRestOrdId.mockReturnValue({id:1,issueDate:"2021/09/02",state:"DELIVERED",
            products:'[{"SKUId":1,"itemId":12,"description":"desc","price":12.23,"qty":3}]',supplierId:1,transportNote:'{"deliveryDate":"2021/12/12"}',skuItems:''});
            await or.modifyRestockOrderSkuItems(1,[{"SKUId":1,"itemId":12,"rfid":"24124412"},{"SKUId":1,"itemId":12,"rfid":"13441"},{"SKUId":1,"itemId":12,"rfid":"144151"},{"SKUId":1,"itemId":12,"rfid":"381819"}]);
        } catch (error) {
            expect(error).equal(422);
        }
    });
    test('modify state',async ()=>{
        const modState=jest.fn();
        restockOrder.prototype.modifyState=modState;
        await or.modifyRestockOrderState(1,"COMPLETED");
        expect(modState.mock.calls[0][0]).equal(1);
        expect(modState.mock.calls[0][1]).equal("COMPLETED");
    });
    test('modify state with wrong state', async ()=>{
        try {
            const modState=jest.fn();
            restockOrder.prototype.modifyState=modState;
            await or.modifyRestockOrderState(1,"error");
        } catch (error) {
            expect(error).equal(422);
        }
    })
    test('modify state completedreturn',async ()=>{
        const modState=jest.fn();
        restockOrder.prototype.modifyState=modState;
        await or.modifyRestockOrderState(1,"COMPLETEDRETURN");
        //expect(retItRetOr.mock.calls[0][0]).equal(1);
        expect(modState.mock.calls[0][0]).equal(1);
        expect(modState.mock.calls[0][1]).equal("COMPLETEDRETURN");
    })
});

describe('internal order',()=>{
    test('modify completed',async ()=>{
        const intOrId=jest.fn();
        const modStateProd=jest.fn();
        internalOrder.prototype.modifyProdAndStateIntOrd=modStateProd;
        internalOrder.prototype.getInternalOrderId=intOrId;
        intOrId.mockReturnValue({
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ACCEPTED",
            "products": '[{"SKUId":12,"description":"a product","price":10.99,"qty":3},{"SKUId":180,"description":"another product","price":11.99,"qty":3}]',
            "customerId" : 1
        });
        await or.modifyInternalOrder(1,{
            newState: "COMPLETED",
            products: [{
                    SkuID: 12,
                    RFID: "1201"
                },
                {
                    SkuID: 12,
                    RFID: "1202"
                },
                {
                    SkuID: 12,
                    RFID: "1203"
                },
                {
                    SkuID: 180,
                    RFID: "1801"
                },
                {
                    SkuID: 180,
                    RFID: "1802"
                },
                {
                    SkuID: 180,
                    RFID: "1803"
                }
            ]
        });
        expect(modStateProd.mock.calls[0][0]).equal(1);
        expect(modStateProd.mock.calls[0][1]).equal(JSON.stringify(
            [{"SKUId":12,"description":"a product","price":10.99,"RFID":"1201"},{"SKUId":12,"description":"a product","price":10.99,"RFID":"1202"},{"SKUId":12,"description":"a product","price":10.99,"RFID":"1203"},{"SKUId":180,"description":"another product","price":11.99,"RFID":"1801"},{"SKUId":180,"description":"another product","price":11.99,"RFID":"1802"},{"SKUId":180,"description":"another product","price":11.99,"RFID":"1803"}]
        ));
    })

    test('modify completed with not enough prods',async ()=>{
        try {
            const intOrId=jest.fn();
            const modStateProd=jest.fn();
            internalOrder.prototype.modifyProdAndStateIntOrd=modStateProd;
            internalOrder.prototype.getInternalOrderId=intOrId;
            intOrId.mockReturnValue({
                "id":1,
                "issueDate":"2021/11/29 09:33",
                "state": "ACCEPTED",
                "products": '[{"SKUId":12,"description":"a product","price":10.99,"qty":3},{"SKUId":180,"description":"another product","price":11.99,"qty":3}]',
                "customerId" : 1
            });
            await or.modifyInternalOrder(1,{
                newState: "COMPLETED",
                products: [{
                        SkuID: 12,
                        RFID: "1201"
                    },
                    {
                        SkuID: 12,
                        RFID: "1202"
                    },
                    {
                        SkuID: 12,
                        RFID: "1203"
                    },
                    {
                    SkuID: 180,
                        RFID: "1801"
                    },
                    {
                        SkuID: 180,
                        RFID: "1802"
                    },
                ]
            });
        } catch (error) {
            expect(error).equal(422);
        }
    })
    test('delete internal order',async()=>{
        const del=jest.fn();
        internalOrder.prototype.deleteIntOrd=del;
        await or.deleteInternalOrder(1);
        expect(del.mock.calls[0][0]).equal(1);
    })
    test('add internal order',async()=>{
        const add=jest.fn();
        internalOrder.prototype.addinternalOrder=add;
        const prod=[{"SKUId":12,"description":"a product","price":10.99,"qty":3},
        {"SKUId":180,"description":"another product","price":11.99,"qty":3}];
        await or.addInternalOrder("2021/11/29 09:33",prod,1);
        expect(add.mock.calls[0][1]).equal("ISSUED");
    })
})

describe('return order',()=>{
    test('add return order successful',async()=>{
        const getRest=jest.fn();
        const addRet=jest.fn();
        restockOrder.prototype.getRestockOrderId=getRest;
        returnOrder.prototype.addReturnOrder=addRet;
        getRest.mockReturnValue({id:1,issueDate:"2021/09/02",state:"COMPLETEDRETURN",
        products:'[{"SKUId":1,"itemId":12,"description":"desc","price":12.23,"qty":3}]',supplierId:1,transportNote:'{"deliveryDate":"2021/12/12"}',skuItems:'[{"SKUId":1,"itemId":12,"description":"aaj","price":1.11,"rfid":"17177171"},{"SKUId":1,"description":"aaj","price":1.11,"rfid":"17177172"}]'});
        await or.addReturnOrder("2012/09/12",[{"SKUId":1,"itemId":12,"description":"aaj","price":1.11,"RFID":"17177171"},{"SKUId":1,"itemId":12,"description":"aaj","price":1.11,"RFID":"17177172"}],1);
        expect(addRet.mock.calls[0][1]).equal(JSON.stringify([{"SKUId":1,"itemId":12,"description":"aaj","price":1.11,"RFID":"17177171"},{"SKUId":1,"itemId":12,"description":"aaj","price":1.11,"RFID":"17177172"}]));
    })
    test('add return order failed',async()=>{
        try {
            const getRest=jest.fn();
            const addRet=jest.fn();
            restockOrder.prototype.getRestockOrderId=getRest;
            returnOrder.prototype.addReturnOrder=addRet;
            getRest.mockReturnValue({id:1,issueDate:"2021/09/02",state:"COMPLETEDRETURN",
            products:'[{"SKUId":1,"itemId":12,"description":"desc","price":12.23,"qty":3}]',supplierId:1,transportNote:'{"deliveryDate":"2021/12/12"}',skuItems:'[{"SKUId":1,"description":"aaj","price":1.11,"RFID":"17177171"},{"SKUId":1,"description":"aaj","price":1.11,"RFID":"17177172"}]'});
            await or.addReturnOrder("12/09/12",[{"SKUId":1,"description":"aaj","price":1.11,"RFID":"17177179"},{"SKUId":1,"itemId":12,"description":"aaj","price":1.11,"RFID":"17177172"}],1);
        } catch (error) {
            expect(error).equal(422);
        }
    })
    test('get return items restock order',async()=>{
        const getRetIts=jest.fn();
        returnOrder.prototype.getRetItROrd=getRetIts;
        getRetIts.mockReturnValue([{products:'[{"SKUId":1,"itemId":12,"description":"aaj","price":1.11,"RFID":"17177179"}]'},{products:'[{"SKUId":1,"itemId":12,"description":"aaj","price":1.11,"RFID":"17177172"}]'}]);
        await or.getRetOrdItemsRestOrd(1);
        expect(getRetIts.mock.calls[0][0]).equal(1);
    })
    test('delete return order',async()=>{
        const del=jest.fn();
        returnOrder.prototype.deleteReturnOrder=del;
        await or.deleteReturnOrder(1);
        expect(del.mock.calls[0][0]).equal(1);
    })
    test('get return orders',async()=>{
        const get=jest.fn();
        returnOrder.prototype.getReturnOrders=get;
        get.mockReturnValue([{
            "id":1,
            "returnDate":"2021/11/29 09:33",
            "products": '[{"SKUId":12,"itemId":10,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},{"SKUId":180,"itemId":18,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}]',
            "restockOrderId" : 1
        },{
            "id":2,
            "returnDate":"2021/11/29 09:33",
            "products": '[{"SKUId":15,"itemId":13,"description":"a product","price":10.99,"RFID":"22345678901234567890123456789016"},{"SKUId":15,"itemId":13,"description":"another product","price":11.99,"RFID":"22345678901234567890123456789038"}]',
            "restockOrderId" : 4
        }]);
        const res=await or.getReturnOrders();
        expect(res[0].id).equal(1);
        expect(res[1].id).equal(2);
    })
    test('get return order id',async()=>{
        const get=jest.fn();
        returnOrder.prototype.getReturnOrderId=get;
        get.mockReturnValue({
            "id":2,
            "returnDate":"2021/11/29 09:33",
            "products": '[{"SKUId":15,"itemId":13,"description":"a product","price":10.99,"RFID":"22345678901234567890123456789016"},{"SKUId":15,"itemId":13,"description":"another product","price":11.99,"RFID":"22345678901234567890123456789038"}]',
            "restockOrderId" : 4
        });
        const res=await or.getReturnOrderId(2);
        expect(res.id).equal(2);
    })
})
