# Java worker (Spring Boot)

Job workers for the order-process example, built on the Camunda Spring Boot Starter. **Officially supported, production-ready.**

See the [parent README](../README.md) for the full walkthrough (starting the local cluster, deploying and starting the process instance from Camunda Modeler). This README only covers the Java-specific setup.

Full step-by-step guide: [docs.camunda.io/docs/guides/getting-started-example](https://docs.camunda.io/docs/guides/getting-started-example/) (Python/C# additions pending merge in [camunda/camunda-docs#9403](https://github.com/camunda/camunda-docs/pull/9403); the URL is stable).

## Prerequisites

- JDK 21-25
- Maven

## Run

```bash
cd java
mvn spring-boot:run
```

Stop with Ctrl+C.

## Test

```bash
cd java
mvn test
```

Uses [`camunda-process-test`](https://docs.camunda.io/docs/apis-tools/testing/getting-started/) to spin up an ephemeral engine and run the workers against it — no running local cluster required.
