# 1. Aşama: Uygulamayı derleme (Build)
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Aşama: Uygulamayı çalıştırma (Run)
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Render'ın 512MB RAM limitine uygun bellek ayarı (-Xmx300m)
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]
