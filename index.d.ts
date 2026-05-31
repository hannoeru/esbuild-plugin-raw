import type { Plugin } from 'esbuild'
import './client'

declare function rawPlugin(): Plugin

export default rawPlugin
