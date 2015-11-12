

// ------------------------Game------------------------------------
var Game = function () {
    clearScreen();
    this.gameState = true;
    this.calledNumbers = [];
    this.card = new Card(); 
    this.finalCard = this.card.genCard();
    populateBoard(this.finalCard);
    this.card.getWinStates(this.finalCard);
};
Game.prototype.callNum = function(){
  if(this.gameState === false){
    return false;
  }
  var currentNumber = getUniqueNumber(1, 75, this.calledNumbers);
  this.calledNumbers.push(currentNumber);
  updateNumberPool(currentNumber);
  var flatArr = flattenArray(this.finalCard);
   if (checkIfNumInArray(currentNumber, flatArr)){
    crossItOff(currentNumber);
    this.card.removeFromWinStates(currentNumber);
   }
  this.hasUserWon();
};
Game.prototype.hasUserWon = function(){
	for(var i = 0; i < this.card.winStates.length; i++){
		if(this.card.winStates[i].length === 0){
			var winningRowNum = i;
			var winningRow = this.card.winStatesCopy[i];
			$('#game-status').text('you won!!!!')
			hightlightWinningRow(winningRow);
			this.gameState = false;
		}
	}
}
	// -----------------------------------Card-----------------------
var Card = function(){
  this.gameBoardArrays = [];
  this.winStates = [];
  this.winStatesCopy = [];
  this.genCard = function() {	
	  for(var i = 0; i < 5; i ++) {
	    var row = [];
	    for(var n = 0; n < 5; n ++) {
	      var min = 1 + (n * 15);
	      var max = 15 + (n * 15);
	      var randNum = getUniqueNumber(min, max, this.gameBoardArrays);
	      row.push(randNum);
	    }
	    this.gameBoardArrays.push(row);
	  }
	  return this.filterColumns(this.gameBoardArrays);
  }
}
Card.prototype.getWinStates = function(arr) {
	var copyOfGameBoard = this.transcribeArray(arr, true);
	for(var i = 0; i < copyOfGameBoard.length; i++){
		this.winStates.push(copyOfGameBoard[i]);
	}
	var columnWins = this.transcribeArray(arr, false);
	for(var i = 0; i < 5; i ++){
		this.winStates.push(columnWins[i]);
	}
	var diagonalWins = this.findDiagonalWins(arr);
	this.winStates.push(diagonalWins[0],diagonalWins[1]);
	
	for(i = 0; i < this.winStates.length; i++){
		var row = this.winStates[i].slice();
		this.winStatesCopy.push(row);
	}
	return this.winStates;
}
Card.prototype.findDiagonalWins = function(arr) {
	var diagonalWins = [];
	var d1 = [arr[0][0],arr[1][1],arr[2][2],arr[3][3],arr[4][4]];
	var d2 =  [arr[0][4],arr[1][3],arr[2][2],arr[3][1],arr[4][0]];
	diagonalWins.push(d1,d2)
	return diagonalWins;
}
Card.prototype.filterColumns = function(arr) {
// create columns
	var columnArr = this.transcribeArray(arr);
	sortArray(columnArr);
// push them back into rows
	var filteredArr = this.transcribeArray(columnArr);
	return filteredArr;
}
Card.prototype.transcribeArray = function(arr, reverse) {
	var alteredArr = [];
	for(var i = 0; i < arr.length; i++){
		var newSubArray = [];
		for(var n = 0; n < arr[i].length; n++){
			var copy;
			reverse ? copy = arr[i][n] : copy = arr[n][i];				
			newSubArray.push(copy);
		}	
		alteredArr.push(newSubArray);
	}
	return alteredArr;
}
Card.prototype.removeFromWinStates = function(num) {
	for(var i = 0; i < this.winStates.length; i++){
		var currentArray = this.winStates[i];
		var index = currentArray.indexOf(num);
		if(index > -1){
			currentArray.splice(index, 1);
		}
	}
}
// ------------------------Helpers---------------------------------------------
function sortArray(arr){
	var sortedArr = [];
	for(var i = 0; i < 5; i ++){
			arr[i].sort(function(a,b){
				return a > b;
			});
			sortedArr.push(arr[i]);
	}
	return sortedArr;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function checkIfNumInArray(num, array){
	var index = array.indexOf(num)
	if (index > -1 ) {
		return index + 1;
	}
	return false;
}
function flattenArray(array){
	var flatArr = [].concat.apply([], array);
	return flatArr;
}
function getUniqueNumber(min, max, array){
	 var currentNum = getRandomInt(min, max);
	 var flatArr = flattenArray(array);
	 while(checkIfNumInArray(currentNum, flatArr)){
	 	currentNum = getRandomInt(min, max);
	 }
	 return currentNum;
}

//-------------------------User-Interface-------------------------
var currentGame = {};
$('#makeACard').on('click',function(){
	currentGame = new Game;
})
$('#callANumber').on('click',function(){
	if(currentGame.gameState){
		currentGame.callNum();
	}
})
function clearScreen(){
	$('.crossed').removeClass('crossed');
	$('#number-pool').text('');
	$('#game-status').text('');
	$('.winner').removeClass('winner');
}
function updateNumberPool(currentNumber) {
	var text = $('#number-pool').text();
	$('#number-pool').text(text + ' ' + currentNumber);
}
function crossItOff(num) {
	var flatArr = flattenArray(currentGame.finalCard);
	var id = checkIfNumInArray(num, flatArr)
	$('#'+ id).addClass('crossed');
}
function populateBoard(array){
	for(var n = 1; n < 6; n++){
		for (var x = 0; x < array.length; x++){
			var currentRow = array[n-1]
			var numbery = x + 1;
			$('#row'+n+' td:nth-child('+numbery+') span').text(currentRow[x]);
		}
	}
}
function hightlightWinningRow(array) {
	var flatArr = flattenArray(currentGame.finalCard);
	for(var i = 0; i < array.length; i++){
		var number = array[i];
		var id = checkIfNumInArray(number, flatArr)
		$('#' + id).addClass('winner');
	}
}
