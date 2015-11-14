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
var fs =require ('fs') ;
console.log (process.platform === 'linux' ? 'beaglebone initialization' : 'bbb fake API loading' ) ;
var bonescript =(process.platform === 'linux' ?
	  require ('bonescript')
	: {
		'pinMode': function (pin, inout, mode, pulltype, speed, cb) {
			if ( cb )
				cb ({ 'value': true }) ;
		},
		'digitalWrite': function (pin, value, cb) {
			if ( cb )
				cb ({ 'value': true }) ;
		},
		'LOW': 0,
		'HIGH': 1,
		'OUTPUT': 7
	  }
) ;

var DigitalPins =[], AnalogPins =[]/*, LEDs =[]*/ ;
// P8 7-19 / 26-36 - (13) / (11) = 24
// P9 11-18 / 21-27 / 30 / 41-42 - (8) / (7) / (1) / (2) = 18

var initPins =function () {
	for ( var p =0 ; p < DigitalPins.length ; p++ ) {
		var pin =DigitalPins [p] ;
		bonescript.pinMode (pin, bonescript.OUTPUT, 7, 'pullup', 'fast', function (pinR) {
			//console.log ('err = ' + pinR.err) ;
			bonescript.digitalWrite (pin, bonescript.HIGH, function (pinR2) {
				//console.log ('err = ' + pingR2.err) ;
			}) ;
		}) ;
	}
} ;

var triggerShutter =function (shutter, repeat, cb) {
	//console.log ('triggerShutter' + shutter) ;
	bonescript.digitalWrite (shutter, bonescript.LOW, function (pinR) {
		//console.log ('err = ' + pinR.err) ;
		setTimeout (
			function () {
				bonescript.digitalWrite (shutter, bonescript.HIGH, function (pinR2) {
					//console.log ('err = ' + pinR2.err) ;
					if ( repeat > 1 )
						setTimeout (function () {
							triggerShutter (shutter, repeat - 1, cb) ;
						}, 50) ;
					else if ( cb )
						cb (shutter) ;
				}) ;
			},
			100
		) ;
	}) ;
} ;

var init =function () {
	fs.readFile ('./data/DigitalPins.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read DigitalPins definition file')) ;
		DigitalPins =JSON.parse (data) ;
		initPins () ;
	}) ;
	fs.readFile ('./data/AnalogPins.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read AnalogPins definition file')) ;
		AnalogPins =JSON.parse (data) ;
	}) ;
	//fs.readFile ('./data/LEDs.json', function (err, data) {
	//	if ( err )
	//		return (console.log ('Cannot read LEDs definition file')) ;
	//	LEDs =JSON.parse (data) ;
	//}) ;
} ;
init () ;

module.exports ={
	'DigitalPins': function () { return (DigitalPins) ; },
	'AnalogPins': function () { return (AnalogPins) ; },
	//'LEDs': function () { return (LEDs) ; },
	'initPins': initPins,
	'triggerShutter': triggerShutter
} ;
