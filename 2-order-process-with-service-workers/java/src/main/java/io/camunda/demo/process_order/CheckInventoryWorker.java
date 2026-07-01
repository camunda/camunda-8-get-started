package io.camunda.demo.process_order;

import java.util.Map;

import io.camunda.client.annotation.JobWorker;
import io.camunda.client.annotation.Variable;
import jakarta.annotation.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class CheckInventoryWorker {

    private static final Logger LOG = LoggerFactory.getLogger(CheckInventoryWorker.class);

    @JobWorker
    public Map<String, String> checkInventory(@Variable @Nullable String item) {
        String allocated = (item == null || item.isEmpty()) ? "default-item" : item;
        LOG.info("Checking inventory for item: {}", allocated);
        return Map.of("item", allocated + " allocated");
    }
}
