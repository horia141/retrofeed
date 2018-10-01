describe("Status page", () => {
    it("Has OK result", () => {
        cy.visit("/real/tech/status");

        cy.contains("OK");
    });
});
