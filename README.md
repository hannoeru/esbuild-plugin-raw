# esbuild-plugin-raw

## Install

```sh
$ npm install -D esbuild-plugin-raw
```

## Usage

### With build script

```js
import esbuild from 'esbuild'
import RawPlugin from 'esbuild-plugin-raw'

esbuild.build({
  entryPoints: ['app.js'],
  bundle: true,
  outfile: 'out.js',
  plugins: [RawPlugin],
}).catch(() => process.exit(1))
```

### With [tsup](https://github.com/egoist/tsup)

```js
import { defineConfig } from 'tsup'
import RawPlugin from 'esbuild-plugin-raw'

export default defineConfig({
  entryPoints: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  esbuildPlugins: [RawPlugin()],
  clean: true,
})
```