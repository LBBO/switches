import React, { Component } from "react";
import Gameboard from "./Gameboard";
import Header from "./Header";
import Footer from "./Footer";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.startingPatterns = [
      [[1, 1], [2, 1], [3, 1], [1, 2], [3, 2], [1, 3], [2, 3], [3, 3]],
      [[0, 0], [0, 4], [1, 1], [1, 3], [2, 2], [3, 3], [3, 1], [4, 4], [4, 0]],
      [[0, 2], [1, 1], [1, 3], [2, 0], [2, 2], [2, 4], [3, 1], [3, 3], [4, 2]]
    ];

    this.state = {
      gameIsRunning: false,
      movesMade: 0,
      gameIsWon: false,
      switches: [],
			/**
			 * inactiveSwitches keeps track of currently inactive switches in order to reduce time complexity of checkForWin().
			 * The trivial solution (checking all switches in a for loop) would have a time complexity of O(n) with n being the total amount of switches (in this case 25).
			 * Now it's always O(1).
			 * 
			 * The cost of this is raising the time complexity of onSwitchClick() to O(n), but here n is the maximum amount of switches flipped in a row (3, in this case).
			 * This optimisation is completely useless right now but might be nice to have when the board is supposed to have more switches.
			 */
      inactiveSwitches: 0
    }

    this.startGame = this.startGame.bind(this);
    this.abort = this.abort.bind(this);
    this.restart = this.restart.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.resetSwitches = this.resetSwitches.bind(this);
    this.onSwitchFlip = this.onSwitchFlip.bind(this);

    this.resetSwitches();
  }

  resetSwitches() {
    this.state.switches = [];
    for (let i = 0; i < 5; i++) {
      let row = [];
      for (let j = 0; j < 5; j++) {
        row.push(false);
      }
      this.state.switches.push(row);
    }
    
    //set switches to randomly chosen starting pattern and update inactiveSwitches
    const randomStartingPattern = this.startingPatterns[Math.round(Math.random() * 2)];

    for (let i = 0; i < randomStartingPattern.length; i++) {
      const rowIndex = randomStartingPattern[i][0];
      const colIndex = randomStartingPattern[i][1];
      this.state.switches[rowIndex][colIndex] = true;
    }

    this.state.inactiveSwitches = Math.pow(this.state.switches.length, 2) - randomStartingPattern.length;
  }

  startGame() {
    this.resetSwitches();
    this.state.gameIsRunning = true;
    this.state.gameIsWon = false;
    this.state.movesMade = 0;
    this.setState(this.state);
  }

  abort() {
    this.state.gameIsRunning = false;
    this.setState(this.state);
  }

  restart() {
    this.startGame();
  }

  checkForWin() {
      this.state.gameIsWon = this.state.inactiveSwitches === 0;
  }

  onSwitchFlip(rowIndex, colIndex) {
    this.state.movesMade++;

    //iterates over the clicked switch and it's neighbors independently from all axes
    for (let i = -1; i <= 1; i++) {
      //handle curr element in same col
      if (rowIndex + i >= 0 && rowIndex + i < 5) {
        //flip switch and increment / decrement inactiveSwitches accordingly
        this.state.switches[rowIndex + i][colIndex] = !this.state.switches[rowIndex + i][colIndex];
        this.state.inactiveSwitches -= this.state.switches[rowIndex + i][colIndex] ? 1 : -1;
      }

      //handle curr element in same row. i may not be 0 (thus referring to the clicked switch itself) because otherwise the clicked switch would be switched twice
      if (colIndex + i >= 0 && colIndex + i < 5 && i !== 0) {
        this.state.switches[rowIndex][colIndex + i] = !this.state.switches[rowIndex][colIndex + i];
        this.state.inactiveSwitches -= this.state.switches[rowIndex][colIndex + i] ? 1 : -1;
      }
    }

    //check for win
    this.checkForWin();
    this.setState(this.state);
  }

  render() {
    return (
      <div className={'game ' + (this.state.gameIsRunning ? 'gameIsRunning' : 'gameIsNotRunning') + (this.state.gameIsWon ? ' gameIsWon' : '')}>
        <Header
          gameIsRunning={this.state.gameIsRunning}
          gameIsWon={this.state.gameIsWon}
          onRestart={this.restart}
          onAbort={this.abort}
        >
        </Header>

        <Gameboard
          onMove={this.onSwitchFlip}
          disable={!this.state.gameIsRunning || this.state.gameIsWon}
          switches={this.state.switches}
        >
        </Gameboard>

        <Footer
          gameIsRunning={this.state.gameIsRunning}
          onStart={this.startGame}
          movesMade={this.state.movesMade}
        >
        </Footer>
      </div>
    );
  }
}
