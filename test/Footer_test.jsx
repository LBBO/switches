import React from "react";
import Footer from "Footer";
import chai from "chai";
import { mount } from "enzyme";
import sinon from "sinon";
import sinonChai from "sinon-chai";
const expect = chai.expect;
chai.use(sinonChai);

describe("Footer component", () => {
  it("Should display 'new game' button if nothing else is configured", () => {
	const wrapper = mount(<Footer />);
	const newGameEl = wrapper.find('.newGame');
	expect(newGameEl).to.have.lengthOf(1);
	expect(newGameEl.text()).to.equal('NEW GAME');
  });

  it("Should display 'new game' button if game is not running", () => {
	const wrapper = mount(<Footer />);
	wrapper.setProps({
		gameIsRunning: false
	});
	const newGameEl = wrapper.find('.newGame');
	expect(newGameEl).to.have.lengthOf(1);
	expect(newGameEl.text()).to.equal('NEW GAME');
  });

  it("Should redirect clicks to 'NEW GAME'", () => {
	const wrapper = mount(<Footer />);
	const spy = sinon.spy();
	wrapper.setProps({
		gameIsRunning: false,
		onStart: spy
	});
	expect(spy).to.not.have.been.called;
	wrapper.find('.newGame').simulate('click');
	expect(spy).to.have.been.calledOnce;
  });

  it("Should display that 0 buttons have been pressed when nothing else was specified (except that the game is running)", () => {
    const wrapper = mount(<Footer />);
	wrapper.setProps({
		gameIsRunning: true
	});
	expect(wrapper.find('.moveCounter').text()).to.match(/^0 .+$/)
  });

  it("Should display specified amount of buttons pressed", () => {
    const wrapper = mount(<Footer />);
	

	for(let i = 0; i < 10; i++) {
		const rand = Math.floor(Math.random() * 10000000);
		wrapper.setProps({
			gameIsRunning: true,
			buttonsPressed: rand
		});
		expect(wrapper.find('.moveCounter').text()).to.match(new RegExp('^' + rand.toString() + '.+$'))
	}
  });

  it("Should not accept negaitve values for buttonsPressed", () => {
    const wrapper = mount(<Footer />);
	

	for(let i = 0; i < 10; i++) {
		const rand = Math.floor(Math.random() * -10000000);
		wrapper.setProps({
			gameIsRunning: true,
			buttonsPressed: rand
		});
		expect(wrapper.find('.moveCounter').text()).to.match(new RegExp(/^0 .+$/))
	}
  });

  it("Should only accept numbers for buttonsPressed", () => {
	const wrapper = mount(<Footer />);
	
	wrapper.setProps({
		gameIsRunning: true,
		buttonsPressed: '12'
	});
	expect(wrapper.find('.moveCounter').text()).to.match(/^0 .+$/)

	wrapper.setProps({
		gameIsRunning: true,
		buttonsPressed: true
	});
	expect(wrapper.find('.moveCounter').text()).to.match(/^0 .+$/)

	wrapper.setProps({
		gameIsRunning: true,
		buttonsPressed: [12]
	});
	expect(wrapper.find('.moveCounter').text()).to.match(/^0 .+$/)
  });
});
