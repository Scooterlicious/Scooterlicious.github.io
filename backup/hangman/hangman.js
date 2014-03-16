function Game(){

	this.wordArray = ["Rapahel", "Michelangelo", "Leonardo da Vinci", "El Greco", "Burial of the Count of Orgaz", "Giotto", "Botticelli", "David", "Mona Lisa", "The Last Supper", "Pieta", "The Sistine Chapel Ceiling", "The School of Athens", "The Birth of Venus"];

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

	for(var i = 0; i < this.incorrectGuesses;++i){
		string += "X ";
	}

	for(; i < this.MAX_GUESSES;++i){
		string += "_ ";
	}

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
	for(var i = 0; i< inArray.length; ++i){
		if (inArray[i] === inLetter)
			return true;
	}
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
		alert("I believe you already guessed that letter.");
		return;
	}

	this.guessLettersAr.push(inLetter);
	this.guessNumber++;

	//Only update the string if the guessed letter was actually in the word
	if(this.letterInAr(inLetter, this.word)){
		this.updatePartiallyRevealedWord();
		console.log("Letter is in String");
	}
	else{
		this.incorrectGuesses++;
		console.log("Letter NOT in string");
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
			$(".heartBoxers").hide();
			$(".diva").show();
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

	$('.guessedLetters').text(this.guessLettersAr.join(" ") );//.replace(/,/g, "" ));
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
	console.log("letterPressed: " + letterPressed + "... keyCode: "+event.keyCode);
	var enter_keycode = 13;

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
		alert("Nice Job!");
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


