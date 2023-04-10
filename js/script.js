const baseURL = 'https://api.dicionario-aberto.net';

const newGameButton = document.querySelector('.new-game');
const resetButton = document.querySelector('.reset');

const bgColorInput = document.getElementById('bg-color');
const boardColorInput = document.getElementById('board-color');

const wordElement = document.querySelector('.word');

let word;
let characterElements = [];

let gameStart = false;
let mistakes = 0;

let canvasContext;

async function requestWord () {
	const response = await fetch(`${baseURL}/random`);

	if (response.ok) {
		const result = await response.json();
		const description = await requestDescription(result.word);

		if (description && isDescriptionValid(description)) {
			word = result.word;
			displayHint(description);
		} else requestWord();
	}
}

async function requestDescription (word) {
	const response = await fetch(`${baseURL}/word/${word}/1`)

	if (response.ok) {
		const result = await response.json();
		return treatDescription(result[0].xml);
	} else return null;
}

function displayHint (description) {
	if (document.querySelector('.hint'))
		document.querySelector('.hint').remove();

	const hintElement = document.createElement('p');
	hintElement.innerText = `hint: ${description}`;
	hintElement.classList.add('hint');

	document.querySelector('.menu').append(hintElement);
}

function keyboardGeneration () {
	let keyboard = document.querySelector('.keyboard');
	keyboard.innerHTML = '';

	['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
		.forEach((letter) => {
			let button = document.createElement('button');

			button.value = letter;
			button.innerText = letter;
			button.style.gridArea = letter;

			button.addEventListener('click', handleKeyboardClick, { once: true });

			keyboard.append(button);
		});
}

function drawLine (startX, startY, endX, endY) {
	canvasContext.moveTo(startX, startY);
	canvasContext.lineTo(endX, endY);
	canvasContext.stroke();
}

function hangmanInit () {
	canvasContext = document.querySelector('.hangman').getcanvasContext('2d');

	canvasContext.beginPath();
	canvasContext.lineWidth = 3;
	canvasContext.strokeStyle = localStorage.getItem('bg-color');
	canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

	drawLine(20, 145, 60, 145);
	drawLine(40, 5, 40, 145);
	drawLine(38, 5, 75, 5);
	drawLine(75, 3, 75, 20);
	drawLine(40, 25, 60, 5);
}

function hangmanDrawing () {
	if (mistakes > 0) {
		canvasContext.beginPath();
		canvasContext.arc(75, 30, 10, 0, Math.PI * 2, true);
		canvasContext.stroke();

		if (mistakes > 1) drawLine(75, 40, 75, 80);
		if (mistakes > 2) drawLine(75, 50, 50, 75);
		if (mistakes > 3) drawLine(75, 50, 100, 75);
		if (mistakes > 4) drawLine(75, 80, 50, 110);
		if (mistakes > 5) {
			drawLine(75, 80, 100, 110);
			handleLoss();
		}
	}
}

function treatDescription (description) {
	return description
		.split('def>')[1]
		.split('.')[0]
		.split(',')[0]
		.split(';')[0]
		.split(':')[0]
		.split('^')[0]
		.replace(/\n/g, ' ')
		.replace(/_/g, '')
		.replace(/\[/g, '')
		.replace(/]/g, '')
		.toLowerCase()
		.trim();
}

function isDescriptionValid (description) {
	return description.length >= 6 && description.length <= 30;
}

requestWord();
