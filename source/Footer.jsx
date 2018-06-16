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
			let movesMade = 0;
			if(this.props.movesMade && typeof this.props.movesMade === 'number' && this.props.movesMade >= 0) {
				movesMade = this.props.movesMade;
			}
			return (
				<div className="footer">
					<span className="moveCounter">{movesMade} BUTTONS PRESSED</span>
				</div>
			);
		}
	}
}
