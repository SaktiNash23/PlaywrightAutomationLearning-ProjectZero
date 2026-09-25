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
        this.orderPayload = orderPayload
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: this.orderPayload,
            headers:
            {
                "Authorization": this.getToken(),
                "Content-Type": "application/json"
            }
        }
        )
        
        const orderResponseJSON = await orderResponse.json()
        orderID = orderResponseJSON.orders[0]

        return orderID;
    }
    
}

module.exports = {APIUtils}; //This is to export the APIUtils class so that it can be used globally (used by other test scripts)