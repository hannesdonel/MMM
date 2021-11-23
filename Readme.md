# MORE MOVIE METADATA - backend

This is MORE MOVIE METADATA backend. This <b>RESTful API</b> provides all necessary endpoints to access the movie, genre, director and user collections stored within a <b>MongoDB</b> database which I also crafted by myself.

#### Security:
It's fully protected through an authorization and authentication process, you can sign up for your own user account to retrieve full access and save favorite movies. Furthermore it meets a high level data security regulation including data validation. 

#### Endpoints:
Endpoints can be accessed via standard http methods like GET, POST, PUT and DELETE.
You'll find the detailed documentation of those endpoints here: https://more-movie-metadata.herokuapp.com/documentation

#### Client:
I also coded an user client that uses this backend:
- with REACT: https://github.com/hannesdonel/MMM-client-React
- with Angular: https://github.com/hannesdonel/MMM-client-Angular


## Technologies

#### Codebase:
- node.js
- nodemon
- express
- mongoose
- dotenv
- bcrypt
- cors
- express-validator
- jsonwebtoken
- passport
- xss

#### External tools:
- The database is built by myself using <b>MongoDB</b>
- I used <b>Postman</b> for endpoint testing
- This code is hostet on <b>Heroku</b> to be always available


## Functionality

#### Movies:
- Return a list of all movies to the user
- Return a list of movies by genre or/and actor
- Return data (description, genre, director, image URL, whether it’s featured or not) about a
  single movie by title to the user

#### Genres:
- Return a list of all genres
- Return data about a genre (description) by name/title (e.g., “Thriller”)

#### Directors:
- Return a list of all directors
- Return data about a director (bio, birth year, death year) by name

#### User:
- Allow new users to register
- Allow existing users to deregister
- Get information about a user by name
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites


## Documentation

Further documentation of the codebase is located <a href="https://more-movie-metadata.herokuapp.com/doc/">here</a>.