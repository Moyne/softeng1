jest.mock('../modules/testDescriptor');
jest.mock('../modules/testResult');
const testDescriptor=require('../modules/testDescriptor');
const testResult=require('../modules/testResult');
const mngTst=require('../manageTests');
const { expect } = require('chai');
const { json } = require('express');
const tst=new mngTst('db');
describe('test descriptor',()=>{

    test('get test desc by id',async()=>{
        const getTDesc=jest.fn();
        testDescriptor.prototype.getTestDescriptorById=getTDesc;
        getTDesc.mockReturnValue({
            "id": 1,
            "name": "ink",
            "procedureDescription": "checking ink viscosity",
            "idSKU": 1
        });
        const ret=await tst.getTestDescId(1);
        expect(JSON.stringify(ret)).equal(JSON.stringify({
            "id": 1,
            "name": "ink",
            "procedureDescription": "checking ink viscosity",
            "idSKU": 1
        }));
    })
});


describe('test result',()=>{

    test('get test res by id',async()=>{
        const getTRes=jest.fn();
        testResult.prototype.getTestResByRFID=getTRes;
        getTRes.mockReturnValue({
            "id":2,
            "idTestDescriptor":12,
            "Date":"2021/11/29",
            "Result": 1
        });
        const ret=await tst.getTestResultId(1,"121212");
        expect(JSON.stringify(ret)).equal(JSON.stringify({
            "id":2,
            "idTestDescriptor":12,
            "Date":"2021/11/29",
            "Result": true
        }));
    })

    test('add new test result',async()=>{
        const addTr=jest.fn();
        testResult.prototype.addNewTestResult=addTr;
        await tst.addTestResult("12121",2,"2022/01/01",true);
        expect(addTr.mock.calls[0][3]).equal(1);
    })
    test('modify test result',async()=>{
        const getTd=jest.fn();
        const getTr=jest.fn();
        const modTr=jest.fn();
        testDescriptor.prototype.getTestDescriptorById=getTd;
        testResult.prototype.getTestResByRFID=getTr;
        testResult.prototype.modifyTestResult=modTr;
        await tst.modifyTestResult("113141",1,1,"2022/01/01",false);
        expect(modTr.mock.calls[0][4]).equal(0);
    })
    test('modify test result with bad date',async()=>{
        try {
            const getTd=jest.fn();
            const getTr=jest.fn();
            const modTr=jest.fn();
            testDescriptor.prototype.getTestDescriptorById=getTd;
            testResult.prototype.getTestResByRFID=getTr;
            testResult.prototype.modifyTestResult=modTr;
            await tst.modifyTestResult("113141",1,1,"20/01/01",false);
        } catch (error) {
            expect(error).equal(422);
        }
    })
})
