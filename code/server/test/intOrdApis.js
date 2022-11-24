const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { afterEach, beforeEach, it } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
let customerId;
describe('test internal orders creation and states apis', () => {
    beforeEach(async()=>{
        const sku={
            "description" : "sku for internal order testign 1",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for return order testing",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        const sku2={
            "description" : "sku for internal order testign 2",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for return order testing",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        await agent.post('/api/sku').send(sku);
        await agent.post('/api/sku').send(sku2);
        const skus=await agent.get('/api/skus');
        let sku1id;
        let sku2id;
        for(const s of skus.body){
            if(s.description===sku.description) sku1id=s.id;
            else if(s.description===sku2.description) sku2id=s.id;
        }
        const cust={
            "username":"custTestInternalOrderApiTest@ezwh.com",
            "name":"Customer",
            "surname" : "Testing",
            "password" : "testpassword",
            "type" : "customer"
        }
        await agent.post('/api/newUser').send(cust);
        const usr=await agent.get('/api/users');
        for(const u of usr.body){
            if(u.email===cust.username && u.type===cust.type){
                customerId=u.id;
                break;
            }
        }
        const iOrd={
            "issueDate":"2020/11/29 09:33",
            "products": [{"SKUId":sku1id,"description":"sku for internal order testign 1","price":10.99,"qty":2},
                        {"SKUId":sku2id,"description":"sku for internal order testign 2","price":10.99,"qty":1}],
            "customerId" : customerId
        }
        await agent.post('/api/internalOrders').send(iOrd);
    });

    it('accept internal order and complete it (scenario 9-1 and scenario 10-1)',done=>{
        const sku={
            "description" : "sku for internal order testign scenario",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for return order testing",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        agent.post('/api/sku').send(sku).then(res=>{
            res.should.have.status(201);
            agent.get('/api/skus').then(res=>{
                let skuid;
                for(const s of res.body){
                    if(s.description===sku.description){
                        skuid=s.id;
                        break;
                    }
                }
                expect(skuid!==undefined).equal(true);
                const iOrd={
                    "issueDate":"2022/8/29 17:24",
                    "products": [{"SKUId":skuid,"description":"pen","price":1.99,"qty":1}],
                    "customerId" : customerId
                };
                const skuIt={
                    "RFID":"12345678900000000000000000000012",
                    "SKUId":skuid,
                    "DateOfStock":"2021/11/29 12:30"
                }
                agent.post('/api/skuitem').send(skuIt).then(res=>{
                    res.should.have.status(201);
                    const newSkuId={
                        "newRFID":"12345678900000000000000000000012",
                        "newAvailable":1,
                        "newDateOfStock":"2021/11/29 12:30"
                    }
                    agent.put('/api/skuitems/12345678900000000000000000000012').send(newSkuId).then(res=>{
                        res.should.have.status(200);
                        agent.post('/api/internalOrders').send(iOrd).then(res=>{
                            res.should.have.status(201);
                            agent.get('/api/internalOrders').then(res=>{
                                res.should.have.status(200);
                                let iid;
                                for(const i of res.body){
                                    if(i.customerId===customerId && i.issueDate==="2022/8/29 17:24"){
                                        iid=i.id;
                                        break;
                                    }
                                }
                                expect(iid!==undefined).equal(true);
                                const url='/api/internalOrders/'+iid;
                                const state={
                                    "newState":"ACCEPTED"
                                }
                                agent.put(url).send(state).then(res=>{
                                    res.should.have.status(200);
                                    agent.get('/api/internalOrders/'+iid).then(res=>{
                                        res.body.state.should.equal('ACCEPTED');
                                        const compl={
                                            "newState":"COMPLETED",
                                            "products":[{"SkuID":skuid,"RFID":"12345678900000000000000000000012"}]
                                        }
                                        agent.put('/api/internalOrders/'+iid).send(compl).then(res=>{
                                            res.should.have.status(200);
                                            agent.get('/api/internalOrders/'+iid).then(res=>{
                                                res.body.state.should.equal('COMPLETED');
                                                agent.delete('/api/internalOrders/'+iid).then(res=>{
                                                    res.should.have.status(204);
                                                    agent.delete('/api/skuitems/12345678900000000000000000000012').then(res=>{
                                                        res.should.have.status(204);
                                                        agent.delete('/api/skus/'+skuid).then(res=>{
                                                            done();
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    });

    it('refuse internal order (scenario 9-2)',done=>{
        agent.get('/api/internalOrders').then(res=>{
            res.should.have.status(200);
            let iid;
            for(const i of res.body){
                if(i.customerId===customerId && i.issueDate==="2020/11/29 09:33"){
                    iid=i.id;
                    break;
                }
            }
            expect(iid!==undefined).equal(true);
            const url='/api/internalOrders/'+iid;
            const state={
                "newState":"REFUSED"
            }
            agent.put(url).send(state).then(res=>{
                res.should.have.status(200);
                agent.get('/api/internalOrders/'+iid).then(res=>{
                    res.body.state.should.equal('REFUSED');
                    done();
                })
            })
        })
    });

    it('cancel internal order (scenario 9-3)',done=>{
        agent.get('/api/internalOrders').then(res=>{
            res.should.have.status(200);
            let iid;
            for(const i of res.body){
                if(i.customerId===customerId && i.issueDate==="2020/11/29 09:33"){
                    iid=i.id;
                    break;
                }
            }
            expect(iid!==undefined).equal(true);
            const url='/api/internalOrders/'+iid;
            const state={
                "newState":"CANCELED"
            }
            agent.put(url).send(state).then(res=>{
                res.should.have.status(200);
                agent.get('/api/internalOrders/'+iid).then(res=>{
                    res.body.state.should.equal('CANCELED');
                    done();
                })
            })
        })
    });



    afterEach(async()=>{
        const z=await agent.get('/api/internalOrders');
        for(const i of z.body){
            if(i.customerId===customerId && i.issueDate==="2020/11/29 09:33") await agent.delete('/api/internalOrders/'+i.id);
        }
        const skus=await agent.get('/api/skus');
        const sku={
            "description" : "sku for internal order testign 1",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for return order testing",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        const sku2={
            "description" : "sku for internal order testign 2",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for return order testing",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        for(const s of skus.body){
            if(s.description===sku.description) await agent.delete('/api/skus/'+s.id);
            else if(s.description===sku2.description) await agent.delete('/api/skus/'+s.id);
        }
        await agent.delete('/api/users/custTestInternalOrderApiTest@ezwh.com/customer');
    })
});