import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import arc from '@architect/functions'
import enhanceApp from '@enhance/core'
import enhanceConfigLoader from '@enhance/loader'

const here = dirname(fileURLToPath(import.meta.url))
const loaderConfig = { basePath: join(here, 'app') }

const appConfig = await enhanceConfigLoader(loaderConfig)
const app = enhanceApp(appConfig)
export const handler = arc.http(app.routeAndRender.bind({}))
