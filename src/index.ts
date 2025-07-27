import type { Plugin } from 'esbuild'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export default function rawPlugin(): Plugin {
  return {
    name: 'raw',
    setup(build) {
      build.onResolve({ filter: /\?raw$/ }, (args) => {
        return {
          path: args.path,
          pluginData: {
            isAbsolute: path.isAbsolute(args.path),
            resolveDir: args.resolveDir,
          },
          namespace: 'raw-loader',
        }
      })
      build.onLoad({ filter: /\?raw$/, namespace: 'raw-loader' }, async (args) => {
        const fullPath = args.pluginData.isAbsolute ? args.path : path.join(args.pluginData.resolveDir, args.path)
        return {
          contents: await readFile(fullPath.replace(/\?raw$/, '')),
          loader: 'text',
        }
      })
    },
  }
}
