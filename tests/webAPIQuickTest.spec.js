const {test, expect, request} = require('@playwright/test');//"request library" is needed to work with API testing

let token_global = ""
let cookie_global = ""
const loginPayload = {"email":"nathan.sativelthamilvanan+prd1@jitera.com","password":"Newpassword2"}



test.beforeAll(async ()=>
{
    const apiContext = await request.newContext()//Create a new API context. This is needed to make API calls. Similar to creating a new browser context for UI testing, we need to create a new API context for API testing
    const loginResponse = await apiContext.get("https://reservation.tokyustay.co.jp/api/auth/session", {data: loginPayload})
    await expect(loginResponse.ok()).toBeTruthy()//Check if the response is OK (200)
    const loginJSON = await loginResponse.json()
    
        
});

test("Login to Tokyu Stay PRD site via API call", async ()=>
{
    console.log("Token (Global): " + token_global)
});