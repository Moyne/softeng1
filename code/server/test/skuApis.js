const { should } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test sku apis', () => {

    beforeEach(async ()=>{
        const sku={
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        await agent.post('/api/sku').send(sku);
    })

    it('add sku correct (scenario 1-1)',  done=> {
        const sku={
            "description" : "inserted sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 0
        }
        agent.post('/api/sku').send(sku).then(res=>{
            res.should.have.status(201);
            agent.get('/api/skus').then(res=>{
                let skuId;
                for(const k of res.body){
                    if(k.description==='inserted sku'){
                        skuId=k.id;
                        break;
                    }
                }
                const url='/api/skus/'+skuId;
                agent.delete(url).then(res=>{
                    res.should.have.status(204);
                    done();
                })
            })
        });
    });
    it('add wrong sku', done=>{
        const sku={
            "description" : "a new sku",
            "weight" : 100.50,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }
        agent.post('/api/sku').send(sku).then(res=>{
            res.should.have.status(422);
            done();
        });
    })
    it('get skus', done=>{
        agent.get('/api/skus').then(res=>{
            res.should.have.status(200);
            done();
        });
    })
    it('modify sku location(scenario 1-2)',done=>{
        agent.get('/api/skus').then(res=>{
            let id;
            for(const z of res.body){
                if(z.description==='a new sku'){
                    id=z.id;
                    break;
                }
            }
            const url='/api/sku/'+id+"/position";
            const p={
                "positionID":"123456789012",
                "aisleID": "1234",
                "row": "5678",
                "col": "9012",
                "maxWeight": 1000,
                "maxVolume": 1000
            }
            agent.post('/api/position').send(p).then(res=>{
                res.should.have.status(201);
                const position={"position":p.positionID};
                agent.put(url).send(position).then(res=>{
                    res.should.have.status(200);
                    agent.delete('/api/position/123456789012').then(res=>{
                        res.should.have.status(204);
                        done();
                    })
                })
            })
        })
    });
    it('modify sku weight and volume (scenario 1-3)',done=>{
        agent.get('/api/skus').then(res=>{
            let skuId;
            const sku={};
            for(const l of res.body){
                if(l.description==='a new sku'){
                    skuId=l.id;
                    sku.newDescription=l.description;
                    sku.newWeight=30;
                    sku.newVolume=20;
                    sku.newNotes=l.notes;
                    sku.newPrice=l.price;
                    sku.newAvailableQuantity=l.availableQuantity;
                    sku.newTestDescriptors=[];
                    break;
                }
            }
            const url="/api/sku/"+skuId;
            agent.put(url).send(sku).then(res=>{
                res.should.have.status(200);
                done();
            })
        })
    })

    afterEach(async()=>{
        const skus=await agent.get('/api/skus');
        for(const l of skus.body){
            if(l.description==='a new sku'){
                const url='/api/skus/'+l.id;
                await agent.delete(url);
            }
        }
    })
});

