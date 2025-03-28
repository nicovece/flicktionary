# F L I C K T I O N A R Y - A dictionary for flicks

## API Documentation

### Description

Welcome to the Flicktionary documentation. Here you will find all the information you need to interact with the API. Flicktionary API allows users to explore information about movies. Users can sign up, update their personal details, and curate lists of their favorite films. Additionally, they can search the movie database using filters such as movie title, genre, actor name, and more.

### API Endpoints

#### Return a list of ALL movies

- **URL:** `/movies`
- **Method:** GET
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
- **Response Example:**

```json
[
  {
    "_id": "ObjectId('67e3ee6ec963a7641fc ...')",
    "Username": "john_doe",
    "Password": "password123",
    "Email": "john.doe@example.com",
    "Birth_date": "ISODate('1990-05-15T00 ...')",
    "FavoriteMovies": []
  },
  {
    "_id": "ObjectId('67e3ee6ec963a7641fc ...')",
    "Username": "jane_smith",
    "Password": "securePass456",
    "Email": "jane.smith@example.com",
    "Birth_date": "ISODate('1985-11-20T00 ...')",
    "FavoriteMovies": []
  }
]
```

#### Returns data about a single user by Username

- **URL:** `/users/:Username`
- **Method:** GET
- **Response Example:**

```json
{
  "_id": "ObjectId('67e3ee6ec963a7641fc ...')",
  "Username": "john_doe",
  "Password": "password123",
  "Email": "john.doe@example.com",
  "Birth_date": "ISODate('1990-05-15T00 ...')",
  "FavoriteMovies": []
}
```

#### Allows new users registration

- **URL:** `/users/`
- **Method:** POST
- **Request Body Format:**

```json
{
  "ID": "Integer",
  "Username": "String",
  "Password": "String",
  "Email": "String",
  "Birthday": "Date"
}
```

- **Response Example:**

```json
{
  "_id": "ObjectId('67e3ee6ec963a7641fc66bb6')",
  "Username": "john_doe",
  "Password": "password123",
  "Email": "john.doe@example.com",
  "Birth_date": "ISODate('1990-05-15T00:00:00.000Z')",
  "FavoriteMovies": []
}
```

#### Allows users to update their user info

- **URL:** `/users/:id`
- **Method:** PUT
- **Request Body Format:**

```json
{
  "ID": "Integer",
  "Username": "String",
  "Password": "String",
  "Email": "String",
  "Birthday": "Date"
}
```

- **Response Example:**

```json
{
  "_id": "ObjectId('67e3ee6ec963a7641fc66bb6')",
  "Username": "john_doe",
  "Password": "password123",
  "Email": "john.doe@example.com",
  "Birth_date": "ISODate('1990-05-15T00:00:00.000Z')",
  "FavoriteMovies": []
}
```

#### Allows users to add a movie to their favorites

- **URL:** `/users/:Username/movies/:MovieID`
- **Method:** PUT
- **Response Example:**

```json
{
  "_id": "67e3ee6ec963a7641fc66bb6",
  "Username": "john_doe",
  "Password": "password123",
  "Email": "john.doe@example.com",
  "Birth_date": "1990-05-15T00:00:00.000Z",
  "FavoriteMovies": ["67e06937dd46a81da53227a3", "67e06937dd46a81da53227a4"]
}
```

#### Allows users to remove a movie from their favorites

- **URL:** `/users/:Username/movies/:MovieID`
- **Method:** DELETE
- **Response Example:**

```json
{
  "_id": "67e3ee6ec963a7641fc66bb6",
  "Username": "john_doe",
  "Password": "password123",
  "Email": "john.doe@example.com",
  "Birth_date": "1990-05-15T00:00:00.000Z",
  "FavoriteMovies": ["67e06937dd46a81da53227a3"]
}
```

#### Allows existing users to deregister

- **URL:** `/users/:Username`
- **Method:** DELETE
- **Response Example:**

```
User with username "Username" successfully removed
```

### Footer

F L I C K T I O N A R Y - © {current year}
