<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import ArcadeStatus from '@/components/ArcadeStatus.vue'
import GameBoard from '@/components/GameBoard.vue'
import GameControls from '@/components/GameControls.vue'
import LearningMissionList from '@/components/LearningMissionList.vue'
import { learningMissions } from '@/content/missions'
import {
  buildBoard,
  createInitialState,
  fireBullet,
  getGameTickMs,
  getStatusLabel,
  movePlayer,
  restartGame,
  startGame,
  tickGame,
  togglePause,
} from '@/game/engine'

const state = ref(createInitialState())
let gameTimer: number | undefined

const boardCells = computed(() => buildBoard(state.value))
const statusLabel = computed(() => getStatusLabel(state.value.status))
const canStart = computed(
  () =>
    state.value.status === 'idle' ||
    state.value.status === 'won' ||
    state.value.status === 'lost'
)
const canPause = computed(
  () => state.value.status === 'playing' || state.value.status === 'paused'
)

const pipelineSteps = [
  {
    title: '1. ローカルで変更',
    description:
      'まずは自分の PC でコードを直します。ここでは Vue と TypeScript を使ってゲームを更新します。',
  },
  {
    title: '2. pre-commit で早めに確認',
    description:
      'コミット前に formatter、lint、型検査を走らせて、単純なミスを早く見つけます。',
  },
  {
    title: '3. GitHub Actions で自動確認',
    description:
      'push や PR をきっかけに、単体テスト、Playwright、Storybook build が GitHub 上で動きます。',
  },
  {
    title: '4. main へマージしたら公開',
    description:
      'main に入った変更だけが GitHub Pages にデプロイされるので、公開版が安定しやすくなります。',
  },
]

const glossary = [
  {
    word: 'CI',
    description:
      'Continuous Integration の略です。コードをリポジトリへ集めるたびに、自動でテストやチェックを走らせる考え方です。',
  },
  {
    word: 'CD',
    description:
      'Continuous Delivery / Deployment の略です。CI で確認できた成果物を、自動で公開や配布につなげる流れです。',
  },
  {
    word: 'Artifact',
    description:
      'ビルド結果やテストレポートのような「実行してできた成果物」のことです。Actions では後からダウンロードして確認できます。',
  },
  {
    word: 'Fork',
    description:
      '元リポジトリを自分の GitHub アカウントへコピーすることです。新人研修では安全に試すためによく使います。',
  },
]

function clearGameTimer() {
  if (typeof gameTimer !== 'undefined') {
    window.clearInterval(gameTimer)
    gameTimer = undefined
  }
}

function handleStart() {
  state.value = startGame(state.value)
}

function handleRestart() {
  state.value = restartGame()
}

function handleTogglePause() {
  state.value = togglePause(state.value)
}

function handleMoveLeft() {
  state.value = movePlayer(state.value, -1)
}

function handleMoveRight() {
  state.value = movePlayer(state.value, 1)
}

function handleFire() {
  state.value = fireBullet(state.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
    event.preventDefault()
    handleMoveLeft()
    return
  }

  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
    event.preventDefault()
    handleMoveRight()
    return
  }

  if (event.key === ' ') {
    event.preventDefault()
    handleFire()
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    handleStart()
    return
  }

  if (event.key.toLowerCase() === 'p') {
    event.preventDefault()
    handleTogglePause()
  }
}

watch(
  () => state.value.status,
  (status) => {
    clearGameTimer()

    if (status === 'playing') {
      gameTimer = window.setInterval(() => {
        state.value = tickGame(state.value)
      }, getGameTickMs())
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearGameTimer()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <main class="app-shell">
    <section class="hero">
      <div class="hero__copy">
        <p class="hero__eyebrow">DevOps Learning Lab</p>
        <h1>CI/CD を学べる Vue 製シューティングゲーム教材</h1>
        <p class="hero__lead">
          このリポジトリは、コードを少し直して、コミットして、PR
          を出して、GitHub Pages に公開されるまでを体験するための練習場です。
        </p>
        <div class="hero__chips">
          <span>Vue + TypeScript</span>
          <span>mise</span>
          <span>pre-commit</span>
          <span>Vitest</span>
          <span>Playwright</span>
          <span>Storybook</span>
          <span>GitHub Pages</span>
        </div>
      </div>

      <div class="hero__aside">
        <div class="hero__card">
          <p class="hero__card-label">はじめに覚える流れ</p>
          <ol>
            <li>フォークして、自分の作業ブランチを切る</li>
            <li>変更して、ローカルのチェックを通す</li>
            <li>PR を作って、GitHub Actions の結果を見る</li>
            <li>main へマージして、Pages の公開を確認する</li>
          </ol>
        </div>
      </div>
    </section>

    <section class="lab-grid">
      <div class="lab-grid__game">
        <GameBoard
          :cells="boardCells"
          :columns="state.columns"
          :status-label="statusLabel"
        />
        <GameControls
          :can-pause="canPause"
          :can-start="canStart"
          @start="handleStart"
          @restart="handleRestart"
          @toggle-pause="handleTogglePause"
          @move-left="handleMoveLeft"
          @fire="handleFire"
          @move-right="handleMoveRight"
        />
      </div>

      <div class="lab-grid__info">
        <ArcadeStatus
          :score="state.score"
          :lives="state.lives"
          :wave="state.wave"
          :enemy-count="state.enemies.length"
          :shots-fired="state.shotsFired"
          :defeated-enemies="state.defeatedEnemies"
          :status-label="statusLabel"
        />
      </div>
    </section>

    <section class="content-grid">
      <LearningMissionList :missions="learningMissions" />

      <section class="pipeline-panel">
        <header class="pipeline-panel__header">
          <div>
            <p class="pipeline-panel__eyebrow">Pipeline Map</p>
            <h2>CI/CD の流れ</h2>
          </div>
          <p class="pipeline-panel__copy">
            何がいつ動くのかを先に知っておくと、赤い CI
            を見ても慌てにくくなります。
          </p>
        </header>

        <article
          v-for="step in pipelineSteps"
          :key="step.title"
          class="pipeline-step"
        >
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </article>
      </section>
    </section>

    <section class="glossary">
      <header class="glossary__header">
        <div>
          <p class="glossary__eyebrow">Beginner Glossary</p>
          <h2>専門用語をやさしく確認</h2>
        </div>
        <p class="glossary__copy">
          ドキュメントでよく出る言葉を、読み飛ばしにくい短さでまとめています。
        </p>
      </header>

      <div class="glossary__grid">
        <article
          v-for="item in glossary"
          :key="item.word"
          class="glossary-card"
        >
          <p class="glossary-card__word">{{ item.word }}</p>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>
  </main>
</template>
