describe("Status page", () => {
    it("Has OK result", () => {
        cy.visit("/status");

        cy.contains("OK");
    });
});
