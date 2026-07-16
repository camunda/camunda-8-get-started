// Job workers for the Camunda 8 order process: check-inventory, charge-payment,
// and ship-items. Each processes jobs of a specific type and simulates some work.
using Camunda.Orchestration.Sdk;

public static class Workers
{
    public static void Register(CamundaClient client)
    {
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
    }
}

// DTO describing the input variables for the check-inventory job.
public record InventoryInput(string? Item);
