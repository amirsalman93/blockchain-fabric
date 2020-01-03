'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.post('/login', (req, res) => {
    
    console.log(req.body.userName+ req.body.password)
    network.login(req.body.userName, req.body.password)

        .then((response) => {
            console.log(response);
            res.send(response);
        });
});


app.get('/queryFir', (req, res) => {
    network.queryFir()
        .then((response) => {
            let carsRecord = JSON.parse(response);
            res.send(carsRecord);
        });
});

app.get('/queryAllFirs', (req, res) => {
    network.queryAllFirs()
        .then((response) => {
            let carsRecord = JSON.parse(response);
            res.send(carsRecord);
        });
});

// app.get('/querySingleCar', (req, res) => {
//     console.log(req.query.key);
//     network.querySingleCar(req.query.key)
//         .then((response) => {
//             let carsRecord = JSON.parse(response);
//             res.send(carsRecord);
//         });
// });

app.post('/createFir', (req, res) => {
    console.log(req.body);
    network.queryAllFirs()
        .then((response) => {
            console.log(response);
            let carsRecord = JSON.parse(response);
            let numCars = carsRecord.length+1;
            let firId = numCars+"";
            network.createFir(firId, req.body.district, req.body.policeStationAddress, req.body.crimeType, req.body.caseSummary, req.body.caseDetailedDescription, req.body.incidentLocation, 
                req.body.registrarDesignation, req.body.registrarName, req.body.complainantName, req.body.complainantCnic, req.body.date)
                .then((response) => {
                    res.send(response);
                });
        });
});

app.post('/updateFirResult', (req, res) => {
    
    console.log(req.body.firId+ req.body.result)
    network.updateFirResult(req.body.firId, req.body.result)

        .then((response) => {
            res.send(response);
        });
});

app.listen(process.env.PORT || 8081);