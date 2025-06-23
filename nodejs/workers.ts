import { Camunda8 } from '@camunda8/sdk'

const client = new Camunda8({
    CAMUNDA_AUTH_STRATEGY: 'NONE'
}).getCamundaRestClient()

client.createJobWorker({
    type: 'check-inventory',
    timeout: 10000, // Timeout for the job worker
    maxJobsToActivate: 5, // Maximum number of jobs to process concurrently
    worker: 'check-inventory-worker',
    jobHandler: async (job, log) => {
        log.info('Processing check-inventory job:', job.jobKey)
        // Simulate some work
        await new Promise((resolve) => setTimeout(resolve, 2000))
        log.info(`check-inventory job completed: ${job.jobKey}\n`)
        return job.complete()
    }
})

client.createJobWorker({
    type: 'charge-payment',
    timeout: 10000, // Timeout for the job worker
    maxJobsToActivate: 5, // Maximum number of jobs to process concurrently
    worker: 'charge-payment-worker',
    jobHandler: async (job, log) => {
        log.info('Processing charge-payment job:', job.jobKey)
        // Simulate some work
        await new Promise((resolve) => setTimeout(resolve, 2000))
        log.info(`charge-payment job completed: job completed: ${job.jobKey}\n`)
        return job.complete()
    }
})

client.createJobWorker({
    type: 'ship-items',
    timeout: 10000, // Timeout for the job worker
    maxJobsToActivate: 5, // Maximum number of jobs to process concurrently
    worker: 'ship-items-worker',
    jobHandler: async (job, log) => {
        log.info('Processing ship-items job:', job.jobKey)
        // Simulate some work
        await new Promise((resolve) => setTimeout(resolve, 2000))
        log.info(`ship-items job completed: job completed: ${job.jobKey}\n`)
        return job.complete()
    }
})

console.log('Job workers started. Waiting for jobs...\n')