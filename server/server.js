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
//var logger =require ('morgan') ;
var async =require ('async') ;
//var bonescript =require ('bonescript') ;

// http://garann.github.io/template-chooser/
var app =express () ;
app.use (bodyParser.urlencoded ({ extended: false })) ;
app.use (bodyParser.json ()) ;
//app.use (logger ('dev')) ;
//app.use (favicon (__dirname + '/../www/favicon.ico')) ;
app.use (express.static (__dirname + '/../www')) ;
app.set ('view engine', 'ejs') ;
app.use ('/', require ('./pages')) ;
//app.use (require ('./errors')) ;

//- Commands
var housedef =require ('./house-def') ;

triggerVolet =function (volet, repeat, cb) {
	//bonescript.digitalWrite (volet, bonescript.LOW, function (pinR) {
	//	setTimeout (
	//		function () {
	//			bonescript.digitalWrite (volet, bonescript.HIGH, function (pinR) {
	//				if ( repeat > 1 )
	//					setTimeout (function () {
	//						triggerVolet (volet, repeat - 1, cb) ;
	//					}, 50) ;
	//				else if ( cb )
	//					cb (volet) ;
	//			}) ;
	//		},
	//		100
	//	) ;
	//}) ;
} ;

voletCommand =function (voletid, cmd, cb) {
	var pin =housedef.cmds [voletid].pins [cmd] ;
	var repeat =1 ;
	if ( pin.constructor === Array ) {
		repeat =pin [1] ;
		pin =pin [0] ;
	}
	triggerVolet (pin, repeat, cb) ;
} ;

roomVoletCommand =function (room, name, cmd, cb) {
	var volets =housedef.rooms [room] ;
	var results =volets.filter (function (volet) {
		return (housedef.cmds [volet].name == name) ;
	}) ;
	voletCommand (results [0], cmd, cb) ;
} ;

app.get ('/volet/:voletid/:cmd', function (req, res) {
	var voletid =req.params.voletid ;
	var cmd =parseInt (req.params.cmd) ;
	voletCommand (voletid, cmd, null) ;
	res.end () ;
}) ;

app.get ('/volet/:room/:name/:cmd', function (req, res) {
	var room =req.params.room ;
	var name =req.params.name ;
	var cmd =parseInt (req.params.cmd) ;
	roomVoletCommand (room, name, cmd, null) ;
	res.end () ;
}) ;

roomCentral =function (room, cmd, cb) {
	var volets =housedef.rooms [room] ;
	//for ( var i =0 ; i < volets.length ; i++ )
	//	voletCommand (volets [i], cmd, cb) ;
	var count =0 ;
	async.whilst (
		function () { return (count < volets.length) ; },
		function (callback) {
			voletCommand (volets [count++], cmd, function (volet) {
				callback ()
			}) ;
		},
		function (err) {
			if ( cb )
				cb (room) ;
		}
	) ;
} ;

app.get ('/room/:room/:cmd', function (req, res) {
	var room =req.params.room ;
	var cmd =parseInt (req.params.cmd) ;
	roomCentral (room, cmd, null) ;
	res.end () ;
}) ;

floorCentral =function (floor, cmd, cb) {
	var rooms =housedef.floors [floor] ;
	//for ( var i =0 ; i < rooms.length ; i++ )
	//	roomCentral (rooms [i], cmd, cb) ;
	var count =0 ;
	async.whilst (
		function () { return (count < rooms.length) ; },
		function (callback) {
			roomCentral (rooms [count++], cmd, function (room) {
				callback ()
			}) ;
		},
		function (err) {
			if ( cb )
				cb (floor) ;
		}
	) ;
} ;

app.get ('/floor/:floor/:cmd', function (req, res) {
	var floor =req.params.floor ;
	var cmd =parseInt (req.params.cmd) ;
	floorCentral (floor, cmd, null) ;
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
