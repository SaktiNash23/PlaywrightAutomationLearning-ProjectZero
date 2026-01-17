const {test, expect, request} = require('@playwright/test');
//request "fixture" is needed to work with API testing

//This is JSON information from the login network call's Payload. Needed for the POST request in the Login process
const loginPayload = 
{
  userEmail: "sativel@hotmail.com",
  userPassword: "Newpassword1"
}

let tokenGlobal = "" //Global Variable to hold the browser token taken from the JSON response

//.beforeAll() executes first, before every other test case is executed
test.beforeAll(async ()=>
{
    const apiContext = await request.newContext()
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {data:loginPayload})

    //ASSERTION: To verify if the LoginResponse returns the Status: 200 OK, .ok() returns within the range of 200-299
    expect(loginResponse.ok()).toBeTruthy()

    const loginResponseJSON = await loginResponse.json()//Retrieve the response's JSON
    const loginResponseToken = await loginResponseJSON.token//From the response JSON, retrieve the token. This is the token that is saved in "Inspect Element > Application > Local Storage". Needed for bypassing the Login process
    tokenGlobal = loginResponseToken
    console.log(loginResponseToken)

});


//.beforeEach executes each time before the start of each test case
test.beforeEach(async ()=>
{

});

test("Client App E2E Tests w/ auto-Login via API call", async ({browser, page})=>
{
    const productName = "ADIDAS ORIGINAL"
    let itemNumber = ""
    const countryName = " Malaysia"//It needs an extra whitespace cause in the CSS there is a whitespace
    const countryNameSequential = "mal"

    /*
    .addInitScript() takes 1 function and 1 argument:
    value => .... This is the function
    ,tokenGlobal... This is the argument

    The purpose of the addInitScript() is to add the token to the browser's localStorage so that we don't need to write the code for Login everytime
    */
    page.addInitScript(value => {window.localStorage.setItem("token", value)}, tokenGlobal)
    await page.goto("https://rahulshettyacademy.com/client/")
    await page.locator("div h5 b").last().waitFor()

    const allProducts = page.locator("div.card-body")
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
    await expect(page.locator("#toast-container")).toContainText("Product Added To Cart")
    await page.locator("button[routerlink*='cart']").click()//Click Cart button

    //ASSERTION: Check if item added to cart has correct details -> Click Checkout button
    await page.locator("div li").last().waitFor()
    itemNumber = await page.locator("p.itemNumber").textContent()
    await expect(page.locator("div.cartSection h3")).toHaveText(productName)
    await page.getByRole("button", {name: "Checkout"}).click()

    //PAYMENT INFORMATION
    await page.locator("div select.ddl").first().selectOption("07")//Select Expiry Date: Month
    await page.locator("div select.ddl").last().selectOption("23")//Select Expiry Date: Year
    await page.locator("div input").nth(1).fill("123")//Fill CVV
    await page.locator("div input").nth(2).fill("SATIVEL")//Fill Cardholder Name
    await page.locator("div input").nth(3).fill("rahulshettyacademy")//Fill Coupon Code
    await page.getByRole("button", {name: "Apply Coupon"}).click()//Click Apply Coupon button
    await expect(page.locator("p.ng-star-inserted")).toHaveText("* Coupon Applied")
    await page.getByPlaceholder("Select Country").pressSequentially(countryNameSequential, {delay: 150})

    const countryList = page.locator("section.ta-results button.ta-item")
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

    await expect(page.locator("div input.text-validated").nth(1)).toHaveValue(loginPayload.userEmail)//ASSERTION: Check if the email address is correct
    await page.locator("div a.btnn.action__submit").click() //Click "Place Order" button

    //ORDER COMPLETED PAGE
    await expect(page.locator("h1.hero-primary")).toHaveText(" Thankyou for the order. ")
    const orderID = await page.locator("label.ng-star-inserted").textContent()
    console.log(orderID)

    //ORDERS PAGE
    await page.locator("button[routerlink*='myorders']").click()
    await page.locator("div h1.ng-star-inserted").waitFor()
    const orderList = page.locator("tr.ng-star-inserted")
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

    const orderIdDetails = await page.locator("div.col-text").textContent()
    expect(orderID.includes(orderIdDetails)).toBeTruthy()

    await page.pause()

});