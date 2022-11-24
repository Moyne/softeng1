const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test issuing a restock order apis', () => {
    it('issuing a restock order (scenario 3-1 and scenario 3-2)',done=>{
        const sku={
            "description" : "sku for issue restock order testing",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for issue restock order testing",
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
                    "id" : 125,
                    "description" : "api testing issue rest ord",
                    "price" : 1.99,
                    "SKUId" : skuid,
                    "supplierId" : 1
                };
                agent.post('/api/item').send(it).then(res=>{
                    res.should.have.status(201);
                    const rord={
                        "issueDate":"2022/05/22 09:33",
                        "products": [{"SKUId":skuid,"itemId":it.id,"description":"pen","price":1.99,"qty":30}],
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
                            agent.delete(url).then(res=>{
                                res.should.have.status(204);
                                agent.delete('/api/items/125/1').then(res=>{
                                    agent.delete('/api/skus/'+skuid).then(res=>{
                                        done();
                                    })
                                })
                            })
                        })
                    })
                });
            })
        })
    })
});