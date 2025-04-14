import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');
});

test('Verify sorting by Name Z to A', async ({ page }) => {
  await page.selectOption('[data-test="product_sort_container"]', 'za');
  const itemNames = await page.$$eval('.inventory_item_name', items => items.map(i => i.textContent));
  const sorted = [...itemNames].sort().reverse();
  expect(itemNames).toEqual(sorted);
});

test('Verify sorting by Price High to Low', async ({ page }) => {
  await page.selectOption('[data-test="product_sort_container"]', 'hilo');
  const prices = await page.$$eval('.inventory_item_price', items =>
    items.map(i => parseFloat(i.textContent.replace('$', '')))
  );
  const sorted = [...prices].sort((a, b) => b - a);
  expect(prices).toEqual(sorted);
});

test('Add items to cart and verify checkout', async ({ page }) => {
  await page.click('text=Add to cart', { strict: false });
  await page.click('.shopping_cart_link');
  await expect(page.locator('.cart_item')).toHaveCountGreaterThan(0);
  await page.click('[data-test="checkout"]');
  await page.fill('[data-test="firstName"]', 'Devika');
  await page.fill('[data-test="lastName"]', 'Naidu');
  await page.fill('[data-test="postalCode"]', '400001');
  await page.click('[data-test="continue"]');
  await page.click('[data-test="finish"]');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});