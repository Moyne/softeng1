"use strict";
class position{
    constructor(db){
        this.db=db;
        this.createTable();
    }
    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS POSITION(positionID VARCHAR PRIMARY KEY,aisleID VARCHAR NOT NULL,row VARCHAR NOT NULL,col VARCHAR NOT NULL,maxWeight REAL,maxVolume REAL,occupiedWeight REAL,occupiedVolume REAL)";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });
    deletePos=async a=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM POSITION WHERE positionID=?"
        this.db.run(sql,[a],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    addNewPos=async(posId,aisleId,maxWeight,maxVol,row,col)=>new Promise((resolve,reject)=>{
        const sql="INSERT INTO POSITION(positionID,aisleID,row,col,maxWeight,maxVolume,occupiedWeight,occupiedVolume) VALUES(?,?,?,?,?,?,?,?)";
        this.db.run(sql,[posId,aisleId,row,col,maxWeight,maxVol,0,0],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifyPos=async (oldPosId,newPosId,aisleID,row,col,maxWeight,maxVol,occWeight,occVol)=>new Promise((resolve,reject)=>{
        const sql="UPDATE POSITION SET positionID=? ,aisleID=? ,row=? ,col=? ,maxWeight=? ,maxVolume=? ,occupiedWeight=? ,occupiedVolume=? WHERE positionID=?";
        this.db.run(sql,[newPosId,aisleID,row,col,maxWeight,maxVol,occWeight,occVol,oldPosId],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    modifyPosPos=async (newPosId,aisleId,row,col,oldPosId)=>new Promise((resolve,reject)=>{
        const sql="UPDATE POSITION SET positionID=? ,aisleID=? ,row=? ,col=? WHERE positionId=?";
        this.db.run(sql,[newPosId,aisleId,row,col,oldPosId],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
    getPosById=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM POSITION WHERE positionID=?";
        this.db.get(sql,[a],(e,r)=>{
            if(e) reject(503);
            else{
                if(typeof(r)==='undefined') reject(404);
                resolve(r);
            }
        });
    });
    getPos=async ()=>new Promise((resolve,reject)=>{
        const sql="SELECT * FROM POSITION";
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
            else resolve(r);
        });
    });
};
module.exports=position;