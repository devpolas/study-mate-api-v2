# Study Mate Backend API

This is the backend API for **Study Mate**, a social learning platform.  
It is built using **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.  
The API supports both email/password login and Firebase social login (Google).

---

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [API Routes](#api-routes)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Friendships](#friendships)
- [Error Handling](#error-handling)
- [CORS](#cors)
- [Testing](#testing)
- [Notes](#notes)

---

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-folder>

Install dependencies:

npm install


Set environment variables (see below).

Start the server:

npm run dev


Server will run on http://localhost:3000 by default.

Environment Variables

Create a .env file with the following variables:

NODE_ENV=development
PORT=3000

# JWT Secrets
ACCESS_JWT_SECRET=your_access_secret
ACCESS_JWT_EXPIRES_IN=15m
REFRESH_JWT_SECRET=your_refresh_secret
REFRESH_JWT_EXPIRES_IN=15

# Firebase SDK (base64 encoded JSON)
FIREBASE_SDK_API_KEY=your_base64_encoded_firebase_sdk_json

# MongoDB Connection
DATABASE=mongodb://localhost:27017/study-mate

Installation

Install dependencies:

npm install express mongoose morgan cookie-parser cors jsonwebtoken bcryptjs firebase-admin dotenvx


Start in development mode:

npm run dev

API Routes

Base URL: /api/v1

Authentication Routes
Method	Route	Description	Access
POST	/users/signup	Register a new user with email/password	Public
POST	/users/login	Login with email/password	Public
POST	/users/social-login	Login with Firebase token	Public
POST	/users/refresh_token	Refresh access JWT using cookie	Public
POST	/users/logout	Logout user and invalidate refresh token	Protected

Signup Example

POST /api/v1/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}

User Routes
Method	Route	Description	Access
GET	/users/	Get all users (supports filtering & sorting)	Public
GET	/users/me	Get current authenticated user	Protected
GET	/users/:id	Get a user by ID	Protected
PATCH	/users/updateMe	Update authenticated user profile	Protected

Filtering & Sorting

Filter by slug:

GET /api/v1/users?slug=developer


Sort by fields (comma-separated):

GET /api/v1/users?sort=name,-ratingAverage


Update User Example

PATCH /api/v1/users/updateMe
Content-Type: application/json

{
  "name": "Jane Doe",
  "profileImage": "http://example.com/image.jpg",
  "availability": "Evenings"
}

Friendship Routes
Method	Route	Description	Access
GET	/friendships/all-friends/:id	Get all accepted friends	Protected
GET	/friendships/all-requested-friends/:id	Get all pending friend requests	Protected
POST	/friendships/send-request	Send a friend request	Protected
POST	/friendships/accept-request	Accept a friend request	Protected
POST	/friendships/unfriend	Remove an existing friend	Protected

Send Friend Request Example

POST /api/v1/friendships/send-request
Content-Type: application/json

{
  "recipientId": "64fb1c5e6e4b2b0012a5d9a0"
}


Accept Friend Request Example

POST /api/v1/friendships/accept-request
Content-Type: application/json

{
  "requesterId": "64fb1c5e6e4b2b0012a5d9a0"
}


Unfriend Example

POST /api/v1/friendships/unfriend
Content-Type: application/json

{
  "recipientId": "64fb1c5e6e4b2b0012a5d9a0"
}

Error Handling

Errors are returned in the following format:

{
  "status": "fail",
  "message": "Description of the error"
}


Common Status Codes

400 → Bad Request

401 → Unauthorized

404 → Not Found

500 → Internal Server Error

CORS

Allowed origins:

http://localhost:5173

https://study-mate1.netlify.app

Supports credentials (cookies)

Standard HTTP methods allowed

Testing

Use Postman or Insomnia to test the API:

Include Authorization: Bearer <accessToken> for protected routes

Refresh tokens are sent automatically via HTTP-only cookies

Make sure Firebase social login tokens are valid for /social-login

Notes

Passwords are hashed and never returned in responses

Social login uses Firebase token verification

Token versioning ensures logout invalidates previous refresh tokens

User updates only allow whitelisted fields; passwords must be updated via a separate route

Quick Workflow

Signup / Login → receive access & refresh tokens

Access protected routes → send Authorization header

Send friend requests → accept / unfriend other users

Refresh tokens → automatically via /refresh_token

License

This project is licensed under the MIT License.
