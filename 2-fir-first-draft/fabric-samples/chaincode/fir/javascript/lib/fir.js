// /*
//  * SPDX-License-Identifier: Apache-2.0
//  */

// 'use strict';

// const { Contract } = require('fabric-contract-api');

// class Fir extends Contract {

//     async initLedger(ctx) {
//         console.info('============= START : Initialize Ledger ===========');
//         const cars = [
//             {
//                 color: 'blue',
//                 make: 'Toyota',
//                 model: 'Prius',
//                 owner: 'Tomoko',
//             },
//             {
//                 color: 'red',
//                 make: 'Ford',
//                 model: 'Mustang',
//                 owner: 'Brad',
//             },
//             {
//                 color: 'green',
//                 make: 'Hyundai',
//                 model: 'Tucson',
//                 owner: 'Jin Soo',
//             },
//             {
//                 color: 'yellow',
//                 make: 'Volkswagen',
//                 model: 'Passat',
//                 owner: 'Max',
//             },
//             {
//                 color: 'black',
//                 make: 'Tesla',
//                 model: 'S',
//                 owner: 'Adriana',
//             },
//             {
//                 color: 'purple',
//                 make: 'Peugeot',
//                 model: '205',
//                 owner: 'Michel',
//             },
//             {
//                 color: 'white',
//                 make: 'Chery',
//                 model: 'S22L',
//                 owner: 'Aarav',
//             },
//             {
//                 color: 'violet',
//                 make: 'Fiat',
//                 model: 'Punto',
//                 owner: 'Pari',
//             },
//             {
//                 color: 'indigo',
//                 make: 'Tata',
//                 model: 'Nano',
//                 owner: 'Valeria',
//             },
//             {
//                 color: 'brown',
//                 make: 'Holden',
//                 model: 'Barina',
//                 owner: 'Shotaro',
//             },
//         ];

//         for (let i = 0; i < cars.length; i++) {
//             cars[i].docType = 'car';
//             await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
//             console.info('Added <--> ', cars[i]);
//         }
//         console.info('============= END : Initialize Ledger ===========');
//     }

//     async queryCar(ctx, carNumber) {
//         const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
//         if (!carAsBytes || carAsBytes.length === 0) {
//             throw new Error(`${carNumber} does not exist`);
//         }
//         console.log(carAsBytes.toString());
//         return carAsBytes.toString();
//     }

//     async createCar(ctx, carNumber, make, model, color, owner) {
//         console.info('============= START : Create Car ===========');

//         const car = {
//             color,
//             docType: 'car',
//             make,
//             model,
//             owner,
//         };

//         await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
//         console.info('============= END : Create Car ===========');
//     }

//     async queryAllCars(ctx) {
//         const startKey = 'CAR0';
//         const endKey = 'CAR999';

//         const iterator = await ctx.stub.getStateByRange(startKey, endKey);

//         const allResults = [];
//         while (true) {
//             const res = await iterator.next();

//             if (res.value && res.value.value.toString()) {
//                 console.log(res.value.value.toString('utf8'));

//                 const Key = res.value.key;
//                 let Record;
//                 try {
//                     Record = JSON.parse(res.value.value.toString('utf8'));
//                 } catch (err) {
//                     console.log(err);
//                     Record = res.value.value.toString('utf8');
//                 }
//                 allResults.push({ Key, Record });
//             }
//             if (res.done) {
//                 console.log('end of data');
//                 await iterator.close();
//                 console.info(allResults);
//                 return JSON.stringify(allResults);
//             }
//         }
//     }

//     async changeCarOwner(ctx, carNumber, newOwner) {
//         console.info('============= START : changeCarOwner ===========');

//         const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
//         if (!carAsBytes || carAsBytes.length === 0) {
//             throw new Error(`${carNumber} does not exist`);
//         }
//         const car = JSON.parse(carAsBytes.toString());
//         car.owner = newOwner;

//         await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
//         console.info('============= END : changeCarOwner ===========');
//     }

// }

// module.exports = Fir;




/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');


class Fir extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryFir(ctx, firId) {
        const firAsBytes = await ctx.stub.getState(firId); // get the fir from chaincode state
        if (!firAsBytes || firAsBytes.length === 0) {
            throw new Error(`${firId} does not exist`);
        }
        console.log(firAsBytes.toString());
        return firAsBytes.toString();
    }

    async createFir(ctx, firId, district, policeStationAddress, crimeType, caseSummary, caseDetailedDescription, incidentLocation, 
        registrarDesignation, registrarName, complainantName, complainantCnic, date) {
    
        var resultSummary = 'Pending';
        // if (typeof firId == 'number' && firId > 0 && firId < 999999)
        // {
        //     console.info('Invalid Fir Id. Cannot Create Fir.');
        // }
        // else
        {
            console.info('============= START : Create Fir ===========');

            const fir = {
                district,
                policeStationAddress,
                crimeType,
                caseSummary,
                caseDetailedDescription,
                incidentLocation,
                registrarDesignation,
                registrarName,
                complainantName,
                complainantCnic,
                date,
                resultSummary
            };

            await ctx.stub.putState(firId, Buffer.from(JSON.stringify(fir)));
        }
        console.info('============= END : Create Fir ===========');
    }

    async queryAllFirs(ctx) {
        const startKey = '1';
        const endKey = '999999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async updateFirResult(ctx, firId, result) {
        console.info('============= START : updateFirResult ===========');

        const firAsBytes = await ctx.stub.getState(firId); // get the fir from chaincode state
        if (!firAsBytes || firAsBytes.length === 0) {
            throw new Error(`${firId} does not exist`);
        }
        const fir = JSON.parse(firAsBytes.toString());
        if (fir.resultSummary.toString('utf8') == 'Pending')
        {
            fir.resultSummary = result;
            console.log('Updating FIR.');    
            await ctx.stub.putState(firId, Buffer.from(JSON.stringify(fir)));
            console.log('FIR updated successfully.');    
        }
        else
        {
            console.log('FIR Update Request Denied.');
            throw new Error(`${firId} already update to date.`);
        }

        console.info('============= END : updateFirResult ===========');
    }

    async getFirBycomplainantName(ctx, name) {
        const startKey = '0';
        const endKey = '999999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        
        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                    console.log(Record.complainantName);
                    if(Record.complainantName.toString('utf8') == name.toString('utf8'))
                    {
                        allResults.push({ Key, Record });
                    }
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = Fir;