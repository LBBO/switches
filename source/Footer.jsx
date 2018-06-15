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
			let buttonsPressed = 0;
			if(this.props.buttonsPressed && typeof this.props.buttonsPressed === 'number' && this.props.buttonsPressed >= 0) {
				buttonsPressed = this.props.buttonsPressed;
			}
			return (
				<div className="footer">
					<span className="moveCounter">{buttonsPressed} BUTTONS PRESSED</span>
				</div>
			);
		}
	}
}
