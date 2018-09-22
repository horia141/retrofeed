describe("Status page", () => {
    it("Has OK result", () => {
        cy.visit("/tech/status");

        cy.contains("OK");
    });
});
