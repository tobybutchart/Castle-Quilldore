'use strict';

//setup our initial variables and values
var rotateY = 0,
	rotateZ = 0,
	die = document.getElementById('dice'),
	height = window.innerHeight / 2,
	width = window.innerWidth / 2;

function setTransform( el, value ) {
//by checking for the default one first we're future-proofing our code
	if (typeof el.style.transform !== 'undefined') {
		el.style.transform = value;
	} else if (typeof el.style.webkitTransform !== 'undefined') {
		el.style.webkitTransform = value;
	} else if (typeof el.style.MozTransform !== 'undefined') {
		el.style.MozTransform = value;
	} else if (typeof el.style.msTransform !== 'undefined') {
		el.style.msTransform = value;
	} else if (typeof el.style.oTransform !== 'undefined') {
		el.style.oTransform = value;
	} else {
		window.alert('This browser doesn\'t support 3D transforms');
	}
}

// setInterval(function() {
// //this will stop high degrees happening, we never need more than 360 for one revolution
// 	if (rotateY >= 360) rotateY = 0;
// 	if (rotateZ >= 360) rotateZ = 0;
	
//	//increment the y rotational value by 1	
// 	rotateY++;

// 	setTransform(die, 'rotateY(' + rotateY + 'deg) rotateX(' + rotateZ + 'deg)');
// }, 20);

// function rotateDice( event ) {
// 	if (rotateY >= 360) rotateY = 0;
// 	if (rotateZ >= 360) rotateZ = 0;
	
	//if we're in the lower or upper half of the page 
// 	if (event.pageY > height) {
// 		rotateY++;
// 	} else {
// 		rotateY--;
// 	}
				
// 	if (event.pageX > width) {
// 		rotateZ++;
// 	} else {
// 		rotateZ--;
// 	}
	
// 	setTransform(die, 'rotateY(' + rotateY + 'deg) rotateX(' + rotateZ + 'deg)');
// }

// document.addEventListener('mousemove', rotateDice, false);
// document.addEventListener('touchmove', rotateDice, false);
document.addEventListener('keyup', function( event ) {
	var numbers, rotate;
	
	if ( event.keyCode === 37 ) { //left
		//match integers including negative ones
		numbers = die.style.webkitTransform.match(/-?\d+/g);
		//if none (as in, the initial keypress) set it as 0
		if (numbers === null) numbers = [0];
		//take the last number in the array as this is always the degree angle
		//then add 90, the second argument to parseInt is the radix http://parseintimate.com/
		rotate = parseInt( numbers[numbers.length-1], 10 ) + 90;
		
		setTransform(die, 'rotateY(' + rotate + 'deg)');
	} else if ( event.keyCode === 38 ) { //up
		setTransform(die, 'rotate3d(1, 0, 0, -90deg)');
	} else if ( event.keyCode === 39 ) { //right
		numbers = die.style.webkitTransform.match(/-?\d+/g);
		if (numbers === null) numbers = [0];
		rotate = parseInt( numbers[numbers.length-1], 10 ) + -90;
		setTransform(die, 'rotateY(' + rotate + 'deg)');
	} else if ( event.keyCode === 40 ) { //down
		setTransform(die, 'rotate3d(1, 0, 0, 90deg)');
	}
}, false);

function roll() {
	//max = 6, min = 0
	//Math.floor(Math.random() * (max - min + 1)) + min;
	var result = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

	var offset = Math.floor(result / 2);
	setTransform(die, 'rotateY(' + 90 * offset + 'deg)');

	setTimeout(function() {
		if (result !== 5 && result !== 6) {
			setTransform(die, 'rotateY(' + 90 * result + 'deg)'); // 90 * 6 = 540 ergo 540 / 6 = 90
		} else if (result === 5) {
			setTransform(die, 'rotate3d(1, 0, 0, -90deg)');
		} else if (result === 6) {
			setTransform(die, 'rotate3d(1, 0, 0, 90deg)'); //shorthand for rotatey, z, x
		}
	}, 250);
}

document.getElementById('roll').addEventListener('click', roll, false);