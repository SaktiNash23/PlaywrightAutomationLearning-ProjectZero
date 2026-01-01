 const {test, expect} = require('@playwright/test');

 test.only("Calendar Validations", async ({browser, page})=>
{
    const year = "2027"
    const monthText = "July"
    const month = "7"
    const day = "23"
    const expectedDateList = [month,day,year] //Since the locator input.react-date-picker__inputGroup__input has 3 elements, each for month, day and year. We create an array so that we can loop through it in order of Month, Year & Day just like in the website's calendar
    
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers")
    await page.getByLabel("deliveryDate").isVisible()

    await page.locator("button.react-date-picker__calendar-button").click()
    await page.locator("button.react-calendar__navigation__label").click()
    await page.locator("button.react-calendar__navigation__label").click()

    await page.getByRole("button", {name: year}).click()
    await page.getByRole("button", {name: monthText}).click()
    await page.getByRole("button", {name: day}).click()

    const calendar = page.locator("input.react-date-picker__inputGroup__input")
    for(let i = 0; i < expectedDateList.length; i++)
    {
        const value = await calendar.nth(i).inputValue()
        expect(value).toEqual(expectedDateList[i])
        console.log(value)
    }

    await page.pause()

})