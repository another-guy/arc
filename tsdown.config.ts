import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'my-tool': './src/my-tool/index.ts', // Sets the output name to tool.js
  },
  outDir: './bin',
  banner: '#!/usr/bin/env node',
});
