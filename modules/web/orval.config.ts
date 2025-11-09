import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: '../../openapi.yaml',
    output: {
      target: './src/lib/data/generated.ts',
      client: 'react-query',
      baseUrl: 'http://localhost:8080',
      httpClient: 'axios',
      mock: false,
      prettier: true,
    },
  },
})
