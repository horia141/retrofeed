import { expect } from "chai";
import * as HttpStatus from "http-status";

// TODO: handle logged in pages here
const PUBLIC_PAGES = [{
    title: "Home Man",
    path: "/",
    description: "Stay up to date with the latest changes in your project's dependencies"
}];

describe("Large scale SEO & Web integration", () => {
    describe("Favicons", () => {
        it("should reference favicons", () => {
            cy.visit(PUBLIC_PAGES[0].path);
            cy.get("head > link[rel=apple-touch-icon]")
                .should("have.attr", "sizes", "180x180")
                .should("have.attr", "href", "/real/client/assets/apple-touch-icon.png");
            cy.get("head > link[rel=icon][sizes=32x32]")
                .should("have.attr", "type", "image/png")
                .should("have.attr", "href", "/real/client/assets/favicon-32x32.png");
            cy.get("head > link[rel=icon][sizes=16x16]")
                .should("have.attr", "type", "image/png")
                .should("have.attr", "href", "/real/client/assets/favicon-16x16.png");
            cy.get("head > link[rel=mask-icon]")
                .should("have.attr", "href", "/real/client/assets/safari-pinned-tab.svg")
                .should("have.attr", "color", "#FE5D44");
            cy.get("head > link[rel=\"shortcut icon\"]")
                .should("have.attr", "href", "/real/client/assets/favicon.ico");
            cy.get("head > meta[name=msapplication-TileColor]")
                .should("have.attr", "content", "#FE5D44");
            cy.get("head > meta[name=theme-color]")
                .should("have.attr", "content", "#FE5D44");
            cy.get("head > link[rel=manifest]")
                .should("have.attr", "href", "/site.webmanifest");
            cy.get("head > meta[name=msapplication-config]")
                .should("have.attr", "content", "/browserconfig.xml");
        });

        it("Should exist", () => {
            cy.request("/real/client/assets/android-chrome-192x192.png");
            cy.request("/real/client/assets/android-chrome-512x512.png");
            cy.request("/real/client/assets/apple-touch-icon.png");
            cy.request("/real/client/assets/mstile-70x70.png");
            cy.request("/real/client/assets/mstile-150x150.png");
            cy.request("/real/client/assets/mstile-310x310.png");
            cy.request("/real/client/assets/mstile-310x150.png");
            cy.request("/real/client/assets/favicon-32x32.png");
            cy.request("/real/client/assets/favicon-16x16.png");
            cy.request("/real/client/assets/safari-pinned-tab.svg");
            cy.request("/real/client/assets/favicon.ico");
        });
    });

    describe("robots.txt", () => {
        it("Should exist", () => {
            cy.request("/robots.txt").then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers["content-type"]).to.eq("text/plain; charset=utf-8");
                expect(resp.body).to.eql(`Sitemap: https://retrofeed.io/sitemap.xml
User-agent: *
Disallow: /admin
`);
            });
        });
    });

    describe("humans.txt", () => {
        it("Should exist", () => {
            cy.request("/humans.txt").then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers["content-type"]).to.eq("text/plain; charset=utf-8");
                expect(resp.body).to.eql(`/* Team */
Programmer: The RetroFeed Team
Contact: contact@retrofeed.io
`);
            });
        });
    });

    describe("sitemap.xml", () => {
        it("Should exist", () => {
            cy.request("/sitemap.xml").then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers["content-type"]).to.eq("application/xml; charset=utf-8");
                expect(resp.body).to.contain(`<?xml version="1.0" encoding="utf-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`);
                expect(resp.body).to.contain(`<loc>https://retrofeed.io/</loc>`);
                expect(resp.body).to.contain(`<loc>https://retrofeed.io/company/about</loc>`);
                expect(resp.body).to.contain(`<loc>https://retrofeed.io/company/tos</loc>`);
                expect(resp.body).to.contain(`<loc>https://retrofeed.io/company/privacy</loc>`);
                expect(resp.body).to.contain(`<loc>https://retrofeed.io/company/contact</loc>`);
            });
        });
    });

    describe("browserconfig.xml", () => {
        it("Should exist", () => {
            cy.request("/browserconfig.xml").then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers["content-type"]).to.eq("application/xml; charset=utf-8");
                expect(resp.body).to.contain(`<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="/real/client/assets/mstile-70x70.png"/>
            <square150x150logo src="/real/client/assets/mstile-150x150.png"/>
            <square310x310logo src="/real/client/assets/mstile-310x310.png"/>
            <wide310x150logo src="/real/client/assets/mstile-310x150.png"/>
            <TileColor>#DA532C</TileColor>
        </tile>
    </msapplication>
</browserconfig>
`);
            });
        });
    });

    describe("site.webmanifest", () => {
        it("Should exist", () => {
            cy.request("/site.webmanifest").then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers["content-type"]).to.eq("application/manifest+json; charset=utf-8");
                expect(resp.body).to.eql(`{
    "name": "RetroFeed",
    "short_name": "RetroFeed",
    "icons": [{
        "src": "/real/client/assets/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
    }, {
        "src": "/real/client/assets/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
    }],
    "theme_color": "#FE5D44",
    "background_color": "#FAFAFA",
    "start_url": "https://retrofeed.io",
    "display": "standalone"
}
`);
            });
        });
    });

    describe("Page-level machine information", () => {
        for (const { path, title, description } of PUBLIC_PAGES) {
            it(`${path}`, () => {
                cy.visit(path);

                // Language
                cy.get("html").should("have.attr", "lang", "en");

                // Page specific generic web configuration
                cy.title().should("equal", title);
                cy.get("head > meta[name=description]").should("have.attr", "content", description);
                cy.get("head > link[rel=canonical]").should("have.attr", "href", `https://retrofeed.io${path}`);

                // Common generic web configuration
                cy.get("head > meta[name=keywords]").should("have.attr", "content", "retrofeed,feed,developer");
                cy.get("head > meta[name=author]").should("have.attr", "content", "The RetroFeed Team");
                cy.get("head > link[rel=author]").should("have.attr", "href", "/humans.txt");

                // // Microdata for organization

                // cy.get("head > script[type='application/ld+json']").first().should("exist");
                // cy.get("head > script[type='application/ld+json']").first().then($script => {
                //     const organization = JSON.parse($script.text());
                //     const target = {
                //         "@context": "http://schema.org",
                //         "@type": "Organization",
                //         "name": "RetroFeed",
                //         "url": "https://retrofeed.io",
                //         "logo": "https://retrofeed.io/real/client/assets/android-chrome-192x192.png",
                //         "sameAs": [
                //             "https://twitter.com/@retrofeed",
                //         ],
                //     };
                //     expect(organization).to.eql(target);
                // });
            });
        }
    });
});
