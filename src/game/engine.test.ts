import { describe, expect, it } from 'vitest'

import {
  buildBoard,
  createInitialState,
  fireBullet,
  getGameTickMs,
  getStatusLabel,
  movePlayer,
  startGame,
  tickGame,
  togglePause,
} from './engine'

describe('game engine', () => {
  it('creates the initial state for the learning game', () => {
    const state = createInitialState()

    expect(state.status).toBe('idle')
    expect(state.playerColumn).toBe(4)
    expect(state.enemies).toHaveLength(7)
    expect(state.lives).toBe(2)
  })

  it('keeps the player inside the board', () => {
    const state = {
      ...createInitialState(),
      playerColumn: 0,
    }

    expect(movePlayer(state, -1).playerColumn).toBe(0)
    expect(movePlayer(state, 1).playerColumn).toBe(1)
  })

  it('fires a bullet only while the game is running', () => {
    const idleState = createInitialState()
    const playingState = {
      ...createInitialState(),
      status: 'playing' as const,
    }

    expect(fireBullet(idleState).bullets).toHaveLength(0)
    expect(fireBullet(playingState).bullets).toHaveLength(1)
  })

  it('starts and pauses the game through status changes', () => {
    const idleState = createInitialState()
    const playingState = startGame(idleState)
    const pausedState = togglePause(playingState)

    expect(playingState.status).toBe('playing')
    expect(pausedState.status).toBe('paused')
    expect(togglePause(pausedState).status).toBe('playing')
  })

  it('defeats an enemy, adds score, and wins the wave', () => {
    const state = {
      ...createInitialState(),
      status: 'playing' as const,
      enemies: [{ id: 'enemy-1', row: 2, column: 4 }],
      bullets: [{ id: 'bullet-1', row: 3, column: 4 }],
    }

    const nextState = tickGame(state)

    expect(nextState.score).toBe(100)
    expect(nextState.defeatedEnemies).toBe(1)
    expect(nextState.enemies).toHaveLength(0)
    expect(nextState.status).toBe('won')
  })

  it('makes enemies descend and reverse direction at the wall', () => {
    const state = {
      ...createInitialState(),
      status: 'playing' as const,
      enemies: [{ id: 'enemy-1', row: 1, column: 8 }],
      enemyDirection: 1 as const,
    }

    const nextState = tickGame(state)

    expect(nextState.enemyDirection).toBe(-1)
    expect(nextState.enemies[0]).toMatchObject({ row: 2, column: 8 })
  })

  it('resets the wave when the player still has remaining lives', () => {
    const state = {
      ...createInitialState(),
      status: 'playing' as const,
      lives: 2,
      enemies: [{ id: 'enemy-1', row: 8, column: 4 }],
      bullets: [{ id: 'bullet-1', row: 6, column: 4 }],
    }

    const nextState = tickGame(state)

    expect(nextState.status).toBe('playing')
    expect(nextState.lives).toBe(1)
    expect(nextState.playerColumn).toBe(4)
    expect(nextState.bullets).toHaveLength(0)
    expect(nextState.enemies).toHaveLength(7)
  })

  it('ends the game when no lives remain', () => {
    const state = {
      ...createInitialState(),
      status: 'playing' as const,
      lives: 1,
      enemies: [{ id: 'enemy-1', row: 8, column: 4 }],
    }

    const nextState = tickGame(state)

    expect(nextState.status).toBe('lost')
    expect(nextState.lives).toBe(0)
  })

  it('renders board cells with the expected entity markers', () => {
    const state = {
      ...createInitialState(),
      status: 'playing' as const,
      bullets: [{ id: 'bullet-1', row: 5, column: 4 }],
      enemies: [{ id: 'enemy-1', row: 2, column: 1 }],
    }

    const cells = buildBoard(state)
    const playerCell = cells.find((cell) => cell.kind === 'player')
    const bulletCell = cells.find((cell) => cell.kind === 'bullet')
    const enemyCell = cells.find((cell) => cell.kind === 'enemy')

    expect(playerCell).toMatchObject({ row: 8, column: 4 })
    expect(bulletCell).toMatchObject({ row: 5, column: 4 })
    expect(enemyCell).toMatchObject({ row: 2, column: 1 })
  })

  it('exposes helper labels for the UI', () => {
    expect(getStatusLabel('idle')).toBe('待機中')
    expect(getStatusLabel('playing')).toBe('プレイ中')
    expect(getStatusLabel('paused')).toBe('一時停止中')
    expect(getStatusLabel('won')).toBe('ミッションクリア')
    expect(getStatusLabel('lost')).toBe('ゲームオーバー')
    expect(getGameTickMs()).toBe(450)
  })
})
