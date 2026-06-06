import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { learningMissions } from '@/content/missions'

import LearningMissionList from './LearningMissionList.vue'

const meta = {
  title: 'Components/LearningMissionList',
  component: LearningMissionList,
  args: {
    missions: learningMissions,
  },
} satisfies Meta<typeof LearningMissionList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
