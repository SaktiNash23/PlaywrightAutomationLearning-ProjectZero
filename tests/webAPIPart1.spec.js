const {test, expect, request} = require('@playwright/test');//"request" library is needed to work with API testing
const {APIUtils} = require('./utils/APIUtils');//Importing the APIUtils class so we can create new objects of APIUtils class


//This is JSON information from the login network call's Payload tab. Needed for the POST request in the Login process
const loginPayload = {userEmail: "sativel@hotmail.com",userPassword: "Newpassword1"}
const orderPayload = {orders: [{country: "Bahamas", productOrderedId: "6960eac0c941646b7a8b3e68"}]}
let orderID

/*
const createOrderPayload = {orders: [{country: "Bahamas", productOrderedId: "6960eac0c941646b7a8b3e68"}]}

//Tokens (might not need it after the refactor)
let tokenGlobal = ""
let orderID_Global = ""

//.beforeEach executes each time before the start of each test case
test.beforeEach(async ()=>{});

//.beforeAll() executes first, before every other test case is executed. But executes only ONCE
test.beforeAll(async ()=>
{
    const api_context = await request.newContext()//Create a new API context. This is needed to make API calls. Similar to creating a new browser context for UI testing, we need to create a new API context for API testing
    const loginResponse = await api_context.post("https://rahulshettyacademy.com/api/ecom/auth/login", {data: loginPayload})//Send a POST request and retrieve the response. The POST request is sent to the Login API URL, and the Payload is passed in the data parameter
    expect(loginResponse.ok()).toBeTruthy()//Check if the response is OK (200)
    const loginJSON = await loginResponse.json()//This is the response body in JSON format. We need to extract the token from this response body
    const loginToken = await loginJSON.token//Extract the token from the response body
    const loginResponseBody = await loginResponse.json()
    tokenGlobal = loginResponseBody.token

    //Call the create_order API via a POST request, and pass the Payload and Headers. The Headers are needed to specify the Authorization token and Content-Type
    const orderResponse = await api_context.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
            data:createOrderPayload,
            headers:
            {
                'Authorization': tokenGlobal,
                'Content-Type': 'application/json'
            }
    }
    )

    const orderResponseJSON = await orderResponse.json()//Retrieve the JSON from the Create Order response
    orderID_Global = await orderResponseJSON.orders[0] //Extract the order ID that we need to check from the JSON. The reason we use [0] is because the response returns an array of orders, and we need to extract the first order ID from that array. You can view this by copying the JSON in an online JSON formatter and see the structure of the JSON.
    console.log("Order ID (Global): " + orderID_Global)

    //const apiContext = await request.newContext()//The API context MUST be created in your actuaal test script, not in the APIUtils class, because we need to pass the actual API Context to the Class constructor
    //const apiUtils = new APIUtils(apiContext, loginPayload)
    //apiUtils.createOrder(payloadCreateOrder)
});

test("Client App E2E Tests w/ auto-Login via API call", async ({page})=>
{
    
    .addInitScript() takes 1 function and 1 argument:
    value => .... This is the function
    ,tokenGlobal... This is the argument

    The purpose of the addInitScript() is to add the token to the browser's localStorage so that we don't need to write the code for Login everytime
    
    await page.addInitScript(value => 
    {window.localStorage.setItem("token", value)

    }, tokenGlobal)
    

    //GO TO SITE
    await page.goto("https://rahulshettyacademy.com/client/")
    await page.locator("div h5 b").last().waitFor()

    //ORDERS PAGE
    await page.locator("button[routerlink*='myorders']").click()
    await page.locator("div h1.ng-star-inserted").waitFor()
    const orderList = page.locator("tr.ng-star-inserted")
    const orderListCount = await orderList.count()

    for(let i = 0; i < orderListCount; i++)
    {
        let rowOrderID = await orderList.locator("th").nth(i).textContent()
        if(orderID_Global.includes(rowOrderID))//A logical way to read this is to think "Check if rowOrderID contains orderID_Global.
        {
            console.log(await orderList.locator("th").nth(i).textContent())
            await orderList.locator("td button.btn").first().click()
            break;
        }
    }

    const orderIdDetails = await page.locator("div.col-text").textContent()
    expect(orderID_Global.includes(orderIdDetails)).toBeTruthy()//A logical way to read this is to think "Check if orderIdDetails contains orderID_Global.

    await page.pause()
});

*/

//Verify if order created is appearing in Order List via the Order ID
//Precondition: Create an order
//But by using APIs we won't need to repeat the steps to create an order manually, we will call the API that handles Creating Orders, so we can skip most of the steps and directly check the Order ID

//Request URL for Create Order: https://rahulshettyacademy.com/api/ecom/order/create-order
//Payload for Create Order: {"orders":[{"country":"Malaysia","productOrderedId":"6960eae1c941646b7a8b3ed3"}]}
//Authorization Header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTAyOWY0ZGY2NjlkNmNiMGEzNTMyYWUiLCJ1c2VyRW1haWwiOiJzYXRpdmVsQGhvdG1haWwuY29tIiwidXNlck1vYmlsZSI6MTIzNDU2Nzg5MCwidXNlclJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc3NDIzNjQyMywiZXhwIjoxODA1Nzk0MDIzfQ.Ap7saBlaobnXAps31togrGT64brUQJn78VwAyQn6NSc
//Content Type: application/json




//FOR UDEMY FOLLOW-ALONG
test.beforeAll(async ()=>
{
    const apiContext = await request.newContext() //The step to create a new API context must be done in the actual test script, not in the APIUtils class, because we need to pass the actual API Context to the Class constructor

    const apiUtils = new APIUtils(loginPayload, apiContext) //Create a new object of the APIUtils class, and pass the loginPayload and apiContext to the constructor of the APIUtils class
    apiUtils.createOrder(orderPayload) //Call the createOrder() method of the APIUtils class, and pass the orderPayload to it. This will create an order and return the order ID

    
});



test("Client App E2E Tests w/ API", async ({browser, page})=>
{

    await page.addInitScript(value =>
    {
        window.localStorage.setItem("token", value);
    },  tokenGlobal);

    await page.goto("https://rahulshettyacademy.com/client/")

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

