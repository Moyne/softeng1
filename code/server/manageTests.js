"use strict";
const dayjs=require('dayjs');
const testDescriptor=require('./modules/testDescriptor');
const testResult = require('./modules/testResult');
class manageTests{
    constructor(db){
        this.testDescriptor=new testDescriptor(db);
        this.testResult=new testResult(db);
    }
    //test descriptor implementation
    getTestDescriptors=async ()=>{
        try {
            const ret=await this.testDescriptor.getAllTestDescriptor();
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getTestDescId=async a=>{
        try {
            const ret=await this.testDescriptor.getTestDescriptorById(a);
            return ret;
        } catch (error) {
            throw error;
        }
    }
    addTestDescriptor=async (name,proc,skuid)=>{
        try {
            return await this.testDescriptor.addNewTestDescriptor(name,proc,skuid);
        } catch (error) {
            throw error;
        }
    }
    modifyTestDesc=async (id,name,proc,skuid)=>{
        try {
            await this.testDescriptor.getTestDescriptorById(id);
            return await this.testDescriptor.modifyTestDescriptor(id,name,proc,skuid);
        } catch (error) {
            throw error;
        }
    }
    deleteTestDesc=async a=>{
        try {
            //commented change1 version
            /*const b=await this.testResult.hasIdTestDesc(a);
            if(b)   return await this.testDescriptor.deleteTestDescriptor(a);
            else throw 422;
            await this.getTestDescId(a);*/
            return await this.testDescriptor.deleteTestDescriptor(a);
        } catch (error) {
            throw error;
        }
    }
    //test result implementation
    getTestResultRfid=async a=>{
        try {
            const ret=await this.testResult.getAllTestByRFID(a);
            ret.forEach(x=>x.Result=Boolean(x.Result));
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getTestResultId=async(id,rfid)=>{
        try {
            const ret=await this.testResult.getTestResByRFID(id,rfid);
            ret.Result=Boolean(ret.Result);
            return ret;
        } catch (error) {
            throw error;
        }
    }
    addTestResult=async (rfid,idTd,date,res)=>{
        try {
            if(!dayjs(date,"YYYY/MM/DD HH:MM",true).isValid() && !dayjs(date,"YYYY/MM/DD",true).isValid()) throw 422;
            return await this.testResult.addNewTestResult(rfid,idTd,date,res?1:0);
        } catch (error) {
            throw error;
        }
    }
    modifyTestResult=async (rfid,id,idTd,date,res)=>{
        try {
            if(!dayjs(date,"YYYY/MM/DD HH:MM",true).isValid() && !dayjs(date,"YYYY/MM/DD",true).isValid()) throw 422;
            await this.testDescriptor.getTestDescriptorById(idTd);
            await this.testResult.getTestResByRFID(id,rfid);
            return await this.testResult.modifyTestResult(id,rfid,idTd,date,res?1:0);
        } catch (error) {
            throw error;
        }
    }
    deleteTestResult=async (rfid,id)=>{
        try {
            //change 1 modification
            //await this.getTestResultId(id,rfid);
            return await this.testResult.deleteTestResult(id,rfid);
        } catch (error) {
            throw error;
        }
    }
}
module.exports=manageTests;