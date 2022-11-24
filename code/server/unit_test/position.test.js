const position=require('../modules/position');

const { expect } = require('chai');

const db=require('../modules/db');
const dbase=new db('./unit_test/testingDb.sqlite');
const pos=new position(dbase.getDb());

describe('position',()=>{

    beforeEach(async ()=>{
        await pos.createTable();
        const first={
        posId: "800234543412",
        aisleId: "8002",
        maxWeight: 1000,
        maxVol: 1000,
        row: "3454",
        col: "3412"
        }
        await pos.addNewPos(first.posId,first.aisleId,first.maxWeight,first.maxVol,first.row,first.col);
    })

    test('modifyPos',async()=>{
        const newPos={
            posId: "900234573415",
            aisleId: "9002",
            maxWeight: 1000,
            maxVol: 1000,
            row: "3457",
            col: "3415",
            occWeight: 500,
            occVol: 500
            }
        const res = await pos.modifyPos("800234543412",newPos.posId,newPos.aisleId,newPos.row,newPos.col,newPos.maxWeight,newPos.maxVol,newPos.occWeight,newPos.occVol);
    })
    test('get pos by id',async()=>{
        const ret=await pos.getPos();
        const positionId=await pos.getPosById(ret[0].positionID);
        expect(positionId.positionID).equal(ret[0].positionID);

    })
    test('get not existant position',async()=>{
        try {
            await pos.getPosById("099000");
        } catch (error) {
            expect(error).equal(404);
        }
    })
    test('modifyPos with wrong posId',async()=>{
        try {
        const newPos={
            posId: "900234573415",
            aisleId: "9002",
            maxWeight: 1000,
            maxVol: 1000,
            row: "3457",
            col: "3415",
            occWeight: 500,
            occVol: 500
            }
        const res = await pos.modifyPos("10",newPos.posId,newPos.aisleId,newPos.row,newPos.col,newPos.maxWeight,newPos.maxVol,newPos.occWeight,newPos.occVol);
        } catch(error){
            expect(error).equal(503);
        }
    })

    afterEach(async ()=>{
        await pos.deletePos("800234543412");
        await pos.deletePos("900234573415");
    })
})