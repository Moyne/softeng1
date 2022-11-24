'use strict';
const express = require('express');
const apiImpl= require('./apiImpl');
// init express
const app = new express();
const port = 3001;
const api=new apiImpl();
app.use(express.json());

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});
//sku apis
app.get('/api/skus',async (req,res)=>{
  try {
    const ret=await api.getSkus();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/skus/:id',async (req,res)=>{
  try {
    const ret=await api.getSkuById(req.params.id);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/sku',async (req,res)=>{
  try {
    await api.addNewSku(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/sku/:id',async (req,res)=>{
  try {
    await api.modifySku(req.params.id,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/sku/:id/position',async (req,res)=>{
  try {
    await api.modifySkuPos(req.params.id,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/skus/:id',async (req,res)=>{
  try {
    await api.deleteSku(req.params.id);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
//position apis
app.get('/api/positions',async (req,res)=>{
  try {
    const ret=await api.getPos();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/position',async (req,res)=>{
  try {
    await api.addNewPos(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/position/:positionID',async (req,res)=>{
  try {
    await api.modifyPos(req.params.positionID,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/position/:positionID/changeID',async (req,res)=>{
  try {
    await api.modifyPosPos(req.params.positionID,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/position/:positionID',async (req,res)=>{
  try {
    await api.deletePos(req.params.positionID);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
//skuitem apis
app.get('/api/skuitems',async (req,res)=>{
  try {
    const ret=await api.getSkuItems();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/skuitems/sku/:id',async (req,res)=>{
  try {
    const ret=await api.getSkuItemsById(req.params.id);
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/skuitems/:rfid',async (req,res)=>{
  try {
    const ret=await api.getSkuItemByRfid(req.params.rfid);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/skuitem',async (req,res)=>{
  try {
    await api.addSkuItem(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/skuitems/:rfid',async (req,res)=>{
  try {
    await api.modifySkuItem(req.params.rfid,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/skuitems/:rfid',async (req,res)=>{
  try {
    await api.deleteSkuItem(req.params.rfid);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
//restock order apis
app.get('/api/restockOrders',async (req,res)=>{
  try {
    const ret=await api.getRestockOrder();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/restockOrdersIssued',async (req,res)=>{
  try {
    const ret=await api.getIssuedRestockOrder();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/restockOrders/:id',async (req,res)=>{
  try {
    const ret=await api.getRestockOrderId(req.params.id);
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/restockOrders/:id/returnItems',async (req,res)=>{
  try {
    const ret=await api.getRetItemsRestOrd(req.params.id);
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/restockOrder',async (req,res)=>{
  try {
    await api.addRestockOrder(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/restockOrder/:id',async (req,res)=>{
  try {
    await api.modifyStateRestOrd(req.params.id,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/restockOrder/:id/skuItems',async (req,res)=>{
  try {
    await api.modifySkuItRestOrd(req.params.id,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/restockOrder/:id/transportNote',async (req,res)=>{
  try {
    await api.modifyTNoteRestOrd(req.params.id,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/restockOrder/:id',async (req,res)=>{
  try {
    await api.deleteRestockOrder(req.params.id);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
//internal orders apis
app.get('/api/internalOrders',async (req,res)=>{
  try {
    const ret=await api.getInternalOrders();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/internalOrdersIssued',async (req,res)=>{
  try {
    const ret=await api.getIssuedInternalOrders();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/internalOrdersAccepted',async (req,res)=>{
  try {
    const ret=await api.getAcceptedInternalOrders();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/internalOrders/:id',async (req,res)=>{
  try {
    const ret=await api.getInternalOrderId(req.params.id);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/internalOrders',async (req,res)=>{
  try {
    await api.addInternalOrder(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/internalOrders/:id',async (req,res)=>{
  try {
    await api.modifyInternalOrder(req.params.id,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/internalOrders/:id',async (req,res)=>{
  try {
    await api.deleteInternalOrder(req.params.id);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
//return order
app.get('/api/returnOrders',async (req,res)=>{
  try {
    const ret=await api.getReturnOrders();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/returnOrders/:id',async (req,res)=>{
  try {
    const ret=await api.getReturnOrderId(req.params.id);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/returnOrder',async (req,res)=>{
  try {
    await api.addReturnOrder(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/returnOrder/:id',async (req,res)=>{
  try {
    await api.deleteReturnOrder(req.params.id);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
//test descriptor apis
app.get('/api/testDescriptors',async (req,res)=>{
  try {
    const ret=await api.getTestDescriptors();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/testDescriptors/:id',async (req,res)=>{
  try {
    const ret=await api.getTestDescId(req.params.id);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/testDescriptor',async (req,res)=>{
  try {
    await api.addTestDescriptor(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/testDescriptor/:id',async (req,res)=>{
  try {
    await api.modifyTestDescriptor(req.params.id,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/testDescriptor/:id',async (req,res)=>{
  try {
    await api.deleteTestDescriptor(req.params.id);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
//test result apis
app.get('/api/skuitems/:rfid/testResults',async (req,res)=>{
  try {
    const ret=await api.getTestResults(req.params.rfid);
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/skuitems/:rfid/testResults/:id',async (req,res)=>{
  try {
    const ret=await api.getTestResultId(req.params.id,req.params.rfid);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/skuitems/testResult',async (req,res)=>{
  try {
    await api.addTestResult(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/skuitems/:rfid/testResult/:id',async (req,res)=>{
  try {
    await api.modifyTestResult(req.params.id,req.params.rfid,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/skuitems/:rfid/testResult/:id',async (req,res)=>{
  try {
    await api.deleteTestResult(req.params.id,req.params.rfid);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
//user apis
app.get('/api/userinfo',async (req,res)=>{
  try {
    const ret=await api.getUserInfo();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/suppliers',async (req,res)=>{
  try {
    const ret=await api.getSuppliers();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/users',async (req,res)=>{
  try {
    const ret=await api.getUsers();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/newUser',async (req,res)=>{
  try {
    await api.newUser(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.post('/api/managerSessions',async (req,res)=>{
  try {
    const ret=await api.managerSession(req.body);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.post('/api/customerSessions',async (req,res)=>{
  try {
    const ret=await api.customerSession(req.body);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.post('/api/supplierSessions',async (req,res)=>{
  try {
    const ret=await api.supplierSession(req.body);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.post('/api/clerkSessions',async (req,res)=>{
  try {
    const ret=await api.clerkSession(req.body);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.post('/api/qualityEmployeeSessions',async (req,res)=>{
  try {
    const ret=await api.qualityEmpSession(req.body);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.post('/api/deliveryEmployeeSessions',async (req,res)=>{
  try {
    const ret=await api.deliveryEmplSession(req.body);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.post('/api/logout',async (req,res)=>{
  try {
    api.logout();
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/users/:username',async (req,res)=>{
  try {
    await api.modifyUser(req.params.username,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/users/:username/:type',async (req,res)=>{
  try {
    await api.deleteUser(req.params.username,req.params.type);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
//items apis
app.get('/api/items',async (req,res)=>{
  try {
    const ret=await api.getItems();
    return res.status(200).json([...ret]);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.get('/api/items/:id/:supplierId',async (req,res)=>{
  try {
    const ret=await api.getItemsById(req.params.id,req.params.supplierId);
    return res.status(200).json(ret);
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(500).json(error);
  }
});

app.post('/api/item',async (req,res)=>{
  try {
    await api.addItem(req.body);
    return res.status(201).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.put('/api/item/:id/:supplierId',async (req,res)=>{
  try {
    await api.modifyItem(req.params.id,req.params.supplierId,req.body);
    return res.status(200).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});

app.delete('/api/items/:id/:supplierId',async (req,res)=>{
  try {
    await api.deleteItem(req.params.id,req.params.supplierId);
    return res.status(204).json();
  } catch (error) {
    if(typeof(error)==='number') return res.status(error).json();
    else return res.status(503).json(error);
  }
});
// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;