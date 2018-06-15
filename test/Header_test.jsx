import React from "react";
import Header from "Header";
import chai from "chai";
import { mount } from "enzyme";
import sinon from "sinon";
import sinonChai from "sinon-chai";
const expect = chai.expect;
chai.use(sinonChai);

describe("Header component", () => {
  it("Should display the game's title if nothing else is configured", () => {
    const wrapper = mount(<Header />);
	expect(wrapper.find('.header .title').text()).to.equal('SWITCHES');
  });

  it("Should display the game's title if game is neither running, nor won", () => {
	const wrapper = mount(<Header />);
	wrapper.setProps({
		gameIsRunning: false,
		gameIsWon: false
	});

	expect(wrapper.find('.header .title').text()).to.equal('SWITCHES');
  });

  it("Should display 'TAP A SWITCH' if game is running and not won", () => {
	const wrapper = mount(<Header />);
	wrapper.setProps({
		gameIsRunning: true,
		gameIsWon: false
	});
	expect(wrapper.find('.header .title').text()).to.equal('TAP A SWITCH');
	expect(wrapper.find('.abort')).to.have.lengthOf(1);
	expect(wrapper.find('.header .abort').text()).to.equal('ABORT');
  });

  it("Should display 'VICTORY' and 'RESTART' button if game is won", () => {
	const wrapper = mount(<Header />);
	wrapper.setProps({
		gameIsRunning: true,
		gameIsWon: true
	});
	expect(wrapper.find('.header .title').text()).to.equal('VICTORY');
	expect(wrapper.find('.abort')).to.have.lengthOf(1);
	expect(wrapper.find('.header .abort').text()).to.equal('RESTART');


	wrapper.setProps({
		gameIsRunning: false,
		gameIsWon: true
	});
	expect(wrapper.find('.header .title').text()).to.equal('VICTORY');
	expect(wrapper.find('.abort')).to.have.lengthOf(1);
	expect(wrapper.find('.header .abort').text()).to.equal('RESTART');
  });

  it("Should forward clicks made to abort", () => {
	const wrapper = mount(<Header />);
	const spy = sinon.spy();
	wrapper.setProps({
		gameIsRunning: true,
		gameIsWon: false,
		onAbort: spy
	});
	wrapper.find('.abort').simulate('click');

	expect(spy).to.have.been.called;
  });

  it("Should forward clicks made to restart", () => {
	const wrapper = mount(<Header />);
	const spy = sinon.spy();
	wrapper.setProps({
		gameIsRunning: true,
		gameIsWon: true,
		onRestart: spy
	});
	wrapper.find('.abort').simulate('click');

	expect(spy).to.have.been.calledOnce;


	wrapper.setProps({
		gameIsRunning: false,
		gameIsWon: true,
		onRestart: spy
	});
	wrapper.find('.abort').simulate('click');

	expect(spy).to.have.been.calledTwice;
  });
});
