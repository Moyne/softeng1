"use strict";
const sku=require('./modules/sku');
const position=require('./modules/position');
const skuitem=require('./modules/skuitem');
const item=require('./modules/item');
const dayjs=require('dayjs');
class manageWarehouse{
    constructor(db){
        this.sku=new sku(db);
        this.position=new position(db);
        this.skuitem=new skuitem(db);
        this.item=new item(db);
    }
    //sku implementation
    getSkus=async()=>{
        try {
            const ret=await this.sku.getSkus();
            ret.forEach(x=>{
                if(x.testDescriptors!=='')    x.testDescriptors=Array.from(x.testDescriptors.split(',').map(y=>parseInt(y)));
                else x.testDescriptors=[];
            });
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getSkuById=async a=>{
        try {
            const ret=await this.sku.getSkuById(a);
            if(ret.testDescriptors!=='')    ret.testDescriptors=Array.from(ret.testDescriptors.split(',').map(x=>parseInt(x)));
            else ret.testDescriptors=[];
            return ret;
        } catch (error) {
            throw error;
        }
    }
    addSku=async(desc,weight,vol,notes,avlQt,price)=>{
        try {
            //if(avlQt>0) throw 422;
            if(weight<0 || vol<0 || avlQt<0 || price<0 || desc==='' || notes==='') throw 422;
            if(!Number.isInteger(weight) || !Number.isInteger(vol) || !Number.isInteger(avlQt)) throw 422;
            return await this.sku.addNewSku(desc,weight,vol,notes,avlQt,price);
        } catch (error) {
            throw error;
        }
    }
    modifySku=async(id,newDesc,newWeight,newVol,newNotes,newPrice,newAvlQt,newTds)=>{
        try {
            if(newWeight<0 || newVol<0 || newPrice<0 || newAvlQt<0 || newDesc==='' || newNotes==='') throw 422;
            if(!Number.isInteger(newWeight) || !Number.isInteger(newVol) || !Number.isInteger(newAvlQt)) throw 422;
            const x=await this.getSkuById(id);
            //const z=await this.getSkuItemsById(id);
            //if(z.length!==newAvlQt) throw 422;
            if(x.availableQuantity!==newAvlQt && x.position!==null){
                const occWeight=x.availableQuantity*x.weight;
                const occVol=x.availableQuantity*x.volume;
                const newOccWeight=newAvlQt*newWeight;
                const newOccVol=newAvlQt*newVol;
                const y=await this.position.getPosById(x.position);
                if(y.occupiedVolume-occVol+newOccVol>y.maxVolume || y.occupiedWeight-occWeight+newOccWeight>y.maxWeight) throw 422;
                await this.position.modifyPos(x.position,x.position,y.aisleID,y.row,y.col,y.maxWeight,y.maxVolume,y.occupiedWeight-occWeight+newOccWeight,y.occupiedVolume-occVol+newOccVol);
            }
            let tds;
            if(newTds!==undefined)  tds=newTds.toString();
            else tds=x.testDescriptors.toString();
            return await this.sku.modifySku(id,newDesc,newWeight,newVol,newNotes,newPrice,newAvlQt,tds);
        } catch (error) {
            throw error;
        }
    }
    modifySkuPos=async (id,pos)=>{
        try {
            if(pos.length!==12) throw 422;
            const x=await this.getSkuById(id);
            const occWeight=x.availableQuantity*x.weight;
            const occVol=x.availableQuantity*x.volume;
            const p=await this.position.getPosById(pos);
            if(occVol+p.occupiedVolume>p.maxVolume || occWeight+p.occupiedWeight>p.maxWeight) throw 422;
            if(x.position!==null){
                const y=await this.position.getPosById(x.position);
                await this.position.modifyPos(x.position,x.position,y.aisleID,y.row,y.col,y.maxWeight,y.maxVolume,y.occupiedWeight-occWeight,y.occupiedVolume-occVol);
            }
            await this.position.modifyPos(pos,pos,p.aisleID,p.row,p.col,p.maxWeight,p.maxVolume,p.occupiedWeight+occWeight,p.occupiedVolume+occVol);
            return await this.sku.modifySkuPos(id,pos);
        } catch (error) {
            throw error;
        }
    }
    deleteSku=async a=>{
        try {
            //commmented change1 version
            const x=await this.sku.getSkuById(a);
            //if(x.availableQuantity>0) throw 422;
            if(x.position!==null){
                const occWeight=x.availableQuantity*x.weight;
                const occVol=x.availableQuantity*x.volume;
                const y=await this.position.getPosById(x.position);
                await this.position.modifyPos(x.position,x.position,y.aisleID,y.row,y.col,y.maxWeight,y.maxVolume,y.occupiedWeight-occWeight,y.occupiedVolume-occVol);
            }
            await this.sku.deleteSku(a);
            //return await this.item.deleteItemsSku(a);
        } catch (error) {
            if(error===404) return;
            else throw error;
        }
    }
    //position implementation
    getPos=async ()=>{
        try {
            return await this.position.getPos();
        } catch (error) {
            throw error;
        }
    }
    addNewPos=async (pos,aisle,row,col,maxWeight,maxVol)=>{
        try {
            if(aisle.length!==4 || row.length!==4 || col.length!==4)    throw 422;
            if(pos!==(aisle+row+col)) throw 422;
            return await this.position.addNewPos(pos,aisle,maxWeight,maxVol,row,col);
        } catch (error) {
            throw error;
        }
    }
    modifyPos=async (pos,aisle,row,col,maxWeight,maxVol,occWeight,occVol)=>{
        try {
            if(aisle.length!==4 || row.length!==4 || col.length!==4 || pos.length!==12)    throw 422;
            if(occWeight>maxWeight || occVol>maxVol) throw 422;
            await this.position.getPosById(pos);
            await this.position.modifyPos(pos,aisle+row+col,aisle,row,col,maxWeight,maxVol,occWeight,occVol);
            if(pos!==(aisle+row+col)) return await this.sku.modifyPos(pos,aisle+row+col);
        } catch (error) {
            throw error;
        }
    }
    modifyPosPos=async (oldPos,newPos)=>{
        try {
            if(newPos.length!==12 || oldPos.length!==12)    throw 422;
            await this.position.getPosById(oldPos);
            await this.position.modifyPosPos(newPos,newPos.substring(0,4),newPos.substring(4,8),newPos.substring(8),oldPos);
            return await this.sku.modifyPos(oldPos,newPos);
        } catch (error) {
            throw error;
        }
    }
    deletePos=async a=>{
        try {
            if(a.length!==12) throw 422;
            //change1 modification
            //await this.getPosById(a);
            await this.position.deletePos(a);
            return await this.sku.modifyPos(a,null);
        } catch (error) {
            throw error;
        }
    }
    //skuitem implementation
    getSkuItems=async ()=>{
        try {
            return await this.skuitem.getSkuItems();
        } catch (error) {
            throw error;
        }
    }
    getSkuItemsById=async a=>{
        try {
            await this.getSkuById(a);
            return await this.skuitem.getSkuItemsById(a);
        } catch (error) {
            throw error;
        }
    }
    getSkuItemsByRfid=async a=>{
        try {
            console.log("TRYING TO GET SKUIT ",a);
            if(a.length<32) throw 422;
            return await this.skuitem.getSkuItemByRfid(a);
        } catch (error) {
            console.log("SKU IT ",a," , DOESN'T EXISTS");
            throw error;
        }
    }
    addNewSkuItem=async (rfid,skuId,date)=>{
        try {
            if(!dayjs(date,"YYYY/MM/DD HH:MM",true).isValid() && !dayjs(date,"YYYY/MM/DD",true).isValid() && date!==null) throw 422;
            if(rfid.length<32) throw 422;
            await this.sku.getSkuById(skuId);
            return await this.skuitem.addNewSkuItem(rfid,skuId,date);
        } catch (error) {
            throw error;
        }
    }
    modifySkuItem=async (oldRfid,newRfid,newAvl,newDate)=>{
        try {
            if(!dayjs(newDate,"YYYY/MM/DD HH:MM",true).isValid() && !dayjs(newDate,"YYYY/MM/DD",true).isValid() && newDate!==null) throw 422;
            if(oldRfid.length<32 || newRfid.length<32) throw 422;
            const x=await this.skuitem.getSkuItemByRfid(oldRfid);
            await this.skuitem.modifySkuItem(oldRfid,newRfid,newAvl,newDate);
            const diff=newAvl-x.Available;
            const z=await this.sku.getSkuById(x.SKUId);
            if(diff!==0)    return await this.modifySku(x.SKUId,z.description,z.weight,z.volume,z.notes,z.price,z.availableQuantity+diff,z.testDescriptors);
        } catch (error) {
            throw error;
        }
    }
    deleteSkuItem=async a=>{
        try {
            if(a.length<32) throw 422;
            const x=await this.skuitem.getSkuItemByRfid(a);
            await this.skuitem.deleteSkuItem(a);
            if(x.Available>0){
                const z=await this.getSkuById(x.SKUId);
                await this.modifySku(x.SKUId,z.description,z.weight,z.volume,z.notes,z.price,z.availableQuantity-1,z.testDescriptors);
            }
        } catch (error) {
            if(error===404) return;
            else    throw error;
        }
    }
    //item implementation
    getItems=async ()=>{
        try {
            return await this.item.getItems();
        } catch (error) {
            throw error;
        }
    }
    getItemId=async (id,suppId)=>{
        try {
            return await this.item.getItemsById(id,suppId);
        } catch (error) {
            throw error;
        }
    }
    addNewItem=async (id,desc,price,skuid,suppid)=>{
        try {
            await this.sku.getSkuById(skuid);
            const b=await this.item.suppSkuCombExists(suppid,skuid);
            if(!b)   return await this.item.addNewItem(id,desc,price,skuid,suppid);
            else throw 422;
        } catch (error) {
            throw error;
        }
    }
    modifyItem=async (id,suppId,desc,price)=>{
        try {
            await this.getItemId(id,suppId);
            return await this.item.modifyItem(id,suppId,desc,price);
        } catch (error) {
            throw error;
        }
    }
    deleteItem=async (id,suppId)=>{
        try {
            //change1 modifications
            //await this.item.getItemsById(a);
            return await this.item.deleteItem(id,suppId);
        } catch (error) {
            throw error;
        }
    }
    deleteItemsSupplier=async a=>{
        try {
            return await this.item.deleteItemSupp(a);
        } catch (error) {
            throw error;
        }
    }
    supplierHasSku=async (s,skuId)=>{
        try {
            return await this.item.suppSkuCombExists(s,skuId);
        } catch (error) {
            throw error;
        }
    }
}
module.exports=manageWarehouse;