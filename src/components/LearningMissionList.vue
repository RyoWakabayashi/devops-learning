<script setup lang="ts">
import type { LearningMission } from '@/content/missions'

defineProps<{
  missions: LearningMission[]
}>()
</script>

<template>
  <section class="mission-list">
    <header class="mission-list__header">
      <div>
        <p class="mission-list__eyebrow">Hands-on Route</p>
        <h2>学習ミッション</h2>
      </div>
      <p class="mission-list__copy">
        変更は小さく、確認は自動化で。新人向けに 3 ステップへ分けています。
      </p>
    </header>

    <article
      v-for="mission in missions"
      :key="mission.title"
      class="mission-card"
    >
      <p class="mission-card__branch">{{ mission.branchName }}</p>
      <h3>{{ mission.title }}</h3>
      <p>{{ mission.goal }}</p>
      <p class="mission-card__why">{{ mission.whyItMatters }}</p>
      <div class="mission-card__meta">
        <div>
          <strong>編集するファイル</strong>
          <ul>
            <li v-for="file in mission.filesToTouch" :key="file">
              <code>{{ file }}</code>
            </li>
          </ul>
        </div>
        <div>
          <strong>通したい確認</strong>
          <ul>
            <li v-for="check in mission.checks" :key="check">
              <code>{{ check }}</code>
            </li>
          </ul>
        </div>
      </div>
    </article>
  </section>
</template>
