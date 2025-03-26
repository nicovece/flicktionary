INSERT INTO Movies (Title, Description, DirectorID, GenreID, ImageURL, Featured) 
VALUES 
('The Silent Wave', 'A dramatic tale of resilience and survival.', 1, 1, 'https://example.com/images/silent_wave.jpg', TRUE),
('Echoes of Eternity', 'A sci-fi epic exploring time and space.', 2, 2, 'https://example.com/images/echoes_eternity.jpg', FALSE),
('Shadows Unveiled', 'A mysterious thriller set in a small town.', 3, 3, 'https://example.com/images/shadows_unveiled.jpg', TRUE),
('The Last Symphony', 'A heartfelt story of a musician’s struggles.', 1, 4, 'https://example.com/images/last_symphony.jpg', FALSE),
('Parallel Realities', 'A sci-fi journey into alternate dimensions.', 2, 2, 'https://example.com/images/parallel_realities.jpg', TRUE),
('The Forgotten Forest', 'An adventure deep into an eerie forest.', 4, 1, 'https://example.com/images/forgotten_forest.jpg', FALSE),
('City of Whispers', 'A gripping crime drama in an urban setting.', 3, 5, 'https://example.com/images/city_whispers.jpg', TRUE),
('Dreamscapes', 'A surreal exploration of dreams and imagination.', 5, 6, 'https://example.com/images/dreamscapes.jpg', FALSE),
('Harmony Restored', 'A romantic comedy about finding balance.', 6, 4, 'https://example.com/images/harmony_restored.jpg', TRUE),
('Beyond the Horizon', 'An inspiring tale of overcoming adversity.', 4, 1, 'https://example.com/images/beyond_horizon.jpg', TRUE);

INSERT INTO Genres (Name, Description) 
VALUES 
('Drama', 'Movies that primarily focus on realistic storytelling and emotional themes.'),
('Science Fiction', 'Films that explore futuristic concepts, space exploration, and advanced technology.'),
('Thriller', 'A genre characterized by tension, suspense, and excitement.'),
('Romance', 'Stories centered around love and relationships.'),
('Crime', 'Movies focusing on criminal activities and the legal or personal consequences.'),
('Fantasy', 'Films that include magical or supernatural elements in a fictional world.');

INSERT INTO Directors (Name, Bio, Birthyear, Deathyear) 
VALUES 
('Christopher Nolan', 'A British-American filmmaker known for his complex and innovative storytelling.', '1970-07-30', NULL),
('Denis Villeneuve', 'A Canadian filmmaker recognized for his visually stunning and cerebral movies.', '1967-10-03', NULL),
('David Fincher', 'An American director known for his dark, stylish thrillers.', '1962-08-28', NULL),
('Greta Gerwig', 'An American actress and filmmaker noted for her work in independent cinema.', '1983-08-04', NULL),
('Hayao Miyazaki', 'A legendary Japanese animator and director, co-founder of Studio Ghibli.', '1941-01-05', NULL),
('Quentin Tarantino', 'An American filmmaker celebrated for his stylized storytelling and dialogue.', '1963-03-27', NULL);

INSERT INTO Users (Username, Password, Email, Birth_date) 
VALUES 
('john_doe', 'password123', 'john.doe@example.com', '1990-05-15'),
('jane_smith', 'securePass456', 'jane.smith@example.com', '1985-11-20'),
('alice_wonder', 'alicePass789', 'alice.wonder@example.com', '2000-03-08'),
('bob_builder', 'bobBuilds123', 'bob.builder@example.com', '1995-07-22'),
('charlie_brown', 'charlieBrown456', 'charlie.brown@example.com', '1988-01-13');

INSERT INTO User_Movies (UserID, MovieID) 
VALUES 
(1, 12), -- User 1 likes Movie 12 (The Silent Wave)
(1, 13), -- User 1 likes Movie 13 (Echoes of Eternity)
(2, 14), -- User 2 likes Movie 14 (Shadows Unveiled)
(2, 15), -- User 2 likes Movie 15 (The Last Symphony)
(3, 16), -- User 3 likes Movie 16 (Parallel Realities)
(3, 17), -- User 3 likes Movie 17 (The Forgotten Forest)
(4, 18), -- User 4 likes Movie 18 (City of Whispers)
(4, 19), -- User 4 likes Movie 19 (Dreamscapes)
(5, 20), -- User 5 likes Movie 20 (Harmony Restored)
(5, 21); -- User 5 likes Movie 21 (Beyond the Horizon)


SELECT *
  FROM Genres
  WHERE Name = 'Drama';

SELECT *
  FROM Movies
  WHERE GenreID = 4;

UPDATE Users
  SET Email = 'jane.smith@example.com'
  WHERE Username = 'jane_smith';

DELETE FROM Movies
  WHERE Title = 'City of Whispers';