import type { Meta, StoryObj } from '@storybook/vue3-vite'

import GameControls from './GameControls.vue'

const meta = {
  title: 'Components/GameControls',
  component: GameControls,
  args: {
    canPause: true,
    canStart: true,
  },
} satisfies Meta<typeof GameControls>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InProgress: Story = {
  args: {
    canPause: true,
    canStart: false,
  },
}
