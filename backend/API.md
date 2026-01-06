# 📡 BroLearn API Documentation

Base URL: `http://localhost:3000/api`

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Регистрация успешна",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "level": 1,
      "xp": 0,
      "streak": 0
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {accessToken}
```

## 📚 Courses

### Get All Courses
```http
GET /courses
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "...",
        "title": "GigaChat",
        "description": "...",
        "icon": "🤖",
        "color": "#6366F1",
        "order": 1,
        "totalLessons": 10,
        "completedLessons": 3,
        "progressPercentage": 30,
        "estimatedHours": 3,
        "difficulty": "beginner"
      }
    ]
  }
}
```

### Get Course by ID
```http
GET /courses/:courseId
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": "...",
      "title": "GigaChat",
      "description": "...",
      "icon": "🤖",
      "color": "#6366F1",
      "difficulty": "beginner",
      "estimatedHours": 3
    },
    "modules": [
      {
        "id": "...",
        "title": "Основы GigaChat",
        "description": "...",
        "order": 1,
        "isLocked": false,
        "requiredXP": 0,
        "lessons": [
          {
            "id": "...",
            "title": "Что такое GigaChat?",
            "type": "theory",
            "order": 1,
            "xpReward": 10,
            "estimatedMinutes": 5,
            "isCompleted": false
          }
        ],
        "progressPercentage": 30,
        "totalLessons": 3,
        "completedLessons": 1
      }
    ]
  }
}
```

### Get Lesson by ID
```http
GET /courses/lessons/:lessonId
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": "...",
      "title": "Что такое GigaChat?",
      "type": "theory",
      "content": "GigaChat — это...",
      "imageUrl": null,
      "videoUrl": null,
      "quizQuestions": null,
      "practiceSteps": null,
      "flashcards": null,
      "xpReward": 10,
      "estimatedMinutes": 5
    },
    "progress": {
      "isCompleted": false,
      "score": null,
      "attempts": 0
    }
  }
}
```

## 📊 Progress

### Complete Lesson
```http
POST /progress/lessons/:lessonId/complete
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "score": 85  // Optional, for quizzes
}
```

**Response:**
```json
{
  "success": true,
  "message": "Урок завершен",
  "data": {
    "progress": {
      "isCompleted": true,
      "score": 85,
      "attempts": 1
    },
    "xpEarned": 10,
    "isFirstCompletion": true
  }
}
```

### Get User Progress
```http
GET /progress/me
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "user@example.com",
      "level": 3,
      "xp": 250,
      "streak": 5,
      "lastActivityDate": "2025-01-04T..."
    },
    "stats": {
      "totalLessonsCompleted": 15,
      "xpToNextLevel": 50,
      "currentLevelProgress": 50
    }
  }
}
```

### Get Course Progress
```http
GET /progress/courses/:courseId
Authorization: Bearer {accessToken}
```

## 🏆 Achievements

### Get All Achievements
```http
GET /achievements
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "...",
        "title": "Первые шаги",
        "description": "Завершите первый урок",
        "icon": "🎯",
        "type": "lessons",
        "requirement": 1,
        "xpReward": 50,
        "unlocked": true
      }
    ]
  }
}
```

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Все поля обязательны для заполнения"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Недействительный токен"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Курс не найден"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Ошибка сервера"
}
```

## 🔑 Authentication Flow

1. Register or Login to get `accessToken` and `refreshToken`
2. Include `accessToken` in `Authorization: Bearer {token}` header for all protected endpoints
3. When `accessToken` expires (401 error), use `/auth/refresh` with `refreshToken` to get new tokens
4. Store tokens securely (expo-secure-store on mobile)

## 📈 XP System

- Each lesson has `xpReward` (typically 10-20 XP)
- XP is earned only on first completion
- Level = floor(totalXP / 100) + 1
- XP to next level = 100 - (totalXP % 100)

## 🔥 Streak System

- Streak increases by 1 when user completes a lesson on consecutive days
- Streak resets to 1 if more than 1 day passes without activity
- Same-day activity doesn't affect streak

## 🎯 Lesson Types

- **theory**: Text content with optional images/videos
- **quiz**: Multiple choice questions with explanations
- **practice**: Step-by-step tasks with checkboxes
- **flashcard**: Flashcards for memorization (UI in development)
