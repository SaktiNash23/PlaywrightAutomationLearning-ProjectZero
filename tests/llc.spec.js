import {test, expect} from "@playwright/test"

test("Playwright Special Locators", async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/angularpractice/")

    //Difference between #1 and #2
    /*
    For #1, isVisible() returns true or false. Even if the result is false, the test will not fail. It will just continue to the next step.
    For #2, toBeVisible() is an assertion. If the result is false, the test will fail and stop at this step.
    */

    await page.getByText("Success! The Form has been submitted successfully!").isVisible() //#1

    //5 seconds default timeout for expect assertion. But you can override the default timeout by passing a timeout value in milliseconds as an option to the expect assertion.
    //This is considered a "Step Level Timeout", because it is applied to a specific step, not the entire test.
    //Step Level overrides Global Level. Global Level overrides default timeout. Default timeout is 5 seconds.
    await expect(page.getByText("Success! The Form has been submitted successfully!")).toBeVisible({timeout: 10000}) //#2

});