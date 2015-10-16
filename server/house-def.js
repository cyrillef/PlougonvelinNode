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
//var bonescript =require ('bonescript') ;
var fs =require ('fs') ;

var LEDs =[], AnalogPins =[], DigitalPins =[] ;
var floors ={}, rooms ={}, cmds ={} ;
//var cmds ={ v1: { pins: [ 'P8_8', 'P8_7', [ 'P8_8', 2 ] ], name: 'Nord' }, ... } ;

// P8 7-19 / 26-36 - (13) / (11) = 24
// P9 11-18 / 21-27 / 30 / 41-42 - (8) / (7) / (1) / (2) = 18

var initPins =function () {
	for ( var p =0 ; p < DigitalPins.length ; p++ ) {
		var pin =DigitalPins [p] ;
		bonescript.pinMode (pin, bonescript.OUTPUT, 7, 'pullup', 'fast', function (pinR) {
			bonescript.digitalWrite (pin, bonescript.HIGH) ;
		}) ;
	}
}
var init =function () {
	fs.readFile ('./data/DigitalPins.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read DigitalPins definition file')) ;
		DigitalPins =JSON.parse (data) ;
		//initPins () ;
	}) ;
	fs.readFile ('./data/AnalogPins.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read AnalogPins definition file')) ;
		AnalogPins =JSON.parse (data) ;
	}) ;
	//fs.readFile ('../data/LEDs.json', function (err, data) {
	//	if ( err )
	//		return (console.log ('Cannot read LEDs definition file')) ;
	//	LEDs =JSON.parse (data) ;
	//}) ;
	fs.readFile ('./data/floors.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read floors definition file')) ;
		floors =JSON.parse (data) ;
		var rooms2 =Object.keys (floors).map (function (k) { return (floors [k]) ; }) ;
		rooms2 =[].concat.apply ([], [].concat.apply ([], rooms2)) ;
		rooms2 =rooms2.filter (function (item, i, ar) { return (ar.indexOf (item) === i) ; }) ;
		rooms =rooms2.reduce (function (previousValue, value, index) { previousValue [value] =[] ; return (previousValue) ; }, {}) ;
	}) ;
} ;
init () ;

module.exports ={
	'cmds': function () { return (cmds) ; },
	'rooms': function () { return (rooms) ; },
	'floors': function () { return (floors) ; },
	'DigitalPins': function () { return (DigitalPins) ; }
} ;
