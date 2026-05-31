# esbuild-plugin-raw

## Install

```sh
$ npm install -D esbuild-plugin-raw
```

## Usage

### With build script

```js
import esbuild from 'esbuild'
import rawPlugin from 'esbuild-plugin-raw'

esbuild.build({
  entryPoints: ['app.js'],
  bundle: true,
  outfile: 'out.js',
  plugins: [rawPlugin()],
}).catch(() => process.exit(1))
```

### With [tsup](https://github.com/egoist/tsup)

```js
import rawPlugin from 'esbuild-plugin-raw'
import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  esbuildPlugins: [rawPlugin()],
  clean: true,
})
```

## License

MIT License © 2021 [hannoeru](https://github.com/hannoeru)
