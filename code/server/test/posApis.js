const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test position apis', () => {

    beforeEach(async ()=>{
        const p={
            "positionID":"123456789012",
            "aisleID": "1234",
            "row": "5678",
            "col": "9012",
            "maxWeight": 1000,
            "maxVolume": 1000
        }
        await agent.post('/api/position').send(p);
    })

    it('add pos correct and delete it (scenario 2-1 and scenario 2-5)',  done=> {
        const p={
            "positionID":"123456789000",
            "aisleID": "1234",
            "row": "5678",
            "col": "9000",
            "maxWeight": 1000,
            "maxVolume": 1000
        }
        agent.post('/api/position').send(p).then(res=>{
            res.should.have.status(201);
            agent.delete('/api/position/123456789000').then(res=>{
                res.should.have.status(204);
                done();
            })
        });
    });
    it('modify positionID of position (scenario 2-2)',done=>{
        const newPosId={"newPositionID":"123456789000"};
        agent.put('/api/position/123456789012/changeID').send(newPosId).then(res=>{
            res.should.have.status(200);
            agent.delete('/api/position/123456789000').then(res=>{
                res.should.have.status(204);
                done();
            })
        })
    });
    it('modify position weight and volume (scenario 2-3)',done=>{
        const newPos={
            "newAisleID": "1234",
            "newRow": "5678",
            "newCol": "9012",
            "newMaxWeight": 1000,
            "newMaxVolume": 1000,
            "newOccupiedWeight": 200,
            "newOccupiedVolume":100
        }
        agent.put('/api/position/123456789012').send(newPos).then(res=>{
            res.should.have.status(200);
            agent.get('/api/positions').then(res=>{
                let i=0;
                let index;
                for(const p of res.body){
                    if(p.positionID==="123456789012")   index=i;
                    i++;
                }
                expect(res.body[index].occupiedWeight).equal(200);
                expect(res.body[index].occupiedVolume).equal(100);
                done();
            })
        })
    })

    it('modify position aisleID row and col (scenario 2-4)',done=>{
        const newPos={
            "newAisleID": "4321",
            "newRow": "8765",
            "newCol": "2109",
            "newMaxWeight": 1000,
            "newMaxVolume": 1000,
            "newOccupiedWeight": 0,
            "newOccupiedVolume":0
        }
        agent.put('/api/position/123456789012').send(newPos).then(res=>{
            res.should.have.status(200);
            agent.get('/api/positions').then(res=>{
                res.should.have.status(200);
                let i=0;
                let index;
                for(const p of res.body){
                    if(p.positionID==="432187652109")   index=i;
                    i++;
                }
                expect(res.body[index].aisleID).equal("4321");
                expect(res.body[index].row).equal("8765");
                expect(res.body[index].col).equal("2109");
                const np={
                    "newAisleID": "1234",
                    "newRow": "5678",
                    "newCol": "9012",
                    "newMaxWeight": 1000,
                    "newMaxVolume": 1000,
                    "newOccupiedWeight": 0,
                    "newOccupiedVolume":0
                }
                agent.put('/api/position/432187652109').send(np).then(res=>{
                    res.should.have.status(200);
                    done();
                })
            })
        })
    })
    afterEach(async()=>{
        await agent.delete('/api/position/123456789012');
    })
});

