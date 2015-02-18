// By Scott David "Scooter" Fell, 2014
// Javascript file for 'hangman' 2015

function Game(){

	this.wordArray = ["Rapahel", "Michelangelo", "Ferdinand Magellan", "Francisco Pizarro", "Nicolaus Copernicus", "Tycho Brahe", "Leonardo da Vinci", "El Greco", "Burial of the Count of Orgaz", "Giotto", "Botticelli", "David", "Mona Lisa", "The Last Supper", "Pieta", "The Sistine Chapel Ceiling", "The School of Athens by Raphael", "The Last Supper by Leonardo da Vinci", "The Birth of Venus by Sandro Botticelli", "The Creation of Adam by Michelangelo", "The Last Judgment by Hieronymus Bosch", "The Tower of Babel by Pieter Bruegel the Elder", "La Primavera by Sandro Botticelli"];

	this.word = ""; // Current word to guess
	this.guessNumber = 0;
	this.numPuzzlesCompleted = 0;
	this.incorrectGuesses = 0;
	this.guessLettersAr=[];	
	this.partiallyRevealedWord = "";
	this.score = 0;

	this.MAX_GUESSES = 5;
	this.DEBUG_MESSAGES = false;
}

// The user is presented their remaining incorrect guesses as a string
// instead of a numeric.  An 'X' indicates an incorrect guess and a "_"
// indicates a remaining chance.
//
// If a user is permitted 6 guesses and they've guessed incorrectly 
// four times, the returned string will read "XXXX__"
Game.prototype.generateIncorrectGuessesString= function(){
	var string = "";
	var guessesRemaining = this.MAX_GUESSES-this.incorrectGuesses;

	// An 'x' for each incorrect guess
	string = Array(this.incorrectGuesses + 1).join('X');

	// Pad the rest with underscores
	string += Array(guessesRemaining+1).join(' _');

	return string;
}

Game.prototype.wordGenerator = function(){
	var random_index = Math.floor(Math.random()*this.wordArray.length);
	return this.wordArray[random_index].toUpperCase();
}

Game.prototype.newGame = function(){
	this.guessLettersAr = [];
	this.guessNumber = 0;
	this.incorrectGuesses = 0;

	// grab a new word
	this.word = this.wordGenerator();
	this.updatePartiallyRevealedWord();
}


// Given an array of letters, tests to see if the given
// letter is contained in the array.  Returns true if so
Game.prototype.letterInAr = function(inLetter, inArray){
	if (inArray.indexOf(inLetter) >= 0)
		return true;

	return false;
}


// Utility function to update the partially-revealed word on the display.
// Call this function any time the guessLettersAr is changed.  Ie:
// either when the user makes a new guess, or when starting the game
Game.prototype.updatePartiallyRevealedWord = function(){
	this.partiallyRevealedWord = "";

	for(var i = 0; i < this.word.length; ++i){
		if(this.letterInAr(this.word[i], this.guessLettersAr)){
			this.partiallyRevealedWord += this.word[i];
		}
		else{
			if (this.word[i] == " "){
				this.partiallyRevealedWord += ' ';
			}
			else{
				this.partiallyRevealedWord += '_';
			}
		}
	}
}


Game.prototype.guessLetter = function(inLetter){
	if(this.letterInAr(inLetter, this.guessLettersAr)){
		//alert("I believe you already guessed that letter.");
		console.log("Already guessed letter");
		$('.guessedLetters').addClass("animated shake flashRed");
		setTimeout(
			function(){
				$('.guessedLetters').removeClass("animated shake flashRed");
			}, 
			2000);
		// sweetAlert("You've already guessed that letter!");

		return;
	}

	this.guessLettersAr.push(inLetter);
	this.guessNumber++;

	//Only update the string if the guessed letter was actually in the word
	if(this.letterInAr(inLetter, this.word)){
		this.updatePartiallyRevealedWord();
	}
	else{
		this.incorrectGuesses++;
	}
}

Game.prototype.revealAnswer = function(){
	this.partiallyRevealedWord = this.word;
}

Game.prototype.hasWon = function(){
	if (this.word === this.partiallyRevealedWord) {
		return true;
	}
	return false;
}

Game.prototype.hasExceededGuessLimit = function(){
	if (this.incorrectGuesses >= this.MAX_GUESSES){
		return true;
	}
	return false;
}

Game.prototype.setHangmanState = function(inHangmanStateNumber) {
	switch(inHangmanStateNumber){
		case 0:
			$(".diva").hide();
			$(".heartBoxers").hide();
			$(".helmet").show();
			$(".rightBoot").show();
			$(".leftBoot").show();
			$(".firePants").show();
			$(".fireCoat").show();
			$(".hose").show();
		break;
		case 1:
			$(".hose").hide();
		break;
		case 2:
			$(".fireCoat").hide();
		break;
		case 3:
			$(".firePants").hide();
			$(".heartBoxers").show();
		break;
		case 4:
			$(".leftBoot").hide();
			$(".rightBoot").hide();
			$(".helmet").hide();
		break;
		case 5:
			$(".diva").show();
			$(".heartBoxers").hide();
		break;
		default:
			console.log("Code is broken! 3409jf");
	}
}

Game.prototype.updateDisplay = function(){
	if (this.DEBUG_MESSAGES){
		console.log("guessLetters: " + this.guessLettersAr);
		console.log("word: " + this.word);
		console.log("Partially Revealed String: " + this.partiallyRevealedWord);		
	}	

	this.setHangmanState(this.incorrectGuesses);

	$('.guessedLetters').text(this.guessLettersAr.sort().join(" ") );
	$('.partiallyRevealedAnswer').text(this.partiallyRevealedWord);
	$('.guessNumber').text(this.guessNumber);
	$('.incorrectGuessNumberClass').text(this.generateIncorrectGuessesString());
	$('.score').text(this.score);
}


Game.prototype.handleGiveHint = function(){

	// Figure out which letters are still needed to complete the word
	var lettersRemainingAr = [];
	for(var i = 0; i < this.word.length; ++i){
		if(this.partiallyRevealedWord.charAt(i) === "_"){
			lettersRemainingAr.push(this.word.charAt(i));
		}
	}

	// Select one of those letters
	var random_index = Math.floor(Math.random()*lettersRemainingAr.length);
	var letter = lettersRemainingAr[random_index];
	
	// Perform the guess
	this.guessLetter(letter);
	this.incorrectGuesses++; // Hints are not free
	this.updateDisplay();

	// In case the user has used the hint to complete the word,
	// congratulate ourselves and DO NOT give them the point
	if(this.hasWon()){
		alert("Nice Job, me!");
		this.newGame();
		this.updateDisplay();
	}
}

Game.prototype.handleGuessFromKeypress = function(event){
	var letterPressed = String.fromCharCode(event.keyCode);
	
	// Check to make sure it's an alpha entry from the keyboard
	if (event.keyCode < 65 || event.keyCode > 90)
	{
		// Entry was not a-z or A-Z
		return;
	}

	this.guessLetter(letterPressed);
	this.updateDisplay();

	// Handle Scoring
	if (this.hasExceededGuessLimit()){
		this.updateDisplay();
		alert("Guesses exceeded");
		this.revealAnswer();

		var newh1 = $("<h1 align='center' class='revealedAnswer'>"+ this.word +"</h1>");
		$('body').append(newh1);

		$('.revealedAnswer').animate(
			{ 
				top: "-=100%",
				opacity: 0
			}, 
			2000, 
			// 'linear',
			'easeInElastic', 
			function(){$(this).remove();}
		);
		this.updateDisplay();
		this.newGame();
	}
	else if(this.hasWon()){
		sweetAlert("Nice Job!");
		this.score++;
		this.newGame();
	}
	this.updateDisplay();
}


window.onload = function() {
	var myGame = new Game();
	myGame.newGame();
	myGame.updateDisplay();

	$('#newGame').on('click',function(event){myGame.newGame();myGame.updateDisplay();});
	$(document).keyup(function(event){myGame.handleGuessFromKeypress(event);});
	$('#giveHint').on('click',function(event){myGame.handleGiveHint();})
}