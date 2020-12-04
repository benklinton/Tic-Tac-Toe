//Gloabal Variables
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

//typeWriter function for header
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

const cells = document.querySelectorAll('.cell');
startGame();
typeWriter();

//startGame function to initalize the game
function startGame() {
	document.querySelector(".endgame").style.display = "none";
	gameBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

//turnClick checks square and executes functions accordingly
function turnClick(square) {
	if (typeof gameBoard[square.target.id] == 'number') {
		turn(square.target.id, human)
		if (!checkWin(gameBoard, human) && !checkTie()) turn(bestSpot(), comp);
	}
}

//turn function checks for player and square and fills accordingly
function turn(squareId, player) {
	gameBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(gameBoard, player)
	if (gameWon) gameOver(gameWon)
}

//checkWin checks if any player has placed in a winning combo against the WinCombo array
function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = { index: index, player: player };
			break;
		}
	}
	return gameWon;
}

//gameOver function exacutes to highlight outcome and declare winner
function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == human ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == human ? "You win!" : "In what world could you possibly beat me? Come back when you're worthy")
}

//declareWinner displays text of outcome
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

//empty all board game squares
function emptySquares() {
	return gameBoard.filter(s => typeof s == 'number');
}

//uses minimax algorithem for computer to decide best spot
function bestSpot() {
	return minimax(gameBoard, comp).index;
}

//checks game board for a tie
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

//minimax lets the computer pick the best square to minimize lose or maximize win
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, human)) {
		return { score: -10 };
	} else if (checkWin(newBoard, comp)) {
		return { score: 10 };
	} else if (availSpots.length === 0) {
		return { score: 0 };
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == comp) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, comp);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if (player === comp) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}