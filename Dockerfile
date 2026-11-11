# Base image from https://hub.docker.com/layers/library/maven/3.9.14-eclipse-temurin-11-noble/
FROM maven:3.9.14-eclipse-temurin-11-noble

# define working directory
WORKDIR /app

# copy over app files
COPY pom.xml .
COPY src src

# expose default Spring Boot port 8080
EXPOSE 8080

# define default command
CMD ["mvn", "org.springframework.boot:spring-boot-maven-plugin:2.3.1.RELEASE:run"]