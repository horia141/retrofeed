import "mocha";

describe("Main page", () => {
    it("Has main data", () => {
        cy.visit("/");

        cy.contains(`Hello World - ${Cypress.env("ENV")}`);
    });
});
