# Data Sharing Risk Assessment Client App

This repository contains the client-side application for the Data Sharing Risk Assessment tool. This guide will help you set up the project on your local machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setting Up Environment Variables](#setting-up-environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Learn More](#learn-more)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/theodi/data-sharing-risk-assessment.git
    cd data-sharing-risk-assessment/client
    ```

2. **Install dependencies**:

    Using npm:

    ```bash
    npm install
    ```

    Using Yarn:

    ```bash
    yarn install
    ```

## Setting Up Environment Variables

Create a `.env` file in the root directory of the project. This file will contain the necessary environment variables for the application to run correctly.

1. **Create the `.env` file**:

    ```bash
    touch .env
    ```

2. **Add the following variables to the `.env` file**:

    ```env
    REACT_APP_API_URL=http://localhost:3080
    ```

    Replace `http://localhost:3080` with the appropriate URL if your backend server is running on a different host or port.

## Running the Application

Once you have installed the dependencies and set up the environment variables, you can start the development server.

Using npm:

```bash
npm start
```

Using Yarn:

```bash
yarn start
```

This will start the application and open it in your default web browser. The app will automatically reload if you make changes to the code.

## Project Structure

The project structure is as follows:

```
my-react-app/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── redux/
│   ├── App.js
│   ├── index.js
│   └── ...other files
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

- `src/`: Contains the source code of the application.
  - `assets/`: Contains images, styles, and other static assets.
  - `components/`: Contains the React components used in the application.
  - `context/`: Contains context providers and hooks.
  - `redux/`: Contains Redux slices and store configuration.

## Available Scripts

In the project directory, you can run:

- `npm run start` or `yarn start`: Runs the app in development mode.
- `npm run build` or `yarn build`: Builds the app for production to the `build` folder.
- `npm run test` or `yarn test`: Launches the test runner in interactive watch mode.
- `npm run eject`: Ejects the app configuration. **Note: This is a one-way operation. Once you `eject`, you can’t go back!**

## Learn More

To learn more about React, Redux, and other technologies used in this project, you can refer to the following resources:

- [React documentation](https://reactjs.org/)
- [Redux documentation](https://redux.js.org/)
- [Create React App documentation](https://create-react-app.dev/docs/getting-started/)

Happy coding! If you encounter any issues or have any questions, feel free to open an issue on the repository.