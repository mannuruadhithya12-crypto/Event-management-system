package com.eventmanager;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@org.springframework.data.jpa.repository.config.EnableJpaAuditing
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner printUsers(com.eventmanager.repository.UserRepository repo) {
		return args -> {
			System.out.println("--- USERS IN DATABASE ---");
			repo.findAll().forEach(u -> System.out.println(u.getId() + " : " + u.getName()));
			System.out.println("-------------------------");
		};
	}
}
