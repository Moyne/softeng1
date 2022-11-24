"use strict";
class internalOrder{
    constructor(db){
        this.db=db;
        this.createTable();
    }
    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS INTERNALORDER(id INTEGER PRIMARY KEY AUTOINCREMENT,issueDate VARCHAR NOT NULL,state VARCHAR NOT NULL,products VARCHAR,customerId INTEGER NOT NULL)";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });
    deleteIntOrd=async a=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM INTERNALORDER WHERE id=?"
        this.db.run(sql,[a],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    addinternalOrder=async(date,state,products,cust)=>new Promise((resolve,reject)=>{
        const sql="INSERT INTO INTERNALORDER(issueDate,state,products,customerId) VALUES(?,?,?,?)";
        this.db.run(sql,[date,state,products,cust],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifyState=async (id,state)=>new Promise((resolve,reject)=>{
        const sql="UPDATE INTERNALORDER SET state=? WHERE id=?";
        this.db.run(sql,[state,id],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifyProdAndStateIntOrd=async (id,products,state)=>new Promise((resolve,reject)=>{
        const sql="UPDATE INTERNALORDER SET products=?,state=? WHERE id=?";
        this.db.run(sql,[products,state,id],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    getInternalOrderId=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM INTERNALORDER WHERE id=?";
        this.db.get(sql,[a],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)==='undefined') reject(404);
                else    resolve(r);
            }
        });
    });
    getOrdersInState=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM INTERNALORDER WHERE state=?";
        this.db.all(sql,[a],(e,r)=>{
            if(e) reject(500);
            else    resolve(r);
        });
    });
    getInternalOrders=async ()=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM INTERNALORDER";
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
            else resolve(r);
        });
    });
};
module.exports=internalOrder;