const testDescriptor = require('../modules/testDescriptor');

const { expect } = require('chai');

const db=require('../modules/db');
const dbase=new db('./unit_test/testingDb.sqlite');
const tD=new testDescriptor(dbase.getDb());



describe('testDescriptor',()=>{

    beforeEach(async ()=>{
        await tD.createTable();
        await tD.addNewTestDescriptor("Testing home button","Click several times the button",14);
    });

    test('getDescriptor by id',async()=>{
     

        const expRet={
            id:1,
            name: "Testing home button",
            procedureDescription: "Click several times the button",
            idSKU:14
          }

       
        const aux = await tD.getAllTestDescriptor();

            for(const x of aux){

                if(x.name==="Testing home button" && x.idSKU===14){
                    const ret = await tD.getTestDescriptorById(x.id);
                    expect(ret.name).equal(expRet.name);

                }
                
            }

       
        });

    test('getDescriptor by id with undefined id',async()=>{
     
        try {
            await tD.getTestDescriptorById("nf");
        } catch (error) {
            expect(error).equal(404);
        }

    })   

    afterAll(async ()=>{

        const aux = await tD.getAllTestDescriptor();

        for(const x of aux){

            if(x.name==="Testing home button" && x.idSKU===14){
                await tD.deleteTestDescriptor(x.id);
            }

            if(x.idSKU===15){
                await tD.deleteTestDescriptor(x.id);

        }
        }

    });
});