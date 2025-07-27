import RawPlugin from 'esbuild-plugin-raw'
import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  esbuildPlugins: [RawPlugin()],
  clean: true,
})
