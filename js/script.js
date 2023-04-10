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
