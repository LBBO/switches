import React from "react";

const initialConstillationsOfActiveFields = [
	[[1, 1], [2, 1], [3, 1], [1, 2], [3, 2], [1, 3], [2, 3], [3, 3]],
	[[0, 0], [0, 4], [1, 1], [1, 3], [2, 2], [3, 3], [3, 1], [4, 4], [4, 0]],
	[[0, 2], [1, 1], [1, 3], [2, 0], [2, 2], [2, 4], [3, 1], [3, 3], [4, 2]]
];

export default class Gameboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tiles: [],
			isRunning: false,
			activeTiles: 0,
			isWon: false
		};



		this.init = this.init.bind(this);
		this.start = this.start.bind(this);

		this.init();
	}

	init() {
		console.log('restart');
		this.state.isRunning = false;
		this.state.tiles = [];
		this.state.isWon = false;

		for (let i = 0; i < 5; i++) {
			let row = [];
			for (let j = 0; j < 5; j++) {
				row.push(false);
			}
			this.state.tiles.push(row);
		}
	}

	start() {
		const randomInitialSetup = initialConstillationsOfActiveFields[Math.round(Math.random() * 2)];

		for (let i = 0; i < randomInitialSetup.length; i++) {
			const rowIndex = randomInitialSetup[i][0];
			const colIndex = randomInitialSetup[i][1];
			this.state.tiles[rowIndex][colIndex] = true;
		}

		this.state.activeTiles = randomInitialSetup.length;
		this.state.isRunning = true;
		this.setState(this.state);
	}

	checkWin() {
		if (this.state.activeTiles === Math.pow(this.state.tiles.length, 2)) {
			this.state.isRunning = false;
			this.state.isWon = true;
			this.props.onWin();
		}
	}

	onTileClick(index) {
		if(this.state.isRunning && !this.state.isWon) {
			const rowIndex = Math.floor(index / this.state.tiles.length);
			const colIndex = index % this.state.tiles.length;

			for (let i = -1; i <= 1; i++) {
				if (rowIndex + i >= 0 && rowIndex + i < 5) {
					this.state.tiles[rowIndex + i][colIndex] = !this.state.tiles[rowIndex + i][colIndex];
					this.state.activeTiles += this.state.tiles[rowIndex + i][colIndex] ? 1 : -1;
				}

				//i may not be 0 because otherwise the clicked tile would be switched twice
				if (colIndex + i >= 0 && colIndex + i < 5 && i !== 0) {
					this.state.tiles[rowIndex][colIndex + i] = !this.state.tiles[rowIndex][colIndex + i];
					this.state.activeTiles += this.state.tiles[rowIndex][colIndex + i] ? 1 : -1;
				}
			}

			this.props.onMove();
			this.checkWin();
			this.setState(this.state);
		}
	}

	render() {
		return (
			<div className={"wrapper"}>
				{
					this.state.tiles
						.reduce((acc, row) => acc.concat(row))
						.map((tile, index) =>
							<div key={index} className={tile ? 'active' : 'inactive'} onClick={() => this.onTileClick(index)} >

							</div>
						)
				}
			</div>
		);
	}
}
