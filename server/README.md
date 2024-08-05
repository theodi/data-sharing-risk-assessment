# Data Sharing Risk Assessment Server

This repository contains the server-side code for the Data Sharing Risk Assessment application. The server is built using Node.js and Express and connects to a MongoDB database to store and manage assessment data. The server provides authentication and assessment management functionalities.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine
- MongoDB instance running and accessible
- `npm` or `yarn` package manager installed

## Installation

1. Clone the repository:

```bash
git clone https://github.com/theodi/data-sharing-risk-assessment.git
cd data-sharing-risk-assessment/server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `config.env` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables)).

## Environment Variables

The application requires several environment variables to be set. Create a `.env` file in the root directory and add the following variables:

```plaintext
# MongoDB configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net
MONGO_DB=<database-name>

# Application configuration - Server
PORT=3080
HOST=http://localhost:{PORT}

# Application configuration - Client
APP_HOST=http://localhost:3000

# Authentication configuration
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Google OAuth configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3080/auth/google/callback

# Django OAuth configuration
DJANGO_CLIENT_ID=your_django_client_id
DJANGO_CLIENT_SECRET=your_django_client_secret
DJANGO_CALLBACK_URL=http://localhost:3080/auth/django/callback
```

## Usage

1. Start the server:

```bash
npm start
```

2. The server will be running on the port specified in the `config.env` file (default is 3080). You can now access the server at `http://localhost:3080`.

## API Endpoints

### Authentication

- `GET /auth/google` - Initiates Google authentication
- `GET /auth/google/callback` - Google authentication callback
- `GET /auth/django` - Initiates Django authentication
- `GET /auth/django/callback` - Django authentication callback
- `POST /auth/local` - Local authentication
- `GET /auth/check` - Check if the user is logged in
- `GET /auth/logout` - Logout the user

### Assessments

- `GET /assessments` - Get all assessments
- `GET /assessments/:id` - Get a single assessment by ID
- `POST /assessments` - Create a new assessment
- `PUT /assessments/:id` - Update an assessment by ID
- `DELETE /assessments/:id` - Delete an assessment by ID
- `GET /assessments/:id/sharedUsers` - Get shared users of an assessment
- `POST /assessments/:id/sharedUsers` - Add a new shared user to an assessment
- `DELETE /assessments/:id/sharedUsers/:email` - Remove a shared user from an assessment
- `GET /assessments/:id/report` - Get the assessment report in JSON or CSV format

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code follows the project's coding standards and passes all tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README file according to your project's specific needs and details.