const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { afterEach, beforeEach, it } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test users and rights and authentication apis', () => {
    beforeEach(async()=>{
        const usr={
            "username":"testUsr@ezwh.com",
            "name":"Test",
            "surname" : "Right",
            "password" : "testpassword",
            "type" : "customer"
        }
        await agent.post('/api/newUser').send(usr);
    });
    it('adding a user and deleting him (scenario 4-1)',done=>{
        const usr={
            "username":"scenarioTest@ezwh.com",
            "name":"Kim",
            "surname" : "Me",
            "password" : "testpassword",
            "type" : "customer"
        }
        agent.post('/api/newUser').send(usr).then(res=>{
            res.should.have.status(201);
            agent.get('/api/users').then(res=>{
                res.should.have.status(200);
                let found=false;
                for(const u of res.body){
                    if(u.email===usr.username && u.type===usr.type){
                        found=true;
                        break;
                    }
                }
                expect(found).equal(true);
                agent.delete('/api/users/scenarioTest@ezwh.com/customer').then(res=>{
                    res.should.have.status(204);
                    agent.get('/api/users').then(res=>{
                        res.should.have.status(200);
                        let foundn=false;
                        for(const u of res.body){
                            if(u.email===usr.username && u.type===usr.type){
                                foundn=true;
                                break;
                            }
                        }
                        expect(foundn).equal(false);
                        done();
                    })
                })
            })
        });
    });

    it('modifying user rights (scenario 4-2)',done=>{
        const rights={
            "oldType" : "customer",
            "newType" : "clerk"
        }
        agent.put('/api/users/testUsr@ezwh.com').send(rights).then(res=>{
            res.should.have.status(200);
            agent.get('/api/users').then(res=>{
                let i=0;
                let index;
                for(const u of res.body){
                    if(u.email==='testUsr@ezwh.com'){
                        index=i;
                        break;
                    }
                    i++;
                }
                expect(res.body[index].type).equal(rights.newType);
                rights.oldType=rights.newType;
                rights.newType='customer';
                agent.put('/api/users/testUsr@ezwh.com').send(rights).then(res=>{
                    res.should.have.status(200);
                    done();
                })
            })
        })
    })
    it('login (scenario 7-1)',done=>{
        const usr={
            "username":"testUsr@ezwh.com",
            "password" : "testpassword"
        }
        agent.post('/api/customerSessions').send(usr).then(res=>{
            res.body.username.should.equal(usr.username);
            res.body.name.should.equal('Test')
            res.should.have.status(200);
            done();
        })
    })
    it('logout (scenario 7-2)',done=>{
        agent.post('/api/logout').then(res=>{
            res.should.have.status(200);
            done();
        })
    })
    afterEach(async()=>{
        await agent.delete('/api/users/testUsr@ezwh.com/customer');
    })
});