# Java worker (Spring Boot)

Job workers for the order-process example, built on the Camunda Spring Boot Starter. **Officially supported, production-ready.**

See the [parent README](../README.md) for the full walkthrough (starting the local cluster, deploying and starting the process instance from Camunda Modeler). This README only covers the Java-specific setup.

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
