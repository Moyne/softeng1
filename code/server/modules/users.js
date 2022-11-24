"use strict";
const argon=require('argon2');
class users{
    constructor(db){
        this.db=db;
        this.createTable();
    }
	
    createTable=async ()=>new Promise((resolve,reject)=>{
        const sql="CREATE TABLE IF NOT EXISTS USERS(id INTEGER NOT NULL,name VARCHAR,surname VARCHAR,password VARCHAR,email VARCHAR,type VARCHAR NOT NULL, PRIMARY KEY(id,type))";
        this.db.run(sql,e=>{
            if(e) reject(e);
            else resolve();
        });
    });
	
    getUserInfo=async (id,type)=>new Promise((resolve,reject)=>{
        const sql="SELECT id,email,name,surname,type FROM USERS WHERE id=? AND type=?"
        this.db.get(sql,[id,type],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)!=='undefined')  resolve(r);
                else reject(401);
            }
        });
    });

    getSupplier=async ()=>new Promise((resolve,reject)=>{
        const sql='SELECT id,name,surname,email FROM USERS WHERE type ="supplier"';
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
			else resolve(r);
        });
    });	
	
    getUsers=async ()=>new Promise((resolve,reject)=>{
        const sql='SELECT id,name,surname,email,type FROM USERS WHERE type<>"manager"';
        this.db.all(sql,(e,r)=>{
            if(e) reject(500);
			else resolve(r);
        });
    });
    getId=async a=>new Promise((resolve,reject)=>{
        const sql='SELECT MAX(id)+1 AS newId FROM USERS WHERE type=?';
        this.db.get(sql,[a],(e,r)=>{
            if(e) reject(500);
            else{
                if(r.newId!==null)  resolve(r.newId);
                else resolve(1);
            }
        });
    });
    addNewUser=async(name,surname,pwd,email,type)=>{
        const x=await argon.hash(pwd);
        const id=await this.getId(type);
        return new Promise((resolve,reject)=>{
            const sql="INSERT INTO USERS(id,name,surname,password,email,type) VALUES(?,?,?,?,?,?)";
            this.db.run(sql,[id,name,surname,x,email,type],e=>{
                if(e) reject(503);
                else resolve();
            });
    });}

    login=async(user,pwd,type)=>new Promise((resolve,reject)=>{
        const sql="SELECT id,email,name,surname,password FROM USERS WHERE email=? AND type=?";
        this.db.get(sql,[user,type],(e,r)=>{
            if(e)   reject(500);
            else{
                if(typeof(r)!=='undefined'){
                    argon.verify(r.password,pwd).then(b=>{
                        if(b)   resolve({id:r.id,username:r.email,name:r.name});
                        else reject(401)}).catch(e=>reject(500));
                }
                else reject(401);
            }
        });
    });

    modifyUser=async(user,oldType,newType)=>{
        const id=await this.getId(newType);
        return new Promise((resolve,reject)=>{
            const sql="UPDATE USERS SET type=?, id=? WHERE email=? AND type=?";
            this.db.run(sql,[newType,id,user,oldType],e=>{
                if(e) reject(503);
                else    resolve();
            });
        });
    }

    deleteUser=async(user,type)=>new Promise((resolve,reject)=>{
        const sql="DELETE FROM USERS WHERE type=? AND email=?";
        this.db.run(sql,[type,user],e=>{
            if(e) reject(503);
            else resolve();
        });
    });
	hasSupp=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT id FROM USERS WHERE id=? AND type=?";
        this.db.get(sql,[a,"supplier"],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)!=='undefined')  resolve(r);
                else reject(401);
            }
        });
    });
    hasCust=async a=>new Promise((resolve,reject)=>{
        const sql="SELECT id FROM USERS WHERE id=? AND type=?";
        this.db.get(sql,[a,"customer"],(e,r)=>{
            if(e) reject(500);
            else{
                if(typeof(r)!=='undefined')  resolve(r);
                else reject(401);
            }
        });
    });

};
module.exports=users;