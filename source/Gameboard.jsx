import React from "react";

export default class Gameboard extends React.Component {
	onSwitchClick(index) {
		//ignore click if game is disabled
		if(!this.props.disable) {
			this.props.onMove(index);
		}
	}

	render() {
		return (
			<div className={"wrapper"}>
				{
					//flatten switches array (which is currently 2D instead of 1D) and 
					this.props.switches
						.reduce((acc, row) => acc.concat(row))
						.map((currSwitch, index) =>
							<div key={index} className={currSwitch ? 'active' : 'inactive'} onClick={() => this.onSwitchClick(index)} >

							</div>
						)
				}
			</div>
		);
	}
}
