import { expect, test } from "@playwright/test"

test.beforeEach('Form Layouts validation hook', async ({ page }) => {

    await page.goto("http://localhost:4200/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
})

test('Locate child elements', async ({ page }) => {

    await page.locator("nb-card nb-radio :text-is('Option 1')").click();
    await page.locator("nb-card").locator("nb-radio").locator(":text-is('Option 1')").click();
    await page.locator("nb-card").getByRole("button", { name: "Sign in" }).first().click();
})

test('Locate parent elements', async ({ page }) => {

    await page.locator("nb-card", { hasText: 'Using the Grid' }).getByRole("textbox", { name: "Email" }).click();
    await page.locator("nb-card", { has: page.locator("#inputEmail1") }).getByRole("textbox", { name: "Email" }).click();

    //using filter method
    await page.locator("nb-card").filter({ has: page.locator("nb-checkbox") }).filter({ hasText: "Sign in" })
        .getByRole("textbox", { name: "Password" }).click();
})

test('Resuing locators', async ({ page }) => {

    /*
    await page.locator("nb-card").filter({hasText: "Basic form"}).getByRole("textbox",{name:"Email"}).fill("Jaffer@gmail.com");
    await page.locator("nb-card").filter({hasText: "Basic form"}).getByRole("textbox",{name:"Password"}).fill("Playwright123");
    await page.locator("nb-card").filter({hasText: "Basic form"}).getByRole("button",{name:"Submit"}).click();
    */

    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
    const emailField = basicForm.getByRole("textbox", { name: "Email" });

    await emailField.fill("Mohammed@test.com");
    await basicForm.getByRole("textbox", { name: "Password" }).fill("Playwright123");
    await basicForm.locator("nb-checkbox").click();
    await basicForm.getByRole("button").click();

    await expect(emailField).toHaveValue("Mohammed@test.com");
})

test('Extracting values from elements', async ({ page }) => {

    // single value
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
    const buttonText = await basicForm.locator("button").textContent();
    expect(buttonText).toEqual("Submit");

    //All values
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents();
    expect (allRadioButtonLabels).toContain("Option 1");

    // input values
    const emailField = basicForm.getByRole("textbox", { name: "Email" });
    await emailField.fill("Mohammed@test.com");
    const emailValue = await emailField.inputValue();
    expect (emailValue).toEqual("Mohammed@test.com");

    // Validate attribute
    const placeHolderValue = await emailField.getAttribute("placeholder");
    expect (placeHolderValue).toEqual("Email");
})

test('Assertions',async ({page})=>{

    //General assertion - not on the locator, no wait time
    let setValue :number = 5
    expect (setValue).toEqual(5);

    const basicFormButton = page.locator("nb-card").filter({ hasText: "Basic form" }).getByRole("button");
    let buttonText : String = await basicFormButton.textContent();
    expect (buttonText).toEqual("Submit");
    
    //Locator assertion 
    await expect (basicFormButton).toHaveText("Submit");
    
    //Soft assertion 
    await expect.soft(basicFormButton).toHaveText("Submit1");
    await basicFormButton.click();

})