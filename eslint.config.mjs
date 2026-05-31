import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'antfu/no-import-dist': 'off', // allow importing from dist in index.d.ts
  },
})
