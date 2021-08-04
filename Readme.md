# MORE MOVIE METADATA

This is (even) MORE MOVIE METADATA. This application will provide you with access to information about different movies, directors, and genres.
You will be able to sign up here and create a list of your favorite movies.

## Technologies

This is crafted with node.js using the folowing packages:

- express
- mongoose
- dotenv
- bcrypt
- cors
- express-validator
- jsonwebtoken
- passport
- passport-jwt
- passport-local
- lodash
- morgan

## Functionality

- Return a list of all movies to the user
- Return a list of movies by genre or/and actor
- Return data (description, genre, director, image URL, whether it’s featured or not) about a
  single movie by title to the user
- Return a list of all genres
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return a list of all directors
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow existing users to deregister
- Get information about a user by name
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
