package io.camunda.demo.process_order;

import io.camunda.client.api.response.ActivatedJob;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.camunda.spring.client.annotation.JobWorker;

@Component
public class ChargePaymentWorker {
 private final static Logger LOG = LoggerFactory.getLogger(ChargePaymentWorker.class);
    @JobWorker(type = "charge-payment")
    public Map<String, String> processPayment(final ActivatedJob job) {
        LOG.info("Processing charge-payment job: {}", job.getKey());
        LOG.info("charge-payment job completed: {}", job.getKey());
        return Map.of();
    }
}
