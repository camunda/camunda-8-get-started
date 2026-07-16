// Program entry point for the Camunda 8 order-process job workers.
// It defines and runs three job workers: check-inventory, charge-payment, and ship-items.
// Each worker processes jobs of a specific type and simulates some work.
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

client.CreateJobWorker(
    new JobWorkerConfig
    {
        JobType = "check-inventory",
        JobTimeoutMs = 10_000,
        MaxConcurrentJobs = 5,
        WorkerName = "check-inventory-worker",
    },
    async (job, ct) =>
    {
        Console.WriteLine($"Processing check-inventory job: {job.JobKey}");
        var input = job.GetVariables<InventoryInput>();
        var item = string.IsNullOrEmpty(input?.Item) ? "default-item" : input!.Item;
        Console.WriteLine($"Checking inventory for item: {item}");
        // Simulate checking inventory
        await Task.Delay(2000, ct);
        Console.WriteLine($"check-inventory job completed: {job.JobKey}");
        return new { item = $"{item} allocated" };
    });

client.CreateJobWorker(
    new JobWorkerConfig
    {
        JobType = "charge-payment",
        JobTimeoutMs = 10_000,
        MaxConcurrentJobs = 5,
        WorkerName = "charge-payment-worker",
    },
    async (job, ct) =>
    {
        Console.WriteLine($"Processing charge-payment job: {job.JobKey}");
        // Simulate some work
        await Task.Delay(2000, ct);
        Console.WriteLine($"charge-payment job completed: {job.JobKey}");
        // Auto-completes with no variables
    });

client.CreateJobWorker(
    new JobWorkerConfig
    {
        JobType = "ship-items",
        JobTimeoutMs = 10_000,
        MaxConcurrentJobs = 5,
        WorkerName = "ship-items-worker",
    },
    async (job, ct) =>
    {
        Console.WriteLine($"Processing ship-items job: {job.JobKey}");
        // Simulate some work
        await Task.Delay(2000, ct);
        Console.WriteLine($"ship-items job completed: {job.JobKey}");
        // Auto-completes with no variables
    });

Console.WriteLine("Job workers started. Waiting for jobs...\n");

// Block until Ctrl+C
using var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) => { e.Cancel = true; cts.Cancel(); };
await client.RunWorkersAsync(ct: cts.Token);

// DTO describing the input variables for the check-inventory job.
public record InventoryInput(string? Item);
