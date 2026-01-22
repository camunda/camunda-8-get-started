package io.camunda.demo.process_order;

import io.camunda.client.spring.bean.CamundaClientRegistry;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ProcessOrderApplication {
	private final static Logger LOG = LoggerFactory.getLogger(ProcessOrderApplication.class);

	@Autowired
	private CamundaClientRegistry registry;

	public static void main(String[] args) {
		SpringApplication.run(ProcessOrderApplication.class, args);
	}

	@Bean
	public CommandLineRunner keepAlive() {
		return args -> {
			Thread.currentThread().join();
		};
	}

	@PostConstruct
	public void debug() {
		LOG.info("Registered Camunda Clients: {}", registry.getClientNames());
	}

}
