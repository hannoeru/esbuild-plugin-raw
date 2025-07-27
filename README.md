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
import RawPlugin from 'esbuild-plugin-raw'
import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  esbuildPlugins: [RawPlugin()],
  clean: true,
})
```

## License

MIT License © 2021 [hannoeru](https://github.com/hannoeru)
