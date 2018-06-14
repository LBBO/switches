import React from "react";

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
		let row = [];
		for(let i = 0; i < 4; i++) {
			row.push(false);
		}
		this.state.tiles.push(row);
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
