package io.camunda.demo.process_order;

import io.camunda.client.annotation.JobWorker;
import io.camunda.client.api.response.ActivatedJob;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ChargePaymentWorker {
 private final static Logger LOG = LoggerFactory.getLogger(ChargePaymentWorker.class);
    @JobWorker(type = "charge-payment")
    public void processPayment(final ActivatedJob job) {
        LOG.info("Processing charge-payment job: {}", job.getKey());
        LOG.info("charge-payment job completed: {}", job.getKey());
        return;
    }
}
