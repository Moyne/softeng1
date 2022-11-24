const testResult=require('../modules/testResult');

const { expect } = require('chai');

const db=require('../modules/db');
const dbase=new db('./unit_test/testingDb.sqlite');
const ts=new testResult(dbase.getDb());

describe('test result',()=>{

    beforeAll(async ()=>{
        await ts.createTable();
        const first={
            rfid: '131',
            idTestDescriptor: 18,
            Date: '22/05/2022',
            Result: 1
        }
        await ts.addNewTestResult(first.rfid,first.idTestDescriptor,first.Date,first.Result);
    })

    test('getId',async()=>{
        const res = await ts.getId("131");
        const ret=await ts.getAllTestByRFID("131");
        let id;
        if(ret.length>0)    id=Math.max(...ret.map(e=>parseInt(e.id)))+1;
        else id=1;
        expect(res).equal(id);
    })

    test('getId with undefined id',async()=>{
        const res = await ts.getId("135");
        expect(res).equal(1);
    })

    test('hasIdTestDesc',async()=>{
        const res = await ts.hasIdTestDesc(18);
        expect(res).equal(true);
    })

    test('hasIdTestDesc with no test',async()=>{
        const res = await ts.hasIdTestDesc(20);
        expect(res).equal(false);
    })

    afterAll(async ()=>{
        const ret=await ts.getAllTestByRFID("131");
        for(const x of ret) await ts.deleteTestResult(x.id,"131");
    })
});