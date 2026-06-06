<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
  lives: number
  wave: number
  enemyCount: number
  shotsFired: number
  defeatedEnemies: number
  statusLabel: string
}>()

const items = computed(() => [
  {
    label: 'SCORE',
    value: props.score.toString().padStart(4, '0'),
    hint: '敵を倒すと 100 点ずつ増えます。',
  },
  {
    label: 'LIVES',
    value: props.lives.toString(),
    hint: '敵が最下段まで来ると 1 つ減ります。',
  },
  {
    label: 'WAVE',
    value: props.wave.toString(),
    hint: '今は 1 ステージだけなので仕組みを追いやすいです。',
  },
  {
    label: 'ENEMIES',
    value: props.enemyCount.toString(),
    hint: '残りの敵の数です。',
  },
  {
    label: 'SHOTS',
    value: props.shotsFired.toString(),
    hint: '何発撃ったかが分かります。',
  },
  {
    label: 'HITS',
    value: props.defeatedEnemies.toString(),
    hint: '当てた回数です。',
  },
])
</script>

<template>
  <section class="status-panel" aria-label="Game status panel">
    <header class="status-panel__header">
      <div>
        <p class="status-panel__eyebrow">Runtime Dashboard</p>
        <h2>ゲームの状態</h2>
      </div>
      <p class="status-panel__badge" data-testid="status-badge">
        {{ statusLabel }}
      </p>
    </header>

    <div class="status-panel__grid">
      <article
        v-for="item in items"
        :key="item.label"
        class="status-panel__card"
      >
        <p class="status-panel__label">{{ item.label }}</p>
        <strong class="status-panel__value">{{ item.value }}</strong>
        <p class="status-panel__hint">{{ item.hint }}</p>
      </article>
    </div>
  </section>
</template>
