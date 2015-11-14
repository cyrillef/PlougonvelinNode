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
var fs =require ('fs') ;
var boneimpl =require ('./boneimpl') ;

var floors ={}, rooms ={}, viewer ={}, sensors ={}, cameras ={} ;
// rooms {
// 	"Bureau": [
//		{ type: 'shutter', open: 'pin', close: 'pin', name: 'name' }
//		{ type: 'light', switch: 'pin', name: 'name' }
// 	]
// }

var init =function () {
	fs.readFile ('./data/floors.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read floors definition file')) ;
		floors =JSON.parse (data) ;
		var rooms2 =Object.keys (floors).map (function (k) { return (floors [k]) ; }) ;
		rooms2 =[].concat.apply ([], [].concat.apply ([], rooms2)) ;
		rooms2 =rooms2.filter (function (item, i, ar) { return (ar.indexOf (item) === i) ; }) ;
		rooms =rooms2.reduce (function (previousValue, value, index) { previousValue [value] =[] ; return (previousValue) ; }, {}) ;

		for ( var room in rooms ) {
			var roomLoad =function (roomName) {
				var roomid =roomName.replace (/\W/g, '') ;
				fs.readFile (
					'./data/' + roomid + '.json',
					function (err, buffer) {
						if ( err )
							return ;
						rooms [roomName] =JSON.parse (buffer) ;
					}) ;
			} ;
			roomLoad (room) ;
		}
	}) ;

    fs.readFile ('./data/viewer.json', function (err, data) {
        if ( err )
            return (console.log ('Cannot read viewer definition file')) ;
        viewer =JSON.parse (data) ;
    }) ;

    fs.readFile ('./data/sensors.json', function (err, data) {
        if ( err )
            return (console.log ('Cannot read sensors definition file')) ;
        sensors =JSON.parse (data) ;
    }) ;

	fs.readFile ('./data/cameras.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read cameras definition file')) ;
		cameras =JSON.parse (data) ;
	}) ;

} ;
init () ;

var roomCreate =function (data, cb) {
	// rooms {
	// 	"Bureau": [
	//		{ type: 'shutter', open: 'pin', close: 'pin', name: 'name' }
	//		{ type: 'light', switch: 'pin', name: 'name' }
	// 	]
	// }
	var cmd ={ 'type': 'shutter', 'open': '', 'close': '', 'name': data.name } ;
	rooms [data.room].push (cmd) ;
	if ( data.roomid === undefined )
		data.roomid =data.room.replace (/\W/g, '') ;
	fs.writeFile (
		'./data/' + data.roomid + '.json',
		JSON.stringify (rooms [data.room]),
		function (err) {
			if ( cb )
				cb (err, cmd) ;
		}
	) ;
} ;

var roomAssign =function (data, cb) {
	// rooms {
	// 	"Bureau": [
	//		{ type: 'shutter', open: 'pin', close: 'pin', name: 'name' }
	//		{ type: 'light', switch: 'pin', name: 'name' }
	// 	]
	// }
	var ids =data.id.split ('-') ;
	//var keys =Object.keys (rooms) ;
	//var keysid =keys.map (function (elt) { return (elt.replace (/\W/g, '')) ; }) ;
	//var room =keys [keysid.indexOf (ids [0])] ;
	var room =roomNameFromId (ids [0]) ;

	//var names =rooms [room].map (function (elt) { return (elt.name) ; }) ;
	//var namesid =names.map (function (elt) { return (elt.replace (/\W/g, '')) ; }) ;
	//var index =namesid.indexOf (ids [1]) ;
	//var name =names [index] ;
	var index =roomCmdFromId (room, ids [1]) [0] ;

	rooms [room] [index] [ids [3]] =data.pin ;

	fs.writeFile (
		'./data/' + ids [0] + '.json',
		JSON.stringify (rooms [room]),
		function (err) {
			if ( cb )
				cb (err, rooms [room] [index]) ;
		}
	) ;
} ;

var roomCmdFromId =function (room, id) {
	var names =rooms [room].map (function (elt) { return (elt.name) ; }) ;
	var namesid =names.map (function (elt) { return (elt.replace (/\W/g, '')) ; }) ;
	var index =namesid.indexOf (id) ;
	return ([ index, names [index] ]) ;
} ;

var roomNameFromId =function (id) {
	var keys =Object.keys (rooms) ;
	var keysid =keys.map (function (elt) { return (elt.replace (/\W/g, '')) ; }) ;
	return (keys [keysid.indexOf (id)]) ;
} ;

var floorNameFromId =function (id) {
	var keys =Object.keys (floors) ;
	var keysid =keys.map (function (elt) { return (elt.replace (/\W/g, '')) ; }) ;
	return (keys [keysid.indexOf (id)]) ;
} ;

module.exports ={
	'DigitalPins': boneimpl.DigitalPins,
	'floors': function () { return (floors) ; },
	'rooms': function () { return (rooms) ; },
    'viewer': function () { return (viewer) ; },
    'sensors': function () { return (sensors) ; },
	'cameras': function () { return (cameras) ; },

	'roomCreate': roomCreate,
	'roomAssign': roomAssign,
	'floorNameFromId': floorNameFromId,
	'roomNameFromId': roomNameFromId,
	'roomCmdFromId': roomCmdFromId
} ;
