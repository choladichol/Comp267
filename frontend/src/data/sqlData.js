/**
 * Data extracted from SQL files
 * This file contains the actual data from your SQL dump files
 * Update this file when SQL files change, or use a build script to auto-generate
 */

// Data from movie_recommendations_movies.sql
export const moviesData = [
  { movie_id: 101, title: 'The Last Stand', release_year: 2023, genre: 'Action', duration: 125, description: 'A retired agent comes back for one final mission', average_rating: 4.30, poster_url: 'http://posters.com/laststand.jpg' },
  { movie_id: 102, title: 'Eternal Love', release_year: 2022, genre: 'Drama', duration: 138, description: 'A romantic drama spanning decades', average_rating: 4.50, poster_url: 'http://posters.com/eternallove.jpg' },
  { movie_id: 103, title: 'Laugh Out Loud', release_year: 2023, genre: 'Comedy', duration: 95, description: 'A hilarious comedy about mistaken identity', average_rating: 3.80, poster_url: 'http://posters.com/lol.jpg' },
  { movie_id: 104, title: 'Space Odyssey', release_year: 2024, genre: 'Sci-Fi', duration: 152, description: 'Journey through space and time', average_rating: 4.70, poster_url: 'http://posters.com/spaceodyssey.jpg' },
  { movie_id: 105, title: 'Midnight Shadows', release_year: 2023, genre: 'Horror', duration: 98, description: 'A terrifying tale of supernatural horror', average_rating: 4.20, poster_url: 'http://posters.com/midnightshadows.jpg' },
  { movie_id: 106, title: 'City Lights', release_year: 2022, genre: 'Drama', duration: 112, description: 'A story of hope and redemption in the big city', average_rating: 4.60, poster_url: 'http://posters.com/citylights.jpg' },
  { movie_id: 107, title: 'The Comedian', release_year: 2024, genre: 'Comedy', duration: 105, description: 'A stand-up comedian navigates life and love', average_rating: 4.10, poster_url: 'http://posters.com/thecomedian.jpg' },
  { movie_id: 108, title: 'Quantum Leap', release_year: 2023, genre: 'Sci-Fi', duration: 145, description: 'Scientists discover time travel technology', average_rating: 4.55, poster_url: 'http://posters.com/quantumleap.jpg' },
  { movie_id: 109, title: 'Racing Hearts', release_year: 2022, genre: 'Action', duration: 118, description: 'High-speed car racing and intense competition', average_rating: 4.00, poster_url: 'http://posters.com/racinghearts.jpg' },
  { movie_id: 110, title: 'The Haunting', release_year: 2024, genre: 'Horror', duration: 102, description: 'A family moves into a haunted house', average_rating: 3.90, poster_url: 'http://posters.com/thehaunting.jpg' },
  { movie_id: 111, title: 'Love Story', release_year: 2023, genre: 'Drama', duration: 128, description: 'A timeless romance between two star-crossed lovers', average_rating: 4.65, poster_url: 'http://posters.com/lovestory.jpg' },
  { movie_id: 112, title: 'Funny Business', release_year: 2022, genre: 'Comedy', duration: 88, description: 'A workplace comedy about office hijinks', average_rating: 3.75, poster_url: 'http://posters.com/funnybusiness.jpg' },
  { movie_id: 113, title: 'Galaxy Quest', release_year: 2024, genre: 'Sci-Fi', duration: 135, description: 'Space explorers discover a new planet', average_rating: 4.40, poster_url: 'http://posters.com/galaxyquest.jpg' },
  { movie_id: 114, title: 'Street Fighter', release_year: 2023, genre: 'Action', duration: 115, description: 'Martial arts tournament with the worlds best fighters', average_rating: 4.15, poster_url: 'http://posters.com/streetfighter.jpg' },
  { movie_id: 115, title: 'Dark Night', release_year: 2022, genre: 'Horror', duration: 96, description: 'Survival horror in an abandoned asylum', average_rating: 4.25, poster_url: 'http://posters.com/darknight.jpg' },
];

// Data from movie_recommendations_users.sql
export const usersData = [
  { user_id: 1, username: 'john_doe', email: 'john@email.com', password_hash: 'hashed_password_123', join_date: '2023-01-15', age: 30, most_watched_genre: 'Sci-Fi' },
  { user_id: 2, username: 'jane_smith', email: 'jane@email.com', password_hash: 'hashed_password_456', join_date: '2023-02-20', age: 32, most_watched_genre: 'Drama' },
  { user_id: 3, username: 'mike_wilson', email: 'mike@email.com', password_hash: 'hashed_password_789', join_date: '2023-03-10', age: 25, most_watched_genre: 'Comedy' },
  { user_id: 4, username: 'sarah_jones', email: 'sarah@email.com', password_hash: 'hashed_password_101', join_date: '2023-04-05', age: 28, most_watched_genre: 'Action' },
  { user_id: 5, username: 'david_brown', email: 'david@email.com', password_hash: 'hashed_password_202', join_date: '2023-05-12', age: 35, most_watched_genre: 'Horror' },
  { user_id: 6, username: 'emily_taylor', email: 'emily@email.com', password_hash: 'hashed_password_303', join_date: '2023-06-18', age: 22, most_watched_genre: 'Drama' },
];

// Data from movie_recommendations_ratings.sql
export const ratingsData = [
  { rating_id: 1, user_id: 1, movie_id: 101, rating_value: 4.5, rating_date: '2023-04-01' },
  { rating_id: 3, user_id: 2, movie_id: 102, rating_value: 5.0, rating_date: '2023-04-03' },
  { rating_id: 4, user_id: 3, movie_id: 103, rating_value: 4.0, rating_date: '2023-04-04' },
  { rating_id: 5, user_id: 2, movie_id: 104, rating_value: 4.8, rating_date: '2023-04-05' },
  { rating_id: 6, user_id: 1, movie_id: 104, rating_value: 5.0, rating_date: '2023-04-10' },
  { rating_id: 7, user_id: 3, movie_id: 102, rating_value: 4.5, rating_date: '2023-04-12' },
  { rating_id: 8, user_id: 4, movie_id: 101, rating_value: 4.2, rating_date: '2023-04-15' },
  { rating_id: 9, user_id: 4, movie_id: 109, rating_value: 4.5, rating_date: '2023-04-16' },
  { rating_id: 10, user_id: 4, movie_id: 114, rating_value: 4.0, rating_date: '2023-04-18' },
  { rating_id: 11, user_id: 5, movie_id: 105, rating_value: 4.5, rating_date: '2023-04-20' },
  { rating_id: 12, user_id: 5, movie_id: 110, rating_value: 4.0, rating_date: '2023-04-22' },
  { rating_id: 13, user_id: 5, movie_id: 115, rating_value: 4.3, rating_date: '2023-04-25' },
  { rating_id: 14, user_id: 6, movie_id: 102, rating_value: 5.0, rating_date: '2023-04-28' },
  { rating_id: 15, user_id: 6, movie_id: 106, rating_value: 4.8, rating_date: '2023-05-01' },
  { rating_id: 16, user_id: 6, movie_id: 111, rating_value: 4.9, rating_date: '2023-05-03' },
  { rating_id: 17, user_id: 1, movie_id: 108, rating_value: 4.7, rating_date: '2023-05-05' },
  { rating_id: 18, user_id: 1, movie_id: 113, rating_value: 4.6, rating_date: '2023-05-08' },
  { rating_id: 19, user_id: 2, movie_id: 106, rating_value: 4.7, rating_date: '2023-05-10' },
  { rating_id: 20, user_id: 2, movie_id: 111, rating_value: 4.9, rating_date: '2023-05-12' },
  { rating_id: 21, user_id: 3, movie_id: 107, rating_value: 4.2, rating_date: '2023-05-15' },
  { rating_id: 22, user_id: 3, movie_id: 112, rating_value: 3.8, rating_date: '2023-05-18' },
];

// Data from movie_recommendations_watchhistory.sql
export const watchHistoryData = [
  { history_id: 1, user_id: 1, movie_id: 101, last_watch_date: '2023-04-01', progress: '100%' },
  { history_id: 3, user_id: 2, movie_id: 102, last_watch_date: '2023-04-03', progress: '100%' },
  { history_id: 4, user_id: 3, movie_id: 103, last_watch_date: '2023-04-04', progress: '100%' },
  { history_id: 5, user_id: 2, movie_id: 104, last_watch_date: '2023-04-05', progress: '100%' },
  { history_id: 6, user_id: 1, movie_id: 104, last_watch_date: '2023-04-10', progress: '100%' },
  { history_id: 7, user_id: 1, movie_id: 108, last_watch_date: '2023-05-05', progress: '100%' },
  { history_id: 8, user_id: 1, movie_id: 113, last_watch_date: '2023-05-08', progress: '100%' },
  { history_id: 9, user_id: 2, movie_id: 106, last_watch_date: '2023-05-10', progress: '100%' },
  { history_id: 10, user_id: 2, movie_id: 111, last_watch_date: '2023-05-12', progress: '100%' },
  { history_id: 11, user_id: 3, movie_id: 107, last_watch_date: '2023-05-15', progress: '100%' },
  { history_id: 12, user_id: 3, movie_id: 112, last_watch_date: '2023-05-18', progress: '100%' },
  { history_id: 13, user_id: 4, movie_id: 101, last_watch_date: '2023-04-15', progress: '100%' },
  { history_id: 14, user_id: 4, movie_id: 109, last_watch_date: '2023-04-16', progress: '100%' },
  { history_id: 15, user_id: 4, movie_id: 114, last_watch_date: '2023-04-18', progress: '100%' },
  { history_id: 16, user_id: 5, movie_id: 105, last_watch_date: '2023-04-20', progress: '100%' },
  { history_id: 17, user_id: 5, movie_id: 110, last_watch_date: '2023-04-22', progress: '100%' },
  { history_id: 18, user_id: 5, movie_id: 115, last_watch_date: '2023-04-25', progress: '100%' },
  { history_id: 19, user_id: 6, movie_id: 102, last_watch_date: '2023-04-28', progress: '100%' },
  { history_id: 20, user_id: 6, movie_id: 106, last_watch_date: '2023-05-01', progress: '100%' },
  { history_id: 21, user_id: 6, movie_id: 111, last_watch_date: '2023-05-03', progress: '100%' },
];

// Data from movie_recommendations_recommendations.sql
export const recommendationsData = [
  { rec_id: 1, user_id: 1, movie_id: 104, reason: 'Based on your interest in action movies' },
  { rec_id: 2, user_id: 2, movie_id: 101, reason: 'Similar to dramas youve watched' },
  { rec_id: 3, user_id: 3, movie_id: 102, reason: 'Because you enjoy comedy with heart' },
  { rec_id: 4, user_id: 1, movie_id: 108, reason: 'Highly rated Sci-Fi movie you might enjoy' },
  { rec_id: 5, user_id: 1, movie_id: 113, reason: 'Based on your interest in Sci-Fi movies' },
  { rec_id: 6, user_id: 2, movie_id: 106, reason: 'Similar to dramas youve watched' },
  { rec_id: 7, user_id: 2, movie_id: 111, reason: 'Highly rated drama movie' },
  { rec_id: 8, user_id: 3, movie_id: 107, reason: 'New comedy release you might like' },
  { rec_id: 9, user_id: 3, movie_id: 112, reason: 'Based on your interest in comedy movies' },
  { rec_id: 10, user_id: 4, movie_id: 109, reason: 'Action movie with high ratings' },
  { rec_id: 11, user_id: 4, movie_id: 114, reason: 'Based on your interest in action movies' },
  { rec_id: 12, user_id: 5, movie_id: 110, reason: 'Horror movie you might enjoy' },
  { rec_id: 13, user_id: 5, movie_id: 115, reason: 'Based on your interest in horror movies' },
  { rec_id: 14, user_id: 6, movie_id: 111, reason: 'Highly rated drama movie' },
  { rec_id: 15, user_id: 6, movie_id: 106, reason: 'Similar to dramas youve watched' },
];

// Data from movie_recommendations_genres.sql
export const genresData = [
  { genre_id: 1, genre_name: 'Action' },
  { genre_id: 2, genre_name: 'Drama' },
  { genre_id: 3, genre_name: 'Comedy' },
  { genre_id: 4, genre_name: 'Sci-Fi' },
  { genre_id: 5, genre_name: 'Horror' },
  { genre_id: 6, genre_name: 'Thriller' },
  { genre_id: 7, genre_name: 'Romance' },
  { genre_id: 8, genre_name: 'Adventure' },
  { genre_id: 9, genre_name: 'Fantasy' },
  { genre_id: 10, genre_name: 'Mystery' },
];

