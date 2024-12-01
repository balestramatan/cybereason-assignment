# Cybereason Assignment - Pokémons Full-Stack Application - Matan Balestra

## Overview

Hi and Thank you for the opportunity!

A full-stack web application where users can register, log in, and manage Pokémon data. This project uses NestJS for the backend, React and TypeScript for the frontend, Redis for caching, PostgreSQL for database management, and Docker for containerization.

### Features

- **User Authentication:** Register and log in with JWT-based authentication.

- **Pokémon Management:** CRUD operations for Pokémon data, with pagination and search functionality.

- **Caching:** Caching: Pokémon data is cached in Redis to reduce both database load and the number of direct calls to the PokeAPI. Cache invalidation ensures updated data integrity.

- **Responsive UI:** A clean abd simple interface to display and manage Pokémons.

### Frontend - React TS

1. **Authentication View**: This view handles user authentication, allowing users to securely log in or register for the application.

   - **Login**: Provides a form where users can input their credentials (username and password) to log in. Implements client-side validation for input fields and displays appropriate error messages for invalid credentials.

   - **Registration**: Allows new users to create an account by providing a username and password. Validates input fields, enforces password complexity, and displays success or error messages based on the outcome.

2. **Pokémons List View**: Displays a paginated list of Pokémon retrieved from the database-pokeapi, showing their names, types, and images. Users can interact with the list to view more details or apply filters to narrow down their search.

   - **Pagination**: Divides the Pokémon list into manageable pages to improve performance and usability. Users can navigate between pages using intuitive controls.

   - **Filtering**: Allows users to search and filter Pokémon based on attributes such as name or type. 

### Backed - NestJS

#### Endpoints

1.  Authentication

    - POST /auth/register: User registration
    - POST /auth/login: User login

2.  Pokémon
    - GET /pokemon/findAll - Get a paginated list of Pokémon
    - GET /pokemon/findOne/:id - Get Pokémon details
    - PATCH /pokemon/:pokemonId/favorite - Favorite a Pokémon
    - PATCH /pokemon/:pokemonId/nickname - Give Pokémon a NickName
    - PATCH /pokemon/:pokemonId/notes - Add Notes To a Pokémon
    - DELETE /pokemon/:id - Delete a Pokémon

### Caching - Redis

- Pokémon data is cached to reduce database load and reduce calls to the PokeAPI.
- Cache invalidates on Pokémon updates.

### Database - PostgreSQL

#### Schema

1.  Users

    - id: Primary Key
    - username: Unique
    - password: Encrypted

2.  Pokémon
    - id: Primary Key
    - name
    - type
    - image

3.  UserPokemon
    - id: Primary Key
    - user
    - pokemon
    - nickname
    - notes
    - isFavorite

## Application Flow

![Application Flow Diagram](/documents/ApplicationFlow.jpg)

## Data Flow

![Data Flow Diagram](/documents/DataFlow.jpg)

## Documentation

For detailed documentation on the project's implementation, please refer to the files in the `/documents` folder:

- **[3RD_PARTY_LIBRARIES]**: This file outlines the project structure and the decisions made before and during the development process.
- **[ROAD_MAP_DEVELOPMENT]**: This file contains the roadmap and planning details established before and during the development process.

You can find the `/documents` folder in the root directory of the repository.

## Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- Docker
- Docker Compose

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/balestramatan/cybereason-assignment.git
   cd cybereason-assignment
   ```

2. **Install Dependencies On The Drontend And Backend Folders**:
   ```bash
   cd ~/frontend
   npm install

   cd ~/backend
   npm install
   ```

3. **Start the Application**:
   ```bash
   docker compose up -d
   ```

   - Fronend running on port 5173
   - Backend running on port 3001
   - Fronend running on port 6379
   - Fronend running on port 5432

   Make sure the ports are not already in use the your system.

4. **Open the Application**:
   Navigate to `http://localhost:5173` in your browser.



## License

This project is licensed under the MIT License
