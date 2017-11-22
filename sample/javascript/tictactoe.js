let tictactoe = new function(){
	
	this.turn = "x",
	
	this.states = {
			"x" : [],
			"o" : []
	},
	
	this.level = "easy",
	
	this.winningStates = {
			"V1" : [1,4,7],
			"V2" : [2,5,8],
			"V3" : [3,6,9],
			"H1" : [1,2,3],
			"H2" : [4,5,6],
			"H3" : [7,8,9],
			"C1" : [1,5,9],
			"C2" : [3,5,7]
	},
	
	this.userPlays = "x",
	
	this.userPlayed = "x",
	
	this.winState = "",
	
	this.winner = "",
	
	this.processing = false,
	
	this.emptyCells = [1,2,3,4,5,6,7,8,9],
	
	this.aganistMachine = true,
	
	this.userTurn = function(event){
		
		if(!tictactoe.processing){
			tictactoe.processing = true;
			if(tictactoe.userPlays == tictactoe.turn || !tictactoe.aganistMachine){
				if(event.target.dataset.cell){
					let cell = event.target;
					if(cell.classList.contains("cellEmpty")){
						tictactoe.draw(cell);
					}				
				}
				if(tictactoe.aganistMachine){
					tictactoe.machineTurn();
				}
			}
		}
		
	},
	
	this.draw = function(cell){
		
		let isWinState;
		let currentTurn = tictactoe.turn;
		cell.classList.remove("cellEmpty");
		if(tictactoe.turn == "x"){				
			cell.classList.add("cellX");
			tictactoe.states.x.push(parseInt(cell.dataset.cell));
			isWinState = tictactoe.isWinState(tictactoe.states.x, "x");
			tictactoe.turn = "o";
		}	
		else if(tictactoe.turn == "o"){
			cell.classList.add("cellO");
			tictactoe.states.o.push(parseInt(cell.dataset.cell));
			isWinState = tictactoe.isWinState(tictactoe.states.o, "o");
			tictactoe.turn = "x";
		}
		this.deleteFromArray(this.emptyCells, parseInt(cell.dataset.cell));
		if(isWinState){
			this.winState = isWinState;
			this.winner = currentTurn;
			this.strike(this.winState);
		}
		if(this.emptyCells.length == 0){
			if(!isWinState){
				let source = document.getElementById("svgGameBoard");
				source.classList.add("fadeAway");
				
				setTimeout(function(){
					let target = document.getElementById("gameResults");
					target.innerHTML = " Draw!"
					target.style.display = "block";
				}, 5000);
			}
		}
		tictactoe.processing = false;
	
	},
	
	this.isWinState = function(state, turn){
		
		for (let winState in this.winningStates) {
			let count = 0;
			state.forEach(function(position){
				if(tictactoe.winningStates[winState].indexOf(position) != -1){
					count++;
				}
			});
			if(count == 3){
				return winState;
			}
		}
		
	},
	
	this.strike = function(strikeClass){
		
		let winner;
		if(this.turn == "x"){
			winner = "o";
		}else {
			winner = "x";
		}
		document.getElementById("strike").classList.add("strike"+strikeClass);
		
		let source = document.getElementById("svgGameBoard");
		source.classList.add("fadeAway");
		
		setTimeout(function(){
			if(tictactoe.winner != ""){
				let target = document.getElementById("gameResults");
				target.innerHTML = winner + " wins!"
				target.style.display = "block";
			}
		}, 5000);
		
	},
	
	this.restartGame = function(){
		
		
		document.getElementById("strike").classList.remove("strike"+tictactoe.winState);
		
		let gameCells = document.getElementsByClassName("gameCell");
		for(let i=0; i<gameCells.length; i++){
			gameCells[i].classList.add("cellEmpty");
			gameCells[i].classList.remove("cellX");
			gameCells[i].classList.remove("cellO");
		}

		tictactoe.turn = "x";
		tictactoe.states = {
				"x" : [],
				"o" : []
		};
		tictactoe.winState = "";
		tictactoe.emptyCells = [1,2,3,4,5,6,7,8,9];
		tictactoe.processing = false;
		tictactoe.winner = "";
		
		let source = document.getElementById("svgGameBoard");
		source.classList.remove("fadeAway");
		
		let target = document.getElementById("gameResults");
		target.style.display = "none";
		
	},
	
	this.settings = function(event){
		
		if(event.target.dataset.player){
			let playerDiv = document.getElementById("player");
			if(event.target.dataset.player == "x"){
				playerDiv.innerHTML = "Play X";
				tictactoe.userPlays = "x";
				tictactoe.turn = "x";
			}else {
				playerDiv.innerHTML = "Play O";
				tictactoe.userPlays = "o";
				if(tictactoe.aganistMachine){
					tictactoe.machineTurn();
				}
			}
		}
		
		if(event.target.dataset.level){
			let levelDiv = document.getElementById("level");
			tictactoe.level = event.target.dataset.level;
			if(tictactoe.level == "easy"){
				levelDiv.innerHTML = "Easy";
				tictactoe.userPlays = tictactoe.userPlayed;
				tictactoe.aganistMachine = true;
			}else if(tictactoe.level == "medium"){
				levelDiv.innerHTML = "Medium";
				tictactoe.aganistMachine = true;
				tictactoe.userPlays = tictactoe.userPlayed;
			}else if(tictactoe.level == "hard"){
				levelDiv.innerHTML = "hard";
				tictactoe.userPlays = tictactoe.userPlayed;
				tictactoe.aganistMachine = true;
			}else if(tictactoe.level == "friend"){
				levelDiv.innerHTML = "Vs Friend";
				tictactoe.userPlayed = tictactoe.userPlays;
				tictactoe.userPlays = "";
				tictactoe.aganistMachine = false;
			}
		}
		
	},
	
	this.pickRandom = function(array){
		
		return array[Math.floor(Math.random() * array.length)];
		
	},
	
	this.machineTurn = function(){
		
		tictactoe.processing = true;
		if(this.winState == ""){
			
			setTimeout(function(){
				if(tictactoe.level == "easy"){
					tictactoe.playEasy();
				}	
				if(tictactoe.level == "medium"){
					tictactoe.playMedium();
				}
				if(tictactoe.level == "hard"){
					tictactoe.playHard();
				}
			}, 700);
			
		}
		
	},
	
	this.playEasy = function(){	
		
		let cellNo = this.pickRandom(this.emptyCells);
		this.draw(document.getElementById("cell"+cellNo));
		
	},
	
	this.playMedium = function(){
		
		let played = false;
		let opponent;
		if(this.turn == "x"){
			opponent = "o";
		}else {
			opponent = "x";
		}

		if(tictactoe.states[this.turn].length >= 2){
			
			for(let i=0; i<this.emptyCells.length; i++){
				let currentState = tictactoe.states[this.turn].slice();
				currentState.push(this.emptyCells[i]);
				console.log(currentState);
				let winState = this.isWinState(currentState, this.turn);
				if(winState){
					this.draw(document.getElementById("cell"+this.emptyCells[i]));
					return;
				}
			}
			
		}
		
		if(this.winState == "" && tictactoe.states[opponent].length >= 2) {
	
			for(let i=0; i<this.emptyCells.length; i++){
				let currentState = tictactoe.states[opponent].slice();
				currentState.push(this.emptyCells[i]);
				console.log(currentState);
				let winState = this.isWinState(currentState, opponent);
				if(winState){
					this.draw(document.getElementById("cell"+this.emptyCells[i]));
					return;
				}
			}
			
		} 
		
		if(!played){
			this.playEasy();
		}
			
	},

	this.playHard = function(){
		
		let played = false;
		let opponent;
		if(this.turn == "x"){
			opponent = "o";
		}else {
			opponent = "x";
		}
		
		if(tictactoe.states[opponent].length == 0 && tictactoe.states[this.turn].length == 0){
			this.draw(document.getElementById("cell2"));
			return;
		}
		
		if(tictactoe.states[opponent].length == 1 && (tictactoe.states[this.turn].length == 0 || tictactoe.states[this.turn].length == 1)){
			if(this.emptyCells.indexOf(5) != -1){
				this.draw(document.getElementById("cell5"));
				return;
			} else {
				this.draw(document.getElementById("cell1"));
				return;
			}
		}
		
		if(tictactoe.states[this.turn].length >= 2){
			
			for(let i=0; i<this.emptyCells.length; i++){
				let currentState = tictactoe.states[this.turn].slice();
				currentState.push(this.emptyCells[i]);
				console.log(currentState);
				let winState = this.isWinState(currentState, this.turn);
				if(winState){
					this.draw(document.getElementById("cell"+this.emptyCells[i]));
					return;
				}
			}
			
		}
		
		if(tictactoe.states[opponent].length >= 2) {
	
			for(let i=0; i<this.emptyCells.length; i++){
				let currentState = tictactoe.states[opponent].slice();
				currentState.push(this.emptyCells[i]);
				console.log(currentState);
				let winState = this.isWinState(currentState, opponent);
				if(winState){
					this.draw(document.getElementById("cell"+this.emptyCells[i]));
					return;
				}
			}
			
		}
		
		if(tictactoe.states[opponent].length == 2 && tictactoe.states[this.turn].length == 1){
			
			let corners = [1,3,7,9];
			let edge = [2,4,6,8];
			let  cornerCount = 0;
			for(let i=0; i<corners.length; i++){
				if(this.states[opponent].indexOf(corners[i]) == -1){
					cornerCount++;
				}
			}
			if(cornerCount >= 2){
				for(let i=0; i<edge.length; i++){
					if(this.emptyCells.indexOf(edge[i]) != -1){
						this.draw(document.getElementById("cell"+edge[i]));
						return;
					}
				}
			}
			
			for(let i=0; i<corner.length; i++){
				if(this.emptyCells.indexOf(corner) != -1){
					this.draw(document.getElementById("cell"+corner[i]));
					return;
				}
			}
			
		}
		
		if(!played){
			this.playEasy();
		}
		
		
	},
	
	this.deleteFromArray = function(array, element){
		
		let index = array.indexOf(element);
		if (index > -1) {
		    array.splice(index, 1);
		}

	}
	
}