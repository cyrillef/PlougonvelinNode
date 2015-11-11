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
var request =require ('request') ;
var bodyParser =require ('body-parser') ;
var favicon =require ('serve-favicon') ;
var async =require ('async') ;
var io =require ('socket.io-client') ;
var boneimpl =require ('./boneimpl') ;

// http://garann.github.io/template-chooser/
var app =express () ;
app.use (bodyParser.urlencoded ({ extended: false })) ;
app.use (bodyParser.json ()) ;
//app.use (logger ('dev')) ;
app.use (favicon (__dirname + '/../www/favicon.ico')) ;
app.use (express.static (__dirname + '/../www')) ;
app.set ('view engine', 'ejs') ;
app.use ('/', require ('./pages')) ;
//app.use (require ('./errors')) ;

//- Commands
var housedef =require ('./house-def') ;

var shutterCommand =function (shutter, cmd, cb) {
	var pin =shutter [cmd === 'half' ? 'close' : cmd] ;
	if ( pin === undefined || pin === '' ) {
		if ( cb )
			cb (shutter) ;
		return ;
	}
	//console.log (cmd + ' "' + pin + '"') ;
	var repeat =(cmd === 'half' ? 2 : 1) ;
	boneimpl.triggerShutter (pin, repeat, cb) ;
} ;

var roomShutterCommand =function (roomid, nameid, cmd, cb) {
	var room =housedef.roomNameFromId (roomid) ;
	var shutters =housedef.rooms () [room] ;
	//var name =housedef.roomCmdFromId (room, nameid) [1] ;
	//var results =shutters.filter (function (shutter) { return (shutter.name == name) ; }) ;
	//shutterCommand (results [0], cmd, cb) ;
	var index =housedef.roomCmdFromId (room, nameid) [0] ;
	var shutter =shutters [index] ;
	shutterCommand (shutter, cmd, cb) ;
} ;

app.get ('/room/:roomid/:nameid/:cmd', function (req, res) {
	var roomid =req.params.roomid ;
	var nameid =req.params.nameid ;
	var cmd =req.params.cmd ;
	roomShutterCommand (roomid, nameid, cmd, null) ;
	res.end () ;
}) ;

var roomCentral =function (roomid, cmd, cb) {
	var room =housedef.roomNameFromId (roomid) ;
	var shutters =housedef.rooms () [room] || [] ;
	//for ( var i =0 ; i < shutters.length ; i++ )
	//	shutterCommand (shutters [i], cmd, cb) ;
	var count =0 ;
	async.whilst (
		function () { return (count < shutters.length) ; },
		function (callback) {
			shutterCommand (shutters [count++], cmd, function (shutter) {
				callback ()
			}) ;
		},
		function (err) {
			if ( cb )
				cb (room) ;
		}
	) ;
} ;

app.get ('/room/:roomid/:cmd', function (req, res) {
	var roomid =req.params.roomid ;
	var cmd =req.params.cmd ;
	roomCentral (roomid, cmd, null) ;
	res.end () ;
}) ;

var floorCentral =function (floorid, cmd, cb) {
	var floor =housedef.floorNameFromId (floorid) ;
	var rooms =housedef.floors () [floor] || [] ;
	//for ( var i =0 ; i < rooms.length ; i++ )
	//	roomCentral (rooms [i], cmd, cb) ;
	var count =0 ;
	async.whilst (
		function () { return (count < rooms.length) ; },
		function (callback) {
			var roomid =rooms [count++].replace (/\W/g, '') ;
			roomCentral (roomid, cmd, function (room) {
				callback ()
			}) ;
		},
		function (err) {
			if ( cb )
				cb (floor) ;
		}
	) ;
} ;

app.get ('/floor/:floorid/:cmd', function (req, res) {
	var floorid =req.params.floorid ;
	var cmd =req.params.cmd ;
	floorCentral (floorid, cmd, null) ;
	res.end () ;
}) ;

//- IO
var io =require ('socket.io-client') ;
var socket =io.connect ('http://localhost:8002', { reconnect: true }) ;

socket.on ('connect', function () {
	console.log ('bbb gain connection with heroku') ;
	var defs ={
		'DigitalPins': housedef.DigitalPins (),
		'floors': housedef.floors (),
		'rooms': housedef.rooms ()
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
	roomShutterCommand (data.roomid, data.nameid, data.cmd, function (ret) {
		socket.emit ('roomShutterCommandCompleted', data) ;
	}) ;
}) ;

socket.on ('roomCentral', function (data) {
	console.log ('roomCentral') ;
	roomCentral (data.roomid, data.cmd, function (ret) {
		socket.emit ('roomCentralCompleted', data) ;
	}) ;
}) ;

socket.on ('floorCentral', function (data) {
	console.log ('floorCentral') ;
	floorCentral (data.floorid, data.cmd, function (ret) {
		socket.emit ('floorCentralCompleted', data) ;
	}) ;
}) ;

// Sensors
var sensors =require ('./sensors') ;

//- Setup
app.post ('/setup/create', function (req, res) {
	var data =req.body ; // room, roomid, name, nameid, option, prefix
	housedef.roomCreate (data, function (err, result) {
		if ( err )
			return (res.status (500).end ()) ;
		res.json (result) ;
	}) ;
}) ;

app.post ('/setup/assign', function (req, res) {
	var data =req.body ; // id=rooid-nameid-shutter-cmd, pin
	housedef.roomAssign (data, function (err, result) {
		if ( err )
			return (res.status (500).end ()) ;
		res.json (result) ;
	}) ;
}) ;

app.get ('/setup/test', function (req, res) {
	var pin =req.query.pin ;
	boneimpl.triggerShutter (pin, 1, null) ;
	res.end () ;
}) ;

// Scenario
var scenario =require ('./scenario') ;
var activeScenario =new scenario () ;
//activeScenario.setMode ('Ete') ;

app.get ('/scenario/:name', function (req, res) {
	var name =req.params.name ;
	console.log ('Scenario ' + name + ' active') ;
	activeScenario.setMode (name) ;
	res.end () ;
}) ;

app.set ('port', /*process.env.PORT ||*/ 8001) ;

module.exports =app ;
