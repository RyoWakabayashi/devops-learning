import { expect, test } from '@playwright/test'

test('the learning game starts, moves, and fires', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      name: 'CI/CD を学べる Vue 製シューティングゲーム教材',
    })
  ).toBeVisible()

  await page.getByTestId('start-button').click()
  await expect(page.getByTestId('status-badge')).toHaveText('プレイ中')

  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('Space')

  await expect(page.getByTestId('cell-7-3')).toContainText('|')
})
