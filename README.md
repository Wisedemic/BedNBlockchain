## Bed'N'Blockchain

This application was built using:
- React
- Redux
- Express
- MongoDB w/ Mongoose

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
    
This file is critical for a successful build.

by Tristan Navarrete
