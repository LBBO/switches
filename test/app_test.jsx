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

		it('Should not change when switches are clicked', () => {
			const initialHTML = app.html();

			for (let i = 0; i < 25; i++) {
				app.find('.switch').at(i).simulate('click');
			}

			expect(app.html()).to.equal(initialHTML);
		});

		it('Should have one of three gameboard configurations (repeated 20 times)', () => {
			//flatten patterns for easier comparison
			const startingPatterns = app.instance().startingPatterns;
			expect(Array.isArray(startingPatterns)).to.be.true;

			//do this test 10 times
			for (let i = 0; i < 20; i++) {
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
					const switches = app.state().switches;
					expect(Array.isArray(switches)).to.be.true;

					const oldState = switches.slice(0);

					app.find('.switch').at(positionToBeFlipped[0] * 5 + positionToBeFlipped[1]).simulate('click');

					const newState = switches.slice(0);

					switches.forEach((row, rowIndex) => {
						row.forEach((col, colIndex) => {
							if(oldState[rowIndex][colIndex] === newState[rowIndex][colIndex]) {
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
		})
	});
});
