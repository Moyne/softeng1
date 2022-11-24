const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const apiImpl = require('../apiImpl');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test restock order apis', () => {
    
    it('arrival and testing and completeness of restock order (scenarios that go from 5-1 to 5-3)',done=>{
        const sku={
            "description" : "sku for restock order complete api testing",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for restock order complete api testing",
            "price" : 10.99,
            "availableQuantity" : 0
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
                const it={
                    "id" : 129,
                    "description" : "api testing issue rest ord",
                    "price" : 1.99,
                    "SKUId" : skuid,
                    "supplierId" : 1
                };
                agent.post('/api/item').send(it).then(res=>{
                    res.should.have.status(201);
                    const td={
                        "name":"test descriptor for restock order testing",
                        "procedureDescription":"This test is described by...",
                        "idSKU" :skuid
                    }
                    agent.post('/api/testDescriptor').send(td).then(res=>{
                        agent.get('/api/testDescriptors').then(res=>{
                            let tdId;
                            for(const t of res.body){
                                if(t.name===td.name &&  t.SKUId===td.SKUId && t.supplierId===td.supplierId){
                                    tdId=t.id;
                                    break;
                                }
                            }
                            const rord={
                                "issueDate":"2022/05/22 09:33",
                                "products": [{"SKUId":skuid,"itemId":it.id,"description":"pen","price":1.99,"qty":3}],
                                "supplierId" : 1
                            }
                            agent.post('/api/restockOrder').send(rord).then(res=>{
                                res.should.have.status(201);
                                agent.get('/api/restockOrdersIssued').then(res=>{
                                    let rid;
                                    let index=0;
                                    for(const r of res.body){
                                        if(r.issueDate==="2022/05/22 09:33" && r.supplierId===1){
                                            rid=r.id;
                                            break;
                                        }
                                        index++;
                                    }
                                    expect(res.body[index].state).equal('ISSUED');
                                    const url="/api/restockOrder/"+rid;
                                    const changeState={
                                        "newState":"DELIVERY"
                                    }
                                    agent.put(url).send(changeState).then(res=>{
                                        res.should.have.status(200);
                                        const deliveredState={
                                            "newState":"DELIVERED"
                                        }
                                        agent.put(url).send(deliveredState).then(res=>{
                                            res.should.have.status(200);
                                            const addSkuIts={"skuItems":[]};
                                            addSkuIts.skuItems.push({"SKUId":skuid,"itemId":it.id,"rfid":"27397075510626223356692687863573"});
                                            addSkuIts.skuItems.push({"SKUId":skuid,"itemId":it.id,"rfid":"27397075510626223356692687863574"});
                                            addSkuIts.skuItems.push({"SKUId":skuid,"itemId":it.id,"rfid":"27397075510626223356692687863575"});
                                            const skuit1={
                                                "RFID":"27397075510626223356692687863573",
                                                "SKUId":skuid,
                                                "DateOfStock":"2021/11/29 12:30"
                                            }
                                            const skuit2={
                                                "RFID":"27397075510626223356692687863574",
                                                "SKUId":skuid,
                                                "DateOfStock":"2021/11/29 12:30"
                                            }
                                            const skuit3={
                                                "RFID":"27397075510626223356692687863575",
                                                "SKUId":skuid,
                                                "DateOfStock":"2021/11/29 12:30"
                                            }
                                            agent.post('/api/skuitem').send(skuit1).then(res=>{
                                                res.should.have.status(201);
                                                agent.post('/api/skuitem').send(skuit2).then(res=>{
                                                    res.should.have.status(201);
                                                    agent.post('/api/skuitem').send(skuit3).then(res=>{
                                                        res.should.have.status(201);
                                                        agent.put(url+"/skuItems").send(addSkuIts).then(res=>{
                                                            res.should.have.status(200);
                                                            const tr={
                                                                "rfid":"27397075510626223356692687863574",
                                                                "idTestDescriptor":tdId,
                                                                "Date":"2021/11/28",
                                                                "Result": false
                                                            }
                                                            agent.post('/api/skuitems/testResult').send(tr).then(res=>{
                                                                res.should.have.status(201);
                                                                const trUrl='/api/skuitems/27397075510626223356692687863574/testResults';
                                                                agent.get(trUrl).then(res=>{
                                                                    let trId=res.body[0].id;
                                                                    const testedState={
                                                                        "newState":"TESTED"
                                                                    }
                                                                    agent.put(url).send(testedState).then(res=>{
                                                                        res.should.have.status(200);
                                                                        const complRetState={
                                                                            "newState":"COMPLETEDRETURN"
                                                                        }
                                                                        agent.put(url).send(complRetState).then(res=>{
                                                                            agent.get('/api/skus/'+skuid).then(res=>{
                                                                                res.body.availableQuantity.should.equal(2);
                                                                                agent.delete('/api/restockOrder/'+rid).then(res=>{
                                                                                    agent.delete('/api/skuitems/27397075510626223356692687863574/testResult/'+trId).then(res=>{
                                                                                        agent.delete('/api/testDescriptor/'+tdId).then(res=>{
                                                                                            agent.delete('/api/items/129/1').then(res=>{
                                                                                                agent.delete('/api/skuitems/27397075510626223356692687863573').then(res=>{
                                                                                                    agent.delete('/api/skuitems/27397075510626223356692687863574').then(res=>{
                                                                                                        agent.delete('/api/skuitems/27397075510626223356692687863575').then(res=>{
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
                    })
                })
            })
        })
    })
})