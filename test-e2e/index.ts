import "cypress";
import "mocha";

import * as os from "os";

console.log(os.homedir());

describe("Main page", () => {
    it("Has main data", () => {
        cy.visit("/");

        cy.contains(`Hello World - ${Cypress.env("ENV")}`);
    });
});
