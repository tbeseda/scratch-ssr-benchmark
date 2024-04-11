import { handler } from '../modules/enhance-core/index.mjs'

export async function buildEnhanceCoreHandler() {
  return async function (req, res) {
    const response = await handler(req, {})
    for (const [key, value] of Object.entries(response.headers)) {
      res.setHeader(key, value)
    }
    res.write(response.body)
    res._res()
  }
}
