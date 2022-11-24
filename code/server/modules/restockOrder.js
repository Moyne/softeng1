"use strict";
class restockOrder{
    constructor(db){
        this.db=db;
        this.createTable();
    }
    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS RESTOCKORDER(id INTEGER PRIMARY KEY AUTOINCREMENT,issueDate VARCHAR NOT NULL,state VARCHAR NOT NULL,products VARCHAR,supplierId INTEGER NOT NULL,transportNote VARCHAR,skuItems VARCHAR)";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });
    deleteRestOrd=async a=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM RESTOCKORDER WHERE id=?"
        this.db.run(sql,[a],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    addRestockOrder=async(date,state,products,suppId)=>new Promise((resolve,reject)=>{
        const sql="INSERT INTO RESTOCKORDER(issueDate,state,products,supplierId,skuItems) VALUES(?,?,?,?,?)";
        this.db.run(sql,[date,state,products,suppId,""],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifyState=async (id,state)=>new Promise((resolve,reject)=>{
        const sql="UPDATE RESTOCKORDER SET state=? WHERE id=?";
        this.db.run(sql,[state,id],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifySkuItemsRestOrd=async (id,skuItems)=>new Promise((resolve,reject)=>{
        const sql="UPDATE RESTOCKORDER SET skuItems=? WHERE id=?";
        this.db.run(sql,[skuItems,id],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifyTNote=async (id,tNote)=>new Promise((resolve,reject)=>{
        const sql="UPDATE RESTOCKORDER SET transportNote=? WHERE id=?";
        this.db.run(sql,[tNote,id],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    getReturnItemsOfRestockOrder=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT skuItems FROM RESTOCKORDER WHERE id=?";
        this.db.get(sql,[a],(e,r)=>{
            if(e)   reject(500);
            else{
                if(typeof(r)==='undefined') reject(404);
                else resolve(r.skuItems);
            }
        });
    });
    getRestockOrderId=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT issueDate,state,products,supplierId,transportNote,skuItems FROM RESTOCKORDER WHERE id=?";
        this.db.get(sql,[a],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)==='undefined') reject(404);
                else resolve(r);
            }
        });
    });
    getOrdersInState=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM RESTOCKORDER WHERE state=?";
        this.db.all(sql,[a],(e,r)=>{
            if(e) reject(500);
            else    resolve(r);
        });
    });
    getRestockOrders=async ()=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM RESTOCKORDER";
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
            else resolve(r);
        });
    });
};
module.exports=restockOrder;