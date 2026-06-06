<script setup lang="ts">
import type { BoardCell } from '@/game/types'

defineProps<{
  cells: BoardCell[]
  columns: number
  statusLabel: string
}>()

const tokenByKind = {
  empty: '',
  player: 'A',
  enemy: 'M',
  bullet: '|',
}
</script>

<template>
  <section class="board-shell">
    <header class="board-shell__header">
      <div>
        <p class="board-shell__eyebrow">Playable Demo</p>
        <h2>Vue シューティングゲーム</h2>
      </div>
      <p class="board-shell__note">
        方向キーで移動、スペースで発射。今の状態: {{ statusLabel }}
      </p>
    </header>

    <div
      class="board"
      data-testid="game-board"
      role="grid"
      :style="{ '--board-columns': String(columns) }"
    >
      <div
        v-for="cell in cells"
        :key="cell.testId"
        :data-testid="cell.testId"
        class="board__cell"
        :class="`board__cell--${cell.kind}`"
        role="gridcell"
        :aria-label="cell.ariaLabel"
      >
        <span
          v-if="cell.kind !== 'empty'"
          class="board__token"
          aria-hidden="true"
        >
          {{ tokenByKind[cell.kind] }}
        </span>
      </div>
    </div>
  </section>
</template>
