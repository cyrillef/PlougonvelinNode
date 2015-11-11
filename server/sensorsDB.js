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
var router =express.Router () ;

// https://www.mongodb.org/dl/win32/x86_64-2008plus-ssl
var mongoose =require ('mongoose') ;

mongoose.connect (
    'mongodb://bbb:hDGbEGf1MoKJUQcw8pZT@ds047524.mongolab.com:47524/plougonvelin',
    //{ 'server': { 'socketOptions': { 'keepAlive': 1 } } },
    function (err) {
        if ( err )
            console.log ('DB connection error: ' + err) ;
    }
) ;

//var db =mongoose.connection ;
var Schema =mongoose.Schema ;
//var ObjectId =Schema.ObjectId ;

var SensorsDataSchema =new Schema ({
    sensorId: { type: String },
    when: { type: Date, default: Date.now },
    what: { type: String, enum: [
        'irTemperature',
        'accelerometer',
        'magnetometer',
        'barometricPressure',
        'gyroscope',
        'io',
        'luxometer',
        'humidity',
        'simpleKey'
    ]},
    values: { type: Object, default: {} }
}) ;

module.exports ={
    'SensorsData': mongoose.model ('SensorsData', SensorsDataSchema)
} ;
