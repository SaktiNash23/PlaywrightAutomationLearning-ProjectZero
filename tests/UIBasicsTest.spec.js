 const {test, expect} = require('@playwright/test');

//Playwright Locator writing rules
/*
1. If id is present: #id OR tagname#id
2. If class attribute is present: tagname.class or .class
3. Writing CSS based on any attribute: [attribute='value'] OR tagname[attribute='value']
4. Writing CSS by traversing from parent CSS to child CSS: parenttagname [whitespace] childtagname
5. Writing CSS based on text locator: text=''

*/

test.only("Login - Rahul Shetty Academy", async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")

    await page.locator("#username").fill("rahulshettyacademy")
    await page.locator("#password").fill("learningX")
    await page.locator("#signInBtn").click()
    console.log(await page.locator("[style*='block']").textContent())
    await expect(page.locator("[style*='block']")).toContainText("Incorrect")//Assertion: Check if incorrect username/password message is shown
    
    //Login with correct credentials
    await page.locator("#username").fill("rahulshettyacademy")
    await page.locator("#password").fill("Learning@830$3mK2")
    await page.locator("#signInBtn").click()
    //console.log(await page.locator("h4.card-title").first().textContent())//Get the title of the first item in the store

    //Note that allTextContents() can return empty and still be valid if the page is not loaded yet, so make sure the page is loaded before using .allTextContents()
    await page.locator("div app-card.col-lg-3").last().waitFor()
    const allProductTitles = await page.locator("h4.card-title").allTextContents()
    console.log(allProductTitles)

});

test("Login Practice", async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    await expect(page).toHaveTitle("Let's Shop")

    await page.locator("#userEmail").fill("sativel@hotmail.com")
    await page.locator("#userPassword").fill("Newpassword1")
    await page.locator("#login").click()

    console.log(await page.locator("div h5 b").first().textContent())

});

test("Dropdowns, Radio Buttons & Checkboxes", async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")

    //RADIO BUTTONS
    await page.locator("span.checkmark").first().click() //Clicks "Admin"
    await page.locator("span.checkmark").last().click() //Clicks "User"
    await page.locator("#okayBtn").click()
    await expect(page.locator("span.checkmark").last()).toBeChecked()
    console.log(await page.locator("span.checkmark").last().isChecked())

    //DROPDOWNS
    //.selectOption() only works if the <select> CSS tag is present
    await page.locator("select.form-control").selectOption("Teacher") //Student, Teacher, Consultant
    await expect(page.locator("select.form-control")).toContainText("Teacher")

    //CHECKBOXES
    await page.locator("#terms").click()
    await expect(page.locator("#terms")).toBeChecked()//Here, await keyword is only used on the outside because the Playwright action is on the outside, which is .toBeChecked()

    await page.locator("#terms").uncheck()
    expect(await page.locator("#terms").isChecked()).toBeFalsy() //Here, awat keyword is only used inside the expect because the Playwright action is inside, which is .isChecked(). .toBeFalsy() is not an action

    //ASSERTION BY CHECKING ATTRIBUTE VALUE
    await expect(page.locator("a[href*='documents-request']")).toHaveAttribute("class", "blinkingText")

    await page.locator("#username").fill("rahulshettyacademy")
    await page.locator("#password").fill("learning")
    //await page.locator("#signInBtn").click()

    await page.pause()


});

test("Handling Child Windows", async ({browser, page})=>
{
    const context = await browser.newContext()
    const page1 = await context.newPage()

    await page1.goto("https://rahulshettyacademy.com/loginpagePractise/")
    await expect(page1).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")

    /*Important Notes about opening a new tab/window in a page
    When opening a new tab/window during script execution, Playwright has no knowledge of the new tab/window we opened.
    Therefore, we need to give a heads-up to Playwright BEFORE THE PAGE IS OPENED so that it can keep track of it
    For this, we use a Promise.all()

    Inside this Promise.all() we repeatedly run a set of actions related to opening the new tab. 
    The 1st action is to create a Listener, the purpose is to monitor/watch for an action that opens a new tab/window
    The 2nd action is action that opens the new tab/window
    Only when all the above actions in the Promise.all() are fulfilled, then the code will proceed to the next lines

    Three Promise states:
    1. Promise Pending
    2. Promise Rejected
    3. Promise Fulfilled

    */

    
    const [page2] = await Promise.all //Promise.all() returns an array, that's why we use [] on page2
    ([
        context.waitForEvent("page"),//"Listener" that watches for a new tab/window
        page1.locator("a[href*='documents-request']").click()//Clicks the page that opens the new window/tab
    ])

    //console.log(await page2.locator("p.im-para.red").textContent())


    //Grab email address of 2nd window and insert into Email field of 1st window
    const page2RedText = await page2.locator("p.im-para.red").textContent()
    const arrayText = page2RedText.split("@")//Split the contents between the left and right side of the first instance of "@". Returns an array
    const arrayText2 = arrayText[1].split(" ")//Split the contents between the left and right side of the first instance of " " (whitespace). Returns an array
    const page2Email = arrayText2[0]
    console.log(page2Email)

    await page1.locator("#username").fill(page2Email)

    /*DIFFERENCES BETWEEN .textContent() and .valueInput()
    1. .textContent() only works on text elements that are attached to the DOM by default. So even if you refreshed the page, if the text is still shown, that means it is attached to the DOM
    2  .valueInput() only works on text elements that are inputted during runtime. For example in a password field, if you refreshed the page, the password field will return to being empty. So for fields like this, you have to use .valueInput() to get its text content
    */

    /*CODEGEN TOOLS
    Codegen can dynamically create a Playwright script for you when you record the actions on the browser
    To use Codegen, write "npx playwright codegen [URL of the page you want to record]" and hit Enter in the Terminal
    Then, record you actions from start to end. On the Playwright window that opens, you can see the code being generated in real-time. 
    After you finish your steps, you can copy-paste the generated code into another script if you desire
    */

    /*TRACE LOGS VIEWER
    Trace logs can be generated if you want to view detailed reports of your test run or to debug failed tests in more detail
    To generate trace logs, in playwright.config.js, under use: section, set trace: "on"

    After running a test, in any browser, search for Playwright Trace Viewer.
    It will ask you to upload a ZIP folder
    Go to your project path > test_results > Find the test you want to check trace logs for > Click the ZIP folder called "trace"

    Then, you can view the Trace Logs in more detail
    */

    //await page1.pause()

});