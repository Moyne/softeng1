"use strict";
const fs = require("fs");
const sqlite=require("sqlite3");
class db{
    constructor(dbPath){
        if(dbPath!=="./modules/ezwhdb.sqlite") this.restart=true;
        else if(fs.existsSync(dbPath))   this.restart=true;
        else    this.restart=false;
        this.dataSql = fs.readFileSync(__dirname+"/initQueries.sql").toString();
        this.initDb(dbPath).then(e=>{
            if(!this.restart)   this.initQueries();
        });
    }
    initDb=a=>new Promise((resolve,reject)=>{
        this.db=new sqlite.Database(a,e=>{
            if(e) reject(e);
            else{
                this.db.get("PRAGMA busy_timeout = 10000",e=>{
                    if(e) reject(e);
                    else resolve();
                });
            }
        });
    });
    initQueries=async()=>{
        const dataArr = this.dataSql.toString().split(");");
        this.db.serialize(() => {
            this.db.run("PRAGMA foreign_keys=OFF;");
            this.db.run("BEGIN TRANSACTION;");
                dataArr.forEach(query => {
                    if (query) {
                    query += ");";
                    this.db.run(query, err => {
                        if (err) throw err;
                    });
                    }
                });
            this.db.run("COMMIT;");
        });
    };
    getDb=()=>this.db;
}
module.exports=db;