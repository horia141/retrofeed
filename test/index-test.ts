import { expect } from "chai";
import "mocha";

import { addTwo } from "../src/index";

describe("addTwo", () => {
    it("Should add 2", () => {
        expect(addTwo(10)).to.eql(12);
    });
});
