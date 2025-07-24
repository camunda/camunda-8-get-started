import { setupCamundaProcessTest, CamundaAssert } from '@camunda8/process-test'
import { startWorkers } from '../source/workers' 

describe('Process Test Suite', () => {
    const setup = setupCamundaProcessTest()

    test('Can complete the process instance using mocks', async () => {
        const client = setup.getClient().getCamundaRestClient();
        const context = setup.getContext();
        await context.deployProcess('../bpmn/diagram_1.bpmn')
        // const workers = require('../workers').client // Start the job workers

        const processInstance = await client.createProcessInstance({
            processDefinitionId: 'process1',
            variables: {
                item: 'widget'
            }
        })

        await context.mockJobWorker('check-inventory').thenComplete()
        await context.mockJobWorker('charge-payment').thenComplete()
        await context.mockJobWorker('ship-items').thenComplete()

        const functionAssertion = CamundaAssert.assertThat(processInstance)
        await functionAssertion.isCompleted()
        await functionAssertion.hasVariables({ item: 'widget' })
    })

    test('Can complete the process instance using the actual workers', async () => {
        const client = setup.getClient().getCamundaRestClient();
        const context = setup.getContext();
        await context.deployProcess('../bpmn/diagram_1.bpmn')

        const processInstance = await client.createProcessInstance({
            processDefinitionId: 'process1',
            variables: {
                item: 'widget'
            }
        })

        const { inventoryWorker, paymentChargeWorker, shippingWorker } = startWorkers(client) // Start the job workers

        const functionAssertion = CamundaAssert.assertThat(processInstance)
        await functionAssertion.isCompleted()
        await functionAssertion.hasVariables({ item: 'widget allocated' })

        inventoryWorker.stop()
        paymentChargeWorker.stop()
        shippingWorker.stop()
    })
})