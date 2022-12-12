CREATE DATABASE IF NOT EXISTS `nodedb`;
USE `nodedb`;
DROP TABLE IF EXISTS `people`;
CREATE TABLE `people` (`id` int not null auto_increment, `name` varchar(255), primary key(id));