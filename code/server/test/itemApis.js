const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { afterEach, beforeEach, it } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test items apis', () => {

    it('insert and modify an item (scenario 11-1 and scenario 11-2)',done=>{
        const user={
            "username":"supplierTest@ezwh.com",
            "name":"John",
            "surname" : "Smith",
            "password" : "testpassword",
            "type" : "supplier"
        }
        agent.post('/api/newUser').send(user).then(res=>{
            res.should.have.status(201);
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
                const sku={
                    "description" : "sku for item testign",
                    "weight" : 100,
                    "volume" : 50,
                    "notes" : "sku for item testing",
                    "price" : 10.99,
                    "availableQuantity" : 0
                }
                agent.post('/api/sku').send(sku).then(res=>{
                    res.should.have.status(201);
                    agent.get('/api/skus').then(res=>{
                        res.should.have.status(200);
                        for(const s of res.body){
                            if(s.description===sku.description && s.notes===sku.notes){
                                skuid=s.id;
                                break;
                            }
                        }
                        expect(skuid!==undefined).equal(true);
                        const it={
                            "id" : 120,
                            "description" : "api testing item",
                            "price" : 1.99,
                            "SKUId" : skuid,
                            "supplierId" : suppId
                        }
                        agent.post('/api/item').send(it).then(res=>{
                            res.should.have.status(201);
                            agent.get('/api/items/120/'+suppId).then(res=>{
                                res.should.have.status(200);
                                const modIt={
                                    "newDescription" : "modifying item for scenario 11-2 api testing",
                                    "newPrice" : 1.99
                                }
                                agent.put('/api/item/120/'+suppId).send(modIt).then(res=>{
                                    res.should.have.status(200);
                                    agent.get('/api/items/120/'+suppId).then(res=>{
                                        res.should.have.status(200);
                                        expect(res.body.description).equal(modIt.newDescription);
                                        expect(res.body.price).equal(modIt.newPrice);
                                        agent.delete('/api/items/120/'+suppId).then(res=>{
                                            res.should.have.status(204);
                                            agent.get('/api/items/120/'+suppId).then(res=>{
                                                res.should.have.status(404);
                                                agent.delete('/api/users/'+user.username+'/supplier').then(res=>{
                                                    res.should.have.status(204);
                                                    agent.delete('/api/skus/'+skuid).then(res=>{
                                                        res.should.have.status(204);
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
                });
            })
        })
    })

});