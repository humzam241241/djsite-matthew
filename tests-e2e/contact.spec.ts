import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("shows validation errors for empty fields", async ({ page }) => {
    // Navigate to the contact page
    await page.goto("/contact");
    
    // Submit the form without filling any fields
    await page.getByRole("button", { name: /send/i }).click();
    
    // Check if validation errors are shown
    await expect(page.locator("text=Name is required")).toBeVisible();
    await expect(page.locator("text=Email is required")).toBeVisible();
    await expect(page.locator("text=Message is required")).toBeVisible();
  });
  
  test("shows validation error for invalid email", async ({ page }) => {
    // Navigate to the contact page
    await page.goto("/contact");
    
    // Fill in the form with invalid email
    await page.getByLabel("Your Name").fill("Test User");
    await page.getByLabel("Email Address").fill("invalid-email");
    await page.getByLabel("Message").fill("This is a test message");
    
    // Submit the form
    await page.getByRole("button", { name: /send/i }).click();
    
    // Check if email validation error is shown
    await expect(page.locator("text=Please enter a valid email address")).toBeVisible();
  });
  
  test("shows success message on valid submission", async ({ page }) => {
    // Mock the API response
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true })
      });
    });
    
    // Navigate to the contact page
    await page.goto("/contact");
    
    // Fill in the form with valid data
    await page.getByLabel("Your Name").fill("Test User");
    await page.getByLabel("Email Address").fill("test@example.com");
    await page.getByLabel("Message").fill("This is a test message");
    
    // Submit the form
    await page.getByRole("button", { name: /send/i }).click();
    
    // Check if success message is shown
    await expect(page.locator("text=Message sent")).toBeVisible();
  });
});