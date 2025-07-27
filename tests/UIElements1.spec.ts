import { expect, test } from "@playwright/test";
import { delay } from "rxjs-compat/operator/delay";

test.beforeEach("Playwright Test application ", async ({ page }) => {

    await page.goto("http://localhost:4200/");

})

test.describe("Automate Form layout elements", async () => {

    test.beforeEach("Working with text box", async ({ page }) => {
        await page.getByText("Forms").click();
        await page.getByText("Form Layouts").click();
    })

    test("TextBox automation", async ({ page }) => {

        const inpUserEmail = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: "Email" });
        await inpUserEmail.fill('jaffercharliee@gmail.com');
        await inpUserEmail.clear();
        await inpUserEmail.pressSequentially("jaffercharliebe@gmail.com", { delay: 500 });

        //generic assertion
        const valUserEmail = await inpUserEmail.inputValue();
        expect(valUserEmail).toEqual("jaffercharliebe@gmail.com");

        //locator assertion
        await expect(inpUserEmail).toHaveValue("jaffercharliebe@gmail.com");
    })

    test("Radio button automation", async ({ page }) => {

        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

        //await usingTheGridForm.getByLabel("Option 1").check({force:true});
        const radioOption1 = page.getByRole("radio", { name: "Option 1" });
        await radioOption1.check({ force: true });

        //locator assertion
        await expect(radioOption1).toBeChecked();

        //generic assertion
        const statusRadioOption1 = await radioOption1.isChecked();
        expect(statusRadioOption1).toBeTruthy();

        //Check Option 2 then verify the status
        await usingTheGridForm.getByRole("radio", { name: 'Option 2' }).check({ force: true });
        expect(await usingTheGridForm.getByRole("radio", { name: 'Option 2' }).isChecked()).toBeTruthy();
        expect(await usingTheGridForm.getByRole("radio", { name: 'Option 1' }).isChecked()).toBeFalsy();
    })
})

test.describe("Modal  and Overlays", async () => {

    test("CheckBox automation", async ({ page }) => {

        await page.getByTitle('Modal & Overlays').click();
        await page.getByTitle('Toastr').click();

        //Actions on the checkbox
        await page.getByRole("checkbox", { name: "Hide on click" }).uncheck({ force: true }); // no affect if already checked
        await page.getByRole("checkbox", { name: "Prevent arising of duplicate toast" }).check({ force: true });

        const allCheckBoxes = page.getByRole("checkbox");
        for (const box of await allCheckBoxes.all()) {
            await box.check({ force: true })
            expect(await box.isChecked()).toBeTruthy();
        }

        for (const box of await allCheckBoxes.all()) {
            await box.uncheck({ force: true })
            expect(await box.isChecked()).toBeFalsy();
        }

    })

    test('DropDown and List', async({page})=>{
        const dropDownTheme = page.locator('ngx-header nb-select');
        await dropDownTheme.click();

        page.getByRole('list');// for UI list
        page.getByRole('listitem');//For LI list

        const optionsList = page.locator('nb-option-list nb-option');
        expect (optionsList).toHaveText(["Light","Dark","Cosmic","Corporate"]); //Check the list

        await optionsList.filter({hasText : "Cosmic"}).click();
        const globalHeader = page.locator('nb-layout-header');
        expect (globalHeader).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    })
})