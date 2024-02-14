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

| Route                                        | Method      | Description                                 |
|----------------------------------------------|-------------|---------------------------------------------|
| `/api/users`                                 | GET, POST   | Retrieve or create new users                |
| `/api/users/:id`                             | GET         | Retrieve a single user by ID                |
| `/api/users/:id/preferences`                 | POST        | Update user preferences                     |
| `/api/users/:id/preferences/zipcode`         | GET         | Retrieve user's preferred zip code          |
| `/api/users/:id/favorited-parks`             | GET, POST   | Retrieve or add favorite parks for a user   |
| `/api/users/:id/favorited-parks/:parkId`     | DELETE      | Remove a park from user's favorites         |
| `/api/users/:id/locations`                   | GET, POST   | Retrieve or add locations for a user        |
| `/api/users/:id/locations/:locationId`       | DELETE      | Delete a specific location for a user       |
| `/api/add-favorite`                          | POST        | Add a park to favorites (pre-existing)      |
| `/api/distance-matrix`                       | POST        | Get distance matrix from Google API         |
| `/events`                                    | GET, POST   | Retrieve or create events (pre-existing)    |
| `/events/:id`                                | PATCH, DELETE | Update or delete events (pre-existing)   |
| `/logout`                                    | GET         | Log out and clear the session               |

### New Additions:

- **`/api/users/:id`**: Retrieve a single user by their ID.
- **`/api/users/:id/preferences`**: Allows updating user preferences.
- **`/api/users/:id/preferences/zipcode`**: Get a user's preferred zip code.
- **`/api/users/:id/favorited-parks/:parkId`**: Endpoint to remove a favorited park by ID.
- **`/api/users/:id/locations`**: Retrieve or add new locations for a user.
- **`/api/users/:id/locations/:locationId`**: Allows deletion of a specific user location.
- **`/api/distance-matrix`**: A new route to handle requests to the Google Distance Matrix API, providing distances and travel times between origins and destinations.


## Stretch Goals:
Sharing capabilities off site


## Trello:
<img width="1232" alt="image" src="https://github.com/AustinBByrd/ParkPioneer/blob/main/assets/Trello.png">

## Wireframe:
<img width="757" alt="image" src="https://github.com/AustinBByrd/ParkPioneer/blob/main/assets/WireFrame.png">

