# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration and API Test Report](#integration-and-api-test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Integration Tests](#integration-tests)
  - [Step 1](#step-1)
  - [Step 2](#step-2)
  - [Step n](#step-n)
- [API testing - Scenarios](#api-testing---scenarios)
  - [Scenario UCx.y](#scenario-ucxy)
- [Coverage of Scenarios and FR](#coverage-of-scenarios-and-fr)
- [Coverage of Non Functional Requirements](#coverage-of-non-functional-requirements)
    - [](#)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     <report the here the dependency graph of the classes in EzWH, using plantuml or other tool>
![Dependancy graph](./Images/Testing/dependencyGraph.png "Dependency graph")
     
# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence
    (ex: step1: class A, step 2: class A+B, step 3: class A+B+C, etc)> 
    <Some steps may  correspond to unit testing (ex step1 in ex above), presented in other document UnitTestReport.md>
    <One step will  correspond to API testing>

We decided to follow a bottom up approach starting to do unit testing on our DAO classes and then goin up in the dependency graph continuing to do integration testing for each class


#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1
| Classes  | mock up used |Jest test cases |
|--|--|--|
|sku , skuitem, position, item,internalOrder, testDescriptor, testResult, users, restockOrder, returnOrder|no mock up used, used a stub called testingDb.sqlite|sku.test.js, skuitem.test.js, position.test.js, item.test.js, internalOrder.test.js,testDescriptor.test.js, testResult.test.js, users.test.js, restockOrder.test.js, returnOrder.test.js|


## Step 2
| Classes  | mock up used |Jest test cases |
|--|--|--|
|manageWarehouse manageOrders manageTests manageUsers|mock up used for every class in modules except db class|manageWh.test.js manageOrders.test.js manageTest.test.js manageUser.test.js|


## Step n 

   
| Classes  | mock up used |Jest test cases |
|--|--|--|
|apiImpl|mock up used for manageWarehouse manageOrders manageTests manageUsers and db classes| apiImpl.test.js|




# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>

## Scenario UCx.y

| Scenario |  name |
| ------------- |:-------------:| 
|  Precondition     |  |
|  Post condition     |   |
| Step#        | Description  |
|  1     |  ... |  
|  2     |  ... |



# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test




| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
|  1-1         | FR2.1            |  skuApis.js        |             
|  1-2         | FR2.1 FR3.1.3  FR2.4    |  skuApis.js  |             
| 1-3         | FR2.1 FR2.4 FR3.1.1 | skuApis.js        |             
| 2-1   | FR3.1.1    | posApis.js          |             
| 2-2  | FR3.1.1 FR3.1.3 FR2.1  | posApis.js |             
| 2-3   | FR3.1.3 FR3.1.4        | posApis.js   |
| 2-4   | FR3.1.1 FR3.1.3 FR2.1 | posApis.js     |
| 2-5   | FR3.1.2 FR2.1     | posApis.js |
| 3-1  | FR5.1 FR5.2 FR5.3 FR5.4 FR5.5 FR5.6       | issRsOrdApis.js  | 
| 3-2  | FR5.1 FR5.2 FR5.3 FR5.4 FR5.5 FR5.6       | issRsOrdApis.js  |            
| 4-1  | FR4.1 FR1.1   | userApis.js |
| 4-2  | FR4.1 FR1.1    | userApis.js |
| 4-3   | FR4.2 FR1.2   | userApis.js |
| 5-1-1  | FR5.7 FR5.8 FR5.8.1 FR5.8.3    | RsOrdApis.js            |
| 5-2-1 |  FR5.8.2    FR5.7                |  RsOrdApis.js           |
| 5-2-2         |   FR5.8.2 FR5.7               |RsOrdApis.js|
| 5-2-3         |   FR5.8.2 FR5.7                 |    RsOrdApis.js         |
| 5-3-1         |     FR5.7 FR5.8.3               |    RsOrdApis.js         |
| 5-3-2         |     FR5.7               |     RsOrdApis.js        |
| 5-3-3         |       FR5.7 FR5.8.3             |      RsOrdApis.js       |
| 6-1 | FR5.9 FR5.10 FR5.11 |   retOrdApis.js        |
| 6-2  | FR5.9 FR5.10 FR5.11 | retOrdApis.js           |
| 7-1  | FR1.5  | userApis.js  |
| 7-2   | FR1.5  | userApis.js  |
| 9-1 | FR2.3 FR2.4 FR2.1 FR6.1 FR6.2 FR6.3 FR6.4 FR6.5 FR.6.6 FR6.7 FR3.1.4|  intOrdApis.js |
| 9-2 |FR2.3 FR2.4 FR2.1 FR6.1 FR6.2 FR6.3 FR6.4 FR6.5 FR.6.6 FR6.7 FR3.1.4 | intOrdApis.js  |
| 9-3 |FR2.3 FR2.4 FR2.1 FR6.1 FR6.2 FR6.3 FR6.4 FR6.5 FR.6.6 FR6.7 FR3.1.4 | intOrdApis.js  |
| 10-1|FR2.3 FR2.4 FR2.1 FR6.7 FR6.8 FR3.1.4 FR6.10 FR6.9 | intOrdApis.js   |
| 11-1         |   FR7       |  itemApis.js |
| 11-2         | FR7        |  itemApis.js    |
| 12-1         |  FR3.2.1|  tstDescApis.js|
| 12-2         |  FR3.2.2  | tstDescApis.js |
| 12-3         |  FR3.2.3   |tstDescApis.js |


# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
| NFR2 | Every test |
| NFR4 | posApis.js skuApis.js |
| NFR5 | skuApis.js |
| NFR6 | rsOrdApis.js intOrdApis.js retOrdApis.js |
| NFR9 | intOrdApis.js issRsOrdApis.js | 

