import React, { Component } from "react";
import Gameboard from "./Gameboard";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameIsRunning: false
    }

    this.renderTitle = this.renderTitle.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.abort = this.abort.bind(this);
    this.restart = this.restart.bind(this);
    this.win = this.win.bind(this);
  }

  renderTitle() {

  }

  renderFooter() {

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
