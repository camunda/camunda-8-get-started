package io.camunda.demo.process_order;
import io.camunda.client.api.response.ActivatedJob;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.camunda.spring.client.annotation.JobWorker;

@Component
public class ShipItemsWorker {
 private final static Logger LOG = LoggerFactory.getLogger(ChargePaymentWorker.class);
    @JobWorker(type = "ship-items")
    public Map<String, String> shipItems(final ActivatedJob job) {
        LOG.info("Processing ship-items job: {}", job.getKey());
        LOG.info("ship-items job completed: {}", job.getKey());
        return Map.of();
    }
}
