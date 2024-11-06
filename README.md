# Surbana Assignment CRUD API

This API allows users to manage locations with CRUD operations. Below are the cURL commands to interact with the API.

## Database Design

### Table: `tb_location`

- **id**: `INTEGER`
    - Primary key, auto-generated.
    - Column name: `id`.

- **name**: `VARCHAR`
    - Not nullable.
    - Column name: `name`.

- **location_number**: `VARCHAR`
    - Not nullable.
    - Column name: `location_number`.

- **area**: `FLOAT`
    - Not nullable.
    - Column name: `area`.

- **parent_id**: `INTEGER`
    - Nullable.
    - Column name: `parent_id`.
    - Foreign key referencing `id` in the same table (`tb_location`).

### Relationships

- **Many-to-One**: Each location can have one parent location.
    - Foreign key: `parent_id`.
    - Join column: `parent_id`.

- **One-to-Many**: Each location can have multiple child locations.
    - Inverse side: `children`.

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

### Create (POST)

#### Valid Request
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"name": "New Location", "locationNumber": "A-01-01", "area": 100.50}'
```

#### Invalid Request (Missing `name` field)
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"locationNumber": "A-01-01", "area": 100.50, "parentId": 1}'
```

### Read (GET)

#### Valid Request (Fetch All)
```bash
curl -X GET http://localhost:3000/api/v1/locations
```

#### Valid Request (Fetch One)
```bash
curl -X GET http://localhost:3000/api/v1/locations/1
```

#### Invalid Request (Invalid ID)
```bash
curl -X GET http://localhost:3000/api/v1/locations/999
```

### Update (PUT)

#### Valid Request
```bash
curl -X PUT http://localhost:3000/api/v1/locations/1 \
-H "Content-Type: application/json" \
-d '{"name": "Updated Location", "locationNumber": "A-01-01", "area": 120.75}'
```

#### Invalid Request (Invalid ID)
```bash
curl -X PUT http://localhost:3000/api/v1/locations/999 \
-H "Content-Type: application/json" \
-d '{"name": "Updated Location", "locationNumber": "A-01-01", "area": 120.75}'
```

### Delete (DELETE)

#### Valid Request
```bash
curl -X DELETE http://localhost:3000/api/v1/locations/1
```

#### Invalid Request (Invalid ID)
```bash
curl -X DELETE http://localhost:3000/api/v1/locations/999
```

## Nested Locations Example

### Create Root Location (Level 1)

#### Valid Request
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"name": "Building A", "locationNumber": "A", "area": 5000.00}'
```

### Create Level 2 Locations

#### Valid Request (Level 2 - Car Park)
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"name": "Car Park", "locationNumber": "A-CarPark", "area": 800.00, "parentId": 1}'
```

#### Valid Request (Level 2 - Level 1)
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"name": "Level 1", "locationNumber": "A-01", "area": 1000.00, "parentId": 1}'
```

### Create Level 3 Locations

#### Valid Request (Level 3 - Lobby Level 1)
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"name": "Lobby Level 1", "locationNumber": "A-01-Lobby", "area": 200.00, "parentId": 3}'
```

#### Valid Request (Level 3 - Master Room)
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"name": "Master Room", "locationNumber": "A-01-01", "area": 300.00, "parentId": 3}'
```

#### Valid Request (Level 3 - Meeting Room 1)
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"name": "Meeting Room 1", "locationNumber": "A-01-01-M1", "area": 150.00, "parentId": 4}'
```

### Invalid Requests

#### Invalid Request (Missing `name`)
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"locationNumber": "B-01", "area": 1000.00, "parentId": 1}'
```

#### Invalid Request (Missing `locationNumber`)
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"name": "Level 2", "area": 1000.00, "parentId": 1}'
```

#### Invalid Request (Invalid `parentId`)
```bash
curl -X POST http://localhost:3000/api/v1/locations \
-H "Content-Type: application/json" \
-d '{"name": "Level 2", "locationNumber": "B-01", "area": 1000.00, "parentId": 999}'
```
