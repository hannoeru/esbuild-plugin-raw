import type { Plugin } from 'esbuild'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default function rawPlugin(): Plugin {
  return {
    name: 'raw',
    setup(build) {
      build.onResolve({ filter: /\?raw$/ }, (args) => {
        const resolvedPath = join(args.resolveDir, args.path)
        return {
          path: resolvedPath,
          namespace: 'raw-loader',
        }
      })
      build.onLoad(
        { filter: /\?raw$/, namespace: 'raw-loader' },
        async (args) => {
          return {
            contents: await readFile(args.path.replace(/\?raw$/, '')),
            loader: 'text',
          }
        }
      )
    },
  }
}
