"use strict";
class returnOrder{
    constructor(db){
        this.db=db;
        this.createTable();
    }
    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS RETURNORDER(id INTEGER PRIMARY KEY AUTOINCREMENT,returnDate VARCHAR NOT NULL,products VARCHAR,restockOrderId INTEGER NOT NULL)";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });

    getReturnOrders=async ()=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM RETURNORDER";
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
            else resolve(r);
        });
    });

    getReturnOrderId=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT returnDate,products,restockOrderId FROM RETURNORDER WHERE id=?";
        this.db.get(sql,[a],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)==='undefined') reject(404);
                else resolve(r);
            }
        });
    });

    addReturnOrder=async(rdate,products,rOrderId)=>new Promise((resolve,reject)=>{
        const sql="INSERT INTO RETURNORDER(returnDate,products,restockOrderId) VALUES(?,?,?)";
        this.db.run(sql,[rdate,products,rOrderId],e=>{
            if(e) reject(503);
            else resolve();
        });
    });

    deleteReturnOrder=async a=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM RETURNORDER WHERE id=?"
        this.db.run(sql,[a],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    
    getRetItROrd=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT products FROM RETURNORDER WHERE restockOrderId=?";
        this.db.all(sql,[a],(e,r)=>{
            if(e) reject(503);
            else resolve(r);
        })
    })
};
module.exports= returnOrder;