
'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');


// capture network variables from config.json
// const configPath = path.join(process.cwd(), '/config.json');
// const configJSON = fs.readFileSync(configPath, 'utf8');
// const config = JSON.parse(configJSON);
// let connection_file = config.connection_file;
// let userName = config.userName;
// let gatewayDiscovery = config.gatewayDiscovery;

// // connect to the connection file
// const ccpPath = path.join(process.cwd(), connection_file);
// const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
// const ccp = JSON.parse(ccpJSON);

let userName='user1'
const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'first-network', 'connection-org1.json');
// const ccpJSON = fs.readFileSync(ccp, 'utf8');
// const ccpPath = JSON.parse(ccpJSON);


exports.login = async function(userName, password) {

    var uri = "mongodb+srv://usman:usman123@cluster0-aqivu.gcp.mongodb.net/test?retryWrites=true&w=majority";

    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true });
    client.connect(err => {
    const collection = client.db("fir").collection("users");
    // perform actions on the collection object
    console.log("Inside login " +{ 'userName': userName, 'password': password });
    return collection.findOne({ 'userName': userName, 'password': password },function(err, res) {
        if (err) throw err;
        console.log(res);
    // this.register(res.userName)
        client.close();
        return res;
    }
    );

    
    });


}


exports.register = async function(userName) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (userExists) {
            console.log('An identity for the user "user1" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: userName, role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: userName, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(userName, userIdentity);
        console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "user1": ${error}`);
        process.exit(1);
    }
}

exports.updateFirResult = async function(firId, result) {
    let response = {};
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });



        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fir');


        console.log(firId +  result)
        // Submit the specified transaction.
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('updateFirResult', firId, result);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        response.msg = 'updateFirResult Transaction has been submitted';
        return response;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
};

exports.queryAllFirs = async function() {

    let response = {};
    try {
        console.log('queryAllFirs');

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fir');

        // Evaluate the specified transaction.
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllFirs');
        //console.log('check6');
        //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
};


// Create FIR
exports.createFir = async function(firId, district, policeStationAddress, crimeType, caseSummary, caseDetailedDescription, incidentLocation, 
    registrarDesignation, registrarName, complainantName, complainantCnic, date) {
    let response = {};
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccpPath , { wallet, identity: userName, discovery: gatewayDiscovery });

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fir');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        await contract.submitTransaction('createFir', firId, district, policeStationAddress, crimeType, caseSummary, caseDetailedDescription, incidentLocation, 
        registrarDesignation, registrarName, complainantName, complainantCnic, date);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        response.msg = 'create FIR Transaction has been submitted';
        return response;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
};
    

// Query FIR
exports.queryFir = async function(key) {

    let response = {};
    try {
        console.log('queryFir');

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fir');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: 'querySingleCar('CAR0')'
        console.log(key);
        const result = await contract.evaluateTransaction('queryFir', key);
        //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
};




// // create car transaction
// exports.createCar = async function(key, make, model, color, owner) {
//     let response = {};
//     try {

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), '/wallet');
//         const wallet = new FileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const userExists = await wallet.exists(userName);
//         if (!userExists) {
//             console.log('An identity for the user ' + userName + ' does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
//             return response;
//         }

//         // Create a new gateway for connecting to our peer node.
//         // const gateway = new Gateway();
//         // await gateway.connect(ccpPath , { wallet, identity: userName, discovery: gatewayDiscovery });

//         const gateway = new Gateway();
//         await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('mychannel');

//         // Get the contract from the network.
//         const contract = network.getContract('fabcar');

//         // Submit the specified transaction.
//         // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
//         await contract.submitTransaction('createCar', key, make, model, color, owner);
//         console.log('Transaction has been submitted');

//         // Disconnect from the gateway.
//         await gateway.disconnect();

//         response.msg = 'createCar Transaction has been submitted';
//         return response;

//     } catch (error) {
//         console.error(`Failed to submit transaction: ${error}`);
//         response.error = error.message;
//         return response;
//     }
// };

// // change car owner transaction
// exports.changeCarOwner = async function(key, newOwner) {
//     let response = {};
//     try {

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), '/wallet');
//         const wallet = new FileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const userExists = await wallet.exists(userName);
//         if (!userExists) {
//             console.log('An identity for the user ' + userName + ' does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
//             return response;
//         }

//         // Create a new gateway for connecting to our peer node.
//         // const gateway = new Gateway();
//         // await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

//         const gateway = new Gateway();
//         await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });



//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('mychannel');

//         // Get the contract from the network.
//         const contract = network.getContract('fabcar');

//         // Submit the specified transaction.
//         // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
//         await contract.submitTransaction('changeCarOwner', key, newOwner);
//         console.log('Transaction has been submitted');

//         // Disconnect from the gateway.
//         await gateway.disconnect();

//         response.msg = 'changeCarOwner Transaction has been submitted';
//         return response;

//     } catch (error) {
//         console.error(`Failed to submit transaction: ${error}`);
//         response.error = error.message;
//         return response;
//     }
// };

// // query all cars transaction
// exports.queryAllCars = async function() {

//     let response = {};
//     try {
//         console.log('queryAllCars');

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), '/wallet');
//         const wallet = new FileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const userExists = await wallet.exists(userName);
//         if (!userExists) {
//             console.log('An identity for the user ' + userName + ' does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
//             return response;
//         }

//         // Create a new gateway for connecting to our peer node.
//         // const gateway = new Gateway();
//         // await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

//         const gateway = new Gateway();
//         await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('mychannel');

//         // Get the contract from the network.
//         const contract = network.getContract('fabcar');

//         // Evaluate the specified transaction.
//         // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
//         const result = await contract.evaluateTransaction('queryAllCars');
//         //console.log('check6');
//         //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

//         return result;

//     } catch (error) {
//         console.error(`Failed to evaluate transaction: ${error}`);
//         response.error = error.message;
//         return response;
//     }
// };

// // query the car identified by key
// exports.querySingleCar = async function(key) {

//     let response = {};
//     try {
//         console.log('querySingleCar');

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), '/wallet');
//         const wallet = new FileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const userExists = await wallet.exists(userName);
//         if (!userExists) {
//             console.log('An identity for the user ' + userName + ' does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
//             return response;
//         }

//         // Create a new gateway for connecting to our peer node.
//         // const gateway = new Gateway();
//         // await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

//         const gateway = new Gateway();
//         await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('mychannel');

//         // Get the contract from the network.
//         const contract = network.getContract('fabcar');

//         // Evaluate the specified transaction.
//         // queryCar transaction - requires 1 argument, ex: 'querySingleCar('CAR0')'
//         console.log(key);
//         const result = await contract.evaluateTransaction('querySingleCar', key);
//         //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

//         return result;

//     } catch (error) {
//         console.error(`Failed to evaluate transaction: ${error}`);
//         response.error = error.message;
//         return response;
//     }
// };

