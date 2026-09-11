const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

describe('RIA money transfer calculator', function () {
    this.timeout(30000);

    it('1. Does not accept alphabetical characters in the calculator input', async function () {
        let driver;

        try {
            driver = await new Builder().forBrowser('firefox').build();
            await driver.get('https://www.riamoneytransfer.com/');
            await driver.manage().setTimeouts({ implicit: 1000 });
            
            // Wait for the page to load and the calculator´s "They receive" button to be present:
            const button = await driver.wait(
                until.elementLocated(
                    By.xpath("//*[contains(normalize-space(.), 'Transfer quote calculator')]//*[normalize-space()='They receive']/following::button[1]")
                ),
                10000
            );

            await driver.wait(until.elementIsVisible(button), 10000);
            await driver.sleep(2000);
            // Click the "They receive" button to open the calculator input field
            await button.click();

            // Wait for the calculator input field to be present and visible
            const amountInput = await driver.wait(
                until.elementLocated(
                    By.xpath("//*[contains(normalize-space(.), 'Transfer quote calculator')]//input")
                ),
                10000
            );

            // Wait for the input field to be visible, clear it, and send alphabetical characters
            await driver.wait(until.elementIsVisible(amountInput), 10000);
            await amountInput.clear();
            await amountInput.sendKeys('abc123');

            // Get the value of the input field and assert that it does not contain alphabetical characters
            const value = await amountInput.getAttribute('value');
            assert.ok(!/[a-z]/i.test(value || ''), 'Alphabetical characters should not be written in the calculator input');
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
    });

    it('2. Clicks the "They receive" button and a country popup menu appears', async function () {
        let driver;

        try {
            driver = await new Builder().forBrowser('firefox').build();
            await driver.get('https://www.riamoneytransfer.com/');
            await driver.manage().setTimeouts({ implicit: 1000 });

            // Wait for the page to load and the calculator´s "They receive" button to be present
            const button = await driver.wait(
                until.elementLocated(
                    By.xpath("//*[contains(normalize-space(.), 'Transfer quote calculator')]//*[normalize-space()='They receive']/following::button[1]")
                ),
                10000
            );

            await driver.wait(until.elementIsVisible(button), 10000);
            assert.ok(button, 'They receive button should be visible');

            await button.click();
            //console.log('Clicked the "They receive" button');

            // Wait for the country selection popup to appear and get its text
            const popupText = await driver.wait(async () => {
                const dialogs = await driver.findElements(By.css('[role="dialog"]'));
                for (const dialog of dialogs) {
                    try {
                        const text = await dialog.getText();
                        if (/Select Destination/i.test(text) ) { 
                            return text;
                        }
                    } catch (err) {
                        // ignore non-visible or detached elements while polling
                    }
                }
                return null;
            }, 15000);
            
            // Assert that the popup text is present and contains the expected title
            assert.ok(popupText, 'A country selection popup should appear after clicking the button');
            assert.ok(/Select Destination/i.test(popupText), 'The popup should contain a country-selection title');
            // Next assert is not always the case, as the country list may randomly change if the user is in a different region, so I will comment it out for now (Sometimes MXN was the default country)
            // assert.ok(/Colombia|Peru|Haiti|Dominican Republic/i.test(popupText), 'The popup should include selectable country options'); 
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
    });

    it('3. They receive amount changes when You send is updated to 25000', async function () {
        let driver;

        try {
            driver = await new Builder().forBrowser('firefox').build();
            await driver.get('https://www.riamoneytransfer.com/');
            await driver.manage().setTimeouts({ implicit: 1000 });

            // Wait for the page to load and the calculator´s "You send" button to be present
            const sendButton = await driver.wait(
                until.elementLocated(
                    By.xpath("//*[contains(normalize-space(.), 'Transfer quote calculator')]//*[normalize-space()='You send']/following::button[1]")
                ),
                10000
            );

            // Get the current text of the calculator before updating the "You send" amount
            const getCalculatorText = async () => {
                return await driver.executeScript(() => {
                    const calc = document.querySelector('[aria-label="Transfer quote calculator"]');
                    return calc ? calc.textContent.replace(/\s+/g, ' ').trim() : '';
                });
            };

            const initialCalculatorText = await getCalculatorText();
            assert.ok(initialCalculatorText.length > 0, 'Transfer quote calculator should be visible');

            // Click the "You send" button to open the input field
            await sendButton.click();

            // The input field is inside a shadow DOM, so we need to use executeScript to access it
            const amountInput = await driver.wait(async () => {
                return await driver.executeScript(() => {
                    const calc = document.querySelector('[aria-label="Transfer quote calculator"]');
                    if (!calc) return null;
                    const input = calc.querySelector('input');
                    return input ? input : null;
                });
            }, 10000, 'You send input should be present inside the calculator');

            // Wait for the input field to be visible, clear it, and send the value 25000. We assume its CLP for the test, but the currency may vary depending on the region, so we will not assert the currency symbol in this test.
            await driver.wait(until.elementIsVisible(amountInput), 10000);
            await amountInput.clear();
            await amountInput.sendKeys('25000');

            const enteredValue = await amountInput.getAttribute('value');
            assert.ok(/25000/.test(enteredValue || ''), 'You send field should contain 25000');

            // Wait for the calculator text to update and assert that the "They receive" amount has changed
            const updatedCalculatorText = await driver.wait(async () => {
                const currentText = await getCalculatorText();
                return currentText && currentText !== initialCalculatorText ? currentText : null;
            }, 15000, 'They receive amount should change after setting You send to 25000');

            assert.ok(/They receive/i.test(updatedCalculatorText), 'Updated calculator text should include the They receive section');
            assert.notStrictEqual(updatedCalculatorText, initialCalculatorText, 'They receive amount should change after setting You send to 25000');
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
    });

});