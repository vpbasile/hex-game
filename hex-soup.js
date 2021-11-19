function placeholderText() { return `It is ${players[currentPlayer].color}'s turn. Touch a letter to begin.` }

// Gameplay global variables
var players = [
	{ "id": 0, "color": "purple", "score": 0, "history": [] },
	{ "id": 1, "color": "blue", "score": 0, "history": [] }
]
var currentPlayer = 0
var currentTurn = 1
var currentColor = players[currentPlayer].color
var wordHistory = []
var currentword = ""
var currentWordScore = 0
var lastCLickedHex = null
var letterScores = {
	"A": 1, "B": 3, "C": 3, "D": 2, "E": 1, "F": 4, "G": 2, "H": 4, "I": 1, "J": 8, "K": 5, "L": 1, "M": 3, "N": 1, "O": 1, "P": 3, "QU": 10, "R": 1, "S": 1, "T": 1, "U": 1, "V": 4, "W": 4, "X": 8, "Y": 4, "Z": 10
}
var orientationBowl = 'flat-top'
var bowlRadius
var spoon
var spoonWord

// Stuff for checking the entered words in a dictionary
const apiKey = "df21cec5-0310-49d9-be45-0e5d29bb553c"
const apiName = "thesaurus"
var url


function drawView() {
	// Refresh the viewport
	gameBoard.clear()
	// Draw a soup bowl 
	//then all the hexes with their letters
	// then the spoon
	drawSoupBowl()
	Hexes.forEach(element => { element.draw() })
	drawSpoon()
	// Draw the current word
	currentWordDisplay.innerText = `${currentword} (${currentWordScore})`
}

function drawSoupBowl() {
	var polygonString = ""
	var tempCoordinate = { "x": 0, "y": 0 }
	// Find the X and Y of each corner - shift the bowl by 60 degrees
	console.log(bowlRadius)
	cornerAngles.forEach(element => {
		var theta = element * Math.PI / 180 + Math.PI / 6
		tempCoordinate.x = Math.floor(canvasCenter.x + bowlRadius * Math.cos(theta))
		tempCoordinate.y = Math.floor(canvasCenter.y + bowlRadius * Math.sin(theta))
		if (polygonString != "") { polygonString += " " }
		polygonString += `${tempCoordinate.x},${tempCoordinate.y}`
	});
	gameBoard.polygon(polygonString)
		.attr('id', 'bowl')
}

function drawSpoon() {

	// var enterText="enter"
	// var clearText="clear"
	spoonBack = gameBoard.path(spoonBacker).move(400, 50).attr('id', 'spoonBack').transform({ scale: 3 }).fill('white')
	spoon = gameBoard.path(spoonPath).move(400, 50).attr('id', 'spoon').transform({ scale: 3 }).on('click', function () { submitButtonClicked() })

	spoon.attr(
		'class', `player${currentPlayer}`)

	spoonWord = gameBoard.text(currentword).attr('class', `player${currentPlayer}`)
	spoonWord.move(650, 30)
		.on('click', function () { submitButtonClicked() })
		.attr('id', 'submitButton')
	// .transform({ scale: 3 })
	// .fill("white")

	gameBoard.circle(200).cx(825).cy(750).attr('id', 'sandwichCircle')
	gameBoard.path(sandwichPath).fill('red').move(825, 750).attr('id', 'crackers').transform({ scale: 10 }).stroke("none").attr('class', `pasta`).on('click', function () { clearTurn() })
	gameBoard.text("CLEAR").move(750, 670).attr('id', 'crackersText').attr('class', 'pasta').on('click', function () { clearTurn() })
}
function handleClick(hexId) {
	var clickedHex = Hexes[hexId]
	var hexLetter = clickedHex.letter
	// console.log(`Clicked hex at q:${clickedHex.q} r:${clickedHex.r}`)
	switch (hexLetter) {
		case undefined:
			console.log(`Clicked empty hex`)
			break
		case 'enter':
			console.log(`Clicked enter`)
			finishTurn()
			break
		case 'clear':
			console.log(`Clicked clear`)
			clearTurn()
			break
		default:
			if (clickedHex.classes == "hex clickable") {
				// The hex has a letter and is clickable, so perform the action, so claim the hex for the current player
				successfulClick(clickedHex)
			}

	}
}

function successfulClick(clickedHex) {
	// Keep track of the letters so that you can rewind mistakes
	// !!!!! Still didnt do that

	// Remove the lastclick class from the other letter
	if (lastCLickedHex != null) { lastCLickedHex.setClasses(`${currentColor}`) }
	// Now update the new last clicked hex
	lastCLickedHex = clickedHex
	clickedHex.setClasses(`${currentColor} lastclick`)
	// Add the letter to the word
	currentLetter = clickedHex.letter
	currentword += currentLetter
	currentWordScore += letterScores[currentLetter]
	// Update the word display
	currentWordDisplay.innerText = currentword
	spoonWord.text(currentword)

	Hexes.forEach(element => {
		if (element.classes.includes(currentColor)) {
			// Do nothing
		} else {
			if (clickedHex.isNeighbor(element)) {
				debug(`neighbor found at ${element.q}, ${element.r}`)
				element.setClasses(`clickable`)
			} else { element.setClasses(`locked`) }
		}
	})

	// Lock every hex that is not a neighbor of the clicked hex
	Hexes.forEach(element => {
		if (!clickedHex.isNeighbor(element)) {
		}
	})

	gameBoard.clear()
	drawView()

	// // Check if the word is in the dictionary
	// if (dictionary.includes(current_word)) {
	// 	// The word is in the dictionary, so make the word display clickable in order to enter
	// }
	// else {
	// 	// The word is not in the dictionary, so do nothing
	// }
	// Lock all the neighbors
}

function appendToHistory(player, word) {
	// Add the word to the history
	players[player].history.push(word)
	// console.log(tempstring)
	var tempItem = document.createElement("li")
	tempItem.innerText = `${currentword}(${currentWordScore})`
	document.getElementById(`player${currentPlayer}history`).appendChild(tempItem)
	// Update the history display
	// drawHistory()
}

async function submitButtonClicked() {
	spoon.attr('stroke', 'cornflowerblue')
	if (currentword.length > 0) { await dictionaryCheck(currentword) }
}
async function dictionaryCheck(word) {
	url = `https://www.dictionaryapi.com/api/v3/references/${apiName}/json/${word}?key=${apiKey}`
	let myObject = await fetch(url);
	let myText = await myObject.json();
	if ((myText[0].meta != undefined)) {
		spoon.attr('stroke', `green`)
		console.log(`${word} is in the dictionary`)
		finishTurn()
	} else {
		spoon.attr('stroke', `red`)
		console.log(`${word} is not in the dictionary`)
		nope()
	}
}

function beginTurn() {
	spoon.attr('class', `player${currentPlayer}`)
	spoonBack.attr('class', `player${currentPlayer}`)
}


function finishTurn() {
	generateLetters()
	// Remove the used letters
	Hexes.forEach(element => {
		// If the hex was used, replace it with a new random letter
		if (element.classes.includes(currentColor)) {
			element.assignLetter()
		}
	});
	console.log(`${currentTurn} The ${players[currentPlayer].color} player enterd ${currentword} for ${currentWordScore} points.`)
	players[currentPlayer].score += currentWordScore
	var tempstring = `player${currentPlayer}score`
	document.getElementById(tempstring).innerText = players[currentPlayer].score
	// historyDisplay.innerHTML += `<li class="${currentColor}">(${currentWordScore})${currentword}</li>`
	appendToHistory(currentPlayer, currentword) // Add the word to the history
	wordHistory[currentTurn] = { "word": currentword, "color": currentColor }
	currentTurn++
	// Switch the current player to the next player
	currentPlayer = (currentPlayer + 1) % players.length
	currentWordDisplay.classList.toggle(currentColor)
	currentColor = players[currentPlayer].color
	spoonWord.attr('class', currentColor)
	currentWordDisplay.classList.toggle(currentColor)
	// Clear the current word

	currentWordDisplay.innerText = placeholderText()
	currentword = ""
	currentWordScore = 0
	// Clear the last clicked hex
	lastCLickedHex = null
	clearTurn()
	// Reset the board
	// scoredisplay.innerHTML = scoreDisplayString
	drawView()
	beginTurn()
	currentWordDisplay.innerText = placeholderText()
}

function nope() {
	console.log(`Nope.`)
	clearTurn()
}

function clearTurn() {
	// Clear the current word
	// currentWordDisplay.innerText = placeholderText
	currentword = ""
	currentWordScore = 0
	// Clear the last clicked hex
	lastCLickedHex = null
	Hexes.forEach(element => { element.setClasses(`clickable`) })

	// Reset the board
	drawView()
	// currentWordDisplay.innerText = placeholderText
}

function clearCurrentWord() {
	currentword = ""
	// currentWordDisplay.innerText = placeholderText()
}

/* Functions for generating the board */
function board(results) {//generate a random set of 36 dice and store them in board_generator
	var board = []; // For storing the dice
	var dice_arr = [];
	var upside;
	shuffle(board_generator);
	// console.log(`Newly-shuffled board board_generator`)
	// console.table(board_generator);
	for (let i = 0; i < board_generator.length; i++) {
		// console.log(`Looping through the board_generator`)
		// console.table(board_generator[i]);
		dice_arr = board_generator[i];
		upside = random_face(dice_arr);
		if (upside === 'Q') upside = 'QU';
		results.push(upside)
	}
	debug(`Board: ${board}`)
	debug(`Results: ${results}`)
	//render board on HTML

}

function board_generate() {
	var dice;
	// console.log(`List length: ${list.length}`)
	for (let i = 0; i < list.length; i++) {
		dice = list[i].toUpperCase().split('');
		board_generator.push(dice);
	}
	// console.table(board_generator);
}

function shuffle(arr) {//function to shuffle the dice
	var j, temp;
	for (let i = arr.length; i > 0; i--) {
		j = Math.floor(Math.random() * i);
		temp = arr[i - 1];
		arr[i - 1] = arr[j];
		arr[j] = temp;
	}
}

function random_face(arr) {//random a upside face from a dice
	var index = Math.floor(Math.random() * 6);
	var upside_face = arr[index];
	return upside_face;
}

// Make the enter button hex
var submitHex = new Hex(2, 2, "enter submit-button")
submitHex.letter = "enter"
// { "q": 2, "r": 2, "classes": "black" },

// Make the clear button hex
var clearHex = new Hex(4, -2, "clear")
clearHex.letter = "clear"