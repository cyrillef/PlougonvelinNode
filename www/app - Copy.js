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
var socket =null ;

$(document).ready (function () {
	//var socket =io.connect ('http://' +  window.location.host + ':' + window.location.port) ;
	socket =io () ;

	socket.on ('connect', function (data) {
		socket.emit ('join', 'Hello World from client') ;
	}) ;

	socket.on ('disconnect', function () {
		console.log ('Server disconnected') ;
	}) ;

	socket.on ('messages', function (data) {
		console.log (data) ;
		var stream =ss.createStream () ;
		//ss (socket).emit ('stream', stream) ;
		//$("#cam1 source").attr ('src')


	}) ;

	// opt1
	var img =document.getElementById ('img') ;
	socket.on ('data', function(data) {
		img.src ='data:image/jpeg;base64,' + data ;
	});


	//-opt2
	//socket.on ('canvas', function(data) {
	//	//console.log(data);
	//	try {
	//		// 1. method: draw on canvas
	//		var canvas = document.getElementById('videostream');
	//		 var context = canvas.getContext('2d');
	//		 var imageObj = new Image();
	//		 imageObj.src = "data:image/jpeg;base64,"+data;
	//		 imageObj.onload = function(){
	//		 context.height = imageObj.height;
	//		 context.width = imageObj.width;
	//		 context.drawImage(imageObj,0,0,context.width,context.height);
	//		 }
	//		// 2. method: draw as CSS background
	//		//$('#videostream').css('background', 'transparent url(data:image/jpeg;base64,'+data+') top left / 100% 100% no-repeat');
	//	} catch(e){ }
	//});


}) ;

// Mac address to uppercase
function macAddress (value) {
	value =value.toLowerCase () ;
	value =value.replace ('-', ':').replace ('.', ':') ;
	return (value) ;
}