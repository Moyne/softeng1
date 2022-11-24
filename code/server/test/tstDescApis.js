const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { afterEach, beforeEach, it } = require('mocha');
const sku = require('../modules/sku');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test test descriptors apis', () => {
    beforeEach(async()=>{
        const sku={
            "description" : "sku for test descriptor testing",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for test descriptor testing",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        await agent.post('/api/sku').send(sku);
        const skus=await agent.get('/api/skus');
        let skuid;
        for(const s of skus.body){
            if(s.description===sku.description){
                skuid=s.id;
                break;
            }
        }
        const td={
            "name":"testing test descriptor",
            "procedureDescription":"Initial test description for api testing test descriptors",
            "idSKU" :skuid
        }
        await agent.post('/api/testDescriptor').send(td);
    });

    it('adding tesc descriptor and deleting it (scenario 12-1 and scenario 12-3)',done=>{
        agent.get('/api/skus').then(res=>{
            res.should.have.status(200);
            let skuid;
            for(const s of res.body){
                if(s.description==="sku for test descriptor testing"){
                    skuid=s.id;
                    break;
                }
            }
            expect(skuid!==undefined).equal(true);
            const td={
                "name":"testing scenario 1",
                "procedureDescription":"This test is described by...",
                "idSKU" :skuid
            }
            agent.post('/api/testDescriptor').send(td).then(res=>{
                res.should.have.status(201);
                agent.get('/api/testDescriptors').then(res=>{
                    res.should.have.status(200);
                    let idtd;
                    for(const t of res.body){
                        if(t.name===td.name && t.idSKU===td.idSKU){
                            idtd=t.id;
                            break;
                        }
                    }
                    expect(idtd!==undefined).equal(true);
                    const url='/api/testDescriptor/'+idtd;
                    agent.delete(url).then(res=>{
                        res.should.have.status(204);
                        const urlD='/api/testDescriptors/'+idtd;
                        agent.get(urlD).then(res=>{
                            res.should.have.status(404);
                            done();
                        })
                    })
                })
            })
        })
    })


    it('modify test descriptor (scenario 12-2)',done=>{
        agent.get('/api/skus').then(res=>{
            res.should.have.status(200);
            let skuid;
            for(const s of res.body){
                if(s.description==="sku for test descriptor testing"){
                    skuid=s.id;
                    break;
                }
            }
            expect(skuid!==undefined).equal(true);
            agent.get('/api/testDescriptors').then(res=>{
                res.should.have.status(200);
                let idtd;
                for(const t of res.body){
                    if(t.name==="testing test descriptor" && t.idSKU===skuid){
                        idtd=t.id;
                        break;
                    }
                }
                expect(idtd!==undefined).equal(true);
                const url='/api/testDescriptor/'+idtd;
                const modTd={
                    "newName":"testing test descriptor",
                    "newProcedureDescription":"new description for scenario 12-2",
                    "newIdSKU" :skuid
                }
                agent.put(url).send(modTd).then(res=>{
                    res.should.have.status(200);
                    const gUrl='/api/testDescriptors/'+idtd;
                    agent.get(gUrl).then(res=>{
                        res.should.have.status(200);
                        expect(res.body.procedureDescription).equal(modTd.newProcedureDescription);
                        done();
                    })
                })
            })
        })
    })

    afterEach(async()=>{
        const sku={
            "description" : "sku for test descriptor testing",
            "weight" : 100,
            "volume" : 50,
            "notes" : "sku for test descriptor testing",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        const skus=await agent.get('/api/skus');
        let skuid;
        for(const s of skus.body){
            if(s.description===sku.description) {
                skuid=s.id;
                break;
            }
        }
        const z=await agent.get('/api/testDescriptors');
        for(const t of z.body){
            if(t.name==="testing test descriptor" && t.idSKU===skuid)   await agent.delete('/api/testDescriptor/'+t.id);
        }
        await agent.delete('/api/skus/'+skuid);
    })
});