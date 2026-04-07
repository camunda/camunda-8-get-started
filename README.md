# Camunda 8 Get Started Examples

This repository contains hands-on Camunda 8 examples that help you get started with the platform, and progress from a fully automated BPMN/DMN flow to service-worker based process automation.

## What is in this repo

- `1-rocket-launch/`
- A self-contained BPMN + DMN example (`rocket-launch.bpmn`, `plot-destination.dmn`)
- No external workers required; logic is handled with script tasks and decisions
- Best for understanding process flow, gateways, timers, and decision tables

- `2-order-process-with-service-workers/`
- A process example that uses external job workers
- Includes two worker implementations:
- `java/` (Spring Boot, Java 21)
- `nodejs/` (TypeScript, `@camunda8/sdk`)
- Best for learning worker-based orchestration and application integration

- `renovate.json`
- Dependency update automation configuration

## Recommended learning path

1. Start with `1-rocket-launch`.
2. Move to `2-order-process-with-service-workers`.
   1. Pick one worker stack first (`java` or `nodejs`), then try the other.

## Prerequisites

- Camunda 8 local environment (for example via `c8ctl c8run`)
- Camunda Modeler (recommended for viewing the models, deploying/running visually)
- For Java example:
- JDK 21+
- Maven
- For Node.js example:
- Node.js 18+
- npm

## Quick start

### 1) Hello World process (no workers)

Follow the detailed guide in:
- `1-rocket-launch/README.md`

### 2) Order process with workers

Follow the detailed guide in:
- `2-order-process-with-service-workers/README.md`

Then run one worker implementation.

## Suggested progression for new users

1. Deploy and run `rocket-launch.bpmn` and inspect execution in Operate.
2. Change input variables and observe different paths.
3. Deploy the order process and run with Java workers.
4. Repeat with Node.js workers.
5. Compare implementation styles between Java and TypeScript.

## Where to go next

- Extend DMN rules and process gateways.
- Add your own service task and worker.
- Explore more complex BPMN patterns (subprocesses, event-based gateways, etc) in the [Camunda tutorials repository](https://github.com/camunda/camunda-8-tutorials)
