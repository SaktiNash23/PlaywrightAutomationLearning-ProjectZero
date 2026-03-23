class APIUtils
{
    constructor(apiContext, loginPayload)
    {
        this.apiContext = apiContext
        this.loginPayload = loginPayload

        /*
        Why are we using "this" operator here?

        Because when the class constructor get the parameters for apiContext and loginPayload, they exist only within the scope of the constructor ONLY
        But  we need to use the apiContext and loginPayload in the other functions of this class (e.g. getToken(), createOrder())
        In order to do that, we assign it to to the same variable name but with a this. operator

        By doing so, we are effectively allowing the entire class to have access to the variables, so now any function can use apiContext and loginPayload that we passed from the main test script
        Even though we declared using this operator in the Constructor, make sure to still use the "this" operator when calling the variable in the other functions below
        */
    }

    async getToken()
    {
        //LOGIN API
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {data:this.loginPayload})
        const loginResponseJSON = await loginResponse.json()//Retrieve the login response's JSON
        const loginResponseToken = await loginResponseJSON.token//From the login response JSON, retrieve the token. This is the token that is saved in "Inspect Element > Application > Local Storage". Needed for bypassing the Login process
        token = loginResponseToken
        console.log("Token: "+ token)

        return token;
    }

    async createOrder(payloadCreateOrder)
    {
        //CREATE ORDER API
        const createOrderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", 
        {
            data:payloadCreateOrder,
            headers:
            {
                /*Explanation of the headers:
                
                Authorization:
                This header is retrieved from DevTools > Network > Headers > Request headers dropdown section
                The Authorization header holds a token
                The purpose of the Authorization header is that we need to script which account/profile to call the Create Order Response in.
                We can call the header yes, but then how are we going to tell the script to create the Order in a specific user's profile? That's where Authorization Header comes in
                So we already have the getToken() function in APIUtils class to find and return the token, so just call it with this.getToken()
                
                Content-Type:
                This header is retrieved from DevTools > Network > Headers > Request headers dropdown section
                The purpose of Content-Type is sometimes in some websites, the Response might return in a non-JSON format. 
                So by specifying 'application/json', the Response will guaranteed be returned in JSON format
                */

                'Authorization': this.getToken(),
                'Content-Type': 'application/json'
            },
        })

        const orderResponseJSON = await createOrderResponse.json()//Retrieve the JSON from the Create Order response
        orderID = await orderResponseJSON.orders[0] //Extract the order ID that we need to check from the JSON
        console.log("JSON: "+ orderResponseJSON)
        console.log("Order ID (Global): " + orderID)

        return orderID;
    }
}

//This line is IMPORTANT to allow other scripts to import and make use of the functions of this entire class. Without exporting, we cannot import it.
module.exports = {APIUtils};