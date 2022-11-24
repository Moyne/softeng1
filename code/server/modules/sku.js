"use strict";
class sku{
    constructor(db){
        this.db=db;
        this.createTable();
    }
    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS SKU(id INTEGER PRIMARY KEY AUTOINCREMENT,description VARCHAR,weight REAL,volume REAL,notes VARCHAR,position VARCHAR,availableQuantity INTEGER,price REAL,testDescriptors VARCHAR)";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });
    getSkuById=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT description,weight,volume,notes,position,availableQuantity,price,testDescriptors FROM SKU WHERE id=?"
        this.db.get(sql,a,(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)!=='undefined')  resolve(r);
                else reject(404);
            }
        });
    });
    addNewSku=async(desc,weight,vol,notes,avlQt,price)=>new Promise((resolve,reject)=>{
        const sql="INSERT INTO SKU(description,weight,volume,notes,position,availableQuantity,price,testDescriptors) VALUES(?,?,?,?,?,?,?,?)";
        this.db.run(sql,[desc,weight,vol,notes,null,avlQt,price,""],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifySku=async (id,desc,weight,vol,notes,price,avlQt,td)=>new Promise((resolve,reject)=>{
        const sql="UPDATE SKU SET description=? ,weight=? ,volume=? ,notes=? ,price=? ,availableQuantity=? ,testDescriptors=? WHERE id=?";
        this.db.run(sql,[desc,weight,vol,notes,price,avlQt,td,id],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifySkuPos=async (id,pos)=>new Promise((resolve,reject)=>{
        const sql="UPDATE SKU SET position=? WHERE id=?";
        this.db.run(sql,[pos,id],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    getSkus=async ()=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM SKU";
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
            else resolve(r);
        });
    });
    deleteSku=async a=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM SKU WHERE id=?";
        this.db.run(sql,[a],e=>{
            if(e) reject(e);
            else resolve();
        });
    });
    modifyPos=async (oldPos,newPos)=>new Promise((resolve,reject)=>{
        const sql="UPDATE SKU SET position=? WHERE position=?";
        this.db.run(sql,[newPos,oldPos],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
};
module.exports=sku;