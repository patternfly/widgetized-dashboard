module.exports = {
  branches: [{ name: 'main', channel: 'prerelease', prerelease: 'prerelease' }, 'do-not-delete'],
  analyzeCommits: {
    preset: 'angular'
  },
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    '@semantic-release/npm'
  ],
  tagFormat: 'prerelease-v${version}',
  dryRun: false
};