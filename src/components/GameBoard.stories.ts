import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { buildBoard, createInitialState } from '@/game/engine'

import GameBoard from './GameBoard.vue'

const playingState = {
  ...createInitialState(),
  status: 'playing' as const,
  bullets: [{ id: 'bullet-1', row: 5, column: 4 }],
}

const meta = {
  title: 'Components/GameBoard',
  component: GameBoard,
  args: {
    cells: buildBoard(playingState),
    columns: playingState.columns,
    statusLabel: 'プレイ中',
  },
} satisfies Meta<typeof GameBoard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Cleared: Story = {
  args: {
    cells: buildBoard({
      ...playingState,
      enemies: [],
    }),
    statusLabel: 'ミッションクリア',
  },
}
