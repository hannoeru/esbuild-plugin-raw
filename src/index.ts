import type { Plugin } from 'esbuild'
import { readFile } from 'node:fs/promises'
import { isAbsolute, resolve } from 'node:path'

export default function rawPlugin(): Plugin {
  return {
    name: 'raw',
    setup(build) {
      build.onResolve({ filter: /\?raw$/ }, (args) => {
        const rawPath = args.path.replace(/\?raw$/, '')
        const resolvedPath = isAbsolute(rawPath)
          ? rawPath
          : resolve(args.resolveDir, rawPath)

        return {
          path: resolvedPath,
          namespace: 'raw-loader',
        }
      })
      build.onLoad({ filter: /.*/, namespace: 'raw-loader' }, async (args) => {
        return {
          contents: await readFile(args.path, 'utf8'),
          loader: 'text',
          watchFiles: [args.path],
        }
      })
    },
  }
}
