package io.camunda.demo.process_order;

import io.camunda.client.annotation.JobWorker;
import io.camunda.client.api.response.ActivatedJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OneMoreWorker {
 private final static Logger LOG = LoggerFactory.getLogger(OneMoreWorker.class);
    @JobWorker(type = "one-more")
    public Map<String, String> shipItems(final ActivatedJob job) {
        LOG.info("Processing one-more job: {}", job.getKey());
        LOG.info("one-more job completed: {}", job.getKey());
        return Map.of();
    }
}
