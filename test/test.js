import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import chai from "chai"

Enzyme.configure({ adapter: new Adapter() })

// You can list more individual test files here:
require("Header_test");
require("Footer_test");
require("Gameboard_test");
require("app_test");
