import { expect, test } from "@playwright/test";
import { delay } from "rxjs-compat/operator/delay";

test.beforeEach("Playwright Test application", async ({ page }) => {
    await page.goto("http://localhost:4200/");
});

test.describe("Automate Form layout elements", () => {

    test.beforeEach("Working with text box", async ({ page }) => {
        await page.getByText("Forms").click();
        await page.getByText("Form Layouts").click();
    });

    test("TextBox automation", async ({ page }) => {
        const inpUserEmail = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: "Email" });
        await inpUserEmail.fill('jaffercharliee@gmail.com');
        await inpUserEmail.clear();
        await inpUserEmail.pressSequentially("jaffercharliebe@gmail.com", { delay: 500 });

        const valUserEmail = await inpUserEmail.inputValue();
        expect(valUserEmail).toEqual("jaffercharliebe@gmail.com");
        await expect(inpUserEmail).toHaveValue("jaffercharliebe@gmail.com");
    });

    test("Radio button automation", async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

        const radioOption1 = page.getByRole("radio", { name: "Option 1" });
        await radioOption1.check({ force: true });
        await expect(radioOption1).toBeChecked();

        const statusRadioOption1 = await radioOption1.isChecked();
        expect(statusRadioOption1).toBeTruthy();

        await usingTheGridForm.getByRole("radio", { name: 'Option 2' }).check({ force: true });
        expect(await usingTheGridForm.getByRole("radio", { name: 'Option 2' }).isChecked()).toBeTruthy();
        expect(await usingTheGridForm.getByRole("radio", { name: 'Option 1' }).isChecked()).toBeFalsy();
    });
});

test.describe("Modal and Overlays", () => {

    test("CheckBox automation", async ({ page }) => {
        await page.getByTitle('Modal & Overlays').click();
        await page.getByTitle('Toastr').click();

        await page.getByRole("checkbox", { name: "Hide on click" }).uncheck({ force: true });
        await page.getByRole("checkbox", { name: "Prevent arising of duplicate toast" }).check({ force: true });

        const allCheckBoxes = page.getByRole("checkbox");
        for (const box of await allCheckBoxes.all()) {
            await box.check({ force: true });
            expect(await box.isChecked()).toBeTruthy();
        }

        for (const box of await allCheckBoxes.all()) {
            await box.uncheck({ force: true });
            expect(await box.isChecked()).toBeFalsy();
        }
    });

    test('Change app theme using dropdown', async ({ page }) => {
        const dropDownTheme = page.locator('ngx-header nb-select');
        await dropDownTheme.click();

        const optionsList = page.locator('nb-option-list nb-option');
        await expect(optionsList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);

        await optionsList.filter({ hasText: "Cosmic" }).click();
        const globalHeader = page.locator('nb-layout-header');
        await expect(globalHeader).toHaveCSS('background-color', 'rgb(50, 50, 89)');

        const colors = {
            "Light": "rgb(255, 255, 255)",
            "Dark": "rgb(34, 43, 69)",
            "Cosmic": "rgb(50, 50, 89)",
            "Corporate": "rgb(255, 255, 255)",
        };

        await dropDownTheme.click();
        for (const color in colors) {
            if (color !== "Corporate") {
                await optionsList.filter({ hasText: color }).click();
                await expect(globalHeader).toHaveCSS('background-color', colors[color]);
                await dropDownTheme.click();
            }
        }
    });

    test('Handling Tooltips', async ({ page }) => {
        await test.step('Navigate to Tooltip section', async () => {
            await page.getByTitle('Modal & Overlays').click();
            await page.getByTitle('Tooltip').click();
            await expect(page).toHaveURL(/.*tooltip/);
        });

        await test.step('Hover over TOP button and verify tooltip', async () => {
            const tooltipCard = page.locator('nb-card');
            const topButton = tooltipCard.getByRole('button', { name: 'TOP' });
            const tooltip = page.locator('nb-tooltip');

            await topButton.hover();
            await expect(tooltip).toBeVisible();
            await expect(tooltip).toHaveText('This is a tooltip');
        });
    });

    test.only('Handling browser alerts / dialog box', async ({ page }) => {
        await test.step('Navigate to Smart Table', async () => {
            await page.getByTitle('Tables & Data').click();
            await page.getByTitle('Smart Table').click();
            await expect(page).toHaveURL(/.*smart-table/);
        });

        await test.step('Handle delete confirmation dialog', async () => {
            page.once('dialog', async dialog => {
                expect(dialog.message()).toBe('Are you sure you want to delete?');
                await dialog.accept();
            });

            const smartTable = page.getByRole('table');
            const targetRow = smartTable.locator('tr', { hasText: 'mdo@gmail.com' });
            const deleteButton = targetRow.locator('.nb-trash');

            await deleteButton.click();
            await expect(page.locator('table tr', { hasText: 'mdo@gmail.com' })).toHaveCount(0);
        });
    });
});
