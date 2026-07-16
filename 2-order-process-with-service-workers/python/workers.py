"""
This file contains the job workers for the Camunda 8 process.
It defines three job workers: check-inventory, charge-payment, and ship-items.
Each worker processes jobs of a specific type and simulates some work.
"""

import asyncio

from camunda_orchestration_sdk import (
    CamundaAsyncClient,
    ConnectedJobContext,
    WorkerConfig,
)


async def check_inventory(job: ConnectedJobContext) -> dict[str, object]:
    job.log.info(f"Processing check-inventory job: {job.job_key}")
    item = job.variables.to_dict().get("item") or "default-item"
    job.log.info(f"Checking inventory for item: {item}")
    # Simulate checking inventory
    await asyncio.sleep(2)
    job.log.info(f"check-inventory job completed: {job.job_key}")
    return {"item": f"{item} allocated"}


async def charge_payment(job: ConnectedJobContext) -> dict[str, object]:
    job.log.info(f"Processing charge-payment job: {job.job_key}")
    # Simulate some work
    await asyncio.sleep(2)
    job.log.info(f"charge-payment job completed: {job.job_key}")
    return {}


async def ship_items(job: ConnectedJobContext) -> dict[str, object]:
    job.log.info(f"Processing ship-items job: {job.job_key}")
    # Simulate some work
    await asyncio.sleep(2)
    job.log.info(f"ship-items job completed: {job.job_key}")
    return {}


def register_workers(client: CamundaAsyncClient) -> None:
    """Register the three job workers on the given Camunda client."""
    client.create_job_worker(
        config=WorkerConfig(
            job_type="check-inventory",
            job_timeout_milliseconds=10_000,
            max_concurrent_jobs=5,
            worker_name="check-inventory-worker",
        ),
        callback=check_inventory,
    )
    client.create_job_worker(
        config=WorkerConfig(
            job_type="charge-payment",
            job_timeout_milliseconds=10_000,
            max_concurrent_jobs=5,
            worker_name="charge-payment-worker",
        ),
        callback=charge_payment,
    )
    client.create_job_worker(
        config=WorkerConfig(
            job_type="ship-items",
            job_timeout_milliseconds=10_000,
            max_concurrent_jobs=5,
            worker_name="ship-items-worker",
        ),
        callback=ship_items,
    )
