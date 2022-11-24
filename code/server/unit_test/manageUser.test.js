jest.mock('../modules/users');
const users=require('../modules/users');
const mgUsr=require('../manageUsers');
const { expect } = require('chai');
const usr=new mgUsr('db');
describe('users',()=>{

    test('add new user',async()=>{
        const getUsr=jest.fn();
        const addUsr=jest.fn();
        users.prototype.addNewUser=addUsr;
        users.prototype.getUsers=getUsr;
        getUsr.mockReturnValue([
            {
              "id": 1,
              "name": "Elon",
              "surname": "Musk",
              "email": "user1@ezwh.com",
              "type": "customer"
            },
            {
              "id": 1,
              "name": "Raymond",
              "surname": "Trust",
              "email": "qualityEmployee1@ezwh.com",
              "type": "qualityEmployee"
            },
            {
              "id": 1,
              "name": "Jeff",
              "surname": "Bezos",
              "email": "supplier1@ezwh.com",
              "type": "supplier"
            },
            {
              "id": 1,
              "name": "Charles",
              "surname": "Leclerc",
              "email": "clerk1@ezwh.com",
              "type": "clerk"
            },
            {
              "id": 1,
              "name": "Max",
              "surname": "Verstappen",
              "email": "deliveryEmployee1@ezwh.com",
              "type": "deliveryEmployee"
            }
        ]);
        await usr.newUser("lol@ezwh.com","PierFranco","Montano","hehehehehe","customer");
        expect(addUsr.mock.calls[0][0]).equal("PierFranco");
    })

    test('add new user rejected because of password length',async()=>{
        try {
            const getUsr=jest.fn();
            const addUsr=jest.fn();
            users.prototype.addNewUser=addUsr;
            users.prototype.getUsers=getUsr;
            getUsr.mockReturnValue([
                {
                    "id": 1,
                    "name": "Elon",
                    "surname": "Musk",
                    "email": "user1@ezwh.com",
                    "type": "customer"
                },
                {
                    "id": 1,
                    "name": "Raymond",
                    "surname": "Trust",
                    "email": "qualityEmployee1@ezwh.com",
                    "type": "qualityEmployee"
                },
                {
                    "id": 1,
                    "name": "Jeff",
                    "surname": "Bezos",
                    "email": "supplier1@ezwh.com",
                    "type": "supplier"
                },
                {
                    "id": 1,
                    "name": "Charles",
                    "surname": "Leclerc",
                    "email": "clerk1@ezwh.com",
                    "type": "clerk"
                },
                {
                    "id": 1,
                    "name": "Max",
                    "surname": "Verstappen",
                    "email": "deliveryEmployee1@ezwh.com",
                    "type": "deliveryEmployee"
                }
            ]);
            await usr.newUser("lol@ezwh.com","PierFranco","Montano","hehe","customer");
        } catch (error) {
            expect(error).equal(422);
        }
    })

    test('add new user rejected because of trying to insert already existing user',async()=>{
        try {
            const getUsr=jest.fn();
            const addUsr=jest.fn();
            users.prototype.addNewUser=addUsr;
            users.prototype.getUsers=getUsr;
            getUsr.mockReturnValue([
                {
                    "id": 1,
                    "name": "Elon",
                    "surname": "Musk",
                    "email": "user1@ezwh.com",
                    "type": "customer"
                },
                {
                    "id": 1,
                    "name": "Raymond",
                    "surname": "Trust",
                    "email": "qualityEmployee1@ezwh.com",
                    "type": "qualityEmployee"
                },
                {
                    "id": 1,
                    "name": "Jeff",
                    "surname": "Bezos",
                    "email": "supplier1@ezwh.com",
                    "type": "supplier"
                },
                {
                    "id": 1,
                    "name": "Charles",
                    "surname": "Leclerc",
                    "email": "clerk1@ezwh.com",
                    "type": "clerk"
                },
                {
                    "id": 1,
                    "name": "Max",
                    "surname": "Verstappen",
                    "email": "deliveryEmployee1@ezwh.com",
                    "type": "deliveryEmployee"
                }
            ]);
            await usr.newUser("user1@ezwh.com","PierFranco","Montano","hehehehehe","customer");
        } catch (error) {
            expect(error).equal(409);
        }
    })

    test('add new user rejected because of trying to insert a manager',async()=>{
        try {
            const getUsr=jest.fn();
            const addUsr=jest.fn();
            users.prototype.addNewUser=addUsr;
            users.prototype.getUsers=getUsr;
            getUsr.mockReturnValue([
                {
                    "id": 1,
                    "name": "Elon",
                    "surname": "Musk",
                    "email": "user1@ezwh.com",
                    "type": "customer"
                },
                {
                    "id": 1,
                    "name": "Raymond",
                    "surname": "Trust",
                    "email": "qualityEmployee1@ezwh.com",
                    "type": "qualityEmployee"
                },
                {
                    "id": 1,
                    "name": "Jeff",
                    "surname": "Bezos",
                    "email": "supplier1@ezwh.com",
                    "type": "supplier"
                },
                {
                    "id": 1,
                    "name": "Charles",
                    "surname": "Leclerc",
                    "email": "clerk1@ezwh.com",
                    "type": "clerk"
                },
                {
                    "id": 1,
                    "name": "Max",
                    "surname": "Verstappen",
                    "email": "deliveryEmployee1@ezwh.com",
                    "type": "deliveryEmployee"
                }
            ]);
            await usr.newUser("lol1@ezwh.com","PierFranco","Montano","hehehehehe","manager");
        } catch (error) {
            expect(error).equal(422);
        }
    })
    test('login',async()=>{
        const log=jest.fn();
        users.prototype.login=log;
        log.mockReturnValue({
            "id": 1,
            "username": "user1@ezwh.com",
            "name": "Elon"
        });
        const ret=await usr.session("user1@ezwh.com","testpassword","customer");
        expect(ret.name).equal("Elon");
        let logged=false;
        for(const u of usr.loggedUsers){
            if(u.id===1 && u.type==="customer"){
                logged=true;
                break;
            }
        }
        expect(logged).equal(true);
    })

    test('modify user',async()=>{
        const getUsr=jest.fn();
        const modUsr=jest.fn();
        users.prototype.getUsers=getUsr;
        users.prototype.modifyUser=modUsr;
        getUsr.mockReturnValue([
            {
              "id": 1,
              "name": "Elon",
              "surname": "Musk",
              "email": "user1@ezwh.com",
              "type": "customer"
            },
            {
              "id": 1,
              "name": "Raymond",
              "surname": "Trust",
              "email": "qualityEmployee1@ezwh.com",
              "type": "qualityEmployee"
            },
            {
              "id": 1,
              "name": "Jeff",
              "surname": "Bezos",
              "email": "supplier1@ezwh.com",
              "type": "supplier"
            },
            {
              "id": 1,
              "name": "Charles",
              "surname": "Leclerc",
              "email": "clerk1@ezwh.com",
              "type": "clerk"
            },
            {
              "id": 1,
              "name": "Max",
              "surname": "Verstappen",
              "email": "deliveryEmployee1@ezwh.com",
              "type": "deliveryEmployee"
            }
        ]);
        await usr.modifyUser("user1@ezwh.com","customer","clerk");
        expect(modUsr.mock.calls[0][0]).equal("user1@ezwh.com");
        expect(modUsr.mock.calls[0][1]).equal("customer");
        expect(modUsr.mock.calls[0][2]).equal("clerk");
    })

    test('modify user that doesn\'t exist',async()=>{
        try {
            const getUsr=jest.fn();
            const modUsr=jest.fn();
            users.prototype.getUsers=getUsr;
            users.prototype.modifyUser=modUsr;
            getUsr.mockReturnValue([
                {
                    "id": 1,
                    "name": "Elon",
                    "surname": "Musk",
                    "email": "user1@ezwh.com",
                    "type": "customer"
                },
                {
                    "id": 1,
                    "name": "Raymond",
                    "surname": "Trust",
                    "email": "qualityEmployee1@ezwh.com",
                    "type": "qualityEmployee"
                },
                {
                    "id": 1,
                    "name": "Jeff",
                    "surname": "Bezos",
                    "email": "supplier1@ezwh.com",
                    "type": "supplier"
                },
                {
                    "id": 1,
                    "name": "Charles",
                    "surname": "Leclerc",
                    "email": "clerk1@ezwh.com",
                    "type": "clerk"
                },
                {
                    "id": 1,
                    "name": "Max",
                    "surname": "Verstappen",
                    "email": "deliveryEmployee1@ezwh.com",
                    "type": "deliveryEmployee"
                }
            ]);
            await usr.modifyUser("doesntExist@ezwh.com","customer","clerk");
        } catch (error) {
            expect(error).equal(404);
        }
    })
})
