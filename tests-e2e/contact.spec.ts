import { test, expect } from "@playwright/test";

test("contact form validation (basic UI check)", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("text=Contact Us")).toBeVisible();
});
