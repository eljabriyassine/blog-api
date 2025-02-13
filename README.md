# Blog API Backend

This is the backend service for the Blog API, built with NestJS and PostgreSQL. It handles user authentication, post management, and user roles, ensuring a secure and scalable blogging platform.

## Technologies Used
- **NestJS** – A progressive Node.js framework for building efficient backend services.
- **TypeORM** – An ORM for handling database interactions with PostgreSQL.
- **PostgreSQL** – A powerful, open-source relational database.
- **JWT (JSON Web Token)** – Used for authentication and authorization.
- **Multer** – Middleware for handling file uploads.
- **Railway** – A cloud platform for seamless backend deployment.

## Project Structure
```
backend/
│── src/
│   ├── auth/             # Authentication module (login, JWT, roles)
│   ├── post/             # Post-related routes (CRUD, image uploads)
│   ├── users/            # User-related routes (signup, roles, profile)
│   ├── main.ts           # Entry point of the application
│── .env                  # Environment variables (DB connection, JWT secret)
│── package.json          # Project dependencies and scripts
│── README.md             # Project documentation
```

## Setup and Installation
### 1. Clone the repository
```sh
git clone https://github.com/eljabriyassine/blog-api.git
cd blog-api
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory and configure the following:




### 4. Start the application
```sh
npm run start
```

## Deployment on Railway
1. Push your code to a GitHub repository.
2. Go to [Railway.app](https://railway.app/) and create a new project.
3. Connect your GitHub repository and deploy the service.
4. Add environment variables (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, JWT_SECRET) in Railway’s settings.
5. Railway will automatically build and deploy your NestJS app.

## API Endpoints
### **Auth Routes**
- **POST** `/auth/login` – User login
- **POST** `/auth/logout` – User logout
- **GET** `/auth/user` – Get authenticated user details (Requires JWT authentication)

### **User Routes**
- **GET** `/users/all` – Retrieve all users
- **GET** `/users/:id` – Retrieve a specific user
- **GET** `/users/search/:query` – Search users by email or username
- **POST** `/users/register` – User registration
- **POST** `/users/login` – User login
- **PATCH** `/users/:id` – Change user role (Admin only)
- **DELETE** `/users/:id` – Delete a user

### **Post Routes**
- **POST** `/posts` – Create a new post (Requires JWT authentication)
- **GET** `/posts` – Retrieve all posts
- **GET** `/posts/:id` – Retrieve a specific post
- **PUT** `/posts/:id` – Update a post (Requires JWT authentication & ownership)
- **DELETE** `/posts/:id` – Delete a post (Requires JWT authentication & ownership)

## License
**Copyright (c) 2025 Gomobile, Morocco, Casablanca.** All rights reserved.

This software and its source code (the "Software") are the exclusive property of Gomobile, Morocco, Casablanca. No part of this Software, in whole or in part, may be used, reproduced, disclosed, modified, or distributed without prior written permission from Gomobile.

THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. UNAUTHORIZED USE, INCLUDING ATTEMPTS TO REVERSE ENGINEER, IS STRICTLY PROHIBITED.
















# Blog API Backend

## Project Description
The **Blog API Backend** is a RESTful API that allows users to create, read, update, and delete blog posts. It provides user authentication, comment functionality, and role-based access control. Built with **Node.js**, **Nest.js, and **Postgress**, this API ensures scalability and efficiency.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Deployment](#deployment)
5. [Authentication](#authentication)
6. [Credits](#credits)
7. [License](#license)
8. [Contributing](#contributing)
9. [Testing](#testing)

## Installation
To set up the project locally:

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/blog-api-backend.git
   cd blog-api-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the required environment variables:
  ```env
  # Database Configuration
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=your_db_username
  DB_PASSWORD=your_db_password
  DB_NAME=your_db_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Other settings
NODE_ENV=development
```
4. Start the server:
   ```sh
   npm start
   ```

## Usage
1. Make API requests using tools like **Postman** or **cURL**.
2. Authenticate using JWT tokens.
3. CRUD operations available for **users, posts, and comments**.

### Example Request (Creating a Blog Post)
```sh
POST /api/posts
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }
Body:
{
  "title": "My First Blog Post",
  "content": "This is the content of the post.",
}
```

### Response:
```json
{
  "id": "6123456789abcdef",
  "title": "My First Blog Post",
  "content": "This is the content of the post.",
  "createdAt": "2025-02-13T12:00:00Z"
}
```

## API Endpoints
### **Auth Routes**
- **POST** `/auth/login` – User login
- **POST** `/auth/logout` – User logout
- **GET** `/auth/user` – Get authenticated user details (Requires JWT authentication)

### **User Routes**
- **GET** `/users/all` – Retrieve all users
- **GET** `/users/:id` – Retrieve a specific user
- **GET** `/users/search/:query` – Search users by email or username
- **POST** `/users/register` – User registration
- **POST** `/users/login` – User login
- **PATCH** `/users/:id` – Change user role (Admin only)
- **DELETE** `/users/:id` – Delete a user

### **Post Routes**
- **POST** `/posts` – Create a new post (Requires JWT authentication)
- **GET** `/posts` – Retrieve all posts
- **GET** `/posts/:id` – Retrieve a specific post
- **PUT** `/posts/:id` – Update a post (Requires JWT authentication & ownership)
- **DELETE** `/posts/:id` – Delete a post (Requires JWT authentication & ownership)


## Deployment
To deploy this project:
1. Set up a cloud database (MongoDB Atlas or another provider).
2. Choose a cloud hosting service like **Heroku**, **Vercel**, or **AWS**.
3. Configure environment variables in the deployment settings.
4. Deploy using GitHub Actions or another CI/CD pipeline.

## Authentication
- Users must register and log in to receive a **JWT token**.
- The token must be included in requests requiring authentication.
- Role-based access ensures **only authorized users** can modify or delete posts/comments.



## License
This project is licensed under the **MIT License**. See the LICENSE file for details.
)

## Contributing
1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes.
4. Push to your fork and submit a **pull request**.

## Testing
Run tests using:
```sh
npm test
```
Include unit tests for API routes to ensure functionality.

---
By following this **README**, users and contributors will have a clear understanding of how to use and contribute to the Blog API Backend project.

