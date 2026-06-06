export interface LearningMission {
  title: string
  goal: string
  whyItMatters: string
  branchName: string
  filesToTouch: string[]
  checks: string[]
}

export const learningMissions: LearningMission[] = [
  {
    title: 'Mission 1: 見た目を変える',
    goal: 'ゲームのタイトルかカラーテーマを変更して、最初の PR を作る',
    whyItMatters:
      '小さな変更でも、コミットから CI 実行までの流れを安全に試せます。',
    branchName: 'feature/change-theme',
    filesToTouch: ['src/App.vue', 'src/style.css'],
    checks: ['pre-commit', 'lint', 'build', 'storybook:build'],
  },
  {
    title: 'Mission 2: ルールを変える',
    goal: '敵の並びや残機数を変更して、単体テストも更新する',
    whyItMatters:
      '仕様変更とテスト修正をセットで行うことで、CI が品質を守る理由を体験できます。',
    branchName: 'feature/tune-game-balance',
    filesToTouch: ['src/game/constants.ts', 'src/game/engine.test.ts'],
    checks: ['typecheck', 'test:unit', 'build'],
  },
  {
    title: 'Mission 3: デプロイを確認する',
    goal: 'main にマージして GitHub Pages の公開 URL を確認する',
    whyItMatters:
      'CI と CD がつながると、レビューが終わった変更を自動で公開できるようになります。',
    branchName: 'feature/deploy-verification',
    filesToTouch: ['README.md', 'docs/handson.md'],
    checks: ['ci workflow', 'deploy-pages workflow'],
  },
]
