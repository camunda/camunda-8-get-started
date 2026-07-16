# C# worker

Job workers for the order-process example, built on `Camunda.Orchestration.Sdk`.

> **Technical preview**: the C# SDK is a technical preview available from Camunda 8.9. It will become fully supported in Camunda 8.10. Its API surface may change in future releases without following semver.

See the [parent README](../README.md) for the full walkthrough (starting the local cluster, deploying and starting the process instance from Camunda Modeler). This README only covers the C#-specific setup.

## Prerequisites

- .NET 8 SDK (or later)

## Run

```bash
cd csharp
dotnet run
```

Stop with Ctrl+C.

## Test

```bash
cd csharp/ProcessOrder.Tests
dotnet test
```

`Camunda.Orchestration.Sdk` has no ephemeral-engine test harness yet (unlike java/nodejs's `camunda-process-test`), so `OrderProcessTests.cs` drives the real REST API — it requires a running local cluster (`c8ctl cluster start`) before you run `dotnet test`.
