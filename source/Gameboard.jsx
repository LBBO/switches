import React from "react";

const startingPatterns = [
	[[1, 1], [2, 1], [3, 1], [1, 2], [3, 2], [1, 3], [2, 3], [3, 3]],
	[[0, 0], [0, 4], [1, 1], [1, 3], [2, 2], [3, 3], [3, 1], [4, 4], [4, 0]],
	[[0, 2], [1, 1], [1, 3], [2, 0], [2, 2], [2, 4], [3, 1], [3, 3], [4, 2]]
];

export default class Gameboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			switches: [],
			isPlayable: false,
			/**
			 * inactiveSwitches keeps track of currently inactive switches in order to reduce time complexity of checkForWin().
			 * The trivial solution (checking all switches in a for loop) would have a time complexity of O(n) with n being the total amount of switches (in this case 25).
			 * Now it's always O(1).
			 * 
			 * The cost of this is raising the time complexity of onSwitchClick() to O(n), but here n is the maximum amount of switches flipped in a row (3, in this case).
			 * This optimisation is completely useless right now but might be nice to have when the board is supposed to have more switches.
			 */
			inactiveSwitches: 0
		};

		this.init = this.init.bind(this);
		this.start = this.start.bind(this);

		this.init();
	}

	init() {
		this.state.isPlayable = false;
		
		//reset switches
		this.state.switches = [];
		for (let i = 0; i < 5; i++) {
			let row = [];
			for (let j = 0; j < 5; j++) {
				row.push(false);
			}
			this.state.switches.push(row);
		}
	}

	start() {
		//set switches to randomly chosen starting pattern and update inactiveSwitches & isPlayable
		const randomStartingPattern = startingPatterns[Math.round(Math.random() * 2)];

		for (let i = 0; i < randomStartingPattern.length; i++) {
			const rowIndex = randomStartingPattern[i][0];
			const colIndex = randomStartingPattern[i][1];
			this.state.switches[rowIndex][colIndex] = true;
		}

		this.state.inactiveSwitches = Math.pow(this.state.switches.length, 2) - randomStartingPattern.length;
		this.state.isPlayable = true;
		this.setState(this.state);
	}

	checkForWin() {
		//check if amount of inactive switches === 0
		if (this.state.inactiveSwitches === 0) {
			this.state.isPlayable = false;
			this.props.onWin();
		}
	}

	onSwitchClick(index) {
		//ignore click if game is not playable (in other words: if game was neither won, now aborted)
		if(this.state.isPlayable) {
			//calculate row and col of switch that was clicked on
			const rowIndex = Math.floor(index / this.state.switches.length);
			const colIndex = index % this.state.switches.length;

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

			//notify parents of move and check for win
			this.props.onMove();
			this.checkForWin();
			this.setState(this.state);
		}
	}

	render() {
		return (
			<div className={"wrapper"}>
				{
					//flatten switches array (which is currently 2D instead of 1D) and 
					this.state.switches
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
