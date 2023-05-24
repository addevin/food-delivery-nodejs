# Food Delivery Node.js API

This repository contains a Node.js API that serves as the backend for the Food Delivery Angular app. The API provides routes and functionalities to handle user authentication, manage user data. It works in conjunction with the Food Delivery Angular app, which utilizes JWT (JSON Web Token) refresh and access tokens for user authentication. It is designed specifically for the purpose of supporting the [Food Delivery Angular](https://github.com/addevin/food-delivery-angular) project.

## Features

The Food Delivery Node.js API includes the following features:

- User authentication using JWT refresh and access tokens.
- Endpoints to access and update user data in the database.
- Routes to handle user registration and user data management.
- Image uploading functionality for user avatars.


## Technologies Used

The Food Delivery Node.js API utilizes the following technologies:

- Node.js: A JavaScript runtime environment for building server-side applications.
- Express.js: A fast and minimalist web application framework for Node.js.
- MongoDB: A popular NoSQL database for storing and retrieving data.
- Mongoose: An elegant MongoDB object modeling for Node.js.
- JWT (JSON Web Token): A secure method for transmitting user authentication information between parties.
- Multer: A middleware to handle file uploading.
- Express-validator: An input validation and sanitization library.
- bcrypt: A library for hashing passwords and providing password security.

## Installation

To run the Food Delivery Node.js API locally, follow these steps:

1. Ensure you have [Node.js](https://nodejs.org) installed on your machine.
2. Clone this repository to your local machine using the following command:

```
git clone https://github.com/addevin/food-delivery-nodejs.git
```


3. Navigate to the project's root directory:

```
cd food-delivery-nodejs
```


4. Install the required dependencies using npm:

```
npm install
```


5. Create a `.env` file in the project's root directory and define the following environment variables:

```
DB_SECRET = 'your_mongodb_uri'
CORS_ALLOWED_URL = http://localhost:4200
PORT = 3000 # optional, default=3000
JWT_ACCESS_SECRET_TOKEN = 'authsecretkey1'
JWT_REFRESH_SECRET_TOKEN = 'authsecretkey2'
JWT_DEFAULT_SESSION_TIMEOUT = '7d'
```


Replace `authsecretkey1` and `authsecretkey2` with a secure secret key for JWT token encryption and `your_mongodb_uri` with the connection URI for your MongoDB database.

6. Start the Node.js server:
```
npm start
```

7. The API will be running on `http://localhost:3000`, and it is ready to be used by the Food Delivery Angular app.
