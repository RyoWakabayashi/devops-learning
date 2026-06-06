import path from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

function resolveBasePath() {
  const repository = process.env.GITHUB_REPOSITORY
  const runningInActions = process.env.GITHUB_ACTIONS === 'true'

  if (!repository || !runningInActions) {
    return '/'
  }

  const [, repoName] = repository.split('/')
  return repoName ? `/${repoName}/` : '/'
}

export default defineConfig({
  base: resolveBasePath(),
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
})
