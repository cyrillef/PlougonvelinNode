//
// Copyright (c) Cyrille Fauvel, Inc. All rights reserved
//
// Node.js server workflow
// by Cyrille Fauvel
// September 2015
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// Cyrille Fauvel PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// Cyrille Fauvel SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  Cyrille Fauvel
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
//
var express =require ('express') ;

// https://9uztf0.internetofthings.ibmcloud.com/dashboard/#/overview
var iot ={
    "iotf-service": [
        {
            "name": "SensorTag",
            "label": "iotf-service",
            "plan": "iotf-service-free",
            "credentials": {
                "iotCredentialsIdentifier": "a2g6k39sl6r5",
                "mqtt_host": "9uztf0.messaging.internetofthings.ibmcloud.com",
                "mqtt_u_port": 1883,
                "mqtt_s_port": 8883,
                "base_uri": "https://9uztf0.internetofthings.ibmcloud.com:443/api/v0001",
                "http_host": "9uztf0.internetofthings.ibmcloud.com",
                "org": "9uztf0",
                "apiKey": "a-9uztf0-kqbkmvltoy",
                "apiToken": "Xz0M1z1)Rry0t-_*Tx"
            }
        }
    ],
    "cloudantNoSQLDB": [
        {
            "name": "Plougonvelin-cloudantNoSQLDB",
            "label": "cloudantNoSQLDB",
            "plan": "Shared",
            "credentials": {
                "username": "a67bd5ff-4027-4c8d-8417-e12e7a639771-bluemix",
                "password": "fe7cde24815fd51ca01a665879199f7f24c8081d890b69b1f5a2822c8744d1a7",
                "host": "a67bd5ff-4027-4c8d-8417-e12e7a639771-bluemix.cloudant.com",
                "port": 443,
                "url": "https://a67bd5ff-4027-4c8d-8417-e12e7a639771-bluemix:fe7cde24815fd51ca01a665879199f7f24c8081d890b69b1f5a2822c8744d1a7@a67bd5ff-4027-4c8d-8417-e12e7a639771-bluemix.cloudant.com"
            }
        }
    ]
} ;

//var apikey =myapikey ;
//var apitoken =myapitoken ;

module.exports ={

} ;