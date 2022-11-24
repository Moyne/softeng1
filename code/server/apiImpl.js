"use strict";
const manageWarehouse=require('./manageWarehouse');
const manageOrders=require('./manageOrders');
const manageTests=require('./manageTests');
const manageUsers=require('./manageUsers');
const dbase=require('./modules/db');
const dayjs=require('dayjs');
const sku = require('./modules/sku');
class apiImpl{
    constructor(){
        this.db=new dbase('./modules/ezwhdb.sqlite');
        this.mngWh=new manageWarehouse(this.db.getDb());
        this.mngOrd=new manageOrders(this.db.getDb());
        this.mngTst=new manageTests(this.db.getDb());
        this.mngUsr=new manageUsers(this.db.getDb());
        //this.activeUser={id:1,type:"manager"};
    }
    //manageWarehouse
    //manageWarehouse: sku
    getSkus=async()=>{
        try {
            const ret=await this.mngWh.getSkus();
            return ret;
        } catch (error) {
            throw error;
        }
    }
    getSkuById=async id=>{
        try {
            if(isNaN(id)!==false) throw 422;
            return await this.mngWh.getSkuById(parseInt(id));
        } catch (error) {
            throw error;
        }
    }
    addNewSku=async body=>{
        try{
            if(typeof(body.description)!=='string' || !isFinite(body.weight) || 
            !isFinite(body.volume) || typeof(body.notes)!=='string' || 
            !isFinite(body.price) || !isFinite(body.availableQuantity)) throw 422;
            return await this.mngWh.addSku(body.description,parseFloat(body.weight),parseFloat(body.volume),body.notes,parseFloat(body.availableQuantity),parseFloat(body.price));
        } catch(error) {
            throw error;
        }
    }
    modifySku=async (id,body)=>{
        try{
            if(!isFinite(id) ||typeof(body.newDescription)!=='string' || !isFinite(body.newWeight) || 
            !isFinite(body.newVolume) || typeof(body.newNotes)!=='string' || 
            !isFinite(body.newPrice) || !isFinite(body.newAvailableQuantity) ||
            (typeof(body.newTestDescriptors)!=='object' && body.newTestDescriptors!==undefined)) throw 422;
            if(body.newTestDescriptors!==undefined) await this.checkTds(body.newTestDescriptors);
            return await this.mngWh.modifySku(parseInt(id),body.newDescription,parseFloat(body.newWeight),parseFloat(body.newVolume),body.newNotes,parseFloat(body.newPrice),parseFloat(body.newAvailableQuantity),body.newTestDescriptors);
        } catch(error) {
            throw error;
        }
    }
    checkTds=async a=>{
        try {
            const prom=[];
            a.forEach(x=>{
                prom.push(this.mngTst.getTestDescId(parseInt(x)));
            });
            await Promise.all(prom).then().catch(r=>{throw 422;});
        } catch (error) {
            throw error;
        }
    };
    modifySkuPos=async (id,body)=>{
        try{
            if(typeof(body.position)!=='string' || !isFinite(id)) throw 422;
            return await this.mngWh.modifySkuPos(parseInt(id),body.position);
        } catch(error) {
            throw error;
        }
    }
    deleteSku=async a=>{
        try{
            if(!isFinite(a)) throw 422;
            return await this.mngWh.deleteSku(parseInt(a));
        } catch(error) {
            throw error;
        }
    }
    //manageWarehouse: position
    getPos=async ()=>{
        try{
            const ret=await this.mngWh.getPos();
            return ret;
        } catch (error) {
            return error;
        }
    }
    addNewPos=async body=>{
        try {
            if(typeof(body.positionID)!=='string' || typeof(body.aisleID)!=='string' || 
            typeof(body.row)!=='string' || typeof(body.col)!=='string' || 
            !isFinite(body.maxWeight) || !isFinite(body.maxVolume)) throw 422;
            return await this.mngWh.addNewPos(body.positionID,body.aisleID,body.row,body.col,parseFloat(body.maxWeight),parseFloat(body.maxVolume));
        } catch (error) {
            throw error;
        }
    }
    modifyPos=async (pos,body)=>{
        try {
            if(typeof(pos)!=='string' || typeof(body.newAisleID)!=='string' || 
            typeof(body.newRow)!=='string' || typeof(body.newCol)!=='string' || 
            !isFinite(body.newMaxWeight) || !isFinite(body.newMaxVolume) ||
            !isFinite(body.newOccupiedWeight) || !isFinite(body.newOccupiedVolume)) throw 422;
            return await this.mngWh.modifyPos(pos,body.newAisleID,body.newRow,body.newCol,parseFloat(body.newMaxWeight),parseFloat(body.newMaxVolume),parseFloat(body.newOccupiedWeight),parseFloat(body.newOccupiedVolume));
        } catch (error) {
            throw error;
        }
    }
    modifyPosPos=async (pos,body)=>{
        try {
            if(typeof(pos)!=='string' || typeof(body.newPositionID)!=='string') throw 422;
            return await this.mngWh.modifyPosPos(pos,body.newPositionID);
        } catch (error) {
            throw error;
        }
    }
    deletePos=async a=>{
        try {
            if(typeof(a)!=='string') throw 422;
            return await this.mngWh.deletePos(a);
        } catch (error) {
            throw error;
        }
    }
    //manageWarehouse: skuitem
    getSkuItems=async ()=>{
        try {
            return await this.mngWh.getSkuItems();
        } catch (error) {
            throw error;
        }
    }
    getSkuItemsById=async id=>{
        try {
            if(!isFinite(id)) throw 422;
            return await this.mngWh.getSkuItemsById(parseInt(id));
        } catch (error) {
            throw error;
        }
    }
    getSkuItemByRfid=async rfid=>{
        try {
            if(typeof(rfid)!=='string' || rfid==="null") throw 422;
            return await this.mngWh.getSkuItemsByRfid(rfid);
        } catch (error) {
            throw error;
        }
    }
    addSkuItem=async body=>{
        try {
            if(typeof(body.RFID)!=='string' || !isFinite(body.SKUId) || typeof(body.DateOfStock)!=='string') throw 422;
            return await this.mngWh.addNewSkuItem(body.RFID,parseInt(body.SKUId),body.DateOfStock);
        } catch (error) {
            throw error;
        }
    }
    modifySkuItem=async (rfid,body)=>{
        try {
            if(typeof(rfid)!=='string' || typeof(body.newRFID)!=='string' ||
            typeof(body.newDateOfStock)!=='string' || !isFinite(body.newAvailable) || body.newAvailable===null) throw 422;
            return await this.mngWh.modifySkuItem(rfid,body.newRFID,parseInt(body.newAvailable),body.newDateOfStock);
        } catch (error) {
            throw error;
        }
    }
    deleteSkuItem=async rfid=>{
        try {
            if(typeof(rfid)!=='string') throw 422;
            return await this.mngWh.deleteSkuItem(rfid);
        } catch (error) {
            throw error;
        }
    }
    //ManageWarehouse: item
    getItems=async ()=>{
        try {
            return await this.mngWh.getItems();
        } catch (error) {
            throw error;
        }
    }
    getItemsById=async (id,suppId)=>{
        try {
            if(!isFinite(id) || !isFinite(suppId)) throw 422;
            return await this.mngWh.getItemId(parseInt(id),parseInt(suppId));
        } catch (error) {
            throw error;
        }
    }
    addItem=async body=>{
        try {
            if(!isFinite(body.id) || typeof(body.description)!=='string' || 
                !isFinite(body.SKUId) || !isFinite(body.price) || 
                !isFinite(body.supplierId)) throw 422;
            await this.mngUsr.hasSupp(parseInt(body.supplierId));
            return await this.mngWh.addNewItem(parseInt(body.id),body.description,parseFloat(body.price),parseInt(body.SKUId),parseInt(body.supplierId));
        } catch (error) {
            throw error;
        }
    }
    modifyItem=async (id,suppId,body)=>{
        try {
            if(!isFinite(id) || !isFinite(suppId) || typeof(body.newDescription)!=='string' ||
            !isFinite(body.newPrice)) throw 422;
            return await this.mngWh.modifyItem(parseInt(id),parseInt(suppId),body.newDescription,parseFloat(body.newPrice));
        } catch (error) {
            throw error;
        }
    }
    deleteItem=async (id,suppId)=>{
        try {
            if(!isFinite(id) || !isFinite(suppId)) throw 422;
            return await this.mngWh.deleteItem(parseInt(id),parseInt(suppId));
        } catch (error) {
            throw error;
        }
    }
    //ManageOrders
    //ManageOrders: restock orders
    getRestockOrder=async ()=>{
        try {
            return await this.mngOrd.getRestockOrders();
        } catch (error) {
            throw error;
        }
    }
    getIssuedRestockOrder=async ()=>{
        try {
            return await this.mngOrd.getIssuedRestockOrders();
        } catch (error) {
            throw error;
        }
    }
    getRestockOrderId=async a=>{
        try {
            if(!isFinite(a)) throw 422;
            return await this.mngOrd.getRestockOrderById(parseInt(a));
        } catch (error) {
            throw error;
        }
    }
    getRetItemsRestOrd=async a=>{
        try {
            if(!isFinite(a)) throw 422;
            const ret=[];
            const x=await this.mngOrd.getReturnItemsRestockOrder(parseInt(a));
            for(const z of x){
                const tr=await this.mngTst.getTestResultRfid(z.rfid);
                for(const l of tr){
                    if(!l.Result){
                        ret.push(z);
                        break;
                    }
                }
            }
            return ret;
        } catch (error) {
            throw error;
        }
    }
    addRestockOrder=async body=>{
        try {
            if(typeof(body.issueDate)!=='string' || typeof(body.products)!=='object' || !isFinite(body.supplierId)) throw 422;
            await this.checkSupplierExistance(parseInt(body.supplierId));
            await this.checkRestockOrder(body.products,body.supplierId);
            return await this.mngOrd.addRestockOrder(body.issueDate,body.products,parseInt(body.supplierId));
        } catch (error) {
            throw error;
        }
    }
    checkRestockOrder=async (products,suppId)=>{
        try {
            const prom=[];
            products.forEach(z=>prom.push(this.mngWh.getItemId(z.itemId,suppId)));
            await Promise.all(prom).then().catch(e=>{throw 422;});
        } catch (error) {
            throw error;
        }
    }
    checkSupplierExistance=async s=>{
        try{
            await this.mngUsr.hasSupp(s);
        }catch(error){
            throw 422;
        }
    }
    modifyStateRestOrd=async (id,body)=>{
        try {
            if(!isFinite(id)!==false || typeof(body.newState)!=='string') throw 422;
            const z=await this.mngOrd.getRestockOrderById(parseInt(id));
            if(body.newState==='COMPLETEDRETURN'){
                await this.mngOrd.modifyRestockOrderState(parseInt(id),body.newState);
                const r=await this.getRetItemsRestOrd(id);
                const skuItToStock=[];
                for(const p of z.skuItems){
                    let found=false;
                    for(const k of r){
                        if(k.rfid===p.rfid){
                            found=true;
                            break;
                        }
                    }
                    if(!found) skuItToStock.push(p);
                }
                await this.changeAvlSkuIt(skuItToStock.map(s=>s.rfid),true);
            }
            else    await this.mngOrd.modifyRestockOrderState(parseInt(id),body.newState);
            if(body.newState==='COMPLETED') this.changeAvlSkuIt(z.skuItems.map(s=>s.rfid),true);
        } catch (error) {
            throw error;
        }
    }
    modifySkuItRestOrd=async (id,body)=>{
        try {
            if(!isFinite(id)!==false || typeof(body.skuItems)!=='object') throw 422;
            console.log("IN MODIFY SKU IT REST ORD WITH:",id, " , ",body);
            const skuits=await this.getSkuItems();
            console.log("SKUITS EXISTING:",skuits);
            const rord=await this.mngOrd.getRestockOrderById(parseInt(id));
            console.log("GOT RESTOCK ORDER,",rord);
            await this.checkIfSkuItsAlreadyExists(body.skuItems);
            console.log("SKU ITS ALREADY EXISTS CHECK PASSED");
            await this.mngOrd.modifyRestockOrderSkuItems(parseInt(id),body.skuItems);
            console.log("MODIFIED RESTOCK ORDERS SKU ITS");
            //await this.addSkuItRestOrd(body.skuItems);
        } catch (error) {
            throw error;
        }
    }
    changeAvlSkuIt=async (sk,avl)=>{
        try{
            for(const s of sk){
                const e=await this.mngWh.getSkuItemsByRfid(s);
                await this.mngWh.modifySkuItem(e.RFID,e.RFID,avl?1:0,e.DateOfStock);
            }
        } catch(error){
            if(error===404) return;
            else throw error;
        }
    };
    checkIfSkuItsAlreadyExists=async s=>{
        try{
            const prom=[];
            s.forEach(z=>{
                prom.push(this.mngWh.getSkuItemsByRfid(z.rfid));
            });
            //Promise.any(prom).then(()=>reject(422),()=>resolve());
            await Promise.all(prom).then().catch(()=>{throw 422;});
        }catch(error){
            console.log("CATCHED PROMISE.ALL ERROR");
            throw error;
        }
    }
    /*addSkuItRestOrd=async s=>{
        try {
            const prom=[];
            s.forEach(z=>{
                prom.push(this.mngWh.addNewSkuItem(z.rfid,z.SKUId,dayjs().format('YYYY/MM/DD HH:MM').toString()));
            });
            await Promise.all(prom).then().catch(e=>{throw 503;});
        } catch (error) {
            throw error;
        }
    };*/
    modifyTNoteRestOrd=async (id,body)=>{
        try {
            if(!isFinite(id) || typeof(body.transportNote)!=='object') throw 422;
            return await this.mngOrd.modifyRestockOrderNote(parseInt(id),body.transportNote);
        } catch (error) {
            throw error;
        }
    }
    deleteRestockOrder=async a=>{
        try {
            if(!isFinite(a)) throw 422;
            return await this.mngOrd.deleteRestockOrders(parseInt(a));
        } catch (error) {
            throw error;
        }
    }
    //ManageOrders: internal orders
    getInternalOrders=async ()=>{
        try {
            return await this.mngOrd.getInternalOrders();
        } catch (error) {
            throw error;
        }
    }
    getIssuedInternalOrders=async ()=>{
        try {
            return await this.mngOrd.getIssuedInternalOrders();
        } catch (error) {
            throw error;
        }
    }
    getAcceptedInternalOrders=async ()=>{
        try {
            return await this.mngOrd.getAcceptedInternalOrders();
        } catch (error) {
            throw error;
        }
    }
    getInternalOrderId=async a=>{
        try {
            if(!isFinite(a))    throw 422;
            return await this.mngOrd.getInternalOrderById(parseInt(a));
        } catch (error) {
            throw error;
        }
    }
    addInternalOrder=async body=>{
        try {
            if(typeof(body.issueDate)!=='string' || typeof(body.products)!=='object' || !isFinite(body.customerId)) throw 422;
            await this.checkintOrd(body);
            return await this.mngOrd.addInternalOrder(body.issueDate,body.products,parseInt(body.customerId));
        } catch (error) {
            throw error;
        }
    }
    checkintOrd=async body=>{
        try {
            const prom=[];
            body.products.forEach(z=>prom.push(this.mngWh.getSkuById(z.SKUId)));
            prom.push(this.mngUsr.hasCust(parseInt(body.customerId)));
            await Promise.all(prom).then().catch(e=>{throw 422;});
        } catch (error) {
            throw error;
        }
    };
    modifyInternalOrder=async (id,body)=>{
        try {
            if(!isFinite(id) || typeof(body.newState)!=='string') throw 422;
            const z=await this.mngOrd.getInternalOrderById(parseInt(id));
            if(body.newState==='ACCEPTED')  await this.checkAvlOfProdsIntOrder(z.products);
            await this.mngOrd.modifyInternalOrder(parseInt(id),body);
            //if(body.newState==='COMPLETED') return await this.changeAvlSkuIt(body.products.map(e=>e.RFID),false);
        } catch (error) {
            throw error;
        }
    }
    checkAvlOfProdsIntOrder=async a=>{
        try {
            const prom=[];
            a.forEach(r=>{
                prom.push(this.mngWh.getSkuById(r.SKUId).then(o=>{if(r.qty>o.availableQuantity) throw 422;})); 
            });
            await Promise.all(prom);
        } catch (error) {
            throw error;
        }
    };
    deleteInternalOrder=async a=>{
        try {
            if(!isFinite(a)) throw 422;
            return await this.mngOrd.deleteInternalOrder(parseInt(a));
        } catch (error) {
            throw error;
        }
    }
    //ManageOrders: return orders
    getReturnOrders=async ()=>{
        try {
            return await this.mngOrd.getReturnOrders();
        } catch (error) {
            throw error;
        }
    }
    getReturnOrderId=async a=>{
        try {
            if(!isFinite(a)) throw 422;
            return await this.mngOrd.getReturnOrderId(parseInt(a));
        } catch (error) {
            throw error;
        }
    }
    addReturnOrder=async body=>{
        try {
            if(typeof(body.returnDate)!=='string' || typeof(body.products)!=='object' || !isFinite(body.restockOrderId)) throw 422;
            //await this.checkReturnOrder(body);
            await this.mngOrd.addReturnOrder(body.returnDate,body.products,parseInt(body.restockOrderId));
            await this.changeAvlSkuIt(body.products.map(s=>s.RFID),false);
        } catch (error) {
            throw error;
        }
    }
    /*checkReturnOrder=async body=>{
        try {
            const prom=[];
            body.products.forEach(z=>prom.push(this.mngWh.getSkuItemsByRfid(z.RFID)));
            await Promise.all(prom).then().catch(e=>{throw 422});
        } catch (error) {
            throw error;
        }
    };*/
    deleteReturnOrder=async a=>{
        try {
            if(!isFinite(a)) throw 422;
            return await this.mngOrd.deleteReturnOrder(parseInt(a));
        } catch (error) {
            throw error;
        }
    }
    //ManageTests
    //ManageTests: Test Descriptors
    getTestDescriptors=async()=>{
        try {
            return await this.mngTst.getTestDescriptors();
        } catch (error) {
            throw error;
        }
    }
    getTestDescId=async a=>{
        try {
            if(!isFinite(a))    throw 422;
            return await this.mngTst.getTestDescId(parseInt(a));
        } catch (error) {
            throw error;
        }
    }
    addTestDescriptor=async body=>{
        try {
            if(typeof(body.name)!=='string' || typeof(body.procedureDescription)!=='string' ||
                (!isFinite(body.idSKU) || body.idSKU===null)) throw 422;
            const s=await this.mngWh.getSkuById(parseInt(body.idSKU));
            await this.mngTst.addTestDescriptor(body.name,body.procedureDescription,parseInt(body.idSKU));
            const tds=await this.mngTst.getTestDescriptors();
            for(const td of tds){
                if(td.name===body.name && td.procedureDescription===body.procedureDescription && td.idSKU===parseInt(body.idSKU)){
                    await this.mngWh.modifySku(parseInt(body.idSKU),s.description,s.weight,s.volume,s.notes,s.price,s.availableQuantity,[...s.testDescriptors,parseInt(td.id)]);
                    break;
                }
            }
        } catch (error) {
            throw error;
        }
    }
    modifyTestDescriptor=async (id,body)=>{
        try {
            if(!isFinite(id) || typeof(body.newName)!=='string' ||
                typeof(body.newProcedureDescription)!=='string' || !isFinite(body.newIdSKU)) throw 422;
            const newS=await this.mngWh.getSkuById(body.newIdSKU);
            const td=await this.mngTst.getTestDescId(parseInt(id));
            await this.mngTst.modifyTestDesc(parseInt(id),body.newName,body.newProcedureDescription,parseInt(body.newIdSKU));
            if(td.idSKU!==body.newIdSKU){
                const s=await this.mngWh.getSkuById(parseInt(td.idSKU));
                s.testDescriptors.splice(s.testDescriptors.indexOf(parseInt(id)),1);
                await this.mngWh.modifySku(td.idSKU,s.description,s.weight,s.volume,s.notes,s.price,s.availableQuantity,s.testDescriptors);
                await this.mngWh.modifySku(body.newIdSKU,newS.description,newS.weight,newS.volume,newS.notes,newS.price,newS.availableQuantity,[...newS.testDescriptors,parseInt(id)]);
            }
        } catch (error) {
            throw error;
        }
    }
    deleteTestDescriptor=async a=>{
        try {
            if(!isFinite(a)) throw 422;
            const x=await this.mngTst.getTestDescId(parseInt(a));
            await this.mngTst.deleteTestDesc(parseInt(a));
            const s=await this.mngWh.getSkuById(x.idSKU);
            s.testDescriptors.splice(s.testDescriptors.indexOf(parseInt(a)),1);
            return await this.mngWh.modifySku(x.idSKU,s.description,s.weight,s.volume,s.notes,s.price,s.availableQuantity,s.testDescriptors);
        } catch (error) {
            throw error;
        }
    }
    //ManageTests: test results
    getTestResults=async a=>{
        try {
            if(typeof(a)!=='string') throw 422;
            await this.mngWh.getSkuItemsByRfid(a);
            return await this.mngTst.getTestResultRfid(a);
        } catch (error) {
            throw error;
        }
    }
    getTestResultId=async (id,rfid)=>{
        try {
            if(typeof(rfid)!=='string' || !isFinite(id)) throw 422;
            await this.mngWh.getSkuItemsByRfid(rfid);
            return await this.mngTst.getTestResultId(parseInt(id),rfid);
        } catch (error) {
            throw error;
        }
    }
    addTestResult=async body=>{
        try {
            if(typeof(body.rfid)!=='string' || !isFinite(body.idTestDescriptor) ||
                typeof(body.Date)!=='string' || typeof(body.Result)!=='boolean') throw 422;
            const z=await this.mngWh.getSkuItemsByRfid(body.rfid);
            const y=await this.mngTst.getTestDescId(parseInt(body.idTestDescriptor));
            if(z.SKUId!==y.idSKU) throw 422;
            return await this.mngTst.addTestResult(body.rfid,parseInt(body.idTestDescriptor),body.Date,body.Result);
        } catch (error) {
            throw error;
        }
    }
    modifyTestResult=async (id,rfid,body)=>{
        try {
            if(isNaN(id)!==false || typeof(rfid)!=='string' ||
                !isFinite(body.newIdTestDescriptor) || 
                typeof(body.newDate)!=='string' || typeof(body.newResult)!=='boolean') throw 422;
            await this.mngWh.getSkuItemsByRfid(rfid);
            return await this.mngTst.modifyTestResult(rfid,parseInt(id),parseInt(body.newIdTestDescriptor),body.newDate,body.newResult);
        } catch (error) {
            throw error;
        }
    }
    deleteTestResult=async (id,rfid)=>{
        try {
            if(!isFinite(id) || typeof(rfid)!=='string') throw 422;
            return await this.mngTst.deleteTestResult(rfid,parseInt(id));
        } catch (error) {
            throw error;
        }
    }
    //ManageUsers
    //ManageUsers: users
    getUserInfo=async()=>{
        try {
            return await this.mngUsr.getUserInfo(activeUser.id,activeUser.type);
        } catch (error) {
            throw error;
        }
    }
    getSuppliers=async()=>{
        try {
            return await this.mngUsr.getSuppliers();
        } catch (error) {
            throw error;
        }
    }
    getUsers=async()=>{
        try {
            return await this.mngUsr.getUsers();
        } catch (error) {
            throw error;
        }
    }
    newUser=async body=>{
        try {
            if(typeof(body.username)!=='string' || typeof(body.password)!=='string' ||
            typeof(body.name)!=='string' || typeof(body.surname)!=='string' || typeof(body.type)!=='string') throw 422;
            return await this.mngUsr.newUser(body.username,body.name,body.surname,body.password,body.type);
        } catch (error) {
            throw error;
        }
    }
    managerSession=async body=>{
        try {
            return await this.mngUsr.session(body.username,body.password,"manager");
        } catch (error) {
            throw error;
        }
    }
    customerSession=async body=>{
        try {
            return await this.mngUsr.session(body.username,body.password,"customer");
        } catch (error) {
            throw error;
        }
    }
    clerkSession=async body=>{
        try {
            return await this.mngUsr.session(body.username,body.password,"clerk");
        } catch (error) {
            throw error;
        }
    }
    supplierSession=async body=>{
        try {
            return await this.mngUsr.session(body.username,body.password,"supplier");
        } catch (error) {
            throw error;
        }
    }
    qualityEmpSession=async body=>{
        try {
            return await this.mngUsr.session(body.username,body.password,"qualityEmployee");
        } catch (error) {
            throw error;
        }
    }
    deliveryEmplSession=async body=>{
        try {
            return await this.mngUsr.session(body.username,body.password,"deliveryEmployee");
        } catch (error) {
            throw error;
        }
    }
    logout=()=>this.mngUsr.logout();    //this.mngUsr.logout(this.activeUser.id,this.activeUser.type);
    modifyUser=async (username,body)=>{
        try {
            if(typeof(username)!=='string' || typeof(body.oldType)!=='string' ||
                typeof(body.newType)!=='string') throw 422;
            return this.mngUsr.modifyUser(username,body.oldType,body.newType);
        } catch (error) {
            throw error;
        }
    }
    deleteUser=async(username,type)=>{
        try {
            if(typeof(username)!=='string' || typeof(type)!=='string') throw 422;
            return await this.mngUsr.deleteUser(username,type);
        } catch (error) {
            throw error;
        }
    }
}
module.exports=apiImpl;