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
var bonescript =require ('bonescript') ;

var LEDs =[ 'USR0', 'USR1', 'USR2', 'USR3' ] ;
var AnalogPins =[ 'AIN0', 'AIN1', 'AIN2', 'AIN3', 'AIN4', 'AIN5', 'AIN6' ] ;
var DigitalPins =[
	'P8_7', 'P8_8', 'P8_9', 'P8_10', 'P8_11', 'P8_12', 'P8_13', 'P8_14',
	'P8_15', 'P8_16', 'P8_17', 'P8_18', 'P8_19', 'P8_26',
	'P9_11', 'P9_12', 'P9_13', 'P9_14', 'P9_15', 'P9_16', 'P9_17', 'P9_18',
	'P9_21', 'P9_22', 'P9_23', 'P9_24', 'P9_25', 'P9_26', 'P9_27',
	'P9_30', 'P9_41', 'P9_42'
] ;

var floors = {
	'Maison': [ 'Bureau', 'Cuisine', 'Salon'/*, 'SdJ', */ /*'Pauline', 'Lucille', 'Marie', 'Dressing', */ /*'Garage'*/ ],
	'1er': [ /*'Pauline', 'Lucille', 'Marie', 'Dressing'*/ ],
	'Rdc': [ 'Bureau', 'Cuisine', 'Salon'/*, 'SdJ'*/ ],
	'S-sol': [ /*'Garage'*/ ]
} ;
var rooms ={
	'Bureau': [ 'v1', 'v2' ],
	'Cuisine': [ 'v3', 'v4', 'v5' ],
	'Salon': [ 'v6', 'v7', 'v8' ]
	//'SdJ': [ 'v9', 'v10', 'v11' ],
	//'Garage': [ 'v12' ],
	//'Pauline': [ 'v13', 'v14', 'v15' ],
	//'Lucille': [ 'v16', 'v17' ],
	//'Marie': [ 'v18', 'v19' ],
	//'Dressing': [ 'v20', 'v21', 'v22' ]
} ;
var cmds ={
	v1: { pins: [ 'P8_8', 'P8_7', [ 'P8_8', 2 ] ], name: 'Nord' },
	v2: { pins: [ 'P8_10', 'P8_9', [ 'P8_10', 2 ] ], name: 'Ouest' },
	v3: { pins: [ 'P8_12', 'P8_11', [ 'P8_12', 2 ] ], name: 'Sud' },
	v4: { pins: [ 'P8_14', 'P8_13', [ 'P8_14', 2 ] ], name: 'Ouest' },
	v5: { pins: [ 'P8_16', 'P8_15', [ 'P8_16', 2 ] ], name: 'Cuisine' },
	v6: { pins: [ 'P8_18', 'P8_17', [ 'P8_18', 2 ] ], name: 'Sud' },
	v7: { pins: [ 'P8_26', 'P8_19', [ 'P8_26', 2 ] ], name: 'Ouest' },
	v8: { pins: [ 'P9_12', 'P9_11', [ 'P9_12', 2 ] ], name: 'Nord' }
	//v9: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v10: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v11: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v12: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v13: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v14: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v15: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v16: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v17: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v18: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v19: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v20: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v21: { pins: [ '', '', [ '', 2 ] ], name: '' },
	//v22: { pins: [ '', '', [ '', 2 ] ], name: '' },
} ;

var init =function () {
	for ( var k in cmds ) {
		for ( var i =0 ; i < cmds [k].pins.length ; i++ ) {
			var pin =cmds [k].pins [i] ;
			if ( pin.constructor === Array )
				pin =pin [0] ;
			bonescript.pinMode (pin, bonescript.OUTPUT) ;
			bonescript.digitalWrite (bonescript.HIGH) ;
		}
	}
}
init () ;

module.exports ={
	'cmds': cmds,
	'rooms': rooms,
	'floors': floors
} ;
