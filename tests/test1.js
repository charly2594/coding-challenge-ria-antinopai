const { Builder, Browser, By } = require('selenium-webdriver');

async function runDriver() {
    // 1. Start the session
    // For more details on starting a session read our documentation on driver sessions
    driver = await new Builder().forBrowser('firefox').build();


    // 2. Take action on browser
    // In this example we are navigating to a web page.
    await driver.get('https://www.selenium.dev/selenium/web/web-form.html');

    // 3. Request browser information
    // There are a bunch of types of information about the browser you can request, including window handles, browser size / position, cookies, alerts, etc.
    let title = await driver.getTitle();

    // 4. Establish Waiting Strategy
    /*
    Synchronizing the code with the current state of the browser is one of the biggest challenges with Selenium, and doing it well is an advanced topic.

    Essentially you want to make sure that the element is on the page before you attempt to locate it and the element is in an interactable state before you attempt to interact with it.

    An implicit wait is rarely the best solution, but it’s the easiest to demonstrate here, so we’ll use it as a placeholder.

    Read more about Waiting strategies.
    */
    await driver.manage().setTimeouts({implicit: 500});

    // 5. Find an element
    // The majority of commands in most Selenium sessions are element related, and you can’t interact with one without first finding an element
    let textBox = await driver.findElement(By.name('my-text'));
    let submitButton = await driver.findElement(By.css('button'))

    // 6. Take action on element
    // There are only a handful of actions to take on an element, but you will use them frequently.
    await textBox.sendKeys('Selenium');
    await submitButton.click();

    // 7. Request element information
    // Elements store a lot of information that can be requested.
    let message = await driver.findElement(By.id('message'));
    let value = await message.getText();

    // 8. End the session
    // This ends the driver process, which by default closes the browser as well. No more commands can be sent to this driver instance. See Quitting Sessions.
    await driver.quit();
}


runDriver();