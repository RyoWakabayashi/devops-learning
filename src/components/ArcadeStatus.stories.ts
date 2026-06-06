import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ArcadeStatus from './ArcadeStatus.vue'

const meta = {
  title: 'Components/ArcadeStatus',
  component: ArcadeStatus,
  args: {
    score: 320,
    lives: 2,
    wave: 1,
    enemyCount: 4,
    shotsFired: 6,
    defeatedEnemies: 3,
    statusLabel: 'プレイ中',
  },
} satisfies Meta<typeof ArcadeStatus>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MissionClear: Story = {
  args: {
    score: 700,
    lives: 1,
    enemyCount: 0,
    shotsFired: 11,
    defeatedEnemies: 7,
    statusLabel: 'ミッションクリア',
  },
}
