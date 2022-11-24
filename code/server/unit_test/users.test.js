const users=require('../modules/users');
const db=require('../modules/db');
const { expect } = require('chai');
const dbase=new db('./unit_test/testingDb.sqlite');
const usr=new users(dbase.getDb());

describe('users',()=>{
    beforeEach(async ()=>{
        await usr.createTable();
        await usr.addNewUser("Jeff","Dean","testpassword","jeff@ezwh.com","manager");
        await usr.addNewUser("Ian","Solo","testpassword","ian@ezwh.com","supplier");
    })
    test('get users',async()=>{
        const ret=await usr.getUsers();
        expect(ret.length).equal(1);
    })
    test('get suppliers',async()=>{
        const ret=await usr.getSupplier();
        expect(ret.length).equal(1);
    })
    test('add',async ()=>{
        const a={
            id:3,
            name: "Paul",
            surname: "Leash",
            pwd: "testpassword",
            email: "paul@ezwh.com",
            type: "customer"
        }
        await usr.addNewUser(a.name,a.surname,a.pwd,a.email,a.type);
        const ret=await usr.getUsers();
        expect(ret.find(e=>e.email===a.email).email).equal(a.email);
        await usr.modifyUser(a.email,a.type,"deliveryEmployee");
        const modifiedUser=await usr.getUserInfo(1,"deliveryEmployee");
        await usr.deleteUser(modifiedUser.email,modifiedUser.type);
    });
    test('login accepted',async ()=>{
        const l={
            email: "jeff@ezwh.com",
            pwd: "testpassword",
            type: "manager"
        }
        const ret=await usr.login(l.email,l.pwd,l.type);
        expect(ret.username).equal(l.email);
    })
    test('login rejected',async ()=>{
        try {
            const l={
                email: "jeff@ezwh.com",
                pwd: "aa",
                type: "manager"
            }
            await usr.login(l.email,l.pwd,l.type);
        } catch (error) {
            expect(error).equal(401);
        }
    })
    test('supplier exists',async()=>{
        const ret=await usr.hasSupp(1);
        expect(ret.id).equal(1);
    })
    test('supplier doesn\'t exist',async ()=>{
        try {
            await usr.hasSupp(999);
        } catch (error) {
            expect(error).equal(401);
        }
    })
    test('customer exists',async()=>{
        const a={
            id:3,
            name: "Paul",
            surname: "Leash",
            pwd: "testpassword",
            email: "paul@ezwh.com",
            type: "customer"
        }
        await usr.addNewUser(a.name,a.surname,a.pwd,a.email,a.type);
        const ret=await usr.hasCust(1);
        expect(ret.id).equal(1);
        await usr.deleteUser(a.email,a.type);
    })
    test('customer doesn\'t exist',async ()=>{
        try {
            await usr.hasCust(999);
        } catch (error) {
            expect(error).equal(401);
        }
    })
    afterEach(async ()=>{
        await usr.deleteUser("jeff@ezwh.com","manager");
        await usr.deleteUser("ian@ezwh.com","supplier");
    })
})