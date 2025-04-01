# API Documentation

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer {refresh_token}
```

## Computers

### Get All Computers
```http
GET /api/computers
Authorization: Bearer {token}

Response: {
  "computers": [
    {
      "id": "string",
      "name": "string",
      "status": "active" | "maintenance" | "offline",
      "hourlyRate": number,
      "currentUser": string | null,
      "startTime": string | null
    }
  ]
}
```

### Control Computer
```http
POST /api/computers/{id}/control
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "start" | "stop" | "maintenance",
  "userId": "string"
}
```

## Reports

### Generate Report
```http
POST /api/reports/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "daily" | "weekly" | "monthly",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "format": "pdf" | "excel" | "csv"
}
``` 