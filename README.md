# Final

## 📌 Project Overview
Final is a full-featured web application built using MongoDB, Node.js, and Express.js. The project tests students' knowledge in database design, CRUD operations, indexing, complex queries, and database integration with a web application.

## ✨ Features
- 🔐 Authentication (optional) using JWT tokens
- 👤 User Profiles — manage user information and posts
- 📰 Post Management — create, read, update, delete posts
- 🔍 Search and Filtering — search posts using full-text search, filter by date/category
- 📄 View Post — detailed post view with comments
- ❤️ Likes and Comments — interaction between users
- 📊 Analytics — aggregation queries for insights

## 🛠 Technologies Used
- 🚀 Node.js — JavaScript runtime environment
- ⚡️ Express.js — web framework for building APIs
- 🗄 MongoDB — NoSQL database
- 📜 Mongoose — ODM for MongoDB
- 🔑 JWT (JSON Web Token) — authentication
- 🎨 Validator.js — validate incoming data
- 🔐 bcrypt — password hashing

## 📥 Installation

1. Clone the repository:
   

   git clone https://github.com/strashacc/final.git
   cd final
   
2. Install dependencies:
   

   npm install
   
3. Set up environment variables (`.env` file):
   

   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   
4. Start the server:
   

   npm start
   

## 📡 API Endpoints

### 🔐 Authentication (Optional)
- POST /api/auth/register — Register a new user
- POST /api/auth/login — Log in
- POST /api/auth/logout — Log out

### 👤 User Management
- GET /api/users/:id — Retrieve user profile
- GET /api/users/:id/posts — Get user posts
- PUT /api/users/profile — Update user profile

### 📝 Posts
- GET /api/posts — Get all posts
- GET /api/posts/:id — Get a specific post
- POST /api/posts — Create a new post
- PUT /api/posts/:id — Update a post
- DELETE /api/posts/:id — Delete a post

### 👍 Likes and Comments
- POST /api/posts/:id/like — Like/unlike a post
- POST /api/posts/:id/comment — Add a comment

## 🔍 Search & Filtering
- Full-text search using MongoDB text indexes
- Filtering posts by category, date range, etc.
- Sorting by specific fields (e.g., price, date)

## 📊 Analytics
- Aggregation queries using $group, $aggregate, $lookup
- Example: counting total posts per user

## 🔒 Authentication & Security
- JWT-based authentication
- Middleware protection for private routes
- Password hashing using bcrypt

## 🗄 Database Structure
- At least 3 collections with 10+ documents each
- At least 2 collections with nested documents
- Relationships using embedded documents and references

## ⚠️ Validation and Error Handling
- Data validation using Joi/Validator.js
- Proper error handling (e.g., 400 for bad requests, 401 for unauthorized access)

## 🛠 Indexing
- Unique index: e.g., email field in the users collection
- TTL index: Automatically remove old data (e.g., expired tasks)

## 🚀 Deployment
The project is deployed on platforms such as Render, Replit, or Railway. Ensure .env files store sensitive information like database connection strings and JWT secrets.
