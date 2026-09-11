const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

describe('Register page e2e tests', function () {
    this.timeout(30000);

    it('1. When "Start your transfer" button from the calculator is pressed, it redirects to the login page and loads the login form', async function () {
        let driver;
        try {
            driver = await new Builder().forBrowser('firefox').build();
            await driver.get('https://www.riamoneytransfer.com/');
            await driver.manage().setTimeouts({ implicit: 1000 });

            // Wait for the page to load and the calculator´s "Start your transfer" button to be present
            const button = await driver.wait(
                until.elementLocated(
                    By.xpath("//*[contains(normalize-space(.), 'Transfer quote calculator')]//*[normalize-space()='Start your transfer']")
                ),
                10000
            );

            // Click the “Start your transfer” calculator button
            await driver.wait(until.elementIsVisible(button), 10000);
            await button.click();

            // Wait for the redirect to the secure login page
            await driver.wait(until.urlContains('https://secure.riamoneytransfer.com/login'), 10000);
            const currentUrl = await driver.getCurrentUrl();

            // Confirm the URL includes the login route
            assert.ok(currentUrl.includes('https://secure.riamoneytransfer.com/login'), 'The login page URL is incorrect');

            // Wait for the actual login form to render
            const loginForm = await driver.wait(
                until.elementLocated(By.id('loginForm')),
                15000
            );
            await driver.wait(until.elementIsVisible(loginForm), 15000);

            // Assert the Register action is visible on the login page
            const registerLink = await driver.wait(
                until.elementLocated(By.xpath("//a[normalize-space()='Register'] | //button[normalize-space()='Register']")),
                15000
            );
            await driver.wait(until.elementIsVisible(registerLink), 15000);
            assert.ok(registerLink, 'The Register button should be visible on the login page');

            // dismiss the cookie banner if it blocks the click, as it blocks the Register button for Selenium
            const cookieReject = await driver.findElements(By.xpath("//button[normalize-space()='Reject cookies']"));
            if (cookieReject.length > 0) {
                await cookieReject[0].click();
                await driver.wait(async () => {
                    const overlays = await driver.findElements(By.css('.oen-ui-overlay-mask'));
                    return overlays.length === 0;
                }, 10000);
            }

            // Click Register and verify the redirect to the registration page
            await registerLink.click();
            await driver.wait(until.urlContains('https://secure.riamoneytransfer.com/registration'), 15000);
            const registrationUrl = await driver.getCurrentUrl();
            assert.ok(registrationUrl.includes('https://secure.riamoneytransfer.com/registration'), 'The registration page URL is incorrect');
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
    });
});