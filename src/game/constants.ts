import type { Enemy } from './types'

export const BOARD_COLUMNS = 9
export const BOARD_ROWS = 9
export const PLAYER_ROW = BOARD_ROWS - 1
export const PLAYER_START_COLUMN = Math.floor(BOARD_COLUMNS / 2)
export const INITIAL_LIVES = 2
export const MAX_BULLETS = 2
export const SCORE_PER_ENEMY = 100
export const GAME_TICK_MS = 450

const FORMATIONS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [
    [1, 1],
    [1, 3],
    [1, 5],
    [1, 7],
    [2, 2],
    [2, 4],
    [2, 6],
  ],
  [
    [1, 2],
    [1, 4],
    [1, 6],
    [2, 1],
    [2, 3],
    [2, 5],
    [2, 7],
  ],
]

export function createEnemyFormation(wave: number): Enemy[] {
  const layout = FORMATIONS[(wave - 1) % FORMATIONS.length]

  return layout.map(([row, column], index) => ({
    id: `wave-${wave}-enemy-${index}`,
    row,
    column,
  }))
}
