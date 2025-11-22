import { test, expect } from "@playwright/test"

test.describe("RSVP Flow", () => {
  test("should submit RSVP successfully", async ({ page }) => {
    await page.goto("/rsvp")

    // Fill out form
    await page.fill('input[name="name"]', "Test Guest")
    await page.fill('input[name="email"]', "test@example.com")
    await page.check('input[type="checkbox"]') // Attending checkbox
    await page.fill('input[name="partySize"]', "2")
    await page.selectOption('select[name="mealPreference"]', "Beef")

    // Submit
    await page.click('button[type="submit"]')

    // Should redirect to confirmation page
    await expect(page).toHaveURL(/\/rsvp\/confirmation/)
    await expect(page.locator("text=Thank You")).toBeVisible()
  })

  test("should validate required fields", async ({ page }) => {
    await page.goto("/rsvp")

    // Try to submit without filling form
    await page.click('button[type="submit"]')

    // Should show validation errors
    await expect(page.locator("text=Name is required")).toBeVisible()
  })
})

