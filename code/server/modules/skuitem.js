"use strict";
class skuitem{
    constructor(db){
        this.db=db;
        this.createTable();
    }
    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS SKUITEM(RFID VARCHAR PRIMARY KEY,SKUId INTEGER NOT NULL,Available INTEGER NOT NULL,DateOfStock VARCHAR)";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });
    deleteSkuItem=async a=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM SKUITEM WHERE RFID=?"
        this.db.run(sql,[a],(e,r)=>{
            if(e) reject(503);
            else resolve();
        });
    });
    addNewSkuItem=async(rfid,skuId,date)=>new Promise((resolve,reject)=>{
        const sql="INSERT INTO SKUITEM(RFID,SKUId,Available,DateOfStock) VALUES(?,?,?,?)";
        this.db.run(sql,[rfid,skuId,0,date],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifySkuItem=async (oldRfid,newRfid,avlb,date)=>new Promise((resolve,reject)=>{
        const sql="UPDATE SKUITEM SET RFID=? ,Available=? ,DateOfStock=? WHERE RFID=?";
        this.db.run(sql,[newRfid,avlb,date,oldRfid],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    getSkuItemByRfid=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM SKUITEM WHERE RFID=?";
        this.db.get(sql,[a],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)==='undefined') reject(404);
                resolve(r);
            }
        });
    });
    getSkuItemsById=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT RFID,SKUId,DateOfStock FROM SKUITEM WHERE SKUId=? AND Available=1";
        this.db.all(sql,[a],(e,r)=>{
            if(e) reject(500);
            else    resolve(r);
        });
    });
    getSkuItems=async ()=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM SKUITEM";
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
            else resolve(r);
        });
    });
};
module.exports=skuitem;