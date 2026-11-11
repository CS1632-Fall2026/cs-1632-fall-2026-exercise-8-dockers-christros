import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Open URL
    await page.goto('http://localhost:8080');

    // Set default fixture cookie values (all false)
    await page.evaluate(() => {
        document.cookie = '1=false';
        document.cookie = '2=false';
        document.cookie = '3=false';
    });
});

test('TEST-1-RESET', async ({ page }) => {
    // Preconditions: Cookies 1-3 set to true
    await page.evaluate(() => {
        document.cookie = '1=true';
        document.cookie = '2=true';
        document.cookie = '3=true';
    });

    // Click Reset button
    await page.getByRole('link', { name: 'Reset' }).click();

    // Postconditions 1, 2, 3: Select by position within the cat list container (#listing ul li)
    const listItems = page.locator('#listing ul li');

    await expect(listItems.nth(0)).toHaveText('ID 1. Jennyanydots');
    await expect(listItems.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(listItems.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {

    // Press "Catalog" link
    await page.getByRole('link', { name: 'Catalog' }).click();

    // Postconditions: verify source of image
    const catalogImage = page.locator('ol li img');
    await expect(catalogImage.nth(1)).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
    
    // Press "Catalog" link
    await page.getByRole('link', { name: 'Catalog' }).click();

    // Postconditions: Select items directly by position within the listing container
    const catalogItems = page.locator('#listing ul li');
    await expect(catalogItems).toHaveCount(3);
    await expect(catalogItems.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {

    // Press 'Rent a Cat' link
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    // Postconditions: Rent and Return button exists
    const rentButton = page.getByRole('button', { name: 'Rent' });
    const returnButton = page.getByRole('button', { name: 'Return' });
    await expect(rentButton).toBeVisible();
    await expect(returnButton).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
    // Press 'Rent a Cat' link
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    // Enter 1 into the input field and press 'Rent' button
    await page.getByLabel('Rent').fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();

    // Postconditions: 1st item is "rented out"
    const listingItems = page.locator('#listing ul li');
    await expect(listingItems.nth(0)).toHaveText('Rented out');

    // Postconditions: 2nd and 3rd items have ID and names
    await expect(listingItems.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(listingItems.nth(2)).toHaveText('ID 3. Mistoffelees');

    // Postcondition 4: "Success!" is displayed anywhere on the page
    await expect(page.getByText('Success!')).toBeVisible();
});

test('TEST-6-RETURN', async ({ page }) => {

    // Preconditions: cookies 2 and 3 set to true
    await page.evaluate(() => {
        document.cookie = '2=true';
        document.cookie = '3=true';
    });

    // Press 'Rent a Cat' link
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    // Enter 2 into the input field and press 'Return' button
    await page.getByRole('textbox', { name: /Return/i }).fill('2');
    await page.getByRole('button', { name: 'Return' }).click();

    // Postconditions: 1st and 2nd items have ID and names
    const listingItems = page.locator('#listing ul li');
    await expect(listingItems.nth(0)).toHaveText('ID 1. Jennyanydots');
    await expect(listingItems.nth(1)).toHaveText('ID 2. Old Deuteronomy');

    // Postconditions: third item is "rented out"
    await expect(listingItems.nth(2)).toHaveText('Rented out');

    // Postconditons: Success! is displayed
    await expect(page.getByText('Success!')).toBeVisible();
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {

    // Press 'Feed a Cat' link
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

    // Postconditions: Feed button exists
    const feedButton = page.getByRole('button', { name: 'Feed' });
    await expect(feedButton).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {

    // Press 'Feed a Cat' link
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

    // Enter 6 into the input field and press 'Feed' button
    await page.getByRole('textbox', { name: /Cat/i }).fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();

    // Postcondtions: the text nom nom nom is displayed after 10 seconds
    await expect(page.getByText('Nom, nom, nom.')).toBeVisible({ timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {

    // Press 'Greet a Cat' link
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();

    // Postconditions: The text Meow!Meow!Meow! is displayed
    await expect(page.getByText('Meow!Meow!Meow!')).toBeVisible();

});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {

    // Navigate to 'Greet a Cat Jennyanydots' page
    await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');

    // Postconditions: The text Meow! from Jennyanydots is displayed
    await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();
});


test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {

    // Preconditions: Cookies 1-3 set to true
    await page.evaluate(() => {
        document.cookie = '1=true';
        document.cookie = '2=true';
        document.cookie = '3=true';
    });

    // Press 'Feed a Cat' link
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

    // Postconditions: screenshot of the body of the page matches the one in tests/rentacat.spec.ts.snapshots for browser and OS
    const body = page.locator('body');
    await expect(body).toHaveScreenshot();
});