# Surbana Assignment CRUD API

This API allows users to manage locations with CRUD operations. Below are the cURL commands to interact with the API.

## Database Design

### Building Table
- **Table Name:** `buildings`
- **Columns:**
  - `id` (Primary Key, Serial)
  - `name` (String, Not Null)

### Location Table
- **Table Name:** `locations`
- **Columns:**
  - `id` (Primary Key, Serial)
  - `name` (String, Not Null)
  - `location_number` (String, Not Null, Unique)
  - `area` (Float, Not Null)
  - `parent_id` (Integer, Nullable, Foreign Key referencing `locations.id`)
  - `building_id` (Integer, Not Null, Foreign Key referencing `buildings.id`)

### Relationships
- **Building to Location:**
  - One-to-Many relationship (`buildings.id` to `locations.building_id`)
- **Location to Location:**
  - Self-referencing One-to-Many relationship (`locations.id` to `locations.parent_id`)

This schema allows for hierarchical relationships between locations, where each location can have a parent and multiple children. The area field is stored as a float to accommodate decimal values.

### Project Summary

This project is developed using NestJS, a progressive Node.js framework, and TypeScript for type safety and enhanced development experience.

**Validation Request**:
- Utilizes `class-validator` and `class-transformer` libraries to ensure that incoming data meets specified criteria.
- DTOs (Data Transfer Objects) are used to define validation rules for fields such as `name`, `locationNumber`, and `area`.

**Handle Exception**:
- Implements global exception handling using custom exception filters. This class called `AllExceptionsFilter` under common folder `all-exceptions.filter.ts`
- Ensures that all errors are caught and formatted consistently, providing meaningful error messages to the client.

**Implement Logging**:
- Integrates a logging mechanism to track application behavior and errors using winston. This class under common folder `logger.config.ts`
- Uses NestJS's built-in logging capabilities to log important events and errors.

## Start the Application

```bash
NODE_ENV=development npm run start

or

docker compose -f docker-compose.yml up
```

## API Endpoints and cURL Commands

All API Endpoints are fully listed on Swagger UI, please access http://localhost:3000/swagger for information.
