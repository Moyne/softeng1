"use strict";
const user=require('./modules/users');
class manageUsers{
    constructor(db){
        this.user=new user(db);
        this.loggedUsers=[];
        this.userTypes=["manager","customer","supplier","clerk","qualityEmployee","deliveryEmployee"]
    }
    //User implementation
    isEmail =a => {
        return String(a)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    };
    getUsers=async ()=>{
        try {
            const ret=await this.user.getUsers();
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getSuppliers=async ()=>{
        try {
            const ret=await this.user.getSupplier();
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getUserInfo=async (id,type)=>{
        try {
            if(loggedUsers.contains({"id":id,"type":type})) return await this.user.getUserInfo(id,type);
            else throw 401;
        } catch (error) {
            throw error;
        }
    }
    newUser=async (usr,name,surname,pwd,type)=>{
        try {
            if(type==='manager' || type==='administrator') throw 422;
            if(pwd.length<8) throw 422;
            if(!this.isEmail(usr)) throw 422;
            const z=await this.getUsers();
            for(const u of z){
                if(u.email===usr && u.type===type) throw 409;
            }
            return await this.user.addNewUser(name,surname,pwd,usr,type);
        } catch (error) {
            throw error;
        }
    }
    session=async(usr,pwd,usrType)=>{
        try {
            if(this.userTypes.indexOf(usrType)<0) throw 422;
            if(!this.isEmail(usr)) throw 422;
            const ret=await this.user.login(usr,pwd,usrType);
            this.loggedUsers.push({id:ret.id,type:usrType});
            return ret;
        } catch (error) {
            throw error;
        }
    }
    logout=(id,type)=>{
        if(id!==undefined && type!==undefined)    this.loggedUsers.splice(this.loggedUsers.findIndex(o=>o.id===id && o.type===type),1);
    }
    modifyUser=async (username,oldType,newType)=>{
        try {
            if(this.userTypes.indexOf(oldType)<0 || this.userTypes.indexOf(newType)<0 || newType==="manager") throw 422;
            if(!this.isEmail(username)) throw 422;
            const z=await this.getUsers();
            let found=false;
            for(const u of z){
                if(u.email===username && u.type===oldType){
                    found=true;
                    break;
                }
            }
            if(!found) throw 404;
            return await this.user.modifyUser(username,oldType,newType);
        } catch (error) {
            throw error;
        }
    }
    deleteUser=async (usr,type)=>{
        try {
            if(this.userTypes.indexOf(type)<0 || type==="manager") throw 422;
            if(!this.isEmail(usr)) throw 422;
            //await this.user.getUser(usr,type);
            return await this.user.deleteUser(usr,type);
        } catch (error) {
            throw error;
        }
    }
    hasSupp=async a=>{
        try {
            return await this.user.hasSupp(a);
        } catch (error) {
            throw error;
        }
    }
    hasCust=async a=>{
        try {
            return await this.user.hasCust(a);
        } catch (error) {
            throw error;
        }
    }
}
module.exports=manageUsers;