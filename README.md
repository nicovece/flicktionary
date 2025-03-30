# F L I C K T I O N A R Y

A dictionary for flicks

## API Documentation

### Description

Welcome to the Flicktionary documentation. Here you will find all the information you need to interact with the API. Flicktionary API allows users to explore information about movies. Users can sign up, update their personal details, and curate lists of their favorite films. Additionally, they can search the movie database using filters such as movie title, genre, actor name, and more.

### Authentication

Most endpoints require JWT (JSON Web Token) authentication. Include the JWT token in the Authorization header of your requests:

```
Authorization: Bearer <your_jwt_token>
```

### Security Features

- CORS enabled for all origins
- Security headers implemented:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
- Password hashing for user credentials
- JWT-based authentication

### API Endpoints

#### Return a list of ALL movies

- **URL:** `/movies`
- **Method:** GET
- **Authentication:** Required
- **Response Example:**

```json
[
  {
    "_id": "ObjectId('67e06937dd46a81da532279c')",
    "Title": "The Silent Wave",
    "Description": "A dramatic tale of ...",
    "Genre": {
      "Name": "Drama",
      "Description": "Stories that portray ..."
    },
    "Director": {
      "Name": "John Doe",
      "Bio": "John Doe is a celebrated filmmaker ...",
      "Birth": "1975-03-15",
      "Death": null
    },
    "ImagePath": "...",
    "Featured": true
  }
]
```

#### Returns data about a single movie by title

- **URL:** `/movies/:Title`
- **Method:** GET
- **Authentication:** Required
- **Response Example:**

```json
{
  "_id": "ObjectId('67e06937dd46a81da532279c')",
  "Title": "The Silent Wave",
  "Description": "A dramatic tale of ...",
  "Genre": {
    "Name": "Drama",
    "Description": "Stories that portray ..."
  },
  "Director": {
    "Name": "John Doe",
    "Bio": "John Doe is a celebrated filmmaker ...",
    "Birth": "1975-03-15",
    "Death": null
  },
  "ImagePath": "...",
  "Featured": true
}
```

#### Returns data about a genre by name

- **URL:** `/movies/genre/:genreName`
- **Method:** GET
- **Authentication:** Required
- **Response Example:**

```json
{
  "Name": "Fantasy",
  "Description": "Movies that explore ..."
}
```

#### Returns data about a director by name

- **URL:** `/movies/director/:directorName`
- **Method:** GET
- **Authentication:** Required
- **Response Example:**

```json
{
  "Name": "Daniel Young",
  "Bio": "Daniel Young is known for ...",
  "Birth": "1988-08-30",
  "Death": null
}
```

#### Returns a list of all users

- **URL:** `/users`
- **Method:** GET
- **Authentication:** Required
- **Response Example:**

```json
[
  {
    "_id": "ObjectId('67e3ee6ec963a7641fc ...')",
    "Username": "john_doe",
    "Email": "john.doe@example.com",
    "Birthday": "ISODate('1990-05-15T00 ...')",
    "FavoriteMovies": []
  }
]
```

#### Returns data about a single user by Username

- **URL:** `/users/:Username`
- **Method:** GET
- **Authentication:** Required
- **Response Example:**

```json
{
  "_id": "ObjectId('67e3ee6ec963a7641fc ...')",
  "Username": "john_doe",
  "Email": "john.doe@example.com",
  "Birthday": "ISODate('1990-05-15T00 ...')",
  "FavoriteMovies": []
}
```

#### Allows new users registration

- **URL:** `/users`
- **Method:** POST
- **Authentication:** Not Required
- **Request Body Format:**

```json
{
  "Username": "String",
  "Password": "String",
  "Email": "String",
  "Birthday": "Date"
}
```

- **Validation Rules:**

  - Username:
    - Must be at least 5 characters long
    - Must contain only alphanumeric characters
  - Password:
    - Must be at least 8 characters long
    - Must contain uppercase and lowercase letters
    - Must contain numbers
    - Must contain special characters (!@#$%^&\*-\_=+;:,.)
  - Email must be in valid format

- **Response Example:**

```json
{
  "_id": "ObjectId('67e3ee6ec963a7641fc66bb6')",
  "Username": "john_doe",
  "Email": "john.doe@example.com",
  "Birthday": "ISODate('1990-05-15T00:00:00.000Z')",
  "FavoriteMovies": []
}
```

#### Allows users to update their user info

- **URL:** `/users/:Username`
- **Method:** PUT
- **Authentication:** Required
- **Permission:** Users can only update their own profile
- **Request Body Format:**

```json
{
  "Username": "String",
  "Password": "String",
  "Email": "String",
  "Birthday": "Date"
}
```

- **Validation Rules:** Same as registration
- **Response Example:**

```json
{
  "_id": "ObjectId('67e3ee6ec963a7641fc66bb6')",
  "Username": "john_doe",
  "Email": "john.doe@example.com",
  "Birthday": "ISODate('1990-05-15T00:00:00.000Z')",
  "FavoriteMovies": []
}
```

#### Allows users to add a movie to their favorites

- **URL:** `/users/:Username/movies/:MovieID`
- **Method:** POST
- **Authentication:** Required
- **Permission:** Users can only add to their own favorites
- **Response Example:**

```json
{
  "_id": "67e3ee6ec963a7641fc66bb6",
  "Username": "john_doe",
  "Email": "john.doe@example.com",
  "Birthday": "1990-05-15T00:00:00.000Z",
  "FavoriteMovies": ["67e06937dd46a81da53227a3", "67e06937dd46a81da53227a4"]
}
```

#### Allows users to remove a movie from their favorites

- **URL:** `/users/:Username/movies/:MovieID`
- **Method:** DELETE
- **Authentication:** Required
- **Permission:** Users can only remove from their own favorites
- **Response Example:**

```json
{
  "_id": "67e3ee6ec963a7641fc66bb6",
  "Username": "john_doe",
  "Email": "john.doe@example.com",
  "Birthday": "1990-05-15T00:00:00.000Z",
  "FavoriteMovies": ["67e06937dd46a81da53227a3"]
}
```

#### Allows existing users to deregister

- **URL:** `/users/:Username`
- **Method:** DELETE
- **Authentication:** Required
- **Permission:** Users can only delete their own account
- **Response Example:**

```
User with username "Username" successfully removed
```

### Error Responses

The API may return the following error responses:

- **400 Bad Request**: Invalid request parameters or permission denied
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server-side errors

### Footer

F L I C K T I O N A R Y - © {current year}
