# API Documentation

## Authentication

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string"
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
```

**Headers:** 