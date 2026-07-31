package io.camunda.demo.process_order;

import io.camunda.client.annotation.JobWorker;
import io.camunda.client.annotation.Variable;
import jakarta.annotation.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ShipItemsWorker {

    private static final Logger LOG = LoggerFactory.getLogger(ShipItemsWorker.class);

    @JobWorker
    public void shipItems(@Variable @Nullable String item) {
        LOG.info("Shipping item: {}", item);
    }
}
