export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'lost'
export type CellKind = 'empty' | 'player' | 'enemy' | 'bullet'
export type MovementDirection = -1 | 1

export interface Position {
  row: number
  column: number
}

export interface Enemy extends Position {
  id: string
}

export interface Bullet extends Position {
  id: string
}

export interface GameState {
  rows: number
  columns: number
  playerRow: number
  playerColumn: number
  enemies: Enemy[]
  bullets: Bullet[]
  enemyDirection: MovementDirection
  score: number
  lives: number
  wave: number
  shotsFired: number
  defeatedEnemies: number
  tick: number
  status: GameStatus
}

export interface BoardCell {
  row: number
  column: number
  kind: CellKind
  testId: string
  ariaLabel: string
}
