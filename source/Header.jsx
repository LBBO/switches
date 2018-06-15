import React from "react";

export default class Header extends React.Component {
	render() {
		return (
			<div className="header">
			  <span className="title">
				{
				  this.props.gameIsWon ? 'VICTORY' : (this.props.gameIsRunning ? 'TAP A SWITCH' : 'SWITCHES')
				}
			  </span>
			  {
				//if game is won, display RESTART button. otherwise display ABORT button if game is at least running and nothing otherwise
				this.props.gameIsWon ?
				  <span className="abort" onClick={this.props.onRestart}>RESTART</span> :
				  (this.props.gameIsRunning ? <span className="abort" onClick={this.props.onAbort}>ABORT</span> : null)
			  }
			</div>
		  );
	}
}
