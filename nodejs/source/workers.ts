/**
 * This file contains the job workers for the Camunda 8 process.
 * It defines three job workers: check-inventory, charge-payment, and ship-items.
 * Each worker processes jobs of a specific type and simulates some work. 
 */
import { CamundaRestClient, Dto } from '@camunda8/sdk'

// This is a Dto class that defines the input variables for the job worker.
class Variables extends Dto.LosslessDto {
    item?: string
    quantity?: number
}

/** Client is injected to allow testing with @camunda8/process-test */
export function startWorkers(client: CamundaRestClient) {
    const inventoryWorker = client.createJobWorker<Variables, Variables>({ // The first type parameter is the input variables, the second is the output variables
        type: 'check-inventory',
        timeout: 10000, // Timeout for the job worker to complete the job before it is available for another worker poll
        maxJobsToActivate: 5, // Maximum number of jobs to process concurrently
        worker: 'check-inventory-worker',
        jobHandler: async (job, log) => {
            log.info('Processing check-inventory job:', job.jobKey)
            const item = job.variables.item ?? 'default-item'
            log.info(`Checking inventory for item: ${item}`)
            // Simulate checking inventory
            await new Promise((resolve) => setTimeout(resolve, 2000))
            log.info(`check-inventory job completed: ${job.jobKey}`)
            return job.complete({ item: `${item} allocated` })
        }
    })

    const paymentChargeWorker = client.createJobWorker({
        type: 'charge-payment',
        timeout: 10000,
        maxJobsToActivate: 5,
        worker: 'charge-payment-worker',
        jobHandler: async (job, log) => {
            log.info('Processing charge-payment job:', job.jobKey)
            // Simulate some work
            await new Promise((resolve) => setTimeout(resolve, 2000))
            log.info(`charge-payment job completed: ${job.jobKey}`)
            return job.complete()
        }
    })

    const shippingWorker = client.createJobWorker({
        type: 'ship-items',
        timeout: 10000,
        maxJobsToActivate: 5,
        worker: 'ship-items-worker',
        jobHandler: async (job, log) => {
            log.info('Processing ship-items job:', job.jobKey)
            // Simulate some work
            await new Promise((resolve) => setTimeout(resolve, 2000))
            log.info(`ship-items job completed: ${job.jobKey}`)
            return job.complete()
        }
    })
    return {
        inventoryWorker,
        paymentChargeWorker,
        shippingWorker
    }
}

