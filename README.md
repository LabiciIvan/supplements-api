# 🛒 **Supplements Store API** 🧑‍💻
Welcome to the Supplements Store API! This application provides the backend services for managing a supplements store. It is built using Express.js, and it utilizes MySQL as the database. With Docker, the application is containerized, ensuring it runs seamlessly across different environments.

# 🚀 **Features**
Express.js API: A lightweight and powerful framework to handle API requests.

MySQL Integration: Store and manage supplements data with a robust relational database.

Dockerized: Easy to set up and run the application on any machine, just by using Docker.

Hot-reloading: Thanks to ts-node-dev, your TypeScript files are automatically reloaded during development.



# 🏗️ **Technologies Used**
**Node.js** (v20.19.0)
**Express.js**      - Fast, unopinionated framework for building web APIs.
**MySQL**           - Relational database to store supplements data.
**Docker**          - Containerizes the application, making it easy to run anywhere.
**TypeScript**      - Adds type safety to your code for better maintainability.
**Docker Compose**  - Easily manage multiple services (API + Database) with one command.


# 🛠️ **Getting Started**
Prerequisites
Before you begin, ensure you have the following tools installed:
- Docker
- Docker Compose


1. Clone the Repository
First, clone the repository to your local machine:

`git clone https://github.com/yourusername/supplements-api.git`
`cd supplements-api`



2. Set Up Docker
Dockerize the application by running the following command to build and start the services:
`docker-compose up --build`

This will:

Build the supplements-api service (Express API) and the db service (MySQL).

Mount the current directory to /supplements-api in the container.

Map port 3000 of your host to port 3000 of the container.

Your application will be accessible at http://localhost:3000.

3. Environment Variables
Ensure your .env or Docker environment variables are configured as follows:
MYSQL_HOST=mysql
MYSQL_DATABASE=supplements_db
MYSQL_USER=user
MYSQL_PASSWORD=password

These are used to connect the Express API to the MySQL database inside the Docker container.


# ⚙️ **Running the Application**
Development Mode
The dev script enables automatic TypeScript compilation and server restart on file changes using ts-node-dev:
docker-compose up --build


Accessing MySQL
You can access the MySQL database running in the container:

docker exec -it supplements-db mysql -uuser -p


🎉 Happy coding, and enjoy your supplements API! 🎉