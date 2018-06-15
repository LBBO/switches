import React from "react";
import Gameboard from "Gameboard";
import chai from "chai";
import { mount, render } from "enzyme";
import sinon from "sinon";
import sinonChai from "sinon-chai";
const expect = chai.expect;
chai.use(sinonChai);

describe("Gameboard component", () => {
	let gameboard, wrapper;

	beforeEach(() => {
		gameboard = mount(<Gameboard />);
		wrapper = gameboard.find('.wrapper');
	})

	it("Should display nothing when no props are passed", () => {
		expect(wrapper.children()).to.have.lengthOf(0);
	});

	it("Should create as many switches as passed", () => {
		gameboard.setProps({
			gameIsRunning: true,
			switches: [[true, true, true]]
		});

		//plus one because .wrapper is also a div
		expect(gameboard.find('div')).to.have.lengthOf(3 + 1);
	});

	describe('initialised with 25 inactive switches', () => {
		let switches;

		beforeEach(() => {
			switches = [];
			for (let i = 0; i < 5; i++) {
				let row = []

				for (let j = 0; j < 5; j++) {
					row.push(false);
				}

				switches.push(row);
			}
			gameboard.setProps({
				switches: switches
			});
		});

		it('Should display all 25 switches', () => {
			expect(gameboard.find('.switch')).to.have.lengthOf(25);
		});

		it('Should be able to display random amounts of active and inactive switches', () => {
			const randomAmountOfActiveSwitches = Math.floor(Math.random() * 23) + 2;

			for(let i = 0; i < randomAmountOfActiveSwitches; i++) {
				let randomRowIndex, randomColIndex;

				do {
					randomRowIndex = Math.floor(Math.random() * 5);
					randomColIndex = Math.floor(Math.random() * 5);
				} while(switches[randomRowIndex][randomColIndex]);

				switches[randomRowIndex][randomColIndex] = true;
			}

			gameboard.setProps({ switches: switches });

			expect(gameboard.find('.active')).to.have.lengthOf(randomAmountOfActiveSwitches);
			expect(gameboard.find('.inactive')).to.have.lengthOf(25 - randomAmountOfActiveSwitches);
		});

		it('Should never give a switch both .active and .inactive', () => {
			const randomAmountOfActiveSwitches = Math.floor(Math.random() * 23) + 2;

			for(let i = 0; i < randomAmountOfActiveSwitches; i++) {
				let randomRowIndex, randomColIndex;

				do {
					randomRowIndex = Math.floor(Math.random() * 5);
					randomColIndex = Math.floor(Math.random() * 5);
				} while(switches[randomRowIndex][randomColIndex]);

				switches[randomRowIndex][randomColIndex] = true;
			}

			gameboard.setProps({ switches: switches });

			for (let i = 0; i < 5; i++) {
				for (let j = 0; j < 5; j++) {
					const totalIndex = i * 5 + j;

					expect(gameboard.find('.switch').at(totalIndex).hasClass('active')).to.equal(switches[i][j]);
					expect(gameboard.find('.switch').at(totalIndex).hasClass('inactive')).to.equal(!switches[i][j]);
				}
			}
		});

		it('Should display switches in correct order (one row after another, not on col after another)', () => {
			switches[1][1] = true; // --> 5 elements in 1st row + 2 in 2nd = 7th element (or 6th, when counting starts at 0)
			gameboard.setProps({ switches: switches });

			expect(gameboard.find('.switch').at(6).hasClass('active')).to.equal(true);
		});

		it('Should not be clickable when disabled', () => {
			const spy = sinon.spy();
			gameboard.setProps({
				switches: switches,
				disable: true,
				onMove: spy
			});

			gameboard.find('.switch').at(5).simulate('click');

			expect(spy).to.not.have.been.called;
		});

		it('Should be clickable when not disabled', () => {
			const spy = sinon.spy();
			gameboard.setProps({
				switches: switches,
				disable: false,
				onMove: spy
			});

			gameboard.find('.switch').at(5).simulate('click');

			expect(spy).to.have.been.calledOnce;
		});

		it('Should call callback with correct row and col indexes', () => {
			const spy = sinon.spy();
			gameboard.setProps({
				switches: switches,
				disable: false,
				onMove: spy
			});

			for (let i = 0; i < 5; i++) {
				for (let j = 0; j < 5; j++) {
					const totalIndex = i * 5 + j;
					gameboard.find('.switch').at(totalIndex).simulate('click');
				}
			}

			for (let i = 0; i < 5; i++) {
				for (let j = 0; j < 5; j++) {
					expect(spy).to.have.been.calledWithExactly(i, j);
				}
			}

			expect(spy).to.have.callCount(25);
		});
	});
});
