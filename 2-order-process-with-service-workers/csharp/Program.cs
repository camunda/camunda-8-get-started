// Program entry point for the Camunda 8 order-process job workers.
// Worker definitions live in Workers.cs so they can be reused from tests.
using Camunda.Orchestration.Sdk;

// No credentials => the SDK uses the NONE auth strategy, which matches the
// unauthenticated local cluster started by `c8ctl cluster start`.
using var client = CamundaClient.Create(new CamundaOptions
{
    Config = new Dictionary<string, string>
    {
        ["CAMUNDA_REST_ADDRESS"] = "http://localhost:8080/v2",
        ["CAMUNDA_AUTH_STRATEGY"] = "NONE",
    },
});

Workers.Register(client);

Console.WriteLine("Job workers started. Waiting for jobs...\n");

// Block until Ctrl+C
using var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) => { e.Cancel = true; cts.Cancel(); };
await client.RunWorkersAsync(ct: cts.Token);
