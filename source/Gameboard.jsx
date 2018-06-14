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
			tiles: []
		};

		
		
		this.init = this.init.bind(this);
		this.start = this.start.bind(this);
		
		this.init();
	}
	
	init() {
		for(let i = 0; i < 5; i++) {
			let row = [];
			for(let j = 0; j < 5; j++) {
				row.push(false);
			}
			this.state.tiles.push(row);
		}

		const randomInitialSetup = initialConstillationsOfActiveFields[Math.round(Math.random() * 2)];

		for(let i = 0; i < randomInitialSetup.length; i++) {
			const rowIndex = randomInitialSetup[i][0];
			const colIndex = randomInitialSetup[i][1];
			this.state.tiles[rowIndex][colIndex] = true;
		}
	}
	
	start() {
		
	}
	
	render() {
		return (
			<div className={"wrapper"}>
				{
					this.state.tiles
						.reduce((acc, row) => acc.concat(row))
						.map((tile, index) => 
							<div key={index} className={tile ? 'active' : 'inactive'}>

							</div>
						)
				}
			</div>
		);
	}
}
