# First-Chat

**Full-Stack Chat App**

#### Deployed link : [First Chat](https://first-chat-1.onrender.com/)
#### API documentation : [First Chat](https://documenter.getpostman.com/view/17664456/2sA2xnxpvG)
#### Docker Images : [Frontend](https://hub.docker.com/r/dilip8840/chat_realtime-frontend) [Backend](https://hub.docker.com/r/dilip8840/chat_realtime-backend)

Overview

_This full-stack chat app enables real-time communication between users. It consists of two main components: the frontend and the backend._

## Frontend

The frontend is built using:

- React: A JavaScript library for building dynamic and interactive user interfaces.
- Chakra UI: A component library that provides pre-styled UI components for React applications.

## Backend

#### The backend handles server-side logic, data storage, and communication.

It utilizes:

- MongoDB: A NoSQL database for storing user data, messages, and other relevant information.
- Express: A web application framework for creating RESTful APIs and handling HTTP requests.
- Node.js: A JavaScript runtime environment that allows server-side execution.
- Socket.io: A library for enabling real-time communication via WebSockets.

## Features

- User Authentication:
  1. Implement user registration and login functionality.
  2. Secure user authentication using jwt
- Real-Time Chat:
  1. Users can send and receive messages in real time.
  2. Utilize Socket.io for instant updates and notifications.
- Resource Upload (Cloudinary):
  1. Users can upload images, files, or other resources.
  2. Cloudinary integration for efficient resource storage and retrieval.
- API Endpoints:
  1. Define various API endpoints using Express:
  1. User registration and login.
  1. Message retrieval and storage.

### Steps to contribute

1. Clone this repository.

```
git clone https://github.com/aRc-rAy/First-Chat.git
```

2. Set up MongoDB and create a database for your app.
3. Configure environment variables for MongoDB connection, Cloudinary API keys.
4. Install dependencies (npm install in both frontend and backend folders).
   Move to current directory

```
cd First-Chat
```

run below command in terminal

```
npm run build
```

5. Start the frontend (npm start) and backend (node index.js) servers.

## Usage

1. Register or log in to access the chat interface.
2. Send and receive messages in real time.
3. Upload images using Cloudinary.
4. Explore the API endpoints for additional functionality.

## Contributing

> Contributions are welcome!
