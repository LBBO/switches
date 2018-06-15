import React from "react";

export default class Header extends React.Component {
	render() {
		//if game was not started yet or if it was aborted, display button to start game. otherwise display amount of switches flipped so far
		if (!this.props.gameIsRunning) {
			return (
			  <div className="footer">
				<span className="newGame" onClick={this.props.onStart}>NEW GAME</span>
			  </div>
			);
		  } else {
			return (
			  <div className="footer">
				<span className="moveCounter">{this.props.movesMade} BUTTONS PRESSED</span>
			  </div>
			);
		  }
	}
}
