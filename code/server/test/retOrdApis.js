const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { afterEach, beforeEach, it } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test return order apis', () => {
    
    it('create return order (scenario 6-1 and scenario 6-2)',done=>{
        
        const sku={
            "description" : "sku for return order testign",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for return order testing",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        const user={
            "username":"suppTestForReturnOrder@ezwh.com",
            "name":"John",
            "surname" : "Smith",
            "password" : "testpassword",
            "type" : "supplier"
        }
        agent.post('/api/sku').send(sku).then(res=>{
            res.should.have.status(201);
            agent.get('/api/skus').then(res=>{
                res.should.have.status(200);
                let skuid;
                for(const s of res.body){
                    if(s.description===sku.description && s.notes===sku.notes){
                        skuid=s.id;
                        break;
                    }
                }
                expect(skuid!==undefined).equal(true);
                agent.post('/api/newUser').send(user).then(res=>{
                    agent.get('/api/suppliers').then(res=>{
                        res.should.have.status(200);
                        let suppId;
                        for(const u of res.body){
                            if(u.email===user.username && u.name===user.name && u.surname===user.surname){
                                suppId=u.id;
                                break;
                            }
                        }
                        expect(suppId!==undefined).equal(true);
                        const it={
                            "id" : 122,
                            "description" : "api testing item",
                            "price" : 1.99,
                            "SKUId" : skuid,
                            "supplierId" : suppId
                        }
                        agent.post('/api/item').send(it).then(res=>{
                            const rord={
                                "issueDate":"2022/05/22 09:33",
                                "products": [{"SKUId":skuid,"itemId":it.id,"description":"pen","price":1.99,"qty":1}],
                                "supplierId" : suppId
                            }
                            agent.post('/api/restockOrder').send(rord).then(res=>{
                                res.should.have.status(201);
                                agent.get('/api/restockOrders').then(res=>{
                                    res.should.have.status(200);
                                    let rordid;
                                    for(const r of res.body){
                                        if(r.issueDate===rord.issueDate && r.supplierId===rord.supplierId){
                                            rordid=r.id;
                                            break;
                                        }
                                    }
                                    const url="/api/restockOrder/"+rordid;
                                    const state={
                                        "newState":"DELIVERED"
                                    }
                                    agent.put(url).send(state).then(res=>{
                                        res.should.have.status(200);
                                        const skuIts={
                                            "skuItems" : [{"SKUId":skuid,"itemId":it.id,"rfid":"12345678900000000000000000000000"}]
                                        }
                                        const skuitpost={
                                            "RFID":"12345678900000000000000000000000",
                                            "SKUId":skuid,
                                            "DateOfStock":"2021/11/29 12:30"
                                        }
                                        agent.post("/api/skuitem").send(skuitpost).then(res=>{
                                            res.should.have.status(201);
                                            agent.put(url+"/skuItems").send(skuIts).then(res=>{
                                                res.should.have.status(200);
                                                const compState={
                                                    "newState":"COMPLETEDRETURN"
                                                }
                                                agent.put(url).send(compState).then(res=>{
                                                    res.should.have.status(200);
                                                    const returnOrd={
                                                        "returnDate":"2021/11/29 09:33",
                                                        "products": [{"SKUId":skuid,"itemId":it.id,"description":"pen","price":1.99,"RFID":"12345678900000000000000000000000"}],
                                                        "restockOrderId" : rordid
                                                    }
                                                    agent.post('/api/returnOrder').send(returnOrd).then(res=>{
                                                        res.should.have.status(201);
                                                        agent.get('/api/returnOrders').then(res=>{
                                                            res.should.have.status(200);
                                                            let i=0;
                                                            let index;
                                                            let returnOrdId;
                                                            for(const r of res.body){
                                                                if(r.returnDate===returnOrd.returnDate && r.restockOrderId===returnOrd.restockOrderId){
                                                                    index=i;
                                                                    returnOrdId=r.id;
                                                                    break;
                                                                }
                                                                i++;
                                                            }
                                                            expect(res.body[index].products[0].RFID).equal(skuIts.skuItems[0].rfid);
                                                            agent.get('/api/skuitems/12345678900000000000000000000000').then(res=>{
                                                                res.should.have.status(200);
                                                                expect(res.body.Available).equal(0);
                                                                agent.delete('/api/returnOrder/'+returnOrdId).then(res=>{
                                                                    res.should.have.status(204);
                                                                    agent.get('/api/returnOrders/'+returnOrdId).then(res=>{
                                                                        res.should.have.status(404);
                                                                        agent.delete('/api/skuitems/12345678900000000000000000000000').then(res=>{
                                                                            res.should.have.status(204);
                                                                            agent.delete('/api/restockOrder/'+rordid).then(res=>{
                                                                                res.should.have.status(204);
                                                                                agent.delete('/api/items/122/'+suppId).then(res=>{
                                                                                    agent.delete('/api/users/'+user.username+'/supplier').then(res=>{
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