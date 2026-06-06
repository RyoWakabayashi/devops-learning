import {
  BOARD_COLUMNS,
  BOARD_ROWS,
  GAME_TICK_MS,
  INITIAL_LIVES,
  MAX_BULLETS,
  PLAYER_ROW,
  PLAYER_START_COLUMN,
  SCORE_PER_ENEMY,
  createEnemyFormation,
} from './constants'
import type {
  BoardCell,
  Bullet,
  GameState,
  GameStatus,
  MovementDirection,
} from './types'

function positionKey(row: number, column: number) {
  return `${row}:${column}`
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function resetWave(state: GameState): GameState {
  return {
    ...state,
    bullets: [],
    enemies: createEnemyFormation(state.wave),
    enemyDirection: 1,
    playerColumn: PLAYER_START_COLUMN,
  }
}

function resolveBulletHits(state: GameState): GameState {
  if (state.bullets.length === 0 || state.enemies.length === 0) {
    return state
  }

  const enemiesByPosition = new Map(
    state.enemies.map((enemy) => [positionKey(enemy.row, enemy.column), enemy])
  )
  const defeatedIds = new Set<string>()
  const remainingBullets: Bullet[] = []

  for (const bullet of state.bullets) {
    const hitEnemy = enemiesByPosition.get(
      positionKey(bullet.row, bullet.column)
    )

    if (hitEnemy) {
      defeatedIds.add(hitEnemy.id)
      continue
    }

    remainingBullets.push(bullet)
  }

  if (defeatedIds.size === 0) {
    return state
  }

  return {
    ...state,
    bullets: remainingBullets,
    enemies: state.enemies.filter((enemy) => !defeatedIds.has(enemy.id)),
    score: state.score + defeatedIds.size * SCORE_PER_ENEMY,
    defeatedEnemies: state.defeatedEnemies + defeatedIds.size,
  }
}

function moveEnemies(state: GameState): GameState {
  const hitsWall = state.enemies.some((enemy) => {
    const nextColumn = enemy.column + state.enemyDirection
    return nextColumn < 0 || nextColumn >= state.columns
  })

  const nextDirection: MovementDirection = hitsWall
    ? state.enemyDirection === 1
      ? -1
      : 1
    : state.enemyDirection

  const nextEnemies = state.enemies.map((enemy) =>
    hitsWall
      ? { ...enemy, row: enemy.row + 1 }
      : { ...enemy, column: enemy.column + state.enemyDirection }
  )

  return {
    ...state,
    enemies: nextEnemies,
    enemyDirection: nextDirection,
  }
}

export function createInitialState(): GameState {
  return {
    rows: BOARD_ROWS,
    columns: BOARD_COLUMNS,
    playerRow: PLAYER_ROW,
    playerColumn: PLAYER_START_COLUMN,
    enemies: createEnemyFormation(1),
    bullets: [],
    enemyDirection: 1,
    score: 0,
    lives: INITIAL_LIVES,
    wave: 1,
    shotsFired: 0,
    defeatedEnemies: 0,
    tick: 0,
    status: 'idle',
  }
}

export function startGame(state: GameState): GameState {
  if (state.status === 'won' || state.status === 'lost') {
    return restartGame()
  }

  return {
    ...state,
    status: 'playing',
  }
}

export function restartGame(): GameState {
  return {
    ...createInitialState(),
    status: 'playing',
  }
}

export function togglePause(state: GameState): GameState {
  if (state.status !== 'playing' && state.status !== 'paused') {
    return state
  }

  return {
    ...state,
    status: state.status === 'playing' ? 'paused' : 'playing',
  }
}

export function movePlayer(
  state: GameState,
  direction: MovementDirection
): GameState {
  const nextColumn = clamp(state.playerColumn + direction, 0, state.columns - 1)

  return {
    ...state,
    playerColumn: nextColumn,
  }
}

export function fireBullet(state: GameState): GameState {
  if (state.status !== 'playing' || state.bullets.length >= MAX_BULLETS) {
    return state
  }

  return resolveBulletHits({
    ...state,
    shotsFired: state.shotsFired + 1,
    bullets: [
      ...state.bullets,
      {
        id: `bullet-${state.tick}-${state.shotsFired + 1}`,
        row: state.playerRow - 1,
        column: state.playerColumn,
      },
    ],
  })
}

export function tickGame(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state
  }

  let nextState: GameState = {
    ...state,
    tick: state.tick + 1,
    bullets: state.bullets
      .map((bullet) => ({ ...bullet, row: bullet.row - 1 }))
      .filter((bullet) => bullet.row >= 0),
  }

  nextState = resolveBulletHits(nextState)
  nextState = moveEnemies(nextState)
  nextState = resolveBulletHits(nextState)

  if (nextState.enemies.length === 0) {
    return {
      ...nextState,
      status: 'won',
    }
  }

  const enemyReachedPlayer = nextState.enemies.some(
    (enemy) => enemy.row >= nextState.playerRow
  )

  if (!enemyReachedPlayer) {
    return nextState
  }

  if (nextState.lives > 1) {
    return {
      ...resetWave(nextState),
      lives: nextState.lives - 1,
      status: 'playing',
    }
  }

  return {
    ...nextState,
    lives: 0,
    status: 'lost',
  }
}

export function getStatusLabel(status: GameStatus) {
  switch (status) {
    case 'idle':
      return '待機中'
    case 'playing':
      return 'プレイ中'
    case 'paused':
      return '一時停止中'
    case 'won':
      return 'ミッションクリア'
    case 'lost':
      return 'ゲームオーバー'
  }
}

export function buildBoard(state: GameState): BoardCell[] {
  const enemyPositions = new Set(
    state.enemies.map((enemy) => positionKey(enemy.row, enemy.column))
  )
  const bulletPositions = new Set(
    state.bullets.map((bullet) => positionKey(bullet.row, bullet.column))
  )
  const cells: BoardCell[] = []

  for (let row = 0; row < state.rows; row += 1) {
    for (let column = 0; column < state.columns; column += 1) {
      const key = positionKey(row, column)
      let kind: BoardCell['kind'] = 'empty'

      if (row === state.playerRow && column === state.playerColumn) {
        kind = 'player'
      } else if (bulletPositions.has(key)) {
        kind = 'bullet'
      } else if (enemyPositions.has(key)) {
        kind = 'enemy'
      }

      cells.push({
        row,
        column,
        kind,
        testId: `cell-${row}-${column}`,
        ariaLabel:
          kind === 'player'
            ? `Player at row ${row + 1}, column ${column + 1}`
            : kind === 'enemy'
              ? `Enemy at row ${row + 1}, column ${column + 1}`
              : kind === 'bullet'
                ? `Bullet at row ${row + 1}, column ${column + 1}`
                : `Empty cell at row ${row + 1}, column ${column + 1}`,
      })
    }
  }

  return cells
}

export function getGameTickMs() {
  return GAME_TICK_MS
}
