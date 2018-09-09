describe("Main page", () => {
    it("Has main data", () => {
        cy.visit("/");

        cy.title().should("eq", "Home Man");
        cy.contains("World");
    });
});
