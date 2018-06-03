# Bed'N'Blockchain

This application is a changing model for developing a decentralized application (dapp).

### Design choices

##### For the frontend, React and Redux
-  React mixed with Redux global state handling, mixed with some awesome PromiseMiddleware (in ./client/middleware.js), allows the  frontend to easily update according to the asynchronous nature of a dapp.

##### For the backend, Express
- Express is a familar, yet battle-hardened framework for building API's. It also handles async tasks incredibly well.
##### Other design choices
- React doesn't require .jsx ... but it's much easier to build a react app with .jsx handling. Because of this, the frontend of the application needs to compiled using webpack
- This application Renders React from the api server. This design choice allows for the entire application to be run from 1 port. Normally, React will listen to one port, and can be served on a server seperate from the api. In this case, I wanted to merge the express and react servers. (See ./api/ssr.js, and ./api/server.js)
- As a personal extra, I wanted to have a Hot-Reloading environment. This required that Webpack compile the api server when changes are made. Since webpack already had to compile the api server, I was also able to add ES6 to the express server!

### Installation
    1. npm i
    2. npm i --only=dev

For Production:

    3. npm run serve:fresh

For Development:

    3. npm start

### Folder Structure
    .
    ├── .build                  # Compiled Webpack Development files
    ├── dist                    # Compiled Webpack Proudction files
    ├── api                     # Express Server. (Providing React Server Side Rendering)
    ├── client                  # React Client-side files
    ├── config                  # Webpack files for compiler configuration
    ├── .env                    # Read more @ .env section
    └── README.md

### .env
The .env file should be formated like so:

    MONGO_DB_URI=YOUR_MONGO_URL
    VERSION=0.0.1
    SECRET=somesecret
    PORT=3000
    NODE_ENV=production

by Tristan Navarrete
