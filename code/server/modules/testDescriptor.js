"use strict";

class testDescriptor{
    constructor(db){
        this.db=db;
        this.createTable();
    }
	
    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS TESTDESCRIPTOR(id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR,procedureDescription VARCHAR, idSKU INTEGER NOT NULL)";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });

    getAllTestDescriptor=async ()=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM TESTDESCRIPTOR";
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
            else resolve(r);
        });
    });

    getTestDescriptorById=async (id)=>new Promise((resolve,reject)=>{
        const sql="SELECT id,name,procedureDescription,idSKU FROM TESTDESCRIPTOR WHERE id = ?";
        this.db.get(sql,[id],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)!=='undefined')  resolve(r);
                else reject(404);
            }
        });
    });

    addNewTestDescriptor=async(name, procedureDescription,idSKU)=>new Promise((resolve,reject)=>{
        const sql="INSERT INTO TESTDESCRIPTOR(name, procedureDescription,idSKU) VALUES(?,?,?)";
        this.db.run(sql,[name, procedureDescription,idSKU],e=>{
            if(e) reject(503);
            else resolve();
        });
    });

    modifyTestDescriptor=async (id,name, procedureDescription,idSKU)=>new Promise((resolve,reject)=>{
        const sql="UPDATE TESTDESCRIPTOR SET name=?, procedureDescription=?, idSKU=? WHERE id=?";
        this.db.run(sql,[name, procedureDescription,idSKU,id],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
	
    deleteTestDescriptor=async id=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM TESTDESCRIPTOR WHERE id=?";
        this.db.run(sql,[id],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
};
module.exports=testDescriptor;