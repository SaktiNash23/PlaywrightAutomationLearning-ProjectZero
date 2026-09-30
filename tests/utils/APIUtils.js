const {test, expect, request} = require('@playwright/test');

class APIUtils
{

    constructor(loginPayload, apiContext)
    {
        /*
        the RHS apiContext is the actual API Context that is passed from the test script. Think of the RHS as a foreigner who can't communicate with the locals, so we need to assign it to a local variable (the LHS apiContext)
        The LHS apiContext is the local variable of this APIUtils class. It helps the foreigner (RHS apiContext) to communicate with the locals (the rest of the APIUtils class)
        */
        this.loginPayload = loginPayload
        this.apiContext = apiContext
    }


    async getToken()
    {
        //Login API
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {data: this.loginPayload})
        await expect(loginResponse.ok()).toBeTruthy()
        const loginJSON = await loginResponse.json()
        const token = loginJSON.token
        console.log("Login Token: " + token)

        return token;
    }

    async createOrder(orderPayload)
    {
        //This is an object. We use this to store token and orderID, and then return the object with those values to the main test script.
        //The reason for using an object is because we can return multiple values from a function using an object. (cause function usually returns only 1 value)
        // We need to return both the token and orderID to the main test script, so we use an object to store those values and return them.
        let response = {};
        response.token = await this.getToken()

        this.orderPayload = orderPayload
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: this.orderPayload,
            headers:
            {
                "Authorization": response.token,
                "Content-Type": "application/json"
            }
        }
        )
        
        const orderResponseJSON = await orderResponse.json()
        const orderID = orderResponseJSON.orders[0]
        response.orderID = orderID

        return response;
    }
    
}

module.exports = {APIUtils}; //This is to export the APIUtils class so that it can be used globally (used by other test scripts)