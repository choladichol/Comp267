CREATE DATABASE movie_recommendations; 
USE movie_recommendations; 
-- create operations
CREATE TABLE Users ( -- users table
user_id INT PRIMARY KEY,
username VARCHAR(50) NOT NULL,
email VARCHAR(100) NOT NULL,
password_hash VARCHAR(255) NOT NULL,
join_date DATE,
age INT,
most_watched_genre VARCHAR(50)
);

CREATE TABLE Genres ( -- genres table 
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(50)
);

CREATE TABLE Movies ( -- movies table
    movie_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year YEAR,
    genre VARCHAR(50),
    duration INT,
    description TEXT,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    poster_url VARCHAR(500)
);

CREATE TABLE Ratings ( -- ratings table 
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    movie_id INT,
    rating_value DECIMAL(2,1) CHECK (rating_value >= 1 AND rating_value <= 5),
    rating_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE
);

CREATE TABLE WatchHistory ( -- watchHistorytable
    history_id INT PRIMARY KEY,
    user_id INT,
    movie_id INT,
    last_watch_date DATE NOT NULL,
    progress VARCHAR(20) DEFAULT '0%',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE
);

CREATE TABLE Recommendations ( -- recommendations table 
    rec_id INT PRIMARY KEY,
    user_id INT,
    movie_id INT,
    reason TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE
);
-- INSERTION OF SAMPLE DATA
INSERT INTO Users (user_id, username, email, password_hash, join_date, age, most_watched_genre) VALUES
(1, 'john_doe', 'john@email.com', 'hashed_password_123', '2023-01-15', 28, 'Action'),
(2, 'jane_smith', 'jane@email.com', 'hashed_password_456', '2023-02-20', 32, 'Drama'),
(3, 'mike_wilson', 'mike@email.com', 'hashed_password_789', '2023-03-10', 25, 'Comedy');


INSERT INTO Genres (genre_id, genre_name) VALUES
(1, 'Action'),
(2, 'Drama'),
(3, 'Comedy'),
(4, 'Sci-Fi'),
(5, 'Horror');

INSERT INTO Movies (movie_id, title, release_year, genre, duration, description, average_rating, poster_url) VALUES
(101, 'The Last Stand', 2023, 'Action', 125, 'A retired agent comes back for one final mission', 4.2, 'http://posters.com/laststand.jpg'),
(102, 'Eternal Love', 2022, 'Drama', 138, 'A romantic drama spanning decades', 4.5, 'http://posters.com/eternallove.jpg'),
(103, 'Laugh Out Loud', 2023, 'Comedy', 95, 'A hilarious comedy about mistaken identity', 3.8, 'http://posters.com/lol.jpg'),
(104, 'Space Odyssey', 2024, 'Sci-Fi', 152, 'Journey through space and time', 4.7, 'http://posters.com/spaceodyssey.jpg');

INSERT INTO Ratings (rating_id, user_id, movie_id, rating_value, rating_date) VALUES
(1, 1, 101, 4.5, '2023-04-01'),
(2, 1, 102, 3.5, '2023-04-02'),
(3, 2, 102, 5.0, '2023-04-03'),
(4, 3, 103, 4.0, '2023-04-04'),
(5, 2, 104, 4.8, '2023-04-05');

INSERT INTO WatchHistory (history_id, user_id, movie_id, last_watch_date, progress) VALUES
(1, 1, 101, '2023-04-01', '100%'),
(2, 1, 102, '2023-04-02', '75%'),
(3, 2, 102, '2023-04-03', '100%'),
(4, 3, 103, '2023-04-04', '50%'),
(5, 2, 104, '2023-04-05', '100%');

INSERT INTO Recommendations (rec_id, user_id, movie_id, reason) VALUES
(1, 1, 104, 'Based on your interest in action movies'),
(2, 2, 101, 'Similar to dramas youve watched'),
(3, 3, 102, 'Because you enjoy comedy with heart');

-- READING DATA IN DATABASE
SELECT * FROM Users;

SELECT title, average_rating FROM Movies WHERE average_rating > 4.0 ORDER BY average_rating DESC;

SELECT u.username, m.title, wh.last_watch_date, wh.progress 
FROM WatchHistory wh
JOIN Users u ON wh.user_id = u.user_id
JOIN Movies m ON wh.movie_id = m.movie_id;

SELECT u.username, m.title, r.rating_value, r.rating_date 
FROM Ratings r
JOIN Users u ON r.user_id = u.user_id
JOIN Movies m ON r.movie_id = m.movie_id;

-- UPDATE STATEMENTS 
UPDATE Users SET age = 30, most_watched_genre = 'Sci-Fi' WHERE user_id = 1;
UPDATE Movies SET average_rating = 4.3 WHERE movie_id = 101;
UPDATE WatchHistory SET progress = '100%' WHERE user_id = 3 AND movie_id = 103;
-- delete
DELETE FROM Ratings WHERE user_id = 1 AND movie_id = 102;
DELETE FROM WatchHistory WHERE history_id = 2;
DELETE FROM Users WHERE user_id = 4;

-- ENSURING AND VALIDATING DATABASE RELATIONSHIPS
SELECT u.username, COUNT(r.rating_id) as ratings_given
FROM Users u
LEFT JOIN Ratings r ON u.user_id = r.user_id
GROUP BY u.username;
SELECT m.title, COUNT(wh.history_id) as times_watched, AVG(r.rating_value) as avg_rating
FROM Movies m
LEFT JOIN WatchHistory wh ON m.movie_id = wh.movie_id
LEFT JOIN Ratings r ON m.movie_id = r.movie_id
GROUP BY m.movie_id, m.title;

-- REPORT IMPLEMENTATION
SELECT 
    'Total Users' as metric, COUNT(*) as value FROM Users
UNION ALL
SELECT 'Total Movies', COUNT(*) FROM Movies
UNION ALL
SELECT 'Total Ratings', COUNT(*) FROM Ratings
UNION ALL
SELECT 'Average Movie Rating', ROUND(AVG(average_rating), 2) FROM Movies
UNION ALL
SELECT 'Most Popular Genre', 
    (SELECT genre FROM Movies GROUP BY genre ORDER BY COUNT(*) DESC LIMIT 1);
    
SELECT 
    m.title,
    m.genre,
    COUNT(wh.history_id) as watch_count,
    COUNT(r.rating_id) as rating_count,
    ROUND(AVG(r.rating_value), 2) as average_rating,
    ROUND(m.average_rating, 2) as overall_rating
FROM Movies m
LEFT JOIN WatchHistory wh ON m.movie_id = wh.movie_id
LEFT JOIN Ratings r ON m.movie_id = r.movie_id
GROUP BY m.movie_id, m.title, m.genre, m.average_rating
ORDER BY watch_count DESC, average_rating DESC;

-- GENERATION OF GENRE POPULARITY REPORT 
SELECT 
    genre,
    COUNT(movie_id) as movie_count,
    ROUND(AVG(average_rating), 2) as avg_rating,
    (SELECT COUNT(*) FROM WatchHistory wh 
     JOIN Movies m2 ON wh.movie_id = m2.movie_id 
     WHERE m2.genre = m.genre) as total_watches
FROM Movies m
GROUP BY genre
ORDER BY total_watches DESC;

-- GENERATION OF USER ACTIVITY REPORT 
SELECT 
    u.username,
    u.join_date,
    TIMESTAMPDIFF(MONTH, u.join_date, CURDATE()) as months_since_join,
    COUNT(DISTINCT wh.movie_id) as unique_movies_watched,
    COUNT(DISTINCT r.rating_id) as ratings_provided
FROM Users u
LEFT JOIN WatchHistory wh ON u.user_id = wh.user_id
LEFT JOIN Ratings r ON u.user_id = r.user_id
GROUP BY u.user_id, u.username, u.join_date
ORDER BY months_since_join DESC, unique_movies_watched DESC;