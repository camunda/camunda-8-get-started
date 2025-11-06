package io.camunda.demo.process_order;

import io.camunda.client.CamundaClient;
import io.camunda.client.annotation.Deployment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@SpringBootApplication
@EnableScheduling
@Deployment(resources = {"classpath:diagram_1.bpmn"})
public class ProcessOrderApplication {
    private static final Logger LOG = LoggerFactory.getLogger(ProcessOrderApplication.class);
    @Autowired
    private CamundaClient client;

	public static void main(String[] args) {
		SpringApplication.run(ProcessOrderApplication.class, args);
	}

    @Scheduled(fixedRate = 1000)
    public void scheduleInstanceCreation() {
        long start = System.currentTimeMillis();
        LOG.info("Creating instance");
        client.newCreateInstanceCommand().bpmnProcessId("process1").latestVersion().execute();
        LOG.info("Created instance in {}ms", System.currentTimeMillis() - start);
    }

}
