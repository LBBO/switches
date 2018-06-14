import React, { Component } from "react";
import Gameboard from "./Gameboard";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameIsRunning: false,
      movesMade: 0
    }

    this.renderTitle = this.renderTitle.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.abort = this.abort.bind(this);
    this.restart = this.restart.bind(this);
    this.win = this.win.bind(this);
  }

  renderTitle() {
    return (
			<div className="header">
				<span className="title">SWITCHES</span>
				{this.state.gameIsRunning ? <span className="abort" onClick={this.abort}>ABORT</span> : null}
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

  abort() {

  }

  restart() {

  }

  win() {

  }

  render() {
    return (
      <div className={'game ' + (this.state.gameIsRunning ? 'gameIsRunning' : 'gameIsNotRunning')}>
				{this.renderTitle()}
				<Gameboard
					
				>

				</Gameboard>
				{this.renderFooter()}
			</div>
    )
  }
}
