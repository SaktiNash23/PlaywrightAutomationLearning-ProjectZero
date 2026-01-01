 const {test, expect} = require('@playwright/test');

 test.only("Popup Validations", async ({browser, page})=>
{
    //Navigating back and forth between pages
    await page.goto("https://www.google.com")
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/")
    await page.goBack()
    await page.goForward()

    //VALIDATING IF ELEMENTS ARE HIDDEN OR VISIBLE
    await expect(page.locator("#displayed-text")).toBeVisible()
    await page.locator("#hide-textbox").click()
    await expect(page.locator("#displayed-text")).toBeHidden()

    /*HANDLING JAVA POPUPS
    page.on is a Listener. It can trigger regardless of where execution order is in the script
    dialog => dialog.accept: It clicks on the "OK" button (the positive option)
    dialog => dialog.dismiss: It clicks on the "Cancel" button (the negative option)
    */
    await page.locator("#confirmbtn").click() 
    page.on("dialog", dialog => dialog.accept)

    //await page.locator("#confirmbtn").click()
    //page.on("dialog", dialog => dialog.dismiss)

    //MOUSE HOVER
    await page.locator("#mousehover").hover()
    await page.locator("div.mouse-hover-content a").first().click()

    //HANDLING IFRAMES
    /*
    BY default, Playwright only has access to your main page. It does not have access to child frames/iframes that are attached in your main page
    To know if a page has an attached frame, look for the <iframe> or <frame-set> tag in CSS
    So we need to locate the frame using .frameLocator(). It will return a page object so assign it to a variable
    Then, from there just use .locator() or .getBy() functions as usual
    */
    const iframePage = page.frameLocator("#courses-iframe")
    await iframePage.locator("li a[href*='lifetime-access']:visible").click() //The :visible is added here so that if the page has multiple instances of locator, but we only want to click on the visible one, we force Playwright to only click the visible one

    const subscriberText = await iframePage.locator("div.text h2").textContent()
    const text1 = subscriberText.split(" ")[1] //The text is split at the "whitespaces". The text 13522 is the 2nd element after the split, so we put [1] to tell Playwright to just return the element 1
    console.log(text1)

    await page.pause()

});