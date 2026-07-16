"""
Integration test for the order-process job workers.

camunda-orchestration-sdk has no in-process test harness yet (the equivalent
of camunda-process-test used by the java/ and nodejs/ examples), so this test
drives the real REST API against a running local cluster.

Requires `c8ctl cluster start` to be running before `pytest` is invoked.
"""

import asyncio
from pathlib import Path

from camunda_orchestration_sdk import (
    CamundaAsyncClient,
    ProcessCreationById,
    ProcessInstanceCreationInstructionByIdVariables,
)

from workers import register_workers

BPMN_FILE = Path(__file__).parent.parent / "bpmn" / "order-process.bpmn"


async def _run_order_process() -> dict[str, object]:
    async with CamundaAsyncClient(
        configuration={
            "CAMUNDA_REST_ADDRESS": "http://localhost:8080/v2",
            "CAMUNDA_AUTH_STRATEGY": "NONE",
        }
    ) as client:
        await client.deploy_resources_from_files([BPMN_FILE])

        register_workers(client)
        worker_task = asyncio.create_task(client.run_workers())
        try:
            result = await client.create_process_instance(
                data=ProcessCreationById(
                    process_definition_id="process1",
                    variables=ProcessInstanceCreationInstructionByIdVariables.from_dict(
                        {"item": "widget"}
                    ),
                    await_completion=True,
                    fetch_variables=["item"],
                    request_timeout=20_000,
                )
            )
        finally:
            worker_task.cancel()
            try:
                await worker_task
            except asyncio.CancelledError:
                pass

        return result.variables.to_dict()


def test_order_process_completes_with_real_workers() -> None:
    variables = asyncio.run(_run_order_process())
    assert variables["item"] == "widget allocated"
