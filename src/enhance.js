import arc from '@architect/functions'
import router from '../node_modules/@enhance/arc-plugin-enhance/src/http/any-catchall/router.mjs'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function buildEnhanceHandler() {
    let handler = async function (req, res) {
      let enhance = await arc.http(router.bind({}, { basePath: join(__dirname, '../modules/enhance/app') }))
      req.rawPath = req.url
      let ack = await enhance(req)
      for (const [key, value] of Object.entries(ack.headers)) {
        res.setHeader(key, value)
      }
      res.write(ack.body)
      res._res()
    }

    return handler
}

