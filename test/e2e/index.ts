describe("Main page", () => {
    it("Has main data", () => {
        cy.visit("/");

        cy.title().should("eq", "RetroFeed");
        cy.contains("Hello");
    });
});
