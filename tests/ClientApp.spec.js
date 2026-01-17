 const {test, expect} = require('@playwright/test');

test("Client App E2E Tests", async ({browser, page})=>
{
    const context = await browser.newContext()
    const page1 = await context.newPage()
    const email = "sativel@hotmail.com"
    const password = "Newpassword1"
    const productName = "ADIDAS ORIGINAL"
    let itemNumber = ""
    const countryName = " Malaysia"//It needs an extra whitespace cause in the CSS there is a whitespace
    const countryNameSequential = "mal"

    await page1.goto("https://rahulshettyacademy.com/client")
    await expect(page1).toHaveTitle("Let's Shop")

    await page1.locator("#userEmail").fill(email)
    await page1.locator("#userPassword").fill(password)
    await page1.locator("#login").click()
    await page1.locator("div h5 b").last().waitFor()

    const allProducts = page1.locator("div.card-body")
    const allProductsCount = await allProducts.count()
    for(let i = 0; i < allProductsCount; i++)
    {
        if(await allProducts.locator("h5").nth(i).textContent() == productName)
        {
            console.log(await allProducts.locator("h5").nth(i).textContent())
            allProducts.locator("button.w-10").nth(i).click()
            break;
        }
    }
    await expect(page1.locator("#toast-container")).toContainText("Product Added To Cart")
    await page1.locator("button[routerlink*='cart']").click()//Click Cart button

    //ASSERTION: Check if item added to cart has correct details -> Click Checkout button
    await page1.locator("div li").last().waitFor()
    itemNumber = await page1.locator("p.itemNumber").textContent()
    await expect(page1.locator("div.cartSection h3")).toHaveText(productName)
    await page1.getByRole("button", {name: "Checkout"}).click()

    //PAYMENT INFORMATION
    await page1.locator("div select.ddl").first().selectOption("07")//Select Expiry Date: Month
    await page1.locator("div select.ddl").last().selectOption("23")//Select Expiry Date: Year
    await page1.locator("div input").nth(1).fill("123")//Fill CVV
    await page1.locator("div input").nth(2).fill("SATIVEL")//Fill Cardholder Name
    await page1.locator("div input").nth(3).fill("rahulshettyacademy")//Fill Coupon Code
    await page1.getByRole("button", {name: "Apply Coupon"}).click()//Click Apply Coupon button
    await expect(page1.locator("p.ng-star-inserted")).toHaveText("* Coupon Applied")
    await page1.getByPlaceholder("Select Country").pressSequentially(countryNameSequential, {delay: 150})

    const countryList = page1.locator("section.ta-results button.ta-item")
    await countryList.last().waitFor() //Wait for the Country List to appear or else it will skip the For Loop if its too fast
    const countryListCount = await countryList.count()

    for(let i = 0; i < countryListCount; i++)
    {
        if(await countryList.locator("span.ng-star-inserted").nth(i).textContent() == countryName)
        {
            console.log(await countryList.locator("span.ng-star-inserted").nth(i).textContent())
            await countryList.locator("span.ng-star-inserted").nth(i).click()
            break;
        }
    }

    await expect(page1.locator("div input.text-validated").nth(1)).toHaveValue(email)//ASSERTION: Check if the email address is correct
    await page1.locator("div a.btnn.action__submit").click() //Click "Place Order" button

    //ORDER COMPLETED PAGE
    await expect(page1.locator("h1.hero-primary")).toHaveText(" Thankyou for the order. ")
    const orderID = await page1.locator("label.ng-star-inserted").textContent()
    console.log(orderID)

    //ORDERS PAGE
    await page1.locator("button[routerlink*='myorders']").click()
    await page1.locator("div h1.ng-star-inserted").waitFor()
    const orderList = page1.locator("tr.ng-star-inserted")
    const orderListCount = await orderList.count()

    for(let i = 0; i < orderListCount; i++)
    {
        let rowOrderID = await orderList.locator("th").nth(i).textContent()
        if(orderID.includes(rowOrderID))
        {
            console.log(await orderList.locator("th").nth(i).textContent())
            await orderList.locator("td button.btn").first().click()
            break;
        }
    }

    const orderIdDetails = await page1.locator("div.col-text").textContent()
    expect(orderID.includes(orderIdDetails)).toBeTruthy()

    await page1.pause()

});