import React from "react";
import App from "app";
import chai from "chai";
import { mount } from "enzyme";
import sinon from "sinon";
import sinonChai from "sinon-chai";
const expect = chai.expect;
chai.use(sinonChai);

describe("App component", () => {
	let app;

	beforeEach(() => {
		app = mount(<App />);
	});

	const checkIfGameboardHasOneOfTheSetupPatterns = () => {
		//flatten patterns for easier comparison
		const startingPatterns = app.instance().startingPatterns;
		expect(Array.isArray(startingPatterns)).to.be.true;

		expect(
			startingPatterns
				.reduce((workingPatternHasBeenFound, pattern) => {
					//check for correct amount of inactive switches
					let currPatternWorks = app.find('.inactive').length === 25 - pattern.length;

					if (currPatternWorks) {
						//check if all active switches are in correct position
						currPatternWorks = pattern.reduce(
							(acc, currSwitch) =>
								acc && app.find('.switch').at(currSwitch[0] * 5 + currSwitch[1]).hasClass('active')
							, true
						);
					}

					return (currPatternWorks && !workingPatternHasBeenFound) || (!currPatternWorks && workingPatternHasBeenFound);
				}, false)
		).to.be.true;
	};

	const checkIfClicksOnSwitchesChangeHTML = () => {
		const initialHTML = app.html();
		for (let i = 0; i < 25; i++) {
			app.find('.switch').at(i).simulate('click');
		}
		expect(app.html()).to.equal(initialHTML);
	};

	it("Should display header, gameboard and footer", () => {
		expect(app.find('.game').children()).to.have.lengthOf(3);
		expect(app.find('.header')).to.have.lengthOf(1);
		expect(app.find('.wrapper')).to.have.lengthOf(1);
		expect(app.find('.footer')).to.have.lengthOf(1);
	});

	describe('Initially', () => {
		it('Should display "SWITCHES" in the header', () => {
			expect(app.find('.header').text()).to.equal('SWITCHES');
		});

		it('Should display "NEW GAME" button in the footer', () => {
			expect(app.find('.footer').find('.newGame')).to.have.lengthOf(1);
			expect(app.find('.footer').text()).to.equal('NEW GAME');
		});

		it('Should display 25 switches in game board', () => {
			expect(app.find('.switch')).to.have.lengthOf(25);
		});

		it('Should give game board gameIsNotRunning class', () => {
			expect(app.find('.gameIsNotRunning')).to.have.lengthOf(1);
		});

		it('Should not change when switches are clicked', checkIfClicksOnSwitchesChangeHTML);

		it('Should have one of three gameboard configurations (repeated 20 times)', () => {
			//do this test 10 times
			for (let i = 0; i < 20; i++) {
				checkIfGameboardHasOneOfTheSetupPatterns();
				app = mount(<App />);
			}
		});
	});

	describe('After click on "NEW GAME"', () => {
		beforeEach(() => {
			app.find('.newGame').simulate('click');
		})

		it('Should display "TAP A SWITCH" in the title', () => {
			expect(app.find('.title').text()).to.equal('TAP A SWITCH');
		});

		it('Should have "ABORT" button in header', () => {
			expect(app.find('.abort')).to.have.lengthOf(1);
			expect(app.find('.abort').text()).to.equal('ABORT');
		});

		it('Should handle click on "ABORT" button correctly', () => {
			app.find('.abort').simulate('click');
			expect(app.find('.gameIsNotRunning')).to.have.lengthOf(1);
			expect(app.find('.gameIsRunning')).to.have.lengthOf(0);

			expect(app.find('.header')).to.have.lengthOf(1);
			expect(app.find('.header').find('.abort')).to.have.lengthOf(0);
			expect(app.find('.header').find('.title')).to.have.lengthOf(1);
			expect(app.find('.header').text()).to.equal('SWITCHES');

			expect(app.find('.footer')).to.have.lengthOf(1);
			expect(app.find('.footer').find('.moveCounter')).to.have.lengthOf(0);
			expect(app.find('.footer').find('.newGame')).to.have.lengthOf(1);
			expect(app.find('.footer').text()).to.equal('NEW GAME');

			checkIfGameboardHasOneOfTheSetupPatterns();
		});

		it('Should display "0 BUTTONS PRESSED" in the footer', () => {
			expect(app.find('.footer').find('.moveCounter')).to.have.lengthOf(1);
			expect(app.find('.footer').text()).to.equal('0 BUTTONS PRESSED');
		});

		it('Should display 25 switches in game board', () => {
			expect(app.find('.switch')).to.have.lengthOf(25);
		});

		it('Should give game board gameIsRunning class', () => {
			expect(app.find('.gameIsRunning')).to.have.lengthOf(1);
		});

		it('Should change every time a switch is clicked', () => {
			let lastHTML = app.html();

			for (let i = 0; i < 25; i++) {
				app.find('.switch').at(i).simulate('click');
				expect(app.html()).to.not.equal(lastHTML);
				lastHTML = app.html();
			}

		});

		describe('Handles clicks on Switches correctly', () => {
			const flipSwitchAndCheckNeighbors = (positionToBeFlipped, otherPositionsExpectedToChange) => {
				const allPositionsExpectedToChange = [positionToBeFlipped, ...otherPositionsExpectedToChange];

				//expect no error of any kind to be thrown
				expect(() => {
					//save old state of switches. then click on specified switch and save new state of switches. compare each old and new value. if they are different,
					//expect their position to be in allPositionsExpectedToChange. if they are equal, expect their position to not be in allPositionsExpectedToChange
					const oldSwitches = app.state().switches;

					//calculate expected amount of inactive switches after flipping switch and compare it to actual amount from app.state
					const differenceInAmountOfInactiveSwitches = [positionToBeFlipped, ...otherPositionsExpectedToChange]
						.reduce((acc, curr) => acc + (oldSwitches[curr[0]][curr[1]] ? 1 : -1), 0);
					const expectedNewInactiveSwitches = app.state().inactiveSwitches + differenceInAmountOfInactiveSwitches;

					app.find('.switch').at(positionToBeFlipped[0] * 5 + positionToBeFlipped[1]).simulate('click');

					const newSwitches = app.state().switches;

					expect(app.state().inactiveSwitches).to.equal(expectedNewInactiveSwitches);

					newSwitches.forEach((row, rowIndex) => {
						row.forEach((col, colIndex) => {
							if (oldSwitches[rowIndex][colIndex] === newSwitches[rowIndex][colIndex]) {
								expect(allPositionsExpectedToChange.indexOf([rowIndex, colIndex])).to.equal(-1);
							} else {
								expect(allPositionsExpectedToChange.indexOf([rowIndex, colIndex])).to.not.equal(-1);
							}
						})
					});
				}).to.not.throw();
			};

			it('When switch with neighboring switches in all four directions is clicked', () => {
				flipSwitchAndCheckNeighbors([2, 2], [
					[1, 2], //top
					[3, 2], //bottom
					[2, 1], //left
					[2, 3] //right
				]);
			});

			it('When switch in top left is clicked', () => {
				flipSwitchAndCheckNeighbors([0, 0], [
					[1, 0], //bottom
					[0, 1] //right
				]);
			});

			it('When switch in top right is clicked', () => {
				flipSwitchAndCheckNeighbors([0, 4], [
					[1, 4], //bottom
					[0, 3] //left
				]);
			});

			it('When switch in bottom left is clicked', () => {
				flipSwitchAndCheckNeighbors([4, 0], [
					[3, 0], //top
					[4, 1] //right
				]);
			});

			it('When switch in bottom right is clicked', () => {
				flipSwitchAndCheckNeighbors([4, 4], [
					[3, 4], //top
					[4, 3] //left
				]);
			});

			it('When switch at the top edge is clicked', () => {
				flipSwitchAndCheckNeighbors([0, 2], [
					[1, 2], //bottom
					[0, 1], //left
					[0, 3] //right
				]);
			});

			it('When switch at the bottom edge is clicked', () => {
				flipSwitchAndCheckNeighbors([4, 2], [
					[3, 2], //top
					[4, 1], //left
					[4, 3] //right
				]);
			});

			it('When switch at the left edge is clicked', () => {
				flipSwitchAndCheckNeighbors([2, 0], [
					[1, 0], //top
					[3, 0], //bottom
					[2, 1] //right
				]);
			});

			it('When switch at the right edge is clicked', () => {
				flipSwitchAndCheckNeighbors([2, 4], [
					[1, 4], //top
					[3, 4], //bottom
					[2, 3] //left
				]);
			});

			it('By incrementing the move counter every time a switch is flipped', () => {
				const footer = app.find('.footer');
				for (let i = 0; i < 50; i++) {
					expect(footer.text()).to.match(new RegExp('^' + i + ' BUTTONS PRESSED$'));
					app.find('.switch').at(Math.floor(Math.random() * 24)).simulate('click');
				}
			});
		});

		describe('Detects and handles wins correctly and thus', () => {
			beforeEach(() => {
				//create situation where wins after first switch is flipped

				//for whatever reason, Array(5).fill(Array(5).fill(true)) resulted in an array of five times [false, false, true, true, true]...
				let newSwitches = [
					[true, true, true, true, true],
					[true, true, true, true, true],
					[true, true, true, true, true],
					[true, true, true, true, true],
					[true, true, true, true, true]
				];

				newSwitches[0][0] = false;
				newSwitches[0][1] = false;
				newSwitches[1][0] = false;

				app.setState({
					switches: newSwitches,
					inactiveSwitches: 3
				});
			});

			const winGame = () => {
				app.find('.switch').at(0).simulate('click');
			};

			it('Should not announce a win if there are any inactive switches', () => {
				for (let i = 0; i < 5; i++) {
					for (let j = 0; j < 5; j++) {
						let appState = app.state();

						//create situation where wins after first switch is flipped
						let newSwitches = Array(5).fill(Array(5).fill(true));
						newSwitches[i][j] = false;
						appState.switches = newSwitches;
						appState.inactiveSwitches = 1;

						app.setState(appState);

						expect(app.state().gameIsWon).to.be.false;
					}
				}
			});

			it('Should announce a win if there are no inactive switches', () => {
				winGame();
				expect(app.state().gameIsWon).to.be.true;
			});

			it('Should display "VICTORY" in title', () => {
				winGame();
				expect(app.find('.title').text()).to.equal('VICTORY');
			});

			it('Should display "RESTART" button in title', () => {
				winGame();
				expect(app.find('.abort')).to.have.lengthOf(1);
				expect(app.find('.abort').text()).to.equal('RESTART');
			});

			it('Should display a new and running game after click on "RESTART"', () => {
				winGame();
				app.find('.abort').simulate('click');

				expect(app.find('.abort')).to.have.lengthOf(1);
				expect(app.find('.abort').text()).to.equal('ABORT');

				expect(app.find('.title')).to.have.lengthOf(1);
				expect(app.find('.title').text()).to.equal('TAP A SWITCH');

				expect(app.find('.moveCounter')).to.have.lengthOf(1);
				expect(app.find('.moveCounter').text()).to.equal('0 BUTTONS PRESSED');

				checkIfGameboardHasOneOfTheSetupPatterns();
			});

			it('Should not change HTML when switches are clicked', () => {
				winGame();
				checkIfClicksOnSwitchesChangeHTML();
			});
		})
	});
});
