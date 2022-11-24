"use strict";
const restockOrder=require('./modules/restockOrder');
const internalOrder = require('./modules/internalOrder');
const returnOrder=require('./modules/returnOrder');
const dayjs=require('dayjs');
const isSameOrAfter=require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
class manageOrders{
    constructor(db){
        this.restockOrder=new restockOrder(db);
        this.internalOrder=new internalOrder(db);
        this.returnOrder=new returnOrder(db);
        this.restOrdStates=["ISSUED","DELIVERY","DELIVERED","TESTED","COMPLETEDRETURN","COMPLETED"];
        this.intOrdStates=["ISSUED","ACCEPTED","REFUSED","CANCELED","COMPLETED"];
    }
    //restock orders implementation
    getRestockOrders=async()=>{
        try {
            const ret=await this.restockOrder.getRestockOrders();
            ret.forEach(x=>{
                if(x.products!=='')    x.products=JSON.parse(x.products);
                else x.products=[];
                if(x.transportNote!=='')    x.transportNote=JSON.parse(x.transportNote);
                else x.transportNote=[];
                if(x.skuItems!=='')    x.skuItems=JSON.parse(x.skuItems);
                else x.skuItems=[];
            });
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getIssuedRestockOrders=async()=>{
        try {
            const ret=await this.restockOrder.getOrdersInState("ISSUED");
            ret.forEach(x=>{
                if(x.products!=='')    x.products=JSON.parse(x.products);
                else x.products=[];
                if(x.transportNote!=='')    x.transportNote=JSON.parse(x.transportNote);
                else x.transportNote=[];
                if(x.skuItems!=='')    x.skuItems=JSON.parse(x.skuItems);
                else x.skuItems=[];
            });
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getRestockOrderById=async a=>{
        try {
            const ret=await this.restockOrder.getRestockOrderId(a);
            if(ret.products!=='')    ret.products=JSON.parse(ret.products);
            else ret.products=[];
            if(ret.transportNote!=='')    ret.transportNote=JSON.parse(ret.transportNote);
            else ret.transportNote=[];
            if(ret.skuItems!=='')    ret.skuItems=JSON.parse(ret.skuItems);
            else ret.skuItems=[];
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getReturnItemsRestockOrder=async a=>{
        try {
            const x=await this.getRestockOrderById(a);
            if(x.state!=='COMPLETEDRETURN') throw 422;
            let ret=await this.restockOrder.getReturnItemsOfRestockOrder(a);
            if(ret!=='')    ret=JSON.parse(ret);
            else ret=[];
            return ret;
        } catch (error) {
            throw error;
        }
    }
    addRestockOrder=async (date,prod,suppId)=>{
        try {
            if(!dayjs(date,"YYYY/MM/DD HH:MM",true).isValid() && !dayjs(date,"YYYY/MM/DD",true).isValid()) throw 422;
            prod.forEach(i=>{
                let n=0;
                for(const p in i){
                    if(n===0){
                        if(p!=='SKUId' || typeof(i[p])!=='number') throw 422;
                        else n++;
                    }
                    else if(n===1){
                        if(p!=='itemId' || typeof(i[p])!=='number') throw 422;
                        else n++;
                    }
                    else if(n===2){
                        if(p!=='description' || typeof(i[p])!=='string') throw 422;
                        else n++;
                    }
                    else if(n===3){
                        if(p!=='price' || typeof(i[p])!=='number') throw 422;
                        else n++;
                    }
                    else if(n===4){
                        if(p!=='qty' || typeof(i[p])!=='number') throw 422;
                        else n++;
                    }
                    else throw 422;
                }
            });
            return await this.restockOrder.addRestockOrder(date,"ISSUED",JSON.stringify(prod),suppId);
        } catch (error) {
            throw error;
        }
    }
    modifyRestockOrderState=async (id,state,retItems)=>{
        try {
            if(this.restOrdStates.indexOf(state)<0) throw 422;
            /*if(state==='COMPLETEDRETURN') {
                const ma=new Map(retItems.map(e=>[e.rfid,0]));
                const k=await this.getRetOrdItemsRestOrd(id);
                for(const l of k){
                    for(const m of l.products){
                        ma.set(m.RFID,1);
                    }
                }
                Array.from(ma.values()).forEach(o=>{if(o!==1) throw 422;});
            }*/
            return await this.restockOrder.modifyState(id,state);
        } catch (error) {
            throw error;
        }
    }
    modifyRestockOrderSkuItems=async (id,items)=>{
        try {
            const x=await this.getRestockOrderById(id);
            if(x.state!=='DELIVERED') throw 422;
            items.forEach(i=>{
                let n=0;
                for(const p in i){
                    if(n===0){
                        if(p!=='SKUId' || typeof(i[p])!=='number') throw 422;
                        else n++;
                    }
                    else if(n===1){
                        if(p!=='itemId' || typeof(i[p])!=='number') throw 422;
                        else n++;
                    }
                    else if(n===2){
                        if(p!=='rfid' || typeof(i[p])!=='string') throw 422;
                        else n++;
                    }
                    else throw 422;
                }
            });
            x.skuItems.forEach(y=>items.push(y));
            const temp=new Map(items.map(d=>[d.SKUId,0]));
            items.forEach(z=>temp.set(z.SKUId,temp.get(z.SKUId)+1));
            const tempSku=new Map(x.products.map(d=>[d.SKUId,0]));
            //checking that every skuitem inserted is associated to one of the skus in products
            Array.from(temp.keys()).forEach(k=>{if(!tempSku.has(k)) throw 422});
            //checking that we don't have more than the qty of skus of that type requested
            x.products.forEach(p=>{
                if(p.qty<temp.get(p.SKUId)) throw 422;
            });
            return await this.restockOrder.modifySkuItemsRestOrd(id,JSON.stringify(items));
        } catch (error) {
            throw error;
        }
    }
    modifyRestockOrderNote=async (id,tNote)=>{
        try {
            const z=await this.getRestockOrderById(id);
            if(z.state!=='DELIVERY') throw 422;
            let x=0;
            for(const p in tNote){
                if(x===0){
                    if(p!=='deliveryDate' || (!dayjs(tNote[p],"YYYY/MM/DD HH:MM",true).isValid() && !dayjs(tNote[p],"YYYY/MM/DD",true).isValid())) throw 422;
                    else if(!dayjs(tNote[p]).isSameOrAfter(dayjs(z.issueDate))) throw 422;
                    else x++;
                }
                else throw 422;
            }
            return await this.restockOrder.modifyTNote(id,JSON.stringify(tNote));
        } catch (error) {
            throw error;
        }
    }
    deleteRestockOrders=async a=>{
        try {
            //change 1 modifications
            //await this.getRestockOrderById(a);
            return await this.restockOrder.deleteRestOrd(a);
        } catch (error) {
            throw error;
        }
    }
    //internal orders apis
    getInternalOrders=async ()=>{
        try {
            const ret=await this.internalOrder.getInternalOrders();
            ret.forEach(x=>{
                if(x.products!=='')    x.products=JSON.parse(x.products);
                else x.products=[];
            });
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getIssuedInternalOrders=async()=>{
        try {
            const ret=await this.internalOrder.getOrdersInState("ISSUED");
            ret.forEach(x=>{
                if(x.products!=='')    x.products=JSON.parse(x.products);
                else x.products=[];
            });
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getAcceptedInternalOrders=async()=>{
        try {
            const ret=await this.internalOrder.getOrdersInState("ACCEPTED");
            ret.forEach(x=>{
                if(x.products!=='')    x.products=JSON.parse(x.products);
                else x.products=[];
            });
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getInternalOrderById=async a=>{
        try {
            const ret=await this.internalOrder.getInternalOrderId(a);
            if(ret.products!=='')    ret.products=JSON.parse(ret.products);
            else ret.products=[];
            return ret;
        } catch (error) {
            throw error;
        }
    }
    addInternalOrder=async (date,prod,custId)=>{
        try {
            if(!dayjs(date,"YYYY/MM/DD HH:MM",true).isValid() && !dayjs(date,"YYYY/MM/DD",true).isValid()) throw 422;
            prod.forEach(i=>{
                let d=0;
                for(const p in i){
                    if(d===0){
                        if(p!=='SKUId' || typeof(i[p])!=='number') throw 422;
                        else d++;
                    }
                    else if(d===1){
                        if(p!=='description' || typeof(i[p])!=='string') throw 422;
                        else d++;
                    }
                    else if(d===2){
                        if(p!=='price' || typeof(i[p])!=='number') throw 422;
                        else d++;
                    }
                    else if(d===3){
                        if(p!=='qty' || typeof(i[p])!=='number') throw 422;
                        else d++;
                    }
                    else throw 422;
                }
            });
            return await this.internalOrder.addinternalOrder(date,"ISSUED",JSON.stringify(prod),custId);
        } catch (error) {
            throw error;
        }
    }
    modifyInternalOrder=async (id,body)=>{
        try {
            let y=0;
            let completed=false;
            const z=await this.getInternalOrderById(id);
            const ma=new Map(z.products.map(r=>[r.SKUId,0]));
            const maQty=new Map(z.products.map(r=>[r.SKUId,r.qty]));
            for(const p in body){
                if(y===0){
                    if(p!=='newState' || typeof(body[p])!=='string') throw 422;
                    else{
                        if(body[p]==='COMPLETED') completed=true;
                        if(this.intOrdStates.indexOf(body[p])<0) throw 422;
                        y++;
                    }
                }
                else if(y===1){
                    if(completed && (p!=='products' || typeof(body[p])!=='object')) throw 422;
                    if(completed){
                        body[p].forEach(i=>{
                            let d=0;
                            let sku;
                            for(const p in i){
                                if(d===0){
                                    if(p!=='SkuID' || typeof(i[p])!=='number') throw 422;
                                    else d++;
                                    sku=i[p];
                                }
                                else if(d===1){
                                    if(p!=='RFID' || typeof(i[p])!=='string') throw 422;
                                    else d++;
                                    if(ma.get(sku)!==undefined) ma.set(sku,ma.get(sku)+1);
                                    else ma.set(sku,1);
                                }
                                else throw 422;
                            }
                        });
                    }
                    else y++;
                }
                else throw 422;
            }
            if(completed){
                for(const [key,val] of ma){
                    if(val>maQty.get(key)) throw 422;
                }
                const prods=[];
                body.products.forEach(p=>{
                    let pr;
                    for(const sk of z.products){
                        if(sk.SKUId===p.SkuID){
                            pr=sk;
                            break;
                        }
                    }
                    let o;
                    if(pr!==undefined)  o={"SKUId":p.SkuID,"description":pr.description,"price":pr.price,"RFID":p.RFID};
                    else o=o={"SKUId":p.SkuID,"description":"","price":0.01,"RFID":p.RFID};
                    prods.push(o);
                });
                return await this.internalOrder.modifyProdAndStateIntOrd(id,JSON.stringify(prods),body.newState);
            }
            else    return await this.internalOrder.modifyState(id,body.newState);
        } catch (error) {
            throw error;
        }
    }
    deleteInternalOrder=async a=>{
        try {
            //change 1 modifications
            //await this.getInternalOrderById(a);
            return await this.internalOrder.deleteIntOrd(a);
        } catch (error) {
            throw error;
        }
    }
    //return order implementation
    getReturnOrders=async()=>{
        try {
            const ret=await this.returnOrder.getReturnOrders();
            ret.forEach(x=>{
                if(x.products!=='')    x.products=JSON.parse(x.products);
                else x.products=[];
            });
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getReturnOrderId=async a=>{
        try {
            const ret=await this.returnOrder.getReturnOrderId(a);
            if(ret.products!=='')    ret.products=JSON.parse(ret.products);
            else ret.products=[];
            return ret
        } catch (error) {
            throw error;
        }
    }
    addReturnOrder=async(date,products,restOrdId)=>{
        try {
            if(!dayjs(date,"YYYY/MM/DD HH:MM",true).isValid() && !dayjs(date,"YYYY/MM/DD",true).isValid()) throw 422;
            const rOrd=await this.restockOrder.getRestockOrderId(restOrdId);
            //const z=await this.getReturnItemsRestockOrder(restOrdId);
            let z;
            if(rOrd.skuItems!=='')  z=JSON.parse(rOrd.skuItems);
            else z=[];
            //if(rOrd.state!=='COMPLETEDRETURN') throw 422;
            products.forEach(i=>{
                let x=0;
                let skuid;
                let rfid;
                for(const p in i){
                    if(x===0){
                        if(p!=='SKUId' || typeof(i[p])!=='number') throw 422;
                        else x++;
                        skuid=i[p];
                    }
                    else if(x===1){
                        if(p!=='itemId' || typeof(i[p])!=='number') throw 422;
                        else x++;
                    }
                    else if(x===2){
                        if(p!=='description' || typeof(i[p])!=='string') throw 422;
                        else x++;
                    }
                    else if(x===3){
                        if(p!=='price' || typeof(i[p])!=='number') throw 422;
                        else x++;
                    }
                    else if(x===4){
                        if(p!=='RFID' || typeof(i[p])!=='string') throw 422;
                        else x++;
                        rfid=i[p];
                    }
                    else throw 422;
                }
                /*let found=false;
                for(const l of z){
                    if(l.SKUId===skuid){
                        if(l.rfid===rfid){
                            found=true;
                            break;
                        }
                    }
                }
                if(!found) throw 422;*/
            });
            await this.returnOrder.addReturnOrder(date,JSON.stringify(products),restOrdId);
        } catch (error) {
            throw error;
        }
    }
    deleteReturnOrder=async a=>{
        try {
            //change1 modifications
            //await this.getReturnOrderId(a);
            return await this.returnOrder.deleteReturnOrder(a);
        } catch (error) {
            throw error;
        }
    }
    getRetOrdItemsRestOrd=async a=>{
        try {
            const ret=await this.returnOrder.getRetItROrd(a);
            ret.forEach(x=>{
                if(x.products!=='')    x.products=JSON.parse(x.products);
                else x.products=[];
            });
            return ret;
        } catch (error) {
            throw error;
        }
    }
}
module.exports=manageOrders;