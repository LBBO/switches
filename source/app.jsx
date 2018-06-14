import React, { Component } from "react";
import Gameboard from "./Gameboard";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameIsRunning: false,
      movesMade: 0,
      gameIsWon: false
    }

    this.renderTitle = this.renderTitle.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.startGame = this.startGame.bind(this);
    this.abort = this.abort.bind(this);
    this.restart = this.restart.bind(this);
    this.win = this.win.bind(this);
  }

  renderTitle() {
    return (
			<div className="header">
				<span className="title">{
          this.state.gameIsWon ? 'VICTORY' : (this.state.gameIsRunning ? 'TAP A TILE' : 'SWITCHES')
        }</span>
				{/* {this.state.gameIsRunning ? <span className="abort" onClick={this.abort}>ABORT</span> : null} */}
				{
          this.state.gameIsWon ? 
            <span className="abort" onClick={this.restart}>RESTART</span> :
            (this.state.gameIsRunning ? <span className="abort" onClick={this.abort}>ABORT</span> : null)
        }
			</div>
		);
  }

  renderFooter() {
    if (!this.state.gameIsRunning) {
			return (
				<div className="footer">
					<span className="newGame" onClick={this.startGame}>NEW GAME</span>
				</div>
			);
		} else {
			return (
				<div className="footer">
					<span className="moveCounter">{this.state.movesMade} BUTTONS PRESSED</span>
				</div>
			);
		}
  }

  startGame() {
    this.state.gameIsRunning = true;
    this.state.gameIsWon = false;
    this.state.movesMade = 0;
    this.state.gameBoard.start();
    this.setState(this.state);
  }

  abort() {
    this.state.gameIsRunning = false;
    this.state.gameBoard.init();
    this.setState(this.state);
  }

  restart() {
    this.state.gameBoard.init();
    this.startGame();
  }

  win() {
    this.state.gameIsWon = true;
    this.state.gameBoard.init();
    this.setState(this.state);
  }

  render() {
    return (
      <div className={'game ' + (this.state.gameIsRunning ? 'gameIsRunning' : 'gameIsNotRunning') + (this.state.gameIsWon ? ' gameIsWon' : '')}>
				{this.renderTitle()}
				<Gameboard
          ref={gameBoard => this.state.gameBoard = gameBoard}
          onMove={() => {this.state.movesMade++; this.setState(this.state)}}
          onWin={this.win}
				>

				</Gameboard>
				{this.renderFooter()}
			</div>
    )
  }
}
