import { Bench } from "tinybench";
import { IncomingMessage, ServerResponse } from "./http.js";
import { buildRemixHandler } from "./remix.js";
import { buildNextHandler, buildNextPagesHandler } from "./next.js";
import { buildNuxtHandler } from "./nuxt.js";
import { buildSveltekitHandler } from "./svelte.js";
import { buildEnhanceHandler } from "./enhance.js";
import { buildEnhanceCoreHandler } from "./enhance-core.js";
import http from "node:http";
import { getDuplicationFactor, logResultsTable } from "./result-format.js";

export async function run(handler, collect = false) {
  const request = new IncomingMessage();
  const response = new ServerResponse(request, collect);

  await handler(request, response);

  await response.await;
  return response;
}

const bench = new Bench({ time: 10_000 });

const handlers = [
  {
    name: "solid",
    handler: await import("solid-benchmark").then((x) => x.buildHandler()),
  },
  {
    name: "react",
    handler: await import("react-benchmark").then((x) => x.buildHandler()),
  },
  {
    name: "vue",
    handler: await import("vue-benchmark").then((x) => x.buildHandler()),
  },
  {
    name: "mfng",
    handler: await import("mfng-benchmark").then((x) => x.buildHandler()),
  },
  { name: "remix", handler: await buildRemixHandler() },
  { name: "next", handler: await buildNextHandler() },
  { name: "next-pages", handler: await buildNextPagesHandler() },
  { name: "nuxt", handler: await buildNuxtHandler() },
  { name: "sveltekit", handler: await buildSveltekitHandler() },
  { name: "enhance", handler: await buildEnhanceHandler() },
  { name: "enhance-core", handler: await buildEnhanceCoreHandler() },
];

for (let handler of handlers) {
  bench.add(handler.name, async () => {
    await run(handler.handler);
  });
}

await bench.warmup();
await bench.run();

for (let handler of handlers) {
  let response = await run(handler.handler, true);

  bench.getTask(handler.name).setResult({
    bodyLength: response.length,
    duplicationFactor: getDuplicationFactor(response.body),
  });
}

logResultsTable(bench);

console.log();
console.log("Check out the actual render results:");

for (let handler of handlers) {
  console.log(handler.name, `http://localhost:8080/${handler.name}`);
}

http
  .createServer(async function (req, res) {
    const handler = handlers.find((x) => "/" + x.name == req.url);

    if (handler) {
      req.url = "/";
      handler.handler(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(8080);
