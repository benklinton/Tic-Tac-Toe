var gameBoard;
const human = 'X';
const comp = 'O';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

let text = 'Would you like to play a game?';
var i = 0;
let speed = 70;
function typeWriter() {
	if (i < text.length) {
		document.getElementById('type').innerHTML += text.charAt(i);
		i++;
		setTimeout(typeWriter, speed);
	}
}