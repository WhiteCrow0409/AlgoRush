# 🧾 Algorush – API Documentation

This documentation outlines the backend and frontend API integration for the Algorusher project—a coding practice platform built with Django (REST API) and React (frontend). It is intended to help developers understand, use, and extend the system efficiently.

## 🛠️ Tech Stack

Here's a breakdown of the tech stack and important components used in the application:

| Category | Technology | Description |
|----------|------------|-------------|
| **Frontend** Framework | React | JavaScript library for building the user interface |
| **Frontend** Code Editor | @monaco-editor/react | Code editor component used in the problem detail page |
| **Frontend** HTTP Client | axios | HTTP client for making API requests |
| **Frontend** Styling | Tailwind CSS | CSS framework for styling |
| **Frontend** Routing | react-router-dom | For handling routing in the frontend |
| **Backend** Framework | Django | Python web framework |
| **Backend** API Framework | Django REST Framework | Toolkit for building APIs |
| **Backend** Database | SQLite | Database used for storing data |
| **Backend** Authentication | allauth | Django library for handling user authentication, including social authentication (Google) |
| **Backend** JWT Authentication | rest_framework_simplejwt | JSON Web Token authentication for Django REST Framework |
| **Backend** Language | Python | Server-side programming language |
| **Frontend** Language | JavaScript | Client-side programming language |

## ⚙️ Backend – Django (REST Framework)

### 📦 Models (algorusher/api/models.py)

#### 🔹 Question Model
Represents a coding problem available on the platform.

| Field | Type | Description |
|-------|------|-------------|
| title | CharField | The name or title of the coding question. |
| problem_code | CharField | A unique identifier for the problem (e.g., "1", "twosum"). |
| difficulty | CharField | The difficulty level (Easy, Medium, or Hard). |
| description | TextField | A detailed explanation of the problem statement. |
| examples | JSONField | Sample input/output pairs to illustrate problem requirements. |
| constraints | TextField | Constraints that the solution must satisfy. |
| tags | JSONField | List of topic tags (e.g., arrays, dynamic programming). |
| hints | TextField | (Optional) Tips or hints to help users approach the problem. |
| solution_code | TextField | Correct solution to the problem, typically used for validation or review. |

### 🌐 API Endpoints (algorusher/api/views.py)
These endpoints form the core of communication between frontend and backend services.

#### 1. User Registration
- **URL:** `/api/register/`
- **Method:** POST
- **Permissions:** Public
- **Purpose:** Registers a new user account.

**Request Example:**
```json
{
    "username": "newuser",
    "password": "password123"
}
```

**Response Example:**
```json
{
    "id": 3,
    "username": "newuser"
}
```

#### 2. User Detail
- **URL:** `/api/user/`
- **Method:** GET, PUT, PATCH
- **Permissions:** Authenticated Users
- **Purpose:** Retrieves or updates details of the logged-in user.

**GET Response Example:**
```json
{
    "id": 1,
    "username": "existinguser"
}
```

**PATCH/PUT Request Example:**
```json
{
    "username": "updateduser"
}
```

#### 3. Google OAuth Callback
- **URL:** `/api/google/callback/`
- **Method:** GET
- **Permissions:** Login Required
- **Purpose:** Handles redirection after successful Google authentication and sends JWT back to the frontend.

**Redirect Format:**
```
http://localhost:5173/login/callback/?access_token={access_token}
```

#### 4. Validate Google Access Token
- **URL:** `/api/google/validate/`
- **Method:** POST
- **Permissions:** Public
- **Purpose:** Validates the Google access token sent from frontend.

**Request Example:**
```json
{
    "access_token": "YOUR_GOOGLE_ACCESS_TOKEN"
}
```

**Response Example:**
```json
{
    "valid": true
}
```

#### 5. Get All Questions
- **URL:** `/api/questions/`
- **Method:** GET
- **Permissions:** Public
- **Purpose:** Fetches a list of all coding questions.

**Sample Response:**
```json
[
    {
        "id": 1,
        "title": "Two Sum",
        "problem_code": "1",
        "difficulty": "Easy",
        "description": "Given an array of integers...",
        "examples": [],
        "constraints": "",
        "tags": []
    }
]
```

#### 6. Get Question by Problem Code
- **URL:** `/api/questions/{problem_code}/`
- **Method:** GET
- **Permissions:** Public
- **Purpose:** Fetches the details of a specific coding problem using its unique code.

**Sample Response:**
```json
{
    "id": 1,
    "title": "Two Sum",
    "problem_code": "1",
    "difficulty": "Easy",
    "description": "Given an array of integers...",
    "examples": [],
    "constraints": "",
    "tags": []
}
```

### 🧰 Serializers (algorusher/api/serializers.py)
- **UserSerializer:** Handles serialization of User objects.
- **QuestionSerializer:** Handles serialization of Question objects.

## 🎯 Frontend – React

### 🔌 Axios Configuration (frontend/src/utils/axiosInstance.js)
Handles secure API calls using JWT and token refreshing.

**Key Features:**
- **Base URL:** `http://localhost:8000/api/`
- **Automatic JWT Token Injection**
- **Token Refreshing Logic**
- **Redirects on Unauthorized Access**

```javascript
const token = localStorage.getItem('access');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

If access token is expired:
- It uses the refresh token from localStorage to request a new access token.
- On failure, it logs the user out and redirects to login.

### 📡 Example API Call
```javascript
const fetchQuestion = async (problemCode) => {
  const response = await axiosInstance.get(`/questions/${problemCode}/`);
  return response.data;
};
```

### 🔐 Authentication Logic (frontend/src/auth.js)
This hook (useAuthentication) provides:
- JWT token validation
- Google token validation
- Auto-refreshing of access tokens
- Logout functionality

**Key Concepts:**
```javascript
if (tokenExpiration < now) {
  await refreshToken();
} else {
  setIsAuthorized(true);
}
```

If the JWT or Google token is valid, the user remains logged in. Else, they're redirected or logged out.

### 🔁 Google Login Flow
1. User clicks "Login with Google".
2. Redirects to Google for authentication.
3. On success, Google redirects to `/login/callback`.
4. Frontend extracts `access_token` and stores it.
5. Backend validates token and frontend proceeds with API access.

## ✅ Summary
The Algorusher platform offers a secure, scalable, and user-friendly environment for practicing coding problems with real-time execution and authentication via JWT or Google OAuth. All frontend and backend API interactions are streamlined through well-structured REST endpoints and React integration logic.
