import {expect,test} from '@playwright/test' 

test.beforeEach('UI testing Ajax data hook', async ({ page }) => {

    await page.goto("http://uitestingplayground.com/ajax");
    await page.getByText("Button Triggering AJAX Request").click();
})

test('Auto waiting',async({page})=>{

const successButton = page.locator(".bg-success");
// const text = await successButton.textContent();
// await successButton.waitFor({state:"attached"});

// const allText = await successButton.allTextContents();
// expect(allText).toContain("Button Triggering AJAX Request");

await expect(successButton).toHaveText("Data loaded with AJAX get request.", {timeout:20000})

})

test('Alternative waits', async ({page})=>{
const successButton = page.locator(".bg-success");

//Wait for element
 await page.waitForSelector(".bg-success");

 //wait for particular response
 await page.waitForResponse('http://uitestingplayground.com/ajaxdata'); // Test will due to exceeded timeout limit as intended

 //wait for network calls to complete (NOT RECOMMENDED)
 await page.waitForLoadState("networkidle");

 const allText = await successButton.allTextContents();
 expect(allText).toContain("Data loaded with AJAX get request.");
})

