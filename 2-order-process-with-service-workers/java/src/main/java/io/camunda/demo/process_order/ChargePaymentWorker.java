package io.camunda.demo.process_order;

import io.camunda.client.annotation.JobWorker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ChargePaymentWorker {

    private static final Logger LOG = LoggerFactory.getLogger(ChargePaymentWorker.class);

    @JobWorker
    public void chargePayment() {
        LOG.info("Charging payment");
    }
}
