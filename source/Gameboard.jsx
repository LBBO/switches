import React from "react";

export default class Gameboard extends React.Component {
	onSwitchClick(index) {
		//calculate row and col of switch that was clicked on
		const rowIndex = Math.floor(index / this.props.switches.length);
		const colIndex = index % this.props.switches.length;

		//ignore click if game is disabled
		if (!this.props.disable) {
			this.props.onMove(rowIndex, colIndex);
		}
	}

	render() {
		return (
			<div className={"wrapper"}>
				{
					(this.props.switches && Array.isArray(this.props.switches) && this.props.switches.length > 0) ?
						//flatten switches array (which is currently 2D instead of 1D) and 
						this.props.switches
							.reduce((acc, row) => acc.concat(row))
							.map((currSwitch, index) =>
								<div key={index} className={'switch ' + (currSwitch ? 'active' : 'inactive')} onClick={() => this.onSwitchClick(index)} >

								</div>
							)
						: null
				}
			</div>
		);
	}
}
