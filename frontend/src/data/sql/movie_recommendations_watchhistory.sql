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
-- Table structure for table `watchhistory`
--

DROP TABLE IF EXISTS `watchhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watchhistory` (
  `history_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `movie_id` int DEFAULT NULL,
  `last_watch_date` date NOT NULL,
  `progress` varchar(20) DEFAULT '0%',
  PRIMARY KEY (`history_id`),
  KEY `user_id` (`user_id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `watchhistory_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `watchhistory_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watchhistory`
--

LOCK TABLES `watchhistory` WRITE;
/*!40000 ALTER TABLE `watchhistory` DISABLE KEYS */;
INSERT INTO `watchhistory` VALUES (1,1,101,'2023-04-01','100%'),(3,2,102,'2023-04-03','100%'),(4,3,103,'2023-04-04','100%'),(5,2,104,'2023-04-05','100%'),(6,1,104,'2023-04-10','100%'),(7,1,108,'2023-05-05','100%'),(8,1,113,'2023-05-08','100%'),(9,2,106,'2023-05-10','100%'),(10,2,111,'2023-05-12','100%'),(11,3,107,'2023-05-15','100%'),(12,3,112,'2023-05-18','100%'),(13,4,101,'2023-04-15','100%'),(14,4,109,'2023-04-16','100%'),(15,4,114,'2023-04-18','100%'),(16,5,105,'2023-04-20','100%'),(17,5,110,'2023-04-22','100%'),(18,5,115,'2023-04-25','100%'),(19,6,102,'2023-04-28','100%'),(20,6,106,'2023-05-01','100%'),(21,6,111,'2023-05-03','100%');
/*!40000 ALTER TABLE `watchhistory` ENABLE KEYS */;
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
