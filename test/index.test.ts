import type { BuildOptions } from 'esbuild'
import { existsSync } from 'node:fs'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { build } from 'esbuild'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import rawPlugin from '../src/index.js'

const testDir = join(__dirname, 'temp')

describe('esbuild-plugin-raw', () => {
  beforeEach(async () => {
    if (!existsSync(testDir)) {
      await mkdir(testDir, { recursive: true })
    }
  })

  afterEach(async () => {
    if (existsSync(testDir)) {
      await rm(testDir, { recursive: true })
    }
  })

  it('should load text files with ?raw suffix', async () => {
    // Create a test entry file that imports a raw file
    const entryFile = join(testDir, 'entry.js')
    const rawFile = join(testDir, 'test.txt')

    await writeFile(rawFile, 'Hello, raw content!')
    await writeFile(entryFile, `
      import content from './test.txt?raw'
      export { content }
    `)

    const buildOptions: BuildOptions = {
      entryPoints: [entryFile],
      bundle: true,
      write: false,
      plugins: [rawPlugin()],
      format: 'esm',
    }

    const result = await build(buildOptions)
    const outputText = result.outputFiles![0].text

    expect(outputText).toContain('Hello, raw content!')
    expect(outputText).toContain('var test_default = "Hello, raw content!"')
  })

  it('should load JSON files as raw text', async () => {
    // Create a test entry file that imports a raw JSON file
    const entryFile = join(testDir, 'entry.js')
    const jsonFile = join(testDir, 'data.json')

    const jsonContent = { name: 'test', value: 42 }
    await writeFile(jsonFile, JSON.stringify(jsonContent, null, 2))
    await writeFile(entryFile, `
      import jsonText from './data.json?raw'
      export { jsonText }
    `)

    const buildOptions: BuildOptions = {
      entryPoints: [entryFile],
      bundle: true,
      write: false,
      plugins: [rawPlugin()],
      format: 'esm',
    }

    const result = await build(buildOptions)
    const outputText = result.outputFiles![0].text

    expect(outputText).toContain('"name": "test"')
    expect(outputText).toContain('"value": 42')
  })

  it('should work with files from fixtures directory', async () => {
    const entryFile = join(testDir, 'entry.js')

    await writeFile(entryFile, `
      import sampleText from '../fixtures/sample.txt?raw'
      import configJson from '../fixtures/config.json?raw'
      export { sampleText, configJson }
    `)

    const buildOptions: BuildOptions = {
      entryPoints: [entryFile],
      bundle: true,
      write: false,
      plugins: [rawPlugin()],
      format: 'esm',
    }

    const result = await build(buildOptions)
    const outputText = result.outputFiles![0].text

    expect(outputText).toContain('Hello, world!')
    expect(outputText).toContain('This is a sample text file for testing.')
    expect(outputText).toContain('"name": "test-config"')
    expect(outputText).toContain('"features"')
  })

  it('should handle multiline content correctly', async () => {
    const entryFile = join(testDir, 'entry.js')
    const multilineFile = join(testDir, 'multiline.txt')

    const multilineContent = `Line 1
Line 2
Line 3 with special chars: !@#$%^&*()
Line 4`

    await writeFile(multilineFile, multilineContent)
    await writeFile(entryFile, `
      import content from './multiline.txt?raw'
      export { content }
    `)

    const buildOptions: BuildOptions = {
      entryPoints: [entryFile],
      bundle: true,
      write: false,
      plugins: [rawPlugin()],
      format: 'esm',
    }

    const result = await build(buildOptions)
    const outputText = result.outputFiles![0].text

    expect(outputText).toContain('Line 1\\nLine 2\\nLine 3')
    expect(outputText).toContain('special chars: !@#$%^&*()')
  })

  it('should work with different file extensions', async () => {
    const entryFile = join(testDir, 'entry.js')
    const cssFile = join(testDir, 'styles.css')
    const htmlFile = join(testDir, 'template.html')

    await writeFile(cssFile, '.test { color: red; }')
    await writeFile(htmlFile, '<div>Hello HTML</div>')
    await writeFile(entryFile, `
      import cssContent from './styles.css?raw'
      import htmlContent from './template.html?raw'
      export { cssContent, htmlContent }
    `)

    const buildOptions: BuildOptions = {
      entryPoints: [entryFile],
      bundle: true,
      write: false,
      plugins: [rawPlugin()],
      format: 'esm',
    }

    const result = await build(buildOptions)
    const outputText = result.outputFiles![0].text

    expect(outputText).toContain('.test { color: red; }')
    expect(outputText).toContain('<div>Hello HTML</div>')
  })

  it('should handle empty files', async () => {
    const entryFile = join(testDir, 'entry.js')
    const emptyFile = join(testDir, 'empty.txt')

    await writeFile(emptyFile, '')
    await writeFile(entryFile, `
      import content from './empty.txt?raw'
      export { content }
    `)

    const buildOptions: BuildOptions = {
      entryPoints: [entryFile],
      bundle: true,
      write: false,
      plugins: [rawPlugin()],
      format: 'esm',
    }

    const result = await build(buildOptions)
    const outputText = result.outputFiles![0].text

    expect(outputText).toContain('var empty_default = ""')
  })

  it('should not interfere with regular imports', async () => {
    const entryFile = join(testDir, 'entry.js')
    const regularFile = join(testDir, 'regular.js')

    await writeFile(regularFile, 'export const value = 42;')
    await writeFile(entryFile, `
      import { value } from './regular.js'
      export { value }
    `)

    const buildOptions: BuildOptions = {
      entryPoints: [entryFile],
      bundle: true,
      write: false,
      plugins: [rawPlugin()],
      format: 'esm',
    }

    const result = await build(buildOptions)
    const outputText = result.outputFiles![0].text

    // Should contain the actual JS import, not raw text
    expect(outputText).toContain('var value = 42')
    expect(outputText).not.toContain('export const value = 42;')
  })

  it('should handle files with special characters in content', async () => {
    const entryFile = join(testDir, 'entry.js')
    const specialFile = join(testDir, 'special.txt')

    const specialContent = `Special chars: "quotes", 'single quotes', \`backticks\`, \\backslashes\\, and
newlines with tabs\tand unicode: 你好 🌍`

    await writeFile(specialFile, specialContent)
    await writeFile(entryFile, `
      import content from './special.txt?raw'
      export { content }
    `)

    const buildOptions: BuildOptions = {
      entryPoints: [entryFile],
      bundle: true,
      write: false,
      plugins: [rawPlugin()],
      format: 'esm',
    }

    const result = await build(buildOptions)
    const outputText = result.outputFiles![0].text

    expect(outputText).toContain('Special chars:')
    expect(outputText).toContain('\\u4F60\\u597D') // 你好 in unicode escape
    expect(outputText).toContain('\\u{1F30D}') // 🌍 in unicode escape
  })
})
