import {test} from "@playwright/test";


test.beforeEach('Form Layouts validation hook', async({page})=>{

   await  page.goto("http://localhost:4200/");
   await  page.getByText("Forms").click();
   await  page.getByText("Form Layouts").click();
})

test('locators in playwright', async ({page})=>{

    await page.locator("#inputEmail1").click(); //Locate element by ID

    page.locator(".status-success"); //Locate element by class name 'partial name'

    page.locator("size-medium status-basic shape-rectangle nb-transition"); //Locate element by complete class name

    await page.locator("[status='success']").click(); //Attributes with value

    page.locator(":text-is['Using the Grid']"); //Full text 

    page.locator(":text['Using']"); //Partial text

    await page.locator("//input[@id='exampleInputPassword1']").fill("Password@123"); //Xpath but not recommended by playwright

   await page.locator("input[id='exampleInputPassword1']").clear(); //CSS selector not recommended by playwright

})

test('User-visible locators',async ({page})=>{

    page.getByLabel("Email");
    page.getByPlaceholder("Jane Doe");
    await page.getByRole('textbox',{name:"Email"}).first().click();
    await page.getByRole('button',{name:"Sign In"}).first().click();
    page.getByTitle("IoT Dashboard");
    page.getByText("Basic form");
})
