import path from 'path'
import { readFile } from 'fs/promises'
import type { Plugin } from 'esbuild'

export default function rawPlugin(): Plugin {
  return {
    name: 'raw',
    setup(build) {
      build.onResolve({ filter: /\?raw$/ }, (args) => {
        return {
          path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
          namespace: 'raw-loader',
        }
      })
      build.onLoad({ filter: /\?raw$/, namespace: 'raw-loader' }, async(args) => {
        return {
          contents: await readFile(args.path.replace(/\?raw$/, '')),
          loader: 'text',
        }
      })
    },
  }
}
