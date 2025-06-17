# API Documentation

This document provides detailed information about the Django API endpoints used in the Algorusher project and how they are integrated with the frontend.

## Backend (Django)

### Models (`algorusher/api/models.py`)

#### Question Model

The `Question` model represents a coding problem. It has the following fields:

*   `title` (CharField): The title of the question.
*   `problem_code` (CharField): A unique code for the problem.
*   `difficulty` (CharField): The difficulty level of the question (Easy, Medium, Hard).
*   `description` (TextField): A detailed description of the problem.
*   `examples` (JSONField): Example inputs and outputs for the problem.
*   `constraints` (TextField): Constraints on the input values.
*   `tags` (JSONField): Tags associated with the problem (e.g., "arrays", "dynamic programming").
*   `hints` (TextField, optional): Hints to help solve the problem.
*   `solution_code` (TextField): The correct solution code for the problem.

### API Endpoints (`algorusher/api/views.py`)

#### 1. User Creation (`/api/register/`)

*   **Method:** POST
*   **Permissions:** AllowAny
*   **Purpose:** Creates a new user.
*   **Request Body:**
    ```json
    {
        "username": "newuser",
        "password": "password123"
    }
    ```
*   **Response:**
    ```json
    {
        "id": 3,
        "username": "newuser"
    }
    ```

#### 2. User Detail (`/api/user/`)

*   **Method:** GET, PUT, PATCH
*   **Permissions:** IsAuthenticated
*   **Purpose:** Retrieves or updates the details of the authenticated user.
*   **Response (GET):**
    ```json
    {
        "id": 1,
        "username": "existinguser"
    }
    ```
*   **Request Body (PUT/PATCH):**
    ```json
    {
        "username": "updateduser"
    }
    ```

#### 3. Google Login Callback (`/api/google/callback/`)

*   **Method:** GET
*   **Permissions:** login\_required
*   **Purpose:** Handles the callback from Google after successful authentication. Redirects to the frontend with a JWT access token.
*   **Redirect URL:** `http://localhost:5173/login/callback/?access_token={access_token}`

#### 4. Validate Google Token (`/api/google/validate/`)

*   **Method:** POST
*   **Permissions:** AllowAny
*   **Purpose:** Validates a Google access token received from the frontend.
*   **Request Body:**
    ```json
    {
        "access_token": "YOUR_GOOGLE_ACCESS_TOKEN"
    }
    ```
*   **Response:**
    ```json
    {
        "valid": true
    }
    ```

#### 5. Question List (`/api/questions/`)

*   **Method:** GET
*   **Permissions:** AllowAny
*   **Purpose:** Retrieves a list of all questions.
*   **Response:**
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
        },
        ...
    ]
    ```

#### 6. Question Detail (`/api/questions/{problem_code}/`)

*   **Method:** GET
*   **Permissions:** AllowAny
*   **Purpose:** Retrieves a specific question by its `problem_code`.
*   **Response:**
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

### Serializers (`algorusher/api/serializers.py`)

*   `UserSerializer`: Serializes and deserializes `User` objects.
*   `QuestionSerializer`: Serializes and deserializes `Question` objects.

## Frontend (React)

### API Configuration (`frontend/src/utils/axiosInstance.js`)

The `axiosInstance` is configured with the following:

*   **Base URL:** `http://localhost:8000/api/`
*   **Authorization:** Includes the JWT access token in the `Authorization` header for authenticated requests.
*   **Refresh Token Logic:** Implements logic to refresh the access token when it expires, using the refresh token stored in local storage.

#### Axios Instance

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh');
      if (!refreshToken) {
        logoutAndRedirect();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken
        });

        const newAccess = res.data.access;
        localStorage.setItem('access', newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        logoutAndRedirect();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

function logoutAndRedirect() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  window.location.href = '/login';
}

export default axiosInstance;
```

### API Calls

The frontend uses `axios` or `axiosInstance` to make API calls. Here's an example of fetching a question detail:

```javascript
import axiosInstance from './utils/axiosInstance';

const fetchQuestion = async (problemCode) => {
  try {
    const response = await axiosInstance.get(`/questions/${problemCode}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};
```

### Authentication

*   The frontend stores the access and refresh tokens in local storage.
*   The `useAuthentication` hook (in `frontend/src/auth.js`) is used to check if the user is authenticated.
*   Protected routes are used to restrict access to certain pages based on authentication status.

#### useAuthentication Hook (`frontend/src/auth.js`)

```javascript
import {useState,useEffect} from "react";
import{jwtDecode} from 'jwt-decode';
import api from "./api";
import { ACCESS_TOKEN,REFRESH_TOKEN,GOOGLE_ACCESS_TOKEN } from "./token";

export const useAuthentication = () => {
    const [isAuthorized,setIsAuthorized] = useState(false);
    useEffect(()=>{
        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN)
            
            console.log('ACCESS_TOKEN',token);
            console.log('GOOGLE_ACCESS_TOKEN',googleAccessToken);
            if(token){
                const decode = jwtDecode(token);
                const tokenExpiration = decode.exp;
                const now = Date.now() /1000;
                if(tokenExpiration<now){
                    await refreshToken();
                }
                else{
                    setIsAuthorized(true);
                }
            }
            else if(googleAccessToken){
                const isGoogleTokenValid= await validateGoogleToken(googleAccessToken)
                console.log("Google Token is Valid",isGoogleTokenValid);
                if(isGoogleTokenValid){
                    setIsAuthorized(true);
                }   else{
                    setIsAuthorized(false);
                }

            } else{
                setIsAuthorized(false);
            }
        };
        auth().catch(()=>setIsAuthorized(false));
    },[]);

    const refreshToken = async () => {
         const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            const res = await api.post("/api/token/refresh/", {
            refresh: refreshToken,
            });

            if (res.status === 200) {
                const { access } = res.data;
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                 setIsAuthorized(false);
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            setIsAuthorized(false);
        }
    };
 const validateGoogleToken = async(googleAccessToken) => {
    try{
        const res = await api.post('/api/google/validate_token',{
            access_token:googleAccessToken,
        },{
            headers:{
                'Content-Type':'application/json',
            },
        });
        console.log("validate Response: ",res.data);
        return res.data.valid;
    } catch(error){
        console.log("invalid google token",error);
        return false;
    }
 }
 const logout =() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
    setIsAuthorized(false);
    window.location.reload();
 }
 return {isAuthorized,logout};

}
```

*   The `useAuthentication` hook checks if the user is authenticated by verifying the JWT token stored in local storage.
*   It also handles token refreshing and Google token validation.
*   The `logout` function removes the tokens from local storage and reloads the page.

## Google Authentication Flow

1.  The user clicks on the "Login with Google" button on the frontend.
2.  The frontend redirects the user to the Google authentication page.
3.  After successful authentication, Google redirects the user to the `/login/callback` route on the frontend.
4.  The `RedirectGoogleAuth` component (in `frontend/src/component/GoogleRedirectHandler.jsx`) extracts the access token from the URL.
5.  The access token is stored in local storage.
6.  The frontend uses the access token to make authenticated API calls.
