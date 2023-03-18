'use strict';

let rotateY = 0,
	rotateZ = 0,
	die = document.getElementById('dice'),
	height = window.innerHeight / 2,
	width = window.innerWidth / 2;

function setTransform(el, value) {
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

function rollDice(afterRollCallback, args, nextPage) {
	let result = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
	let offset = Math.floor(result / 2);

	setTransform(die, 'rotateY(' + 90 * offset + 'deg)');

	setTimeout(function() {
		if (result !== 5 && result !== 6) {
			setTransform(die, 'rotateY(' + 90 * result + 'deg)'); // 90 * 6 = 540 ergo 540 / 6 = 90
		} else if (result === 5) {
			setTransform(die, 'rotate3d(1, 0, 0, -90deg)');
		} else if (result === 6) {
			setTransform(die, 'rotate3d(1, 0, 0, 90deg)'); //shorthand for rotatey, z, x
		}

		console.log('Dice rolled: ' + result);

		if (afterRollCallback && typeof afterRollCallback == "function") {
			const fn = function() {
				afterRollCallback(result, args, nextPage);
			}
			//allow a pause to see the dice roll
			setTimeout(fn, 500);
		}
	}, 250);
}
