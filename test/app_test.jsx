import React from "react"
import App from "app"
import { assert } from "chai"
import { mount } from "enzyme"

describe("App component", () => {
  xit("Display headline", () => {
    const wrapper = mount(<App />)

    assert.strictEqual(wrapper.find("h1").text(), "Insert Switches here.")
  })
})
