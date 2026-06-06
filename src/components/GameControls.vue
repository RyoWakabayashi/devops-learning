<script setup lang="ts">
defineProps<{
  canPause: boolean
  canStart: boolean
}>()

defineEmits<{
  start: []
  restart: []
  togglePause: []
  moveLeft: []
  fire: []
  moveRight: []
}>()
</script>

<template>
  <section class="controls">
    <header class="controls__header">
      <div>
        <p class="controls__eyebrow">Input Panel</p>
        <h2>操作ボタン</h2>
      </div>
      <p class="controls__copy">
        キーボードが苦手でも試せるように、画面上のボタンでも遊べます。
      </p>
    </header>

    <div class="controls__row">
      <button
        type="button"
        class="arcade-button"
        data-testid="start-button"
        :disabled="!canStart"
        @click="$emit('start')"
      >
        スタート
      </button>
      <button
        type="button"
        class="arcade-button arcade-button--ghost"
        :disabled="!canPause"
        @click="$emit('togglePause')"
      >
        一時停止 / 再開
      </button>
      <button
        type="button"
        class="arcade-button arcade-button--ghost"
        @click="$emit('restart')"
      >
        リスタート
      </button>
    </div>

    <div class="controls__row controls__row--compact">
      <button
        type="button"
        class="arcade-button arcade-button--icon"
        @click="$emit('moveLeft')"
      >
        左
      </button>
      <button
        type="button"
        class="arcade-button arcade-button--fire"
        data-testid="fire-button"
        @click="$emit('fire')"
      >
        発射
      </button>
      <button
        type="button"
        class="arcade-button arcade-button--icon"
        @click="$emit('moveRight')"
      >
        右
      </button>
    </div>
  </section>
</template>
