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
var io =require ('socket.io-client') ;
var housedef =require ('./house-def') ;
var houseCmds =require ('./house-cmd') ;

//var socket =io.connect ('http://localhost:8002', { reconnect: true }) ;
var socket =io.connect ('https://plougonvelin.herokuapp.com', { reconnect: true }) ;

socket.on ('connect', function () {
    console.log ('bbb gain connection with heroku') ;
    var defs ={
        'DigitalPins': housedef.DigitalPins (),
        'floors': housedef.floors (),
        'rooms': housedef.rooms (),
        'viewer': housedef.viewer (),
        'sensors': housedef.sensors (),
		'cameras': housedef.cameras ()
    } ;
    socket.emit ('definitions', defs) ;
}) ;

socket.on ('disconnect', function () { // Since we are auto-reconnect, we're ok :)
    console.log ('bbb lost connection to heroku') ;
}) ;

socket.on ('refresh', function (data) { // Should not be called in theory
    console.log ('refresh') ;
}) ;

socket.on ('roomShutterCommand', function (data) {
    console.log ('roomShutterCommand') ;
    houseCmds.roomShutterCommand (data.roomid, data.nameid, data.cmd, function (ret) {
        socket.emit ('roomShutterCommandCompleted', data) ;
    }) ;
}) ;

socket.on ('roomCentral', function (data) {
    console.log ('roomCentral') ;
    houseCmds.roomCentral (data.roomid, data.cmd, function (ret) {
        socket.emit ('roomCentralCompleted', data) ;
    }) ;
}) ;

socket.on ('floorCentral', function (data) {
    console.log ('floorCentral') ;
    houseCmds.floorCentral (data.floorid, data.cmd, function (ret) {
        socket.emit ('floorCentralCompleted', data) ;
    }) ;
}) ;

module.exports =socket ;
