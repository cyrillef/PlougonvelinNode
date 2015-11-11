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
var mqtt =require ('mqtt') ;
var SensorTag =require ('sensortag') ;
var sensorsData =require ('./sensorsDB').SensorsData ;

var periods ={
    'irTemperature': 10 * 1000,
    'accelerometer': 60 * 1000,
    'magnetometer': 60 * 1000,
    'barometricPressure': 60 * 1000,
    'gyroscope': 60 * 1000,
    'io': 60 * 1000,
    'luxometer': 60 * 1000,
    'humidity': 20 * 1000,
    'simpleKey': 60 * 1000
} ;

// Constants
//var u_port ="1883" ;
//var s_port ="8883" ;
//var pub_topic ="iot-2/evt/sample/fmt/json" ;
//var sub_topic ="iot-2/cmd/blink/fmt/json" ;
//var qs_org ="9uztf0" ; //"quickstart" ;
//var reg_domain =".messaging.internetofthings.ibmcloud.com" ;
//var qs_type ="SensorTag" ;
////var ledPath ="/sys/class/leds/beaglebone:green:usr" ;
//var caCerts =[ __dirname + "/server/IoTFoundation.pem", __dirname + "/server/IoTFoundation-CA.pem" ] ;
//
//// globals
//var qs_mode =false ;
//var tls =false ;
//var type =qs_type ;
//var deviceId ="c6716393301a" ;
//var password ="64??Z@4O7x(?27SvRO" ;
//var username ='token' ; //'use-token-auth' ;
//var client =null ;

// Event data object
//var tagData ={} ;
//tagData.d ={} ;
//tagData.d.myName =deviceId ;
//tagData.toJson =function () {
//    return (JSON.stringify (this)) ;
//} ;
//
//tagData.publish =function () {
//    // dont publish unless there is a full set of data
//    // alternative: only enable publish when most sensortag callbacks have fired
//    if ( tagData.d.hasOwnProperty("temp") ) {
//        client.publish (pub_topic, tagData.toJson ()) ;
//        //console.log(pub_topic, tagData.toJson()); // trace
//    }
//} ;
//
//var mqttBluemixSend =function (deviceId, cb) { // connect MQTT client
//    var host =qs_org + reg_domain ;
//    var clientId ="d:" + host + ":" + type + ":" + deviceId ;
//    console.log ('MQTT clientId = ' + clientId) ;
//    if ( qs_mode ) {
//        client =mqtt.createClient (u_port, host, {
//            clientId: clientId,
//            keepalive: 30
//        }) ;
//    } else {
//        if ( tls ) {
//            console.log ("TLS connect: " + host + ":" + s_port) ;
//            client =mqtt.createSecureClient (s_port, host, {
//                clientId: clientId,
//                keepalive: 30,
//                username: username,
//                password: password,
//                rejectUnauthorized: true,
//                ca: caCerts
//            }) ;
//        } else {
//            console.log ("Connect host: " + host + " port " + u_port) ;
//            client =mqtt.createClient (u_port, host, {
//                clientId: clientId,
//                keepalive: 30,
//                username: username,
//                password: password
//            }) ;
//        }
//    }
//    client.on ('connect', function () {
//        // not reliable since event may fire before handler
//        // installed
//        console.log ('MQTT Connected') ;
//        console.log ("Sending data") ;
//        if ( qs_mode ) {
//            console.log ('MAC address = ' + deviceId) ;
//            console.log ('Go to the following link to see your device data;') ;
//            console.log ('http://quickstart.internetofthings.ibmcloud.com/#/device/' + deviceId + '/sensor/') ;
//        }
//    }) ;
//    client.on ('error', function (err) {
//        console.log ('mqtt client error: ' + err) ;
//    }) ;
//    client.on ('close', function() {
//        console.log ('mqtt client closed') ;
//    }) ;
//
//    //if ( !qs_mode ) {
//    //    client.subscribe (sub_topic, { qos: 0 }, function (err, granted) {
//    //        if ( err )
//    //            throw err ;
//    //        console.log ('Subscribed to ' + sub_topic) ;
//    //    }) ;
//    //    client.on ('message', doCommand) ;
//    //}
//
//    if ( cb )
//        cb () ;
//} ;

// https://www.npmjs.com/package/ibmiotf
var Client =require ("ibmiotf").IotfDevice ;
var config ={
    "org": "oqadgn",
    "id": "c6716393301a",
    "type": "SensorTag",
    "auth-method": "token",
    "auth-token": "C1Lq)zE+UH2+tx9Wq?"
} ;
var deviceClient =new Client (config) ;
deviceClient.connect () ;
deviceClient.on ("connect", function () {
    //console.log ("deviceClient connect") ;
}) ;

var newSensorRecord =function (sensorTag, what, values) {
    new sensorsData (
        {
            'sensorId': sensorTag.id,
            //'when': 'use default Date.now definition',
            'what': what,
            'values': values //JSON.stringify (values)
        }
    ).save (function (err, record) {
        if ( err )
            return (console.log ('Mongoose error: ' + err.name)) ;
        //console.log ("New  Record: " + record._doc.sensorId + " - " + record._doc.what) ;
    }) ;
} ;

// https://www.npmjs.com/package/sensortag

SensorTag.discoverAll (function (sensorTag) {
    console.log ('new Sensor found ' + sensorTag.id + ' / ' + sensorTag.type) ;
    //mqttBluemixSend (sensorTag.id, null) ;
    sensorTag.connectAndSetUp (function (error) {
        if ( error )
            return (console.log ('Err: Sensor connect error with' + sensorTag.id)) ;
        sensorTag.readDeviceName (function (error, deviceName) {
            if ( error )
                return (console.log ('Err: Sensor has no name (' + error + ')')) ;
            console.log ('Sensor[' + sensorTag.id + '] = ' + deviceName) ;
            //tagData.d.myName =deviceName ;
        }) ;

        // IR Temperature Sensor
        sensorTag.enableIrTemperature (function (error) {}) ; // disableIrTemperature
        sensorTag.setIrTemperaturePeriod (periods.irTemperature, function (error) {}) ;
        //sensorTag.readIrTemperature (function (error, objectTemperature, ambientTemperature) {}) ;
        sensorTag.notifyIrTemperature (function (error) {}) ; // unnotifyIrTemperature
        sensorTag.on ('irTemperatureChange', function (objectTemperature, ambientTemperature) {
            //console.log ('irTemperatureChange ' + objectTemperature + ' / ' + ambientTemperature) ;
            newSensorRecord (
                sensorTag, 'irTemperature',
                { 'objectTemperature': objectTemperature, 'ambientTemperature': ambientTemperature }
            ) ;
            //tagData.d.objectTemp =parseFloat (objectTemperature.toFixed (1)) ;
            //tagData.d.ambientTemp =parseFloat (ambientTemperature.toFixed (1)) ;
            //tagData.publish () ;
            if ( deviceClient.isConnected )
                deviceClient.publish ("status", "json", '{"d" : { "objectTemperature" : ' + objectTemperature + ', "ambientTemperature" : ' + ambientTemperature + ' }}') ;
        }) ;

        // Accelerometer
        // Gyroscope

        // Humidity Sensor
        sensorTag.enableHumidity (function (error) {}) ;
        sensorTag.setHumidityPeriod (periods.humidity, function (error) {}) ;
        //sensorTag.readHumidity (function (error, temperature, humidity) {}) ;
        sensorTag.notifyHumidity (function (error) {}) ;
        sensorTag.on ('humidityChange', function (temperature, humidity) {
            //console.log ('humidityChange ' + temperature + ' / ' + humidity) ;
            newSensorRecord (
                sensorTag, 'humidity',
                { 'temperature': temperature, 'humidity': humidity }
            ) ;
            //tagData.d.humidity =parseFloat (humidity.toFixed (1)) ;
            //tagData.d.temp =parseFloat (temperature.toFixed (1)) ;
            //tagData.publish () ;
            if ( deviceClient.isConnected )
                deviceClient.publish ("status", "json", '{"d" : { "temperature" : ' + temperature + ', "humidity" : ' + humidity + ' }}') ;
        }) ;

        // Magnetometer
        // Barometric Pressure Sensor
        // Luxometer (CC2650 only)
        // IO
        // Simple Key
    }) ;
}) ;

module.exports ={} ;

// Additional lectures:
// https://www.compose.io/articles/building-mongodb-into-your-internet-of-things-a-tutorial/

// Organization ID oqadgn
// Device Type SensorTag
// Device ID c6716393301a
// Authentication Method token
// Authentication Token C1Lq)zE+UH2+tx9Wq?