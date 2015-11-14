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
var houseCmds =require ('./house-cmd') ;

app.get ('/room/:roomid/:nameid/:cmd', function (req, res) {
	var roomid =req.params.roomid ;
	var nameid =req.params.nameid ;
	var cmd =req.params.cmd ;
	houseCmds.roomShutterCommand (roomid, nameid, cmd, null) ;
	res.end () ;
}) ;

app.get ('/room/:roomid/:cmd', function (req, res) {
	var roomid =req.params.roomid ;
	var cmd =req.params.cmd ;
    houseCmds.roomCentral (roomid, cmd, null) ;
	res.end () ;
}) ;

app.get ('/floor/:floorid/:cmd', function (req, res) {
	var floorid =req.params.floorid ;
	var cmd =req.params.cmd ;
    houseCmds.floorCentral (floorid, cmd, null) ;
	res.end () ;
}) ;

// Sensors
var sensors =require ('./sensors') ;

// IO
var socketIO =require ('./socket-connection') ;

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

app.set ('port', process.env.PORT || 8001) ;

module.exports =app ;
