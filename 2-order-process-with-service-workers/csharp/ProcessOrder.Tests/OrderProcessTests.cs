// Integration test for the order-process job workers.
//
// Camunda.Orchestration.Sdk has no in-process test harness yet (the equivalent
// of camunda-process-test used by the java/ and nodejs/ examples), so this
// test drives the real REST API against a running local cluster.
//
// Requires `c8ctl cluster start` to be running before `dotnet test` is invoked.
using Camunda.Orchestration.Sdk;
using Xunit;

public class OrderProcessTests
{
    private record OrderResult(string Item);

    [Fact]
    public async Task CompletesOrderProcessWithRealWorkers()
    {
        using var client = CamundaClient.Create(new CamundaOptions
        {
            Config = new Dictionary<string, string>
            {
                ["CAMUNDA_REST_ADDRESS"] = "http://localhost:8080/v2",
                ["CAMUNDA_AUTH_STRATEGY"] = "NONE",
            },
        });

        var bpmnPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "bpmn", "order-process.bpmn");
        await client.DeployResourcesFromFilesAsync(new[] { bpmnPath });

        Workers.Register(client);

        using var cts = new CancellationTokenSource();
        var runTask = client.RunWorkersAsync(ct: cts.Token);

        try
        {
            var result = await client.CreateProcessInstanceAsync(new ProcessInstanceCreationInstructionById
            {
                ProcessDefinitionId = ProcessDefinitionId.AssumeExists("process1"),
                Variables = new { item = "widget" },
                AwaitCompletion = true,
                FetchVariables = new List<string> { "item" },
                RequestTimeout = 20_000,
            });

            var variables = TypedVariables.DeserializeAs<OrderResult>(result.Variables, null!);
            Assert.NotNull(variables);
            Assert.Equal("widget allocated", variables.Item);
        }
        finally
        {
            cts.Cancel();
        }
    }
}
