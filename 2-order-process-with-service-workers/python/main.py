"""
Entry point for the Camunda 8 job workers.

Connects to a locally running Camunda 8 cluster (started via `c8ctl cluster start`)
over the Orchestration Cluster REST API and starts the order-process job workers.
"""

import asyncio

from camunda_orchestration_sdk import CamundaAsyncClient

from workers import register_workers


async def main() -> None:
    # No credentials => the SDK uses the NONE auth strategy, which matches the
    # unauthenticated local cluster started by `c8ctl cluster start`.
    async with CamundaAsyncClient(
        configuration={
            "CAMUNDA_REST_ADDRESS": "http://localhost:8080/v2",
            "CAMUNDA_AUTH_STRATEGY": "NONE",
        }
    ) as client:
        register_workers(client)

        print("Job workers started. Waiting for jobs...\n")
        await client.run_workers()


if __name__ == "__main__":
    asyncio.run(main())
