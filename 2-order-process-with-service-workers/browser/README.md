# Order process — live in your browser

The **same** order process and the **same** three service workers as the
[`nodejs/`](../nodejs) example — but there is no Camunda 8 cluster here. The real
[nanobpm](https://github.com/Magikcraft/nano-bpm) engine, compiled to
WebAssembly, executes the BPMN **in your browser**, and you edit the workers'
JavaScript live in a [Monaco](https://microsoft.github.io/monaco-editor/) editor.

Clone, install, run — and you're looking at a running process instance:

```bash
cd 2-order-process-with-service-workers/browser
npm install
npm run dev
```

Open the URL it prints (default <http://localhost:5173>) and press **▶ Run**.
Then change input values and service worker code, and run again to compare the
result.

## What you get

- The `order-process.bpmn` model (a copy of `../bpmn/order-process.bpmn`)
  rendered live with [bpmn-js](https://github.com/bpmn-io/bpmn-js). A green token
  walks the diagram task-by-task; a failed job turns its task red (an incident).
- Editable input parameters (JSON), plus editable worker code for each BPMN
  `zeebe:taskDefinition type`. Change both freely and press **Run** repeatedly
  to see how the process behavior changes.
- The BPMN model itself is read-only in this browser demo; this example focuses
  on tweaking input values and worker behavior.
- A live **Variables** panel (the instance payload) and an **Activity** log of
  what each worker did.

## How it differs from the Node.js worker

In the Node.js example, a worker completes a job against a cluster:

```ts
jobHandler: async (job) => {
  const item = job.variables.item ?? "default-item";
  return job.complete({ item: `${item} allocated` });
};
```

In the browser there is no cluster to call, so a handler just **returns** the
variables to merge (or throws to fail the job):

```js
async (job) => {
  const item = job.variables.item ?? "default-item";
  return { item: item + " allocated", inStock: true };
};
```

Everything else — the token advancing, gateways, the variables merging — is the
real engine, running on WebAssembly. Try making `ship-items` `throw new
Error("no stock")` and re-run to see an incident appear on the diagram.

## Scripts

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload.      |
| `npm run build`   | Type-check and produce a static `dist/` bundle. |
| `npm run preview` | Serve the built `dist/` locally.                |

## Requirements

- Node.js **≥ 24** and npm (required by `@camunda/design-system`).

## What's under the hood

- [`@nanobpm/bojtos-react`](https://www.npmjs.com/package/@nanobpm/bojtos-react)
  — the `useBojtos` hook and `<BpmnRuntimeView>` live diagram, over the
  [`@nanobpm/engine-wasm`](https://www.npmjs.com/package/@nanobpm/engine-wasm)
  WebAssembly engine.
- [`@camunda/design-system`](https://www.npmjs.com/package/@camunda/design-system)
  — Camunda's shadcn + Tailwind components for the look and feel.
- [`@monaco-editor/react`](https://www.npmjs.com/package/@monaco-editor/react)
  — the in-page code editor (bundled locally, so it works offline).

> The nanobpm engine is a from-scratch, open-source process orchestration engine
> that speaks Zeebe-compatible BPMN. It is **not** the production Camunda 8
> engine — it's a great way to *see* a BPMN process execute with zero setup.
