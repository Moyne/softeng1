"use strict";
class item{
    constructor(db){
        this.db=db;
        this.createTable();
    }

    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS ITEM(id INTEGER PRIMARY KEY, description VARCHAR, price INTEGER, SKUId INTEGER NOT NULL, supplierId INTEGER NOT NULL)";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });

     
    getItems=async ()=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM ITEM";
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
            else resolve(r);
        });
    });

    getItemsById=async (id,suppId)=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM ITEM WHERE id=? AND supplierId=?";
        this.db.get(sql,[id,suppId],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)==='undefined') reject(404);
                else resolve(r);
            }
        });
    });
 
    addNewItem=async(id,descrip,price,SKUId,suppId)=>new Promise((resolve,reject)=>{
        const sql="INSERT INTO ITEM(id,description,price,SKUId,supplierId) VALUES(?,?,?,?,?)";
        this.db.run(sql,[id,descrip,price,SKUId,suppId],e=>{
            if(e) reject(503);
            else resolve();
        });
    });

    modifyItem=async (id, suppId, newDesc, newPrice)=>new Promise((resolve,reject)=>{
        const sql="UPDATE ITEM SET description=?, price=? WHERE id=? AND supplierId=?";
        this.db.run(sql,[newDesc, newPrice,id,suppId],e=>{
            if(e) reject(503);
            else resolve();
        });
    });

    deleteItem=async (id,suppId)=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM ITEM WHERE id=? AND supplierId=?"
        this.db.run(sql,[id,suppId],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    deleteItemSupp=async a=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM ITEM WHERE supplierId=?";
        this.db.run(sql,[a],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    deleteItemsSku=async a=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM ITEM WHERE SKUId=?";
        this.db.run(sql,[a],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    suppSkuCombExists=async (supp,sku)=>new Promise((resolve,reject)=>{
        const sql="SELECT COUNT(*) AS count FROM ITEM WHERE supplierId=? AND SKUId=?";
        this.db.get(sql,[supp,sku],(e,r)=>{
            if(e) reject(503);
            else{
                if(r.count>0) resolve(true);
                else resolve(false);
            }
        });
    });
};
module.exports=item;