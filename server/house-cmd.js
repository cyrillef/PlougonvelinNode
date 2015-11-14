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
var async =require ('async') ;
var boneimpl =require ('./boneimpl') ;
var housedef =require ('./house-def') ;

var shutterCommand =function (shutter, cmd, cb) {
    var pin =shutter [cmd === 'half' ? 'close' : cmd] ;
    if ( pin === undefined || pin === '' ) {
        if ( cb )
            cb (shutter) ;
        return ;
    }
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
	//console.log (index+ ' ' +shutter) ;
    shutterCommand (shutter, cmd, cb) ;
} ;

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

module.exports ={
    'shutterCommand': shutterCommand,
    'roomShutterCommand': roomShutterCommand,
    'roomCentral': roomCentral,
    'floorCentral': floorCentral
} ;
