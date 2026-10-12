# Employee Management System

This project now includes a responsive PeopleDesk dashboard. Run the application and open `http://localhost:8080` to manage employees visually; the original REST endpoints remain available.

A RESTful backend application developed using Spring Boot and MySQL for managing employee records through CRUD operations. The project follows a layered architecture using Controller, Service, Repository, and Entity layers to ensure clean code organization and maintainability.

---

# Tech Stack

- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Postman

---

# Architecture

The application follows a layered backend architecture:

Client (Postman)
↓
Controller Layer
↓
Service Layer
↓
Repository Layer
↓
MySQL Database

---

# Project Structure

```text
src/main/java/com/rajesh/employeemanagement
│
├── controller
│   └── EmployeeController.java
│
├── service
│   └── EmployeeService.java
│
├── repository
│   └── EmployeeRepository.java
│
├── model
│   └── Employee.java
│
└── EmployeemanagementApplication.java
```

---

# Features

- Employee CRUD Operations
- REST API Development
- MySQL Database Integration
- Layered Architecture
- JPA/Hibernate ORM Mapping
- API Testing using Postman

---

# REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/employees` | Create Employee |
| GET | `/employees` | Get All Employees |
| GET | `/employees/{id}` | Get Employee By ID |
| PUT | `/employees/{id}` | Update Employee |
| DELETE | `/employees/{id}` | Delete Employee |

---

# Sample Request Payload

```json
{
  "name": "Rajesh",
  "email": "rajesh@gmail.com",
  "department": "Engineering",
  "salary": 50000
}
```

---

# Database Configuration

Configure MySQL credentials in:

```text
src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

Set `DB_PASSWORD` (and optionally `DB_USERNAME`) in your environment before running with MySQL. For a database-free local preview of the dashboard, run with the `local` Spring profile to use the included H2 configuration.

---

# Running the Application

## Clone Repository

```bash
git clone https://github.com/RajeshReddi/employee-management-system.git
```

---

## Create Database

```sql
CREATE DATABASE employee_db;
```

---

## Run Application

Run:

```text
EmployeemanagementApplication.java
```

Application runs on:

```text
http://localhost:8080
```

---

# API Testing

The APIs were tested using Postman for:
- Create operations
- Read operations
- Update operations
- Delete operations
- Backend request-response handling

---

# Learning Outcomes

- Spring Boot fundamentals
- RESTful API development
- CRUD operations
- Database integration with MySQL
- JPA/Hibernate ORM
- Layered backend architecture
- Backend request-response lifecycle

---

# Future Enhancements

- Validation
- Exception Handling
- DTO Pattern
- Swagger Documentation
- Pagination and Filtering
- Spring Security with JWT Authentication

---

# Author

Rajesh Reddy
