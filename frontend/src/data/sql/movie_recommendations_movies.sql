-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: movie_recommendations
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `movie_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `release_year` year DEFAULT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `description` text,
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `poster_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`movie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (101,'The Last Stand',2023,'Action',125,'A retired agent comes back for one final mission',4.30,'http://posters.com/laststand.jpg'),(102,'Eternal Love',2022,'Drama',138,'A romantic drama spanning decades',4.50,'http://posters.com/eternallove.jpg'),(103,'Laugh Out Loud',2023,'Comedy',95,'A hilarious comedy about mistaken identity',3.80,'http://posters.com/lol.jpg'),(104,'Space Odyssey',2024,'Sci-Fi',152,'Journey through space and time',4.70,'http://posters.com/spaceodyssey.jpg'),(105,'Midnight Shadows',2023,'Horror',98,'A terrifying tale of supernatural horror',4.20,'http://posters.com/midnightshadows.jpg'),(106,'City Lights',2022,'Drama',112,'A story of hope and redemption in the big city',4.60,'http://posters.com/citylights.jpg'),(107,'The Comedian',2024,'Comedy',105,'A stand-up comedian navigates life and love',4.10,'http://posters.com/thecomedian.jpg'),(108,'Quantum Leap',2023,'Sci-Fi',145,'Scientists discover time travel technology',4.55,'http://posters.com/quantumleap.jpg'),(109,'Racing Hearts',2022,'Action',118,'High-speed car racing and intense competition',4.00,'http://posters.com/racinghearts.jpg'),(110,'The Haunting',2024,'Horror',102,'A family moves into a haunted house',3.90,'http://posters.com/thehaunting.jpg'),(111,'Love Story',2023,'Drama',128,'A timeless romance between two star-crossed lovers',4.65,'http://posters.com/lovestory.jpg'),(112,'Funny Business',2022,'Comedy',88,'A workplace comedy about office hijinks',3.75,'http://posters.com/funnybusiness.jpg'),(113,'Galaxy Quest',2024,'Sci-Fi',135,'Space explorers discover a new planet',4.40,'http://posters.com/galaxyquest.jpg'),(114,'Street Fighter',2023,'Action',115,'Martial arts tournament with the worlds best fighters',4.15,'http://posters.com/streetfighter.jpg'),(115,'Dark Night',2022,'Horror',96,'Survival horror in an abandoned asylum',4.25,'http://posters.com/darknight.jpg');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-22  0:03:32
