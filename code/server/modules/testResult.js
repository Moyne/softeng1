"use strict";

class testResult{
    constructor(db){
        this.db=db;
        this.createTable();
    }
	
    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS TestResult(id INTEGER NOT NULL,rfid VARCHAR NOT NULL,idTestDescriptor INTEGER,Date VARCHAR,Result INTEGER, PRIMARY KEY(id,rfid))";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });

    getAllTestByRFID=async (rfid)=>new Promise((resolve,reject)=>{
        const sql="SELECT id,idTestDescriptor,Date,Result FROM TestResult WHERE rfid = ?";
        this.db.all(sql,[rfid],(e,r)=>{
            if(e)   reject(500);
            else    resolve(r);
        });
    });
	
    getTestResByRFID=async (id,rfid)=>new Promise((resolve,reject)=>{
        const sql="SELECT id,idTestDescriptor,Date,Result FROM TestResult WHERE id = ? AND rfid = ?";
        this.db.get(sql,[id,rfid],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)!=='undefined')  resolve(r);
                else reject(404);
            }
        });
    });	

    getId=async a=>new Promise((resolve,reject)=>{
        const sql='SELECT MAX(id)+1 AS newId FROM TestResult WHERE rfid=?';
        this.db.get(sql,[a],(e,r)=>{
            if(e) reject(500);
            else {
                if(r.newId!==null)  resolve(r.newId);
                else resolve(1);
            }
        });
    });

    addNewTestResult=async(rfid,tdId,date,result)=>{
        const id=await this.getId(rfid);
        if(id===null) id=1;
        return new Promise((resolve,reject)=>{
        const sql="INSERT INTO TestResult(id,rfid,idTestDescriptor,Date,Result) VALUES(?,?,?,?,?)";
        this.db.run(sql,[id,rfid,tdId,date,result],e=>{
            if(e) reject(503);
            else resolve();
        });
    });}

    modifyTestResult=async (id,rfid,tdId,date,result)=>new Promise((resolve,reject)=>{
        const sql="UPDATE TestResult SET idTestDescriptor=?,Date=? ,Result=? WHERE id=? AND rfid=?";
        this.db.run(sql,[tdId,date,result,id,rfid],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
	
    deleteTestResult=async (id,rfid)=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM TestResult WHERE id=? AND rfid=?";
        this.db.run(sql,[id,rfid],e=>{
            if(e) reject(503);
            else resolve();
        });
    });

    hasIdTestDesc=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT COUNT(*) AS count FROM TestResult WHERE idTestDescriptor=?";
        this.db.get(sql,[a],(e,r)=>{
            if(e) reject(503);
            else{
                if(r.count>0) resolve(true);
                else resolve(false);
            }
        });
    });
};
module.exports=testResult;