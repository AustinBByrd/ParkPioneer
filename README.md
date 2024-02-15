# ParkPioneer

**Bringing Families and Friends Together, One Park at a Time**

## Description:
ParkPioneer arose from a simple need within my friend circle - efficiently selecting parks for our weekly "Park Tuesday" gatherings. Our goal is to streamline this process, ensuring that park selection is logical, convenient, and fun for everyone.

## User Stories:
- **Local Park Discovery**: Easily find parks in your vicinity.
- **Directions Integration**: Get hassle-free directions to any park.
- **User Profiles**: Create your own profile and manage your park preferences.
- **Favoriting System**: Keep track of your favorite parks.
- **Multiple Locations**: Add multiple 'home' locations for varied starting points.
- **Comprehensive Park Listing**: A wide range of parks to choose from.
- **Event Creation**: Organize and invite others to park events.


## React Tree:
<img width="757" alt="image" src="https://github.com/AustinBByrd/ParkPioneer/blob/main/assets/ParkPioneerTree.png">


## Schema:
<img width="757" alt="image" src="https://github.com/AustinBByrd/ParkPioneer/blob/main/assets/schema.png">


## API Routes (Updated)

| Route                                        | Method           | Description                                 |
|----------------------------------------------|------------------|---------------------------------------------|
| `/api/users`                                 | GET, POST        | Retrieve or create new users                |
| `/api/users/:id`                             | GET              | Retrieve a single user by ID                |
| `/api/users/:id/preferences`                 | POST             | Update user preferences                     |
| `/api/users/:id/preferences/zipcode`         | GET              | Retrieve user's preferred zip code          |
| `/api/users/:id/favorited-parks`             | GET, POST        | Retrieve or add favorite parks for a user   |
| `/api/users/:id/favorited-parks/:parkId`     | DELETE           | Remove a park from user's favorites         |
| `/api/users/:id/locations`                   | GET, POST        | Retrieve or add locations for a user        |
| `/api/users/:id/locations/:locationId`       | DELETE           | Delete a specific location for a user       |
| `/api/add-favorite`                          | POST             | Add a park to favorites (pre-existing)      |
| `/api/distance-matrix`                       | POST             | Get distance matrix from Google API         |
| `/api/events`                                | GET, POST        | Retrieve or create events                   |
| `/api/events/:id`                            | PATCH, DELETE    | Update or delete events                     |
| `/api/events/update/:id`                     | PATCH            | Update event details                        |
| `/logout`                                    | GET              | Log out and clear the session               |

### New Additions:

- **`/api/events/update/:id`**: Endpoint for updating event details using the PATCH method.




# ParkPioneer Project Setup Guide

This README provides instructions on how to get the ParkPioneer project up and running on your local machine for development and testing purposes.

## Prerequisites

- Node.js and npm
- Python 3 and pip
- pipenv

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd ParkPioneer
```

### Client Setup

Navigate to the `client` directory and create a `.env` file with your Google Maps API key:

```bash
cd client
echo "VITE_URL=/api" > .env
echo "VITE_REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY" >> .env
npm install
```

### Server Setup

Navigate to the `server` directory and create a `.env` file with your credentials and keys:

```bash
cd ../server
cat > .env <<EOL
SUPABASE_URI=YOUR_SUPABASE_URI
SECRET_KEY=YOUR_SECRET_KEY
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
EOL
pipenv install
pipenv shell
```

### Database Setup

Ensure your PostgreSQL database is set up and the `SUPABASE_URI` in the server `.env` file is correct.

### Running the Project

In the `client` directory, start the Vite server:

```bash
npm run dev
```

In the `server` directory, start the Flask server:

```bash
python app.py
```

The client-side application will be served at `http://localhost:3000` by default, and the server-side application will run on `http://localhost:5000` by default (or as specified in the Flask server output).

Remember to replace placeholders in the `.env` files with your actual data before running the application.

## Issues

If you encounter any problems, check the individual setup guides for Node.js, Python, pipenv, and PostgreSQL, or raise an issue in the repository.


## Stretch Goals:
Sharing capabilities off site


## Trello:
<img width="1232" alt="image" src="https://github.com/AustinBByrd/ParkPioneer/blob/main/assets/Trello.png">


