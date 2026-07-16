# Node.js worker (TypeScript)

Job workers for the order-process example, built on `@camunda8/sdk`. **Officially supported, production-ready.**

See the [parent README](../README.md) for the full walkthrough (starting the local cluster, deploying and starting the process instance from Camunda Modeler). This README only covers the Node.js-specific setup.

## Prerequisites

- Node.js 18+
- npm

## Run

```bash
cd nodejs
npm i
npm start
```

Stop with Ctrl+C.

## Test

```bash
cd nodejs
npm i
npm test
```

Uses [`@camunda8/process-test`](https://docs.camunda.io/docs/apis-tools/testing/getting-started/) to spin up an ephemeral engine (via Docker) and run the workers against it — no running local cluster required.
